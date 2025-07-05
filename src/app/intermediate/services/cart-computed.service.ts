import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartComputedService {
  
  private items = signal<CartItem[]>([]);
  private selectedCategory = signal<string>('all');
  private searchQuery = signal<string>('');
  private sortOrder = signal<'asc' | 'desc'>('asc');

  // TODO: Create readonly signals for external access
  public readonly cartItems = this.items.asReadonly();
  public readonly currentCategory = this.selectedCategory.asReadonly();
  public readonly currentSearch = this.searchQuery.asReadonly();
  public readonly currentSort = this.sortOrder.asReadonly();

  // TODO: Implement computed for cart summary with advanced calculations
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.items();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Advanced discount calculation
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    
    // Progressive tax calculation based on total
    const subtotal = totalPrice - totalDiscount;
    let tax = 0;
    if (subtotal > 1000) {
      tax = subtotal * 0.12; // 12% for orders over $1000
    } else if (subtotal > 500) {
      tax = subtotal * 0.10; // 10% for orders over $500
    } else {
      tax = subtotal * 0.08; // 8% for orders under $500
    }
    
    const finalPrice = subtotal + tax;

    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });

  // TODO: Implement computed for filtered and sorted items
  public readonly filteredItems = computed(() => {
    const items = this.items();
    const category = this.selectedCategory();
    const search = this.searchQuery().toLowerCase();
    const sort = this.sortOrder();

    let filtered = items;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    // Filter by search query
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    }

    // Sort items
    return filtered.sort((a, b) => {
      const aValue = a.price * a.quantity;
      const bValue = b.price * b.quantity;
      return sort === 'asc' ? aValue - bValue : bValue - aValue;
    });
  });

  // TODO: Implement computed for category statistics
  public readonly categoryStats = computed(() => {
    const items = this.items();
    const stats = new Map<string, { count: number; total: number }>();
    
    items.forEach(item => {
      const category = item.category;
      const current = stats.get(category) || { count: 0, total: 0 };
      stats.set(category, {
        count: current.count + item.quantity,
        total: current.total + (item.price * item.quantity)
      });
    });

    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      itemCount: data.count,
      totalValue: data.total
    }));
  });

  // TODO: Implement computed for discount information
  public readonly discountInfo = computed(() => {
    const items = this.items();
    const discountedItems = items.filter(item => item.discount && item.discount > 0);
    const totalDiscount = this.cartSummary().totalDiscount;
    
    return {
      hasDiscounts: discountedItems.length > 0,
      discountedItemsCount: discountedItems.length,
      totalSavings: totalDiscount,
      averageDiscount: discountedItems.length > 0 
        ? discountedItems.reduce((sum, item) => sum + (item.discount || 0), 0) / discountedItems.length
        : 0
    };
  });

  // TODO: Implement computed for shipping information
  public readonly shippingInfo = computed(() => {
    const summary = this.cartSummary();
    const freeShippingThreshold = 500;
    const standardShipping = 15;
    
    return {
      isFreeShipping: summary.finalPrice >= freeShippingThreshold,
      shippingCost: summary.finalPrice >= freeShippingThreshold ? 0 : standardShipping,
      amountForFreeShipping: Math.max(0, freeShippingThreshold - summary.finalPrice),
      estimatedDelivery: summary.finalPrice >= freeShippingThreshold ? '2-3 days' : '5-7 days'
    };
  });

  // TODO: Implement computed for recommendations
  public readonly recommendations = computed(() => {
    const items = this.items();
    const categories = [...new Set(items.map(item => item.category))];
    
    return {
      frequentCategories: categories,
      recommendedCategories: categories.length > 0 
        ? ['electronics', 'clothing', 'books'].filter(cat => !categories.includes(cat))
        : ['electronics', 'clothing', 'books'],
      totalUniqueItems: items.length,
      avgItemPrice: items.length > 0 
        ? items.reduce((sum, item) => sum + item.price, 0) / items.length
        : 0
    };
  });

  constructor() {
    this.loadCartFromStorage();
    
    // TODO: Effect for auto-saving cart
    effect(() => {
      this.saveCartToStorage();
    });

    // TODO: Effect for logging cart changes
    effect(() => {
      const summary = this.cartSummary();
      if (summary.totalItems > 0) {
        console.log('Cart updated:', {
          items: summary.totalItems,
          total: summary.finalPrice,
          categories: this.categoryStats().length
        });
      }
    });
  }

  // Basic cart operations
  addItem(product: Product): void {
    const currentItems = this.items();
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        discount: product.discount
      };
      
      this.items.update(items => [...items, newItem]);
    }
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  // Filter and sort methods
  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setSortOrder(order: 'asc' | 'desc'): void {
    this.sortOrder.set(order);
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items-computed', JSON.stringify(this.items()));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items-computed');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.items.set(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}