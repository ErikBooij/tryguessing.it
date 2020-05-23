<?php
declare(strict_types=1);

namespace TryGuessingIt\Domain;

use JsonSerializable;

final class City implements JsonSerializable
{
    private bool $isCapital;
    private string $country;
    private float $lat;
    private float $lng;
    private string $name;

    public function __construct(string $name, string $country, float $lat, float $lng, bool $isCapital)
    {
        $this->name = $name;
        $this->country = $country;
        $this->lat = $lat;
        $this->lng = $lng;
        $this->isCapital = $isCapital;
    }

    /**
     * @return bool
     */
    public function isCapital(): bool
    {
        return $this->isCapital;
    }

    public function getCountry(): string
    {
        return $this->country;
    }

    public function getLat(): float
    {
        return $this->lat;
    }

    public function getLng(): float
    {
        return $this->lng;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getId(): string
    {
        return substr(md5($this->name . ':' . $this->country), 0, 12);
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'n' => $this->name,
            'c' => $this->country,
            'lt' => $this->lat,
            'lg' => $this->lng,
            'cp' => $this->isCapital,
        ];
    }
}
