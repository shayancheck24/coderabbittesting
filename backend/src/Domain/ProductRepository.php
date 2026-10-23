<?php
namespace App\Domain;
interface ProductRepository
{
    /** @return list<Product> */
    public function all(): array;
    public function find(int $id): ?Product;
}
