<?php
namespace App\Data;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
final class Database
{
    public static function connect(string $path): EntityManager
    {
        if (!is_dir(dirname($path))) mkdir(dirname($path), 0775, true);
        $config = ORMSetup::createAttributeMetadataConfiguration([__DIR__], false);
        $connection = DriverManager::getConnection(['driver' => 'pdo_sqlite', 'path' => $path]);
        $connection->executeStatement('PRAGMA busy_timeout = 5000');
        $connection->executeStatement('PRAGMA journal_mode = WAL');
        return new EntityManager($connection, $config);
    }
}
