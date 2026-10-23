<?php
namespace App\Domain;
/** A catalog item and comparable offers for the exact same package. Prices are EUR cents. */
final readonly class Product
{
    /**
     * Store product attributes and offers without validating their contents.
     *
     * @param array $offers Offers for the same package, with price and shipping in EUR cents.
     */
    public function __construct(
        public int $id, public string $name, public string $brand,
        public string $animal, public string $category, public string $size,
        public string $description, public string $color, public array $features,
        public array $offers,
    ) {}
    /**
     * Return the lowest offer price in EUR cents, excluding shipping.
     *
     * @throws \ValueError If no offer contains a price.
     */
    public function lowestPrice(): int { return min(array_column($this->offers, 'price')); }
    /**
     * Return all product fields plus lowestPrice in EUR cents, excluding shipping.
     *
     * @throws \ValueError If no offer contains a price.
     */
    public function toArray(): array { return [...get_object_vars($this), 'lowestPrice' => $this->lowestPrice()]; }
}
