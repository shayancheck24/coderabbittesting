export interface Offer {
  shop: string;
  price: number;
  shipping: number;
  delivery: string;
}
export interface Product {
  id: number;
  name: string;
  brand: string;
  animal: string;
  category: string;
  size: string;
  description: string;
  color: string;
  features: string[];
  offers: Offer[];
  lowestPrice: number;
}
export const money = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
