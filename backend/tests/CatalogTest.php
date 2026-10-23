<?php
use App\Data\{Database, DemoCatalogInitializer, DoctrineProductRepository};
use App\Logic\Catalog;
use PHPUnit\Framework\TestCase;
final class CatalogTest extends TestCase
{
    private string $path;
    private \Doctrine\ORM\EntityManager $em;
    private Catalog $catalog;
    protected function setUp(): void
    {
        $this->path = tempnam(sys_get_temp_dir(), 'catalog-');
        $this->em = Database::connect($this->path);
        (new DemoCatalogInitializer($this->em))->initialize();
        $this->catalog = new Catalog(new DoctrineProductRepository($this->em));
    }
    protected function tearDown(): void
    {
        $this->em->getConnection()->close();
        foreach ([$this->path, $this->path.'-wal', $this->path.'-shm'] as $file) if (is_file($file)) unlink($file);
    }
    public function testSeedIsIdempotentAndPersistent(): void
    {
        (new DemoCatalogInitializer($this->em))->initialize();
        $this->em->clear();
        self::assertCount(8, $this->catalog->search());
        self::assertSame('Adult Huhn & Reis', $this->catalog->detail(1)['name']);
        self::assertNull($this->catalog->detail(999));
    }
    public function testFiltersCombineAndSearchIsCaseInsensitive(): void
    {
        $items = $this->catalog->search('JOSERA', 'Hund', 'Trockenfutter');
        self::assertCount(1, $items);
        self::assertSame('Sensitive Lachs', $items[0]['name']);
        self::assertCount(0, $this->catalog->search('JOSERA', 'Katze'));
        self::assertCount(3, $this->catalog->search('', 'Katze'));
        self::assertCount(1, $this->catalog->search('GEFLÜGEL'));
    }
    public function testPricesAndSortOrder(): void
    {
        $ascending = array_column($this->catalog->search(), 'lowestPrice');
        $expected = $ascending;
        sort($expected);
        self::assertSame($expected, $ascending);
        self::assertSame(array_reverse($expected), array_column($this->catalog->search(sort: 'price-desc'), 'lowestPrice'));
        $product = $this->catalog->detail(1);
        self::assertSame(3299, $product['lowestPrice']);
        $offers = $product['offers'];
        usort($offers, static fn($a, $b) => ($a['price'] + $a['shipping']) <=> ($b['price'] + $b['shipping']));
        self::assertSame('Tierliebe', $offers[0]['shop']);
    }
}
