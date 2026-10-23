import type { Product } from "../domain/product";
async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });
  if (!response.ok)
    throw new Error(
      response.status === 404
        ? "Dieses Produkt wurde nicht gefunden."
        : "Die Angebote konnten nicht geladen werden. Bitte versuche es erneut.",
    );
  return response.json() as Promise<T>;
}
export const catalog = {
  list: (query: string, signal: AbortSignal) =>
    get<{ items: Product[] }>(`/api/products?${query}`, signal),
  detail: (id: string, signal: AbortSignal) =>
    get<Product>(`/api/products/${encodeURIComponent(id)}`, signal),
};
