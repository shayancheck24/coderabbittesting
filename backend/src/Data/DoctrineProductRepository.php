<?php
namespace App\Data;
use App\Domain\{Product, ProductRepository};
use Doctrine\ORM\EntityManagerInterface;
final readonly class DoctrineProductRepository implements ProductRepository
{
    public function __construct(private EntityManagerInterface $em) {}
    public function all(): array { return array_map(static fn(ProductRecord $r) => $r->toDomain(), $this->em->getRepository(ProductRecord::class)->findAll()); }
    public function find(int $id): ?Product { return $this->em->find(ProductRecord::class, $id)?->toDomain(); }
}
