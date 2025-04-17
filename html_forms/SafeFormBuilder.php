<?php
require_once 'FormBuilder.php';

class SafeFormBuilder extends FormBuilder {
    private $sourceData;

    public function __construct(string $method, string $target, string $submitText) {
        parent::__construct($method, $target, $submitText);
        $this->sourceData = strtolower($method) === self::METHOD_GET ? $_GET : $_POST;
    }

    public function addTextField(string $name, string $defaultValue = ''): void {
        $value = $this->getSafeValue($name, $defaultValue);
        parent::addTextField($name, $value);
    }

    public function addRadioGroup(string $name, array $options): void {
        $currentValue = $this->getSafeValue($name);

        foreach ($options as $option) {
            $this->addField([
                'type' => 'radio',
                'name' => $name,
                'value' => $option,
                'checked' => ($option === $currentValue) ? 'checked' : ''
            ]);
        }
    }

    private function getSafeValue(string $name, string $default = ''): string {
        return isset($this->sourceData[$name])
            ? $this->sourceData[$name]
            : $default;
    }
}