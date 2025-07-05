export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  discount?: number;
  tags?: string[];
}