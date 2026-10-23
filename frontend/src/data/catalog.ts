import type { Product } from "../domain/product";
/**
 * Fetch and decode JSON without validating its shape.
 * Reject with a product-not-found error for HTTP 404 or a generic loading error for
 * other unsuccessful HTTP responses; network, abort, and JSON parsing errors propagate.
 */
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
  /**
   * Fetch the items envelope using a serialized query string without a leading '?'.
   * HTTP, network, abort, and JSON parsing failures reject the promise.
   */
  list: (query: string, signal: AbortSignal) =>
    get<{ items: Product[] }>(`/api/products?${query}`, signal),
  /**
   * Fetch one product using an ID encoded as a URL path segment.
   * HTTP, network, abort, and JSON parsing failures reject the promise.
   */
  detail: (id: string, signal: AbortSignal) =>
    get<Product>(`/api/products/${encodeURIComponent(id)}`, signal),
};
