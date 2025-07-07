import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartEffectsService {
  
  private items = signal<CartItem[]>([]);
  // Effects service only manages wishlist, recently viewed, and history
  private wishlist = signal<string[]>([]);
  private recentlyViewed = signal<Product[]>([]);
  private cartHistory = signal<CartItem[][]>([]);

  public readonly cartItems = this.items.asReadonly();
  public readonly wishlistItems = this.wishlist.asReadonly();
  public readonly recentlyViewedItems = this.recentlyViewed.asReadonly();
  public readonly cartHistoryItems = this.cartHistory.asReadonly();

  public readonly cartSummary = computed(() => {
    const items = this.items();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      totalItems,
      totalPrice,
      totalDiscount: 0,
      tax: totalPrice * 0.08,
      finalPrice: totalPrice * 1.08
    };
  });

  constructor() {
    this.loadFromStorage();
    this.setupEffects();
  }

  private setupEffects(): void {
    // Effect for auto-saving cart to localStorage
    effect(() => {
      const items = this.items();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('cart-effects', JSON.stringify(items));
      }
    });

    // Effect for maintaining cart history
    effect(() => {
      const items = this.items();
      if (items.length > 0) {
        this.cartHistory.update(history => {
          const newHistory = [...history, [...items]];
          return newHistory.slice(-10); // Keep last 10 states
        });
      }
    });

    // Effect for managing wishlist persistence
    effect(() => {
      const wishlist = this.wishlist();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wishlist-effects', JSON.stringify(wishlist));
      }
    });

    // Effect for recently viewed items
    effect(() => {
      const recentlyViewed = this.recentlyViewed();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('recently-viewed', JSON.stringify(recentlyViewed));
      }
    });

    // Effect for cart analytics
    effect(() => {
      const items = this.items();
      const summary = this.cartSummary();
      
      if (items.length > 0) {
        console.log('Cart Analytics:', {
          itemCount: summary.totalItems,
          totalValue: summary.finalPrice,
          avgItemValue: summary.totalPrice / items.length,
          categories: [...new Set(items.map(item => item.category))].length
        });
      }
    });

    // Effect for low stock warnings
    effect(() => {
      const items = this.items();
      const highQuantityItems = items.filter(item => item.quantity > 5);
      
      if (highQuantityItems.length > 0) {
        console.warn('High quantity items detected:', highQuantityItems.map(item => ({
          name: item.name,
          quantity: item.quantity
        })));
      }
    });
  }

  // Cart operations
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

    // Add to recently viewed
    this.addToRecentlyViewed(product);
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

  // Wishlist operations
  addToWishlist(productId: string): void {
    this.wishlist.update(items => {
      if (!items.includes(productId)) {
        return [...items, productId];
      }
      return items;
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlist.update(items => items.filter(id => id !== productId));
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist().includes(productId);
  }

  // Recently viewed operations
  addToRecentlyViewed(product: Product): void {
    this.recentlyViewed.update(items => {
      const filtered = items.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 10); // Keep last 10 items
    });
  }

  // Cart history operations
  getPreviousCartState(): CartItem[] | null {
    const history = this.cartHistory();
    return history.length > 1 ? history[history.length - 2] : null;
  }

  restorePreviousCart(): void {
    const previousState = this.getPreviousCartState();
    if (previousState) {
      this.items.set(previousState);
    }
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      // Load cart items
      const savedItems = localStorage.getItem('cart-effects');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.items.set(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }

      // Load wishlist
      const savedWishlist = localStorage.getItem('wishlist-effects');
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist) as string[];
          this.wishlist.set(wishlist);
        } catch (error) {
          console.error('Error loading wishlist from storage:', error);
        }
      }

      // Load recently viewed
      const savedRecentlyViewed = localStorage.getItem('recently-viewed');
      if (savedRecentlyViewed) {
        try {
          const recentlyViewed = JSON.parse(savedRecentlyViewed) as Product[];
          this.recentlyViewed.set(recentlyViewed);
        } catch (error) {
          console.error('Error loading recently viewed from storage:', error);
        }
      }
    }
  }
}