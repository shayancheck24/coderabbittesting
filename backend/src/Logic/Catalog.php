<?php
namespace App\Logic;
use App\Domain\ProductRepository;
use App\Domain\Product;
final readonly class Catalog
{
    public function __construct(private ProductRepository $products) {}
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
    public function detail(int $id): ?array { return $this->products->find($id)?->toArray(); }
}
