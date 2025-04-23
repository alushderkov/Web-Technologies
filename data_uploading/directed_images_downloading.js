const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

// Конфигурация
const config = {
  maxDepth: 2,
  downloadDir: './downloaded_images',
  concurrency: 5,
  timeout: 10000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
};

// Глобальные переменные
const visitedUrls = new Set();
const imagesToDownload = new Map(); // Теперь используем Map для хранения URL и путей сохранения
const queue = [];
let downloadedCount = 0;
let bar;

// Создаем папку для загрузок
if (!fs.existsSync(config.downloadDir)) {
  fs.mkdirSync(config.downloadDir, { recursive: true });
}

// Основная функция
async function startCrawling(startUrl) {
  console.log(`Начинаем сканирование с URL: ${startUrl}`);
  queue.push({ url: startUrl, depth: 0 });
  visitedUrls.add(normalizeUrl(startUrl));

  // Обработка очереди
  while (queue.length > 0) {
    const current = queue.shift();
    try {
      await processPage(current.url, current.depth);
    } catch (error) {
      console.error(`Ошибка при обработке ${current.url}:`, error.message);
    }
  }

  // Начинаем загрузку изображений
  console.log(`\nНайдено ${imagesToDownload.size} изображений для загрузки`);
  if (imagesToDownload.size > 0) {
    bar = new ProgressBar('Загрузка [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: imagesToDownload.size
    });

    await downloadAllImages();
  }

  console.log('\nЗавершено! Все изображения сохранены в', config.downloadDir);
}

// Обработка страницы
async function processPage(url, depth) {
  console.log(`Обработка: ${url} (глубина ${depth})`);

  try {
    const response = await axios.get(url, {
      timeout: config.timeout,
      headers: { 'User-Agent': config.userAgent }
    });

    const $ = cheerio.load(response.data);

    // Извлекаем и сохраняем изображения
    extractImages($, url);

    // Если не достигли максимальной глубины, ищем ссылки на подстраницы
    if (depth < config.maxDepth) {
      extractLinks($, url, depth);
    }
  } catch (error) {
    console.error(`Не удалось обработать ${url}:`, error.message);
  }
}

// Извлечение изображений
function extractImages($, baseUrl) {
  $('img').each((i, element) => {
    let imgUrl = $(element).attr('src') || $(element).attr('data-src');
    if (!imgUrl) return;

    try {
      // Преобразование относительных URL в абсолютные
      imgUrl = new URL(imgUrl, baseUrl).href;

      // Проверка на допустимые расширения файлов
      const ext = path.extname(imgUrl).toLowerCase();
      if (config.allowedExtensions.includes(ext)) {
        // Генерируем путь для сохранения на основе URL
        const savePath = generateSavePath(imgUrl, baseUrl);
        imagesToDownload.set(imgUrl, savePath);
      }
    } catch (error) {
      console.error(`Некорректный URL изображения: ${imgUrl}`);
    }
  });
}

// Генерация пути сохранения на основе URL
function generateSavePath(imgUrl, baseUrl) {
  const urlObj = new URL(imgUrl);
  const baseUrlObj = new URL(baseUrl);

  // Создаем путь на основе структуры URL
  let relativePath = path.join(
    config.downloadDir,
    baseUrlObj.hostname,
    ...urlObj.pathname.split('/').slice(0, -1).filter(Boolean)
  );

  // Создаем имя файла
  const ext = path.extname(urlObj.pathname) || '.jpg';
  const filename = path.basename(urlObj.pathname, ext) || 'image';
  const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ext;

  // Создаем полный путь
  const fullPath = path.join(relativePath, safeFilename);

  // Создаем директорию, если ее нет
  if (!fs.existsSync(relativePath)) {
    fs.mkdirSync(relativePath, { recursive: true });
  }

  return fullPath;
}

// Извлечение ссылок
function extractLinks($, baseUrl, currentDepth) {
  $('a').each((i, element) => {
    let href = $(element).attr('href');
    if (!href || href.startsWith('#')) return;

    try {
      // Преобразование относительных URL в абсолютные
      const absoluteUrl = new URL(href, baseUrl).href;
      const normalizedUrl = normalizeUrl(absoluteUrl);

      // Проверяем, не посещали ли уже эту страницу
      if (!visitedUrls.has(normalizedUrl)) {
        visitedUrls.add(normalizedUrl);
        queue.push({ url: absoluteUrl, depth: currentDepth + 1 });
      }
    } catch (error) {
      console.error(`Некорректный URL: ${href}`);
    }
  });
}

// Нормализация URL для сравнения
function normalizeUrl(url) {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.toLowerCase().replace(/\/$/, '');
}

// Загрузка всех изображений
async function downloadAllImages() {
  const imageEntries = Array.from(imagesToDownload.entries());
  const chunks = chunkArray(imageEntries, config.concurrency);

  for (const chunk of chunks) {
    await Promise.all(chunk.map(([url, savePath]) => downloadImage(url, savePath).catch(e => {
      console.error(`Ошибка загрузки ${url}:`, e.message);
    })));
  }
}

// Загрузка одного изображения
async function downloadImage(url, savePath) {
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: config.timeout,
      headers: { 'User-Agent': config.userAgent }
    });

    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', () => {
        bar.tick();
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Не удалось загрузить ${url}:`, error.message);
    // Удаляем частично загруженный файл, если он существует
    if (fs.existsSync(savePath)) {
      fs.unlinkSync(savePath);
    }
  }
}

// Разделение массива на чанки
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Запуск приложения
const startUrl = process.argv[2];
if (!startUrl) {
  console.log('Пожалуйста, укажите URL для сканирования');
  console.log('Пример: node image-downloader.js https://example.com');
  process.exit(1);
}

startCrawling(startUrl).catch(console.error);