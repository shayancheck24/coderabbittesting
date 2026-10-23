<?php
namespace App\Logic;
use App\Domain\CatalogInitializer;
final readonly class InitializeCatalog
{
    public function __construct(private CatalogInitializer $initializer) {}
    /** Prepare the catalog through its initializer, propagating initialization failures. */
    public function run(): void { $this->initializer->initialize(); }
}
