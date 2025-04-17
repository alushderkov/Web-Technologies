<?php
class SmartDate {
    private $date;

    public function __construct(string $dateString) {
        $this->date = new DateTime($dateString);
        if ($this->date === false) {
            throw new InvalidArgumentException("Invalid date string: {$dateString}");
        }
    }

    public function isWeekend(): bool {
        $dayOfWeek = $this->date->format('N');
        return $dayOfWeek >= 6; // 6 = Saturday, 7 = Sunday
    }

    public function getDistanceFromToday(string $unit = 'days'): int {
        $today = new DateTime();
        $interval = $today->diff($this->date);

        switch (strtolower($unit)) {
            case 'years':
                return (int)$interval->format('%r%y');
            case 'months':
                return (int)$interval->format('%r%m') + (int)$interval->format('%r%y') * 12;
            case 'weeks':
                return (int)floor($interval->days / 7);
            case 'days':
                return (int)$interval->format('%r%a');
            case 'hours':
                return (int)$interval->format('%r%a') * 24;
            case 'minutes':
                return (int)$interval->format('%r%a') * 1440;
            case 'seconds':
                return (int)$interval->format('%r%a') * 86400;
            default:
                throw new InvalidArgumentException("Unsupported unit: {$unit}");
        }
    }

    public function isLeapYear(): bool {
        $year = (int)$this->date->format('Y');
        return ($year % 400 === 0) || ($year % 100 !== 0 && $year % 4 === 0);
    }
}
?>