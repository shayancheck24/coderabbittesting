import { useEffect, useState } from "react";
import { catalog } from "../data/catalog";
import type { Product } from "../domain/product";
export function useCatalog(query: string, id?: string) {
  const [state, setState] = useState<{
    key: string;
    items: Product[];
    loading: boolean;
    error: string;
  }>({ key: "", items: [], loading: true, error: "" });
  const [attempt, retry] = useState(0);
  const key = `${id ?? "list"}:${query}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    setState({ key, items: [], loading: true, error: "" });
    (id
      ? catalog.detail(id, controller.signal).then((item) => [item])
      : catalog.list(query, controller.signal).then((data) => data.items)
    )
      .then((items) => {
        if (!controller.signal.aborted)
          setState({ key, items, loading: false, error: "" });
      })
      .catch((error: Error) => {
        if (!controller.signal.aborted)
          setState({ key, items: [], loading: false, error: error.message });
      });
    return () => controller.abort();
  }, [query, id, key]);
  return {
    ...(state.key === key ? state : { items: [], loading: true, error: "" }),
    retry: () => retry((a) => a + 1),
  };
}
