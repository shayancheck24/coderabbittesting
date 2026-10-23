<?php
namespace App\Presentation;
use App\Logic\InitializeCatalog;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
#[AsCommand(name: 'app:initialize', description: 'Create the local demo catalog once.')]
final class InitializeCommand extends Command
{
    public function __construct(private InitializeCatalog $initializer) { parent::__construct(); }
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->initializer->run();
        $output->writeln('Demo catalog ready.');
        return Command::SUCCESS;
    }
}
