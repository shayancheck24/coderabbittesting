<?php
namespace App\Data;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
final readonly class DemoCatalogInitializer implements \App\Domain\CatalogInitializer
{
    public function __construct(private EntityManagerInterface $em) {}
    public function initialize(): void
    {
        $connection = $this->em->getConnection();
        $connection->beginTransaction();
        try {
            if (!$connection->createSchemaManager()->tablesExist(['products'])) {
                (new SchemaTool($this->em))->createSchema([$this->em->getClassMetadata(ProductRecord::class)]);
                foreach (json_decode(file_get_contents(__DIR__.'/fixtures.json'), true, flags: JSON_THROW_ON_ERROR) as $item) {
                    $record = new ProductRecord();
                    $record->id = $item['id'];
                    unset($item['id']);
                    $record->payload = $item;
                    $this->em->persist($record);
                }
                $this->em->flush();
            }
            $connection->commit();
        } catch (\Throwable $error) { $connection->rollBack(); throw $error; }
    }
}
