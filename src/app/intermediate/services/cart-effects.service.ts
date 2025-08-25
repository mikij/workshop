import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, Product } from '../../shared/models';
import { CartComputedService } from './cart-computed.service';

@Injectable({
  providedIn: 'root'
})
export class CartEffectsService {

  // Inject the main cart service as single source of truth
  private cartService = inject(CartComputedService);

  // Effects service only manages wishlist, recently viewed, and history
  private wishlist = signal<string[]>([]);
  private recentlyViewed = signal<Product[]>([]);
  private cartHistory = signal<CartItem[][]>([]);

  // Expose cart data from main service
  public readonly cartItems = this.cartService.cartItems;
  public readonly cartSummary = this.cartService.cartSummary;

  // Expose effects-specific data
  public readonly wishlistItems = this.wishlist.asReadonly();
  public readonly recentlyViewedItems = this.recentlyViewed.asReadonly();
  public readonly cartHistoryItems = this.cartHistory.asReadonly();

  constructor() {
    this.loadFromStorage();
    this.setupEffects();
  }

  private setupEffects(): void {
    // Effect for maintaining cart history (watches main cart service)
    effect(() => {
      const items = this.cartService.cartItems();
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

    // Effect for cart analytics (watches main cart service)
    effect(() => {
      const items = this.cartService.cartItems();
      const summary = this.cartService.cartSummary();

      if (items.length > 0) {
        console.log('Cart Analytics:', {
          itemCount: summary.totalItems,
          totalValue: summary.finalPrice,
          avgItemValue: summary.totalPrice / items.length,
          categories: [...new Set(items.map(item => item.category))].length
        });
      }
    });

    // Effect for low stock warnings (watches main cart service)
    effect(() => {
      const items = this.cartService.cartItems();
      const highQuantityItems = items.filter(item => item.quantity > 5);

      if (highQuantityItems.length > 0) {
        console.warn('High quantity items detected:', highQuantityItems.map(item => ({
          name: item.name,
          quantity: item.quantity
        })));
      }
    });
  }

  // Cart operations - delegate to main cart service
  addItem(product: Product): void {
    this.cartService.addItem(product);
    // Add to recently viewed as side effect
    this.addToRecentlyViewed(product);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
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
      // Restore to main cart service
      // previousState.forEach(item => {
      //   this.cartService.addItem({
      //     id: item.productId,
      //     name: item.name,
      //     price: item.price,
      //     image: item.image,
      //     category: item.category,
      //     discount: item.discount
      //   });
      // });
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
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
