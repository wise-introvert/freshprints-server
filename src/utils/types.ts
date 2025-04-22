export interface Product {
  code: string;
  sizes: Apparel[];
}

export interface Apparel {
  size: string;
  quantity: number;
  price: number;
}
