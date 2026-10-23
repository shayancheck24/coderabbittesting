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
    /**
     * Build a product from the stored ID and payload fields.
     *
     * @throws \Error If properties are uninitialized or payload fields do not match the product constructor.
     */
    public function toDomain(): \App\Domain\Product { return new \App\Domain\Product(...['id' => $this->id, ...$this->payload]); }
}
