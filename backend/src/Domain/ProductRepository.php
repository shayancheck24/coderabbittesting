<?php
namespace App\Domain;
interface ProductRepository
{
    /** @return list<Product> */
    public function all(): array;
    /** Return the product with this ID, or null when no product matches. */
    public function find(int $id): ?Product;
}
