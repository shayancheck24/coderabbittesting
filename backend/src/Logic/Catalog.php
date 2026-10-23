<?php
namespace App\Logic;
use App\Domain\ProductRepository;
use App\Domain\Product;
final readonly class Catalog
{
    public function __construct(private ProductRepository $products) {}
    /**
     * Return matching product fields, including lowestPrice in EUR cents excluding shipping.
     * Filters combine: query is a case-insensitive substring of the combined name and brand,
     * while animal and category require exact matches. Empty strings disable each filter;
     * query whitespace is preserved.
     * Repository and product conversion errors propagate to the caller.
     *
     * @param string $sort 'price-desc' sorts by descending lowestPrice; 'name' uses
     *     case-insensitive natural name order; all other values sort by ascending lowestPrice.
     * @return list<array> An empty list when no products match.
     * @throws \ValueError If a matching product has no offer price.
     */
    public function search(string $query = '', string $animal = '', string $category = '', string $sort = 'price-asc'): array
    {
        $items = array_filter($this->products->all(), static fn(Product $p) =>
            ($query === '' || str_contains(mb_strtolower($p->name.' '.$p->brand), mb_strtolower($query)))
            && ($animal === '' || $p->animal === $animal)
            && ($category === '' || $p->category === $category));
        usort($items, static fn(Product $a, Product $b) => match ($sort) {
            'price-desc' => $b->lowestPrice() <=> $a->lowestPrice(),
            'name' => strnatcasecmp($a->name, $b->name),
            default => $a->lowestPrice() <=> $b->lowestPrice(),
        });
        return array_map(static fn(Product $p) => $p->toArray(), $items);
    }
    /**
     * Return product fields with lowestPrice in EUR cents excluding shipping, or null if absent.
     * Repository and product conversion errors propagate.
     *
     * @throws \ValueError If the product has no offer price.
     */
    public function detail(int $id): ?array { return $this->products->find($id)?->toArray(); }
}
