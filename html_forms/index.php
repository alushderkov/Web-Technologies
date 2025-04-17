<?php
require_once 'FormBuilder.php';
require_once 'SafeFormBuilder.php';
require_once 'Logger.php';
require_once 'SmartDate.php';
require_once 'CryptoManager.php';

// Установка заголовка и кодировки
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Демонстрация PHP классов</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .demo-section {
            margin-bottom: 40px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            background: #f9f9f9;
        }
        h1, h2 {
            color: #333;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
        }
        form {
            margin: 15px 0;
        }
        input, select, textarea {
            margin: 5px 0;
            padding: 8px;
            width: 100%;
            max-width: 400px;
            box-sizing: border-box;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 4px;
        }
        button:hover {
            background: #45a049;
        }
        .result {
            margin: 15px 0;
            padding: 15px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
        }
    </style>
</head>
<body>
<h1>Демонстрация работы PHP классов</h1>

<div class="demo-section">
    <h2>1. FormBuilder</h2>
    <p>Создайте HTML-форму с текстовым полем и группой радиокнопок:</p>

    <form method="post">
        <input type="hidden" name="demo" value="form_builder">
        <label>
            Метод формы:
            <select name="form_method">
                <option value="post">POST</option>
                <option value="get">GET</option>
            </select>
        </label><br>
        <label>
            URL назначения:
            <input type="text" name="form_target" value="/submit.php" required>
        </label><br>
        <label>
            Текст кнопки отправки:
            <input type="text" name="submit_text" value="Отправить" required>
        </label><br>
        <label>
            Имя текстового поля:
            <input type="text" name="text_field_name" value="username" required>
        </label><br>
        <label>
            Значение по умолчанию:
            <input type="text" name="text_field_value" value="Иван Иванов">
        </label><br>
        <label>
            Имя группы радиокнопок:
            <input type="text" name="radio_group_name" value="gender" required>
        </label><br>
        <label>
            Варианты радиокнопок (через запятую):
            <input type="text" name="radio_options" value="Мужской, Женский" required>
        </label><br>
        <button type="submit">Создать форму</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['demo'] ?? '') === 'form_builder') {
        try {
            $method = $_POST['form_method'];
            $target = $_POST['form_target'];
            $submitText = $_POST['submit_text'];
            $textFieldName = $_POST['text_field_name'];
            $textFieldValue = $_POST['text_field_value'];
            $radioGroupName = $_POST['radio_group_name'];
            $radioOptions = array_map('trim', explode(',', $_POST['radio_options']));

            $formBuilder = new FormBuilder($method, $target, $submitText);
            $formBuilder->addTextField($textFieldName, $textFieldValue);
            $formBuilder->addRadioGroup($radioGroupName, $radioOptions);

            echo '<div class="result"><h3>Результат:</h3>';
            echo $formBuilder->getForm();
            echo '</div>';
        } catch (Exception $e) {
            echo '<div class="result" style="color:red;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
    ?>
</div>

<div class="demo-section">
    <h2>2. SafeFormBuilder</h2>
    <p>Создайте форму с автозаполнением из предыдущих данных:</p>

    <form method="post">
        <input type="hidden" name="demo" value="safe_form_builder">
        <label>
            Метод формы:
            <select name="safe_form_method">
                <option value="post">POST</option>
                <option value="get">GET</option>
            </select>
        </label><br>
        <label>
            URL назначения:
            <input type="text" name="safe_form_target" value="/submit.php" required>
        </label><br>
        <label>
            Текст кнопки отправки:
            <input type="text" name="safe_submit_text" value="Отправить" required>
        </label><br>
        <label>
            Имя текстового поля:
            <input type="text" name="safe_text_field_name" value="username" required>
        </label><br>
        <label>
            Значение по умолчанию:
            <input type="text" name="safe_text_field_value" value="Иван Иванов">
        </label><br>
        <label>
            Имя группы радиокнопок:
            <input type="text" name="safe_radio_group_name" value="gender" required>
        </label><br>
        <label>
            Варианты радиокнопок (через запятую):
            <input type="text" name="safe_radio_options" value="Мужской, Женский" required>
        </label><br>
        <label>
            Имитация отправленных данных (JSON, например: {"username":"Петр","gender":"Мужской"}):
            <textarea name="form_data" rows="3">{"username":"Петр","gender":"Мужской"}</textarea>
        </label><br>
        <button type="submit">Создать форму с автозаполнением</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['demo'] ?? '') === 'safe_form_builder') {
        try {
            $method = $_POST['safe_form_method'];
            $target = $_POST['safe_form_target'];
            $submitText = $_POST['safe_submit_text'];
            $textFieldName = $_POST['safe_text_field_name'];
            $textFieldValue = $_POST['safe_text_field_value'];
            $radioGroupName = $_POST['safe_radio_group_name'];
            $radioOptions = array_map('trim', explode(',', $_POST['safe_radio_options']));
            $formData = json_decode($_POST['form_data'], true) ?? [];

            // Имитируем отправку формы
            if ($method === 'get') {
                $_GET = $formData;
                $_POST = [];
            } else {
                $_POST = $formData;
                $_GET = [];
            }

            $safeFormBuilder = new SafeFormBuilder($method, $target, $submitText);
            $safeFormBuilder->addTextField($textFieldName, $textFieldValue);
            $safeFormBuilder->addRadioGroup($radioGroupName, $radioOptions);

            echo '<div class="result"><h3>Результат:</h3>';
            echo $safeFormBuilder->getForm();
            echo '<p>Имитированные данные: ' . htmlspecialchars(($_POST['demo'] === 'safe_form_builder' ? 'POST' : 'GET')) . ' = ' . htmlspecialchars(json_encode($formData)) . '</p>';echo '</div>';
        } catch (Exception $e) {
            echo '<div class="result" style="color:red;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
    ?>
</div>

<div class="demo-section">
    <h2>3. Logger</h2>
    <p>Протестируйте систему логирования:</p>

    <form method="post">
        <input type="hidden" name="demo" value="logger">
        <label>
            Тип вывода:
            <select name="logger_type">
                <option value="screen">На экран</option>
                <option value="file">В файл</option>
            </select>
        </label><br>
        <label>
            Имя файла (если выбран вывод в файл):
            <input type="text" name="log_file" value="log.txt">
        </label><br>
        <label>
            Сообщение для логирования:
            <textarea name="log_message" rows="3" required>Тестовое сообщение</textarea>
        </label><br>
        <button type="submit">Записать в лог</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['demo'] ?? '') === 'logger') {
        try {
            $type = $_POST['logger_type'];
            $message = $_POST['log_message'];
            $logFile = $_POST['log_file'] ?? 'log.txt';

            if ($type === 'file' && empty($logFile)) {
                throw new InvalidArgumentException("Не указан файл для логирования");
            }

            $logger = new Logger($type, $logFile);
            $logger->log($message);

            echo '<div class="result"><h3>Результат:</h3>';
            if ($type === 'screen') {
                echo '<p>Сообщение выведено на экран (см. выше)</p>';
            } else {
                echo '<p>Сообщение записано в файл: ' . htmlspecialchars($logFile) . '</p>';
            }
            echo '</div>';
        } catch (Exception $e) {
            echo '<div class="result" style="color:red;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
    ?>
</div>

<div class="demo-section">
    <h2>4. SmartDate</h2>
    <p>Проанализируйте дату:</p>

    <form method="post">
        <input type="hidden" name="demo" value="smart_date">
        <label>
            Дата для анализа (формат ГГГГ-ММ-ДД):
            <input type="text" name="date_to_analyze" value="<?= date('Y-m-d') ?>" required>
        </label><br>
        <button type="submit">Анализировать дату</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['demo'] ?? '') === 'smart_date') {
        try {
            $dateStr = $_POST['date_to_analyze'];
            $smartDate = new SmartDate($dateStr);

            echo '<div class="result"><h3>Результат для даты ' . htmlspecialchars($dateStr) . ':</h3>';
            echo '<p>Выходной день: ' . ($smartDate->isWeekend() ? 'Да' : 'Нет') . '</p>';
            echo '<p>Расстояние от сегодняшнего дня в днях: ' . $smartDate->getDistanceFromToday('days') . '</p>';
            echo '<p>Високосный год: ' . ($smartDate->isLeapYear() ? 'Да' : 'Нет') . '</p>';
            echo '</div>';
        } catch (Exception $e) {
            echo '<div class="result" style="color:red;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
    ?>
</div>

<div class="demo-section">
    <h2>5. CryptoManager</h2>
    <p>Протестируйте шифрование и дешифрование:</p>

    <form method="post">
        <input type="hidden" name="demo" value="crypto_manager">
        <label>
            Алгоритм шифрования:
            <select name="crypto_algorithm">
                <?php
                $algorithms = openssl_get_cipher_methods(true);
                foreach ($algorithms as $algo) {
                    echo '<option value="' . htmlspecialchars($algo) . '">' . htmlspecialchars($algo) . '</option>';
                }
                ?>
            </select>
        </label><br>
        <label>
            Пароль:
            <input type="text" name="crypto_password" value="my_secret_password" required>
        </label><br>
        <label>
            Текст для шифрования:
            <textarea name="text_to_encrypt" rows="3" required>Секретное сообщение</textarea>
        </label><br>
        <button type="submit">Зашифровать/расшифровать</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['demo'] ?? '') === 'crypto_manager') {
        try {
            $algorithm = $_POST['crypto_algorithm'];
            $password = $_POST['crypto_password'];
            $text = $_POST['text_to_encrypt'];

            $crypto = new CryptoManager($algorithm, $password);
            $encrypted = $crypto->encrypt($text);
            $decrypted = $crypto->decrypt($encrypted);

            echo '<div class="result"><h3>Результат:</h3>';
            echo '<p>Оригинальный текст: ' . htmlspecialchars($text) . '</p>';
            echo '<p>Зашифрованный текст (base64): <code>' . htmlspecialchars($encrypted) . '</code></p>';
            echo '<p>Расшифрованный текст: ' . htmlspecialchars($decrypted) . '</p>';
            echo '</div>';
        } catch (Exception $e) {
            echo '<div class="result" style="color:red;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</div>';
        }
    }
    ?>
</div>

</body>
</html>