<?php
class FormBuilder
{
    const METHOD_POST = 'post';
    const METHOD_GET = 'get';

    private $method;
    private $target;
    private $submitText;
    protected $fields = []; // Изменено на protected для доступа из дочерних классов

    public function getMethod(): string {
        return $this->method;
    }

    public function getTarget(): string {
        return $this->target;
    }

    public function getSubmitText(): string {
        return $this->submitText;
    }

    public function getFields(): array {
        return $this->fields;
    }

    public function __construct(string $method, string $target, string $submitText) {
        $this->method = strtolower($method) === self::METHOD_GET ? self::METHOD_GET : self::METHOD_POST;
        $this->target = htmlspecialchars($target, ENT_QUOTES);
        $this->submitText = htmlspecialchars($submitText, ENT_QUOTES);
    }

    public function addTextField(string $name, string $defaultValue = ''): void {
        $this->addField([
            'type' => 'text',
            'name' => $name,
            'value' => $defaultValue
        ]);
    }

    public function addRadioGroup(string $name, array $options): void {
        foreach ($options as $option) {
            $this->addField([
                'type' => 'radio',
                'name' => $name,
                'value' => $option
            ]);
        }
    }

    protected function addField(array $field): void {
        $this->fields[] = [
            'type' => htmlspecialchars($field['type'], ENT_QUOTES),
            'name' => htmlspecialchars($field['name'], ENT_QUOTES),
            'value' => htmlspecialchars($field['value'] ?? '', ENT_QUOTES),
            'checked' => $field['checked'] ?? ''
        ];
    }

    public function getForm(): string {
        $html = "<form method=\"{$this->method}\" action=\"{$this->target}\">\n";

        foreach ($this->fields as $field) {
            $checked = !empty($field['checked']) ? ' ' . $field['checked'] : '';
            $html .= " <input type=\"{$field['type']}\" name=\"{$field['name']}\" value=\"{$field['value']}\"{$checked} />\n";
        }

        $html .= " <input type=\"submit\" value=\"{$this->submitText}\" />\n";
        $html .= "</form>";

        return $html;
    }
}