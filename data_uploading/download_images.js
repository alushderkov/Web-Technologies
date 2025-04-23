const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const sanitizeFilename = require('sanitize-filename');
const app = express();
const port = 3000;

// Класс для обработки ошибок скачивания
class ImageDownloaderError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Класс для скачивания изображений
class ImageDownloader {
  constructor(targetUrl, outputDir) {
    this.targetUrl = targetUrl;
    this.outputDir = outputDir;
    this.parsedUrl = new URL(targetUrl);
    this.downloadedCount = 0;
    this.failedCount = 0;
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
  }

  // Создание директории для сохранения
  async ensureDirectoryExists() {
    try {
      await fs.promises.access(this.outputDir, fs.constants.W_OK);
    } catch (err) {
      if (err.code === 'ENOENT') {
        try {
          await fs.promises.mkdir(this.outputDir, { recursive: true });
        } catch (mkdirErr) {
          throw new ImageDownloaderError(`Не удалось создать директорию: ${mkdirErr.message}`);
        }
      } else {
        throw new ImageDownloaderError(`Нет доступа к директории: ${err.message}`);
      }
    }
  }

  // Проверка URL изображения
  isValidImageUrl(url) {
    if (!url) return false;

    try {
      const parsed = new URL(url, this.targetUrl);
      return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  }

  // Нормализация URL изображения
  normalizeImageUrl(url) {
    try {
      if (url.startsWith('//')) {
        return `${this.parsedUrl.protocol}${url}`;
      } else if (url.startsWith('/')) {
        return `${this.parsedUrl.origin}${url}`;
      } else if (!url.startsWith('http')) {
        return `${this.parsedUrl.origin}/${url}`;
      }
      return url;
    } catch {
      return null;
    }
  }

  // Генерация имени файла
  generateFilename(imageUrl) {
    const parsed = new URL(imageUrl);
    const ext = path.extname(parsed.pathname) || '.jpg';
    const baseName = path.basename(parsed.pathname, ext) || 'image';
    const sanitized = sanitizeFilename(baseName).replace(/\s+/g, '_');

    let filename = `${sanitized}${ext}`;
    let counter = 1;

    while (fs.existsSync(path.join(this.outputDir, filename))) {
      filename = `${sanitized}_${counter}${ext}`;
      counter++;
    }

    return filename;
  }

  // Скачивание одного изображения
  async downloadImage(imageUrl) {
    const normalizedUrl = this.normalizeImageUrl(imageUrl);
    if (!normalizedUrl || !this.isValidImageUrl(normalizedUrl)) {
      this.failedCount++;
      return { success: false, message: `Некорректный URL изображения: ${imageUrl}` };
    }

    const filename = this.generateFilename(normalizedUrl);
    const filePath = path.join(this.outputDir, filename);

    try {
      const response = await this.axiosInstance.get(normalizedUrl, {
        responseType: 'stream',
        maxContentLength: 10 * 1024 * 1024 // 10MB лимит
      });

      if (!response.headers['content-type']?.startsWith('image/')) {
        this.failedCount++;
        return { success: false, message: `URL не является изображением: ${normalizedUrl}` };
      }

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
        response.data.on('error', reject);
      });

      this.downloadedCount++;
      return { success: true, filename, url: normalizedUrl };
    } catch (err) {
      this.failedCount++;
      // Удаляем частично скачанный файл, если он существует
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        success: false,
        message: `Ошибка при скачивании ${normalizedUrl}: ${err.message}`
      };
    }
  }

  // Получение всех изображений со страницы
  async downloadAllImages() {
    try {
      await this.ensureDirectoryExists();

      // Получаем HTML страницы
      const response = await this.axiosInstance.get(this.targetUrl);
      const $ = cheerio.load(response.data);
      const imageUrls = [];

      // Извлекаем все возможные URL изображений
      $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) imageUrls.push(src);
      });

      // Также проверяем теги picture и source
      $('picture source').each((i, el) => {
        const srcset = $(el).attr('srcset');
        if (srcset) {
          srcset.split(',').forEach(src => {
            const url = src.trim().split(' ')[0];
            if (url) imageUrls.push(url);
          });
        }
      });

      // Удаляем дубликаты
      const uniqueUrls = [...new Set(imageUrls)];

      // Скачиваем все изображения
      const results = [];
      for (const url of uniqueUrls) {
        const result = await this.downloadImage(url);
        results.push(result);
      }

      return {
        total: uniqueUrls.length,
        downloaded: this.downloadedCount,
        failed: this.failedCount,
        results
      };
    } catch (err) {
      throw new ImageDownloaderError(`Ошибка при обработке страницы: ${err.message}`);
    }
  }
}

// Middleware для обработки JSON
app.use(express.json());

// Роут для скачивания изображений
app.post('/download-images', async (req, res) => {
  try {
    const { url, outputDir } = req.body;

    if (!url || !outputDir) {
      return res.status(400).json({
        error: 'Необходимо указать URL и директорию для сохранения'
      });
    }

    // Валидация URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Некорректный URL' });
    }

    const downloader = new ImageDownloader(url, outputDir);
    const result = await downloader.downloadAllImages();

    res.json({
      success: true,
      message: `Скачивание завершено. Успешно: ${result.downloaded}, Ошибок: ${result.failed}`,
      details: result
    });
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      message: err.message
    });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Ошибка при запуске сервера:', err);
});

// Обработка необработанных исключений
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});