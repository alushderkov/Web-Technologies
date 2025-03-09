<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Меню и сортировка городов</title>
    <style>
        .menu {
            margin-bottom: 20px;
        }
        .menu a {
            text-decoration: none;
            padding: 5px 10px;
            margin-right: 10px;
            background-color: #f0f0f0;
            color: #333;
            border-radius: 5px;
        }
        .menu a.active {
            background-color: #333;
            color: #fff;
        }
    </style>
</head>
<body>

<div class="menu">
    <a href="?page=about" class="<?php echo ($_GET['page'] ?? '') === 'about' ? 'active' : ''; ?>">О компании</a>
    <a href="?page=services" class="<?php echo ($_GET['page'] ?? '') === 'services' ? 'active' : ''; ?>">Услуги</a>
    <a href="?page=pricing" class="<?php echo ($_GET['page'] ?? '') === 'pricing' ? 'active' : ''; ?>">Прайс</a>
    <a href="?page=contacts" class="<?php echo ($_GET['page'] ?? '') === 'contacts' ? 'active' : ''; ?>">Контакты</a>
</div>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cities'])) {
    $cities = explode(',', $_POST['cities']);
    $cities = array_map('trim', $cities);
    $cities = array_map('ucfirst', array_map('strtolower', $cities));
    $cities = array_unique($cities);
    sort($cities);

    echo "<h2>Отсортированные города:</h2>";
    echo "<ul>";
    foreach ($cities as $city) {
        echo "<li>$city</li>";
    }
    echo "</ul>";
}
?>

<h2>Введите города через запятую:</h2>
<form method="post">
    <input type="text" name="cities" required>
    <button type="submit">Отправить</button>
</form>

</body>
</html>