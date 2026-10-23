<?php
namespace App\Data;
use App\Domain\{Product, ProductRepository};
use Doctrine\ORM\EntityManagerInterface;
final readonly class DoctrineProductRepository implements ProductRepository
{
    public function __construct(private EntityManagerInterface $em) {}
    /**
     * Load all stored products without specifying an order; database and conversion errors propagate.
     *
     * @return list<Product>
     */
    public function all(): array { return array_map(static fn(ProductRecord $r) => $r->toDomain(), $this->em->getRepository(ProductRecord::class)->findAll()); }
    /** Return the stored product, or null if absent; database and conversion errors propagate. */
    public function find(int $id): ?Product { return $this->em->find(ProductRecord::class, $id)?->toDomain(); }
}
