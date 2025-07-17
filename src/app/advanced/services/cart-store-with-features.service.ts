import { Injectable, computed, effect, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, addEntity, updateEntity, removeEntity, setAllEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product, CartItem } from '../../shared/models';
import { ProductService } from '../../shared/services/product.service';

// Import custom store features
import { 
  withTaxCalculator, 
  withDiscounts, 
  withPersistence, 
  withAnalytics,
  type CalculationItem
} from '../store-features';

// Define category type based on actual product categories
type CategoryType = 'electronics' | 'clothing' | 'books' | 'home' | 'sports';

// Define the core cart state interface
export interface CartState {
  selectedCategory: CategoryType | 'all';
  searchQuery: string;
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
  wishlist: string[];
  recentlyViewed: Product[];
  cartHistory: CartItem[][];
  products: Product[];
}

// Define cart summary interface (enhanced with features)
export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  tax: number;
  finalPrice: number;
  shippingCost: number;
  estimatedDelivery: string;
  taxBreakdown: {
    standardTax: number;
    luxuryTax: number;
    effectiveRate: number;
  };
  discountBreakdown: {
    discountId: string;
    name: string;
    amount: number;
    type: string;
  }[];
}

/**
 * Enhanced Cart Store using Custom @ngrx/signals Features
 * 
 * This store demonstrates the power of custom features by composing:
 * - Tax calculation with progressive rates and luxury tax
 * - Discount management with coupons and bulk discounts
 * - Automatic persistence with versioning
 * - Analytics tracking for user behavior
 * 
 * This showcases how @ngrx/signals enables building sophisticated,
 * maintainable state management solutions through composition.
 */
