<?php
class DirectorySizeCalculator {
    private $directory;

    public function __construct($directory) {
        $this->validateDirectory($directory);
        $this->directory = realpath($directory);
    }

    private function validateDirectory($directory) {
        if (!file_exists($directory)) {
            throw new InvalidArgumentException("Директория не существует.");
        }
        if (!is_dir($directory)) {
            throw new InvalidArgumentException("Указанный путь не является директорией.");
        }
        if (!is_readable($directory)) {
            throw new RuntimeException("Нет прав на чтение директории.");
        }
    }

    public function calculateSize() {
        $size = 0;
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->directory, FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }

        return $this->formatSize($size);
    }

    private function formatSize($bytes) {
        $units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
        $index = 0;

        while ($bytes >= 1024 && $index < count($units) - 1) {
            $bytes /= 1024;
            $index++;
        }

        return round($bytes, 2) . ' ' . $units[$index];
    }
}

// CLI обработка
if (php_sapi_name() !== 'cli') {
    die("Этот скрипт предназначен только для командной строки.");
}

echo "КАЛЬКУЛЯТОР РАЗМЕРА ДИРЕКТОРИИ\n";
echo "------------------------------\n";
echo "Введите путь к директории\n";
echo "Например: /home/user/documents или C:\\Users\\Public\\Documents\n";
echo "> ";

$handle = fopen("php://stdin", "r");
$directory = trim(fgets($handle));

try {
    $calculator = new DirectorySizeCalculator($directory);
    $size = $calculator->calculateSize();

    echo "\nРезультат:\n";
    echo "Общий размер: " . $size . "\n";
} catch (Exception $e) {
    echo "\nОшибка: " . $e->getMessage() . "\n";
    exit(1);
}
?>