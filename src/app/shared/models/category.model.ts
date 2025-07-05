export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  productCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Laptops, phones, and gadgets',
    icon: '💻',
    color: '#3b82f6',
    productCount: 15
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion and apparel',
    icon: '👕',
    color: '#10b981',
    productCount: 12
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Education and entertainment',
    icon: '📚',
    color: '#f59e0b',
    productCount: 8
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Furniture and decor',
    icon: '🏠',
    color: '#ef4444',
    productCount: 10
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness and outdoor gear',
    icon: '⚽',
    color: '#8b5cf6',
    productCount: 7
  }
];