export const CartStoreWithFeatures = signalStore(
  { providedIn: 'root' },
  
  // Core cart state
  withState<CartState>({
    selectedCategory: 'all',
    searchQuery: '',
    sortOrder: 'asc',
    isLoading: false,
    error: null,
    wishlist: [],
    recentlyViewed: [],
    cartHistory: [],
    products: []
  }),
  
  // Entity management for cart items
  withEntities<CartItem>(),
  
  // TODO: Custom features using signalStoreFeature (temporarily disabled for compilation)
  // withTaxCalculator({
  //   standardRate: 0.08,     // 8% standard tax
  //   luxuryRate: 0.15,       // 15% luxury tax
  //   luxuryThreshold: 1000,  // Items over $1000 are luxury
  //   exemptCategories: ['books'] // Books are tax-exempt
  // }),
  // withDiscounts(),
  // withPersistence({
  //   key: 'cart-with-features',
  //   storage: 'localStorage',
  //   debounceMs: 500,
  //   version: 1,
  //   exclude: ['isLoading', 'error'] // Don't persist loading/error states
  // }),
  // withAnalytics({ enablePerformanceTracking: true }),
  
  // Enhanced computed properties
  withComputed((store) => ({
    // Get all cart items as array
    cartItems: computed(() => store.entities()),
    
    // Filter and sort cart items
    filteredItems: computed(() => {
      const items = store.entities();
      const category = store.selectedCategory();
      const search = store.searchQuery().toLowerCase();
      const sortOrder = store.sortOrder();
      
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
      
      // Sort by total value
      return filtered.sort((a, b) => {
        const aValue = a.price * a.quantity;
        const bValue = b.price * b.quantity;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }),
    
    // Filter and sort products for shopping
    filteredProducts: computed(() => {
      const products = store.products();
      const category = store.selectedCategory();
      const search = store.searchQuery().toLowerCase();
      const sortOrder = store.sortOrder();
      
      let filtered = products;
      
      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
      }
      
      // Filter by search query
      if (search) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        );
      }
      
      // Sort by price
      return filtered.sort((a, b) => {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }),
    
    // Enhanced cart summary (basic version for now)
    enhancedCartSummary: computed((): CartSummary => {
      const items = store.entities();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Basic tax calculation (8% standard rate)
      const standardTaxRate = 0.08;
      const tax = totalPrice * standardTaxRate;
      
      // Basic discount calculation
      const totalDiscount = items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        const discount = item.discount ? (itemTotal * item.discount / 100) : 0;
        return sum + discount;
      }, 0);
      
      const subtotal = totalPrice - totalDiscount;
      
      // Shipping calculation
      let shippingCost = 15;
      if (subtotal > 500) {
        shippingCost = 0; // Free shipping over $500
      } else if (totalItems > 10) {
        shippingCost = 25; // Bulk shipping
      }
      
      const finalPrice = subtotal + tax + shippingCost;
      const estimatedDelivery = totalItems > 5 ? '5-7 business days' : '2-3 business days';
      
      return {
        totalItems,
        totalPrice,
        totalDiscount,
        tax,
        finalPrice,
        shippingCost,
        estimatedDelivery,
        taxBreakdown: {
          standardTax: tax,
          luxuryTax: 0,
          effectiveRate: standardTaxRate
        },
        discountBreakdown: []
      };
    }),
    
    // Category statistics
    categoryStats: computed(() => {
      const items = store.entities();
      const categories: CategoryType[] = ['electronics', 'clothing', 'books', 'home', 'sports'];
      
      return categories.map(category => {
        const categoryItems = items.filter(item => item.category === category);
        const itemCount = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const averagePrice = itemCount > 0 ? totalValue / itemCount : 0;
        
        return {
          category,
          itemCount,
          totalValue,
          averagePrice
        };
      }).filter(stat => stat.itemCount > 0);
    }),
    
    // Total items count
    totalItems: computed(() => {
      const items = store.entities();
      return items.reduce((sum, item) => sum + item.quantity, 0);
    }),
    
    // Check if item is in wishlist
    isInWishlist: computed(() => (productId: string) => {
      return store.wishlist().includes(productId);
    }),
    
    // Add currentCategory for template compatibility
    currentCategory: computed(() => store.selectedCategory())
  })),
  
  // Enhanced methods using features
  withMethods((store, productService = inject(ProductService)) => ({
    // Add item to cart with analytics tracking
    addItem(product: Product): void {
      const existingItem = store.entities().find(item => item.productId === product.id);
      
      if (existingItem) {
        patchState(store, updateEntity({
          id: existingItem.id,
          changes: { quantity: existingItem.quantity + 1 }
        }));
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
          discount: product.discount
        };
        patchState(store, addEntity(newItem));
      }
      
      // TODO: Analytics tracking will be added with custom features
    },
    
    // Remove item from cart
    removeItem(id: string): void {
      patchState(store, removeEntity(id));
    },
    
    // Update item quantity
    updateQuantity(id: string, quantity: number): void {
      if (quantity <= 0) {
        patchState(store, removeEntity(id));
      } else {
        patchState(store, updateEntity({ id, changes: { quantity } }));
      }
    },
    
    // Clear cart
    clearCart(): void {
      patchState(store, setAllEntities<CartItem>([]));
      // TODO: Track with custom analytics feature
    },
    
    // Set filter and sort options
    setCategory(category: CategoryType | 'all'): void {
      patchState(store, { selectedCategory: category });
      // TODO: Track with custom analytics feature
    },
    
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },
    
    toggleSortOrder(): void {
      patchState(store, (state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' as const : 'asc' as const
      }));
      // TODO: Track with custom analytics feature
    },
    
    // Wishlist operations
    addToWishlist(productId: string): void {
      patchState(store, (state) => ({
        wishlist: [...state.wishlist, productId]
      }));
      // TODO: Track with custom analytics feature
    },
    
    removeFromWishlist(productId: string): void {
      patchState(store, (state) => ({
        wishlist: state.wishlist.filter(id => id !== productId)
      }));
      // TODO: Track with custom analytics feature
    },
    
    toggleWishlist(productId: string): void {
      const isInWishlist = store.wishlist().includes(productId);
      
      if (isInWishlist) {
        patchState(store, (state) => ({
          wishlist: state.wishlist.filter(id => id !== productId)
        }));
      } else {
        patchState(store, (state) => ({
          wishlist: [...state.wishlist, productId]
        }));
      }
    },
    
    // Recently viewed tracking
    addToRecentlyViewed(product: Product): void {
      patchState(store, (state) => {
        const filtered = state.recentlyViewed.filter(p => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 10);
        return { recentlyViewed: updated };
      });
    },
    
    // Cart history management
    saveCurrentCart(): void {
      const currentItems = store.entities();
      if (currentItems.length > 0) {
        patchState(store, (state) => ({
          cartHistory: [...state.cartHistory, [...currentItems]].slice(-10)
        }));
      }
    },
    
    restorePreviousCart(): void {
      const history = store.cartHistory();
      if (history.length > 0) {
        const previousCart = history[history.length - 1];
        patchState(store, 
          setAllEntities<CartItem>(previousCart),
          (state) => ({ cartHistory: state.cartHistory.slice(0, -1) })
        );
        // TODO: Track with custom analytics feature
      }
    },
    
    // Search with debounce and analytics
    search: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          patchState(store, { searchQuery: query });
          // TODO: Track search with custom analytics feature
        })
      )
    ),
    
    // Load products from service
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => productService.getProducts()),
        tap((products) => {
          patchState(store, { products, isLoading: false });
          // TODO: Track with custom analytics feature
        })
      )
    ),
    
    // Complete purchase
    completePurchase(orderId: string): void {
      // TODO: Add analytics tracking when custom features are enabled
      // Clear cart after purchase
      patchState(store, setAllEntities<CartItem>([]));
    }
    
    // TODO: The following methods will be available when custom features are enabled:
    // - applyCoupon(couponCode: string): boolean
    // - removeCoupon(couponCode: string): void
    // - updateTaxRate(rate: number): void
    // - getAnalyticsReport()
    // - getPersistenceStats()
  })),
  
  // Lifecycle hooks
  withHooks({
    onInit(store) {
      // Load products on init
      store.loadProducts();
      
      // TODO: Analytics tracking will be added when custom features are enabled
    }
  })
);

// Export as injectable service
@Injectable({ providedIn: 'root' })
export class CartStoreWithFeaturesService extends CartStoreWithFeatures {}