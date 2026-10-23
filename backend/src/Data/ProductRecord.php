<?php
namespace App\Data;
use Doctrine\ORM\Mapping as ORM;
#[ORM\Entity]
#[ORM\Table(name: 'products')]
class ProductRecord
{
    #[ORM\Id, ORM\Column(type: 'integer')]
    public int $id;
    #[ORM\Column(type: 'json')]
    public array $payload;
    public function toDomain(): \App\Domain\Product { return new \App\Domain\Product(...['id' => $this->id, ...$this->payload]); }
}
