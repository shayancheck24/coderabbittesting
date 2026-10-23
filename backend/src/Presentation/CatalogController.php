<?php
namespace App\Presentation;
use App\Logic\Catalog;
use Symfony\Component\HttpFoundation\{JsonResponse, Request};
use Symfony\Component\Routing\Attribute\Route;
#[\Symfony\Component\HttpKernel\Attribute\AsController]
final readonly class CatalogController
{
    public function __construct(private Catalog $catalog) {}
    #[Route('/api/products', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        foreach (['q', 'animal', 'category', 'sort'] as $key) {
            if (is_array($request->query->all()[$key] ?? null)) return new JsonResponse(['error' => 'Ungültiger Filter.'], 400);
        }
        $sort = $request->query->get('sort', 'price-asc');
        if (!in_array($sort, ['price-asc', 'price-desc', 'name'], true)) return new JsonResponse(['error' => 'Ungültige Sortierung.'], 400);
        return new JsonResponse(['items' => $this->catalog->search(trim($request->query->get('q', '')), $request->query->get('animal', ''), $request->query->get('category', ''), $sort)]);
    }
    #[Route('/api/products/{id}', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function detail(int $id): JsonResponse
    {
        $item = $this->catalog->detail($id);
        return new JsonResponse($item ?? ['error' => 'Produkt nicht gefunden.'], $item ? 200 : 404);
    }
    #[Route('/api/health', methods: ['GET'])]
    public function health(): JsonResponse { $this->catalog->search(); return new JsonResponse(['status' => 'ok']); }
}
