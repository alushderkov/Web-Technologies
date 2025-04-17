<?php
class AgeCalculator {
    private $birthDate;

    public function __construct($birthDate) {
        $this->validateDate($birthDate);
        $this->birthDate = new DateTime($birthDate);
    }

    private function validateDate($date) {
        if (!DateTime::createFromFormat('Y-m-d', $date)) {
            throw new InvalidArgumentException("Неверный формат даты. Используйте ГГГГ-ММ-ДД.");
        }
    }

    public function calculateAge() {
        $today = new DateTime();
        if ($this->birthDate > $today) {
            throw new LogicException("Дата рождения не может быть в будущем.");
        }

        $interval = $this->birthDate->diff($today);
        return $interval->format('%y лет, %m месяцев, %d дней');
    }
}

// CLI обработка
if (php_sapi_name() !== 'cli') {
    die("Этот скрипт предназначен только для командной строки.");
}

echo "КАЛЬКУЛЯТОР ВОЗРАСТА\n";
echo "--------------------\n";
echo "Введите дату рождения в формате ГГГГ-ММ-ДД\n";
echo "Например: 1990-05-15\n";
echo "> ";

$handle = fopen("php://stdin", "r");
$birthdate = trim(fgets($handle));

try {
    $calculator = new AgeCalculator($birthdate);
    $age = $calculator->calculateAge();

    echo "\nРезультат:\n";
    echo "Возраст: " . $age . "\n";
} catch (Exception $e) {
    echo "\nОшибка: " . $e->getMessage() . "\n";
    exit(1);
}
?>