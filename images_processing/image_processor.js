const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class ImagePreviewGenerator {
  constructor(options = {}) {
    // Конфигурация по умолчанию
    this.defaultOptions = {
      outputDir: './previews',
      width: 300,
      height: 300,
      fit: 'cover',
      quality: 80,
      formats: ['webp'], // Можно добавить ['webp', 'jpeg', 'png']
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    // Слияние пользовательских опций с дефолтными
    this.options = { ...this.defaultOptions, ...options };

    // Создание выходной директории, если её нет
    this.ensureOutputDir().catch(err => {
      console.error('Failed to create output directory:', err);
      throw err;
    });
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.options.outputDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  async validateInputFile(filePath) {
    try {
      // Проверка существования файла
      const stats = await fs.stat(filePath);

      // Проверка размера файла
      if (stats.size > this.options.maxFileSize) {
        throw new Error(`File size exceeds maximum limit of ${this.options.maxFileSize / 1024 / 1024}MB`);
      }

      // Проверка типа файла (используя расширение как первичную проверку)
      const ext = path.extname(filePath).toLowerCase().slice(1);
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
        throw new Error('Unsupported file extension');
      }

      return true;
    } catch (err) {
      console.error(`Validation failed for ${filePath}:`, err.message);
      throw err;
    }
  }

  async generatePreview(filePath) {
    try {
      // Валидация входного файла
      await this.validateInputFile(filePath);

      // Генерация уникального имени файла
      const filename = path.basename(filePath, path.extname(filePath));
      const outputFiles = [];

      // Обработка для каждого запрошенного формата
      for (const format of this.options.formats) {
        const outputFilename = `${filename}_preview_${uuidv4().slice(0, 8)}.${format}`;
        const outputPath = path.join(this.options.outputDir, outputFilename);

        // Создание превью с помощью sharp
        const pipeline = sharp(filePath)
          .resize({
            width: this.options.width,
            height: this.options.height,
            fit: this.options.fit,
            withoutEnlargement: true
          });

        // Настройки качества/сжатия в зависимости от формата
        switch (format) {
          case 'webp':
            pipeline.webp({ quality: this.options.quality });
            break;
          case 'jpeg':
            pipeline.jpeg({ quality: this.options.quality });
            break;
          case 'png':
            pipeline.png({ compressionLevel: 9 });
            break;
        }

        // Сохранение файла
        await pipeline.toFile(outputPath);
        outputFiles.push(outputPath);

        console.log(`Preview generated: ${outputPath}`);
      }

      return {
        success: true,
        previews: outputFiles,
        originalFile: filePath
      };
    } catch (err) {
      console.error(`Error generating preview for ${filePath}:`, err);
      return {
        success: false,
        error: err.message,
        originalFile: filePath
      };
    }
  }

  async generatePreviewsForDirectory(dirPath) {
    try {
      // Чтение содержимого директории
      const files = await fs.readdir(dirPath);
      const results = [];

      // Обработка каждого файла
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        try {
          const result = await this.generatePreview(filePath);
          results.push(result);
        } catch (err) {
          results.push({
            success: false,
            error: err.message,
            file: filePath
          });
        }
      }

      return {
        total: files.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        details: results
      };
    } catch (err) {
      console.error(`Error processing directory ${dirPath}:`, err);
      throw err;
    }
  }
}

// Пример использования
(async () => {
  try {
    const generator = new ImagePreviewGenerator({
      outputDir: './image_previews',
      width: 400,
      height: 400,
      quality: 85,
      formats: ['webp', 'jpeg']
    });

    // Генерация превью для одного изображения
    const singleResult = await generator.generatePreview('./images/sample.jpg');
    console.log('Single preview result:', singleResult);

    // Генерация превью для всех изображений в директории
    const batchResult = await generator.generatePreviewsForDirectory('./images');
    console.log('Batch processing result:', batchResult);
  } catch (err) {
    console.error('Application error:', err);
    process.exit(1);
  }
})();