<?php
class LetterCounter {
    private $text;

    public function __construct($text) {
        if (empty($text)) {
            throw new InvalidArgumentException("Текст не может быть пустым.");
        }
        $this->text = $text;
    }

    public function countLetters() {
        $result = [];
        $length = mb_strlen($this->text, 'UTF-8');

        for ($i = 0; $i < $length; $i++) {
            $char = mb_strtolower(mb_substr($this->text, $i, 1, 'UTF-8'));

            if (preg_match('/\p{L}/u', $char)) {
                if (!isset($result[$char])) {
                    $result[$char] = 0;
                }
                $result[$char]++;
            }
        }

        // Сортируем по убыванию частоты
        arsort($result);
        return $result;
    }
}

// CLI обработка
if (php_sapi_name() !== 'cli') {
    die("Этот скрипт предназначен только для командной строки.");
}

echo "СЧЁТЧИК БУКВ\n";
echo "------------\n";
echo "Введите текст для анализа\n";
echo "Пример: Тестовая строка для подсчёта букв\n";
echo "> ";

$handle = fopen("php://stdin", "r");
$text = trim(fgets($handle));

try {
    $counter = new LetterCounter($text);
    $letterCounts = $counter->countLetters();

    echo "\nРезультат (буква → количество):\n";
    foreach ($letterCounts as $letter => $count) {
        echo "'$letter' → $count\n";
    }
} catch (Exception $e) {
    echo "\nОшибка: " . $e->getMessage() . "\n";
    exit(1);
}
?>