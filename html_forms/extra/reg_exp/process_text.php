<?php
// Функция для обработки текста
function processText($text) {
    // 1. Заменяем последовательности из 2+ пробельных символов на один пробел
    $text = preg_replace('/\s{2,}/u', ' ', $text);

    // 2. Форматируем предложения в отдельные абзацы
    $text = preg_replace('/([.!?]+)\s*/u', "$1\n\n", $text);

    // 3. Подчеркиваем аббревиатуры (слова из 2-4 заглавных букв)
    $text = preg_replace('/(^|\s)([А-ЯЁA-Z]{2,4})(\s|$|[.!?,])/u', '$1<u>$2</u>$3', $text);

    // 4. Выделяем числа синим цветом (целые и с десятичной точкой)
    $text = preg_replace('/(^|\s)(\d+\.?\d*)(\s|$|[.!?,])/u', '$1<span style="color:blue;">$2</span>$3', $text);

    return $text;
}

// Получаем текст из файла
$filename = 'input.txt'; // Укажите путь к вашему файлу
if (!file_exists($filename)) {
    die("Файл $filename не найден");
}

$originalText = file_get_contents($filename);
if ($originalText === false) {
    die("Не удалось прочитать файл $filename");
}

// Обрабатываем текст
$processedText = processText($originalText);

// Выводим результат
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Обработка текста</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        .text-container {
            display: flex;
            gap: 40px;
        }
        .text-column {
            flex: 1;
        }
        h2 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        p {
            margin-bottom: 1em;
            text-align: justify;
        }
        .original {
            white-space: pre-wrap;
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
        }
        .processed p {
            margin-bottom: 1.5em;
            text-indent: 1.5em;
        }
    </style>
</head>
<body>
<h1>Обработка текста с помощью регулярных выражений</h1>

<div class="text-container">
    <div class="text-column">
        <h2>Исходный текст</h2>
        <div class="original"><?= htmlspecialchars($originalText) ?></div>
    </div>

    <div class="text-column">
        <h2>Обработанный текст</h2>
        <div class="processed"><?= nl2br($processedText) ?></div>
    </div>
</div>
</body>
</html>