<?php
class Logger {
    const OUTPUT_SCREEN = 'screen';
    const OUTPUT_FILE = 'file';

    private $outputType;
    private $logFile;

    public function __construct(string $outputType, string $logFile = '') {
        $this->outputType = in_array($outputType, [self::OUTPUT_SCREEN, self::OUTPUT_FILE])
            ? $outputType
            : self::OUTPUT_SCREEN;

        if ($this->outputType === self::OUTPUT_FILE && empty($logFile)) {
            throw new InvalidArgumentException('Log file path must be specified for file output');
        }

        $this->logFile = $logFile;
    }

    public function log(string $message): void {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] {$message}\n";

        if ($this->outputType === self::OUTPUT_SCREEN) {
            echo $logMessage;
        } else {
            $this->writeToFile($logMessage);
        }
    }

    private function writeToFile(string $message): void {
        $result = file_put_contents($this->logFile, $message, FILE_APPEND);

        if ($result === false) {
            throw new RuntimeException("Failed to write to log file: {$this->logFile}");
        }
    }
}
?>