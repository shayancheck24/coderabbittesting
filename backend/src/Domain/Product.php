<?php
namespace App\Domain;
/** A catalog item and comparable offers for the exact same package. Prices are EUR cents. */
final readonly class Product
{
    public function __construct(
        public int $id, public string $name, public string $brand,
        public string $animal, public string $category, public string $size,
        public string $description, public string $color, public array $features,
        public array $offers,
    ) {}
    public function lowestPrice(): int { return min(array_column($this->offers, 'price')); }
    public function toArray(): array { return [...get_object_vars($this), 'lowestPrice' => $this->lowestPrice()]; }
}
