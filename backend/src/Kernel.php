<?php
namespace App;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
final class Kernel extends BaseKernel
{
    use MicroKernelTrait;
    /** Yield the FrameworkBundle used by the API and console application. */
    public function registerBundles(): iterable { yield new \Symfony\Bundle\FrameworkBundle\FrameworkBundle(); }
}
