const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const cron = require('node-cron');

// Массив каталогов, которые нужно архивировать
const directoriesToArchive = [
  'D:\\bsuir\\web_technologies\\__data_page',
  'D:\\bsuir\\web_technologies\\__data_page\\images'
];

// Абсолютный путь для сохранения архивов
const archiveDir = path.join('D:\\bsuir\\web_technologies\\__data_page', 'archives');
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir); // Создаём папку, если её нет
}

// Функция для безопасного имени архива
const sanitizeDate = () => {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, '-') // Заменяем запрещённые символы
    .replace('T', '_')     // Делаем имя более читаемым
    .replace('Z', '');
};

// Функция для создания архива
const createArchive = (dirPath) => {
  const archiveName = `${path.basename(dirPath)}_${sanitizeDate()}.zip`;
  const outputPath = path.join(archiveDir, archiveName);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Максимальное сжатие
  });

  output.on('close', () => {
    console.log(`✅ Архив создан: ${archiveName}`);
  });

  archive.on('error', (err) => {
    console.error(`❌ Ошибка при создании архива для ${dirPath}:`, err);
  });

  archive.pipe(output);
  archive.directory(dirPath, false);
  archive.finalize();
};

// Функция для архивирования всех указанных каталогов
const archiveDirectories = () => {
  directoriesToArchive.forEach((dir) => {
    if (fs.existsSync(dir)) {
      createArchive(dir);
    } else {
      console.log(`⚠️ Каталог не найден: ${dir}`);
    }
  });
};

// Запуск архивации через минуту после старта
cron.schedule('*/1 * * * *', () => {
  console.log('🚀 Запуск архивирования...');
  archiveDirectories();

  // Задержка, чтобы успеть завершить процесс архивирования
  setTimeout(() => {
    console.log('✅ Архивирование завершено. Выход.');
    process.exit();
  }, 3000); // 3 секунды
});

console.log('🕐 Скрипт запущен. Архивирование произойдёт через 1 минуту.');
