<?php
namespace App\Domain;
interface CatalogInitializer
{
    /** Prepare catalog storage and demo data; initialization failures propagate to the caller. */
    public function initialize(): void;
}
