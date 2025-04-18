<?php
class ArrayFlattener {
    private $array;

    public function __construct($jsonArray) {
        $this->array = json_decode($jsonArray, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new InvalidArgumentException("Неверный JSON формат.");
        }
        if (!is_array($this->array)) {
            throw new InvalidArgumentException("Входные данные должны быть массивом.");
        }
    }

    public function flatten() {
        $result = [];
        $this->flattenArray($this->array, $result);
        return array_unique($result);
    }

    private function flattenArray($array, &$result) {
        foreach ($array as $element) {
            if (is_array($element)) {
                $this->flattenArray($element, $result);
            } else {
                $result[] = $element;
            }
        }
    }
}

// CLI обработка
if (php_sapi_name() !== 'cli') {
    die("Этот скрипт предназначен только для командной строки.");
}

echo "ПРЕОБРАЗОВАТЕЛЬ МАССИВОВ\n";
echo "------------------------\n";
echo "Введите многомерный массив в JSON формате\n";
echo "Примеры:\n";
echo "  [1, [2, 3], [4, [5, 6]]]\n";
echo "  {\"a\": 1, \"b\": [2, 3]}\n";
echo "> ";

$handle = fopen("php://stdin", "r");
$jsonInput = trim(fgets($handle));

try {
    $flattener = new ArrayFlattener($jsonInput);
    $flattened = $flattener->flatten();

    echo "\nРезультат:\n";
    print_r($flattened);
} catch (Exception $e) {
    echo "\nОшибка: " . $e->getMessage() . "\n";
    exit(1);
}
?>