import { Injectable, computed, effect, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, addEntity, updateEntity, removeEntity, setAllEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
// import { tapResponse } from '@ngrx/operators';
import {pipe, switchMap, tap, debounceTime, distinctUntilChanged, firstValueFrom} from 'rxjs';
import { Product, CartItem } from '../../shared/models';
import { ProductService } from '../../shared/services/product.service';

// Define category type based on actual product categories
type CategoryType = 'electronics' | 'clothing' | 'books' | 'home' | 'sports';

// Define the cart state interface
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

// Define cart summary interface
export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  tax: number;
  finalPrice: number;
  shippingCost: number;
  estimatedDelivery: string;
}

// Define category statistics interface
export interface CategoryStats {
  category: CategoryType;
  itemCount: number;
  totalValue: number;
  averagePrice: number;
}

// Define discount information interface
export interface DiscountInfo {
  hasDiscounts: boolean;
  discountedItemsCount: number;
  totalSavings: number;
  averageDiscount: number;
  bulkDiscountApplied: boolean;
}

// Create the cart store using @ngrx/signals
export const CartStore = signalStore(
  { providedIn: 'root' },

  // Initialize state with entities for cart items
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

  // Add entity management for cart items
  withEntities<CartItem>(),

  // Add computed properties for derived state
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

      // console.log('Filtering products:', { products: products.length, category, search, sortOrder });

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

    // Calculate cart summary with advanced logic
    cartSummary: computed((): CartSummary => {
      const items = store.entities();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Advanced discount calculation with bulk discounts
      const totalDiscount = items.reduce((sum, item) => {
        let itemDiscount = item.discount || 0;

        // Apply bulk discount for quantities > 3
        if (item.quantity > 3) {
          itemDiscount = Math.max(itemDiscount, 15);
        }

        // Category-specific bulk discounts
        if (item.category === 'electronics' && item.quantity > 2) {
          itemDiscount = Math.max(itemDiscount, 20);
        }

        return sum + (item.price * item.quantity * itemDiscount / 100);
      }, 0);

      // Progressive tax calculation
      const subtotal = totalPrice - totalDiscount;
      let tax = 0;

      if (subtotal > 1000) {
        tax = subtotal * 0.12; // 12% for orders over $1000
      } else if (subtotal > 500) {
        tax = subtotal * 0.10; // 10% for orders over $500
      } else {
        tax = subtotal * 0.08; // 8% for orders under $500
      }

      // Luxury tax for high-value items
      const luxuryTax = items
        .filter(item => item.price > 1000)
        .reduce((sum, item) => sum + (item.price * item.quantity * 0.15), 0);

      tax += luxuryTax;

      // Shipping calculation
      let shippingCost = 15; // Standard shipping
      if (subtotal > 500) {
        shippingCost = 0; // Free shipping over $500
      } else if (totalItems > 10) {
        shippingCost = 25; // Bulk shipping
      }

      const finalPrice = subtotal + tax + shippingCost;

      // Estimated delivery based on order size
      const estimatedDelivery = totalItems > 5 ? '5-7 business days' : '2-3 business days';

      return {
        totalItems,
        totalPrice,
        totalDiscount,
        tax,
        finalPrice,
        shippingCost,
        estimatedDelivery
      };
    }),

    // Category statistics
    categoryStats: computed((): CategoryStats[] => {
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

    // Discount information
    discountInfo: computed((): DiscountInfo => {
      const items = store.entities();
      const discountedItems = items.filter(item => (item.discount || 0) > 0 || item.quantity > 3);

      // Calculate total discount manually since we can't reference cartSummary
      const totalDiscount = items.reduce((sum, item) => {
        let itemDiscount = item.discount || 0;

        // Apply bulk discount for quantities > 3
        if (item.quantity > 3) {
          itemDiscount = Math.max(itemDiscount, 15);
        }

        // Category-specific bulk discounts
        if (item.category === 'electronics' && item.quantity > 2) {
          itemDiscount = Math.max(itemDiscount, 20);
        }

        return sum + (item.price * item.quantity * itemDiscount / 100);
      }, 0);

      return {
        hasDiscounts: discountedItems.length > 0,
        discountedItemsCount: discountedItems.length,
        totalSavings: totalDiscount,
        averageDiscount: discountedItems.length > 0
          ? totalDiscount / discountedItems.length
          : 0,
        bulkDiscountApplied: items.some(item => item.quantity > 3)
      };
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

  // Add methods for cart operations
  withMethods((store, productService = inject(ProductService)) => ({
    // Add item to cart
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
    },

    // Set filter and sort options
    setCategory(category: CategoryType | 'all'): void {
      patchState(store, { selectedCategory: category });
    },

    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    toggleSortOrder(): void {
      patchState(store, (state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' as const : 'asc' as const
      }));
    },

    // Wishlist operations
    addToWishlist(productId: string): void {
      patchState(store, (state) => ({
        wishlist: [...state.wishlist, productId]
      }));
    },

    removeFromWishlist(productId: string): void {
      patchState(store, (state) => ({
        wishlist: state.wishlist.filter(id => id !== productId)
      }));
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
        const updated = [product, ...filtered].slice(0, 10); // Keep last 10
        return { recentlyViewed: updated };
      });
    },

    // Cart history management
    saveCurrentCart(): void {
      const currentItems = store.entities();
      if (currentItems.length > 0) {
        patchState(store, (state) => ({
          cartHistory: [...state.cartHistory, [...currentItems]].slice(-10) // Keep last 10 states
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
      }
    },

    // Load cart from localStorage
    loadCartFromStorage(): void {
      if (typeof localStorage !== 'undefined') {
        try {
          const saved = localStorage.getItem('cart-ngrx-signals');
          if (saved) {
            const data = JSON.parse(saved);
            patchState(store,
              setAllEntities<CartItem>(data.items || []),
              { wishlist: data.wishlist || [] }
            );
          }
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    },

    // Save cart to localStorage
    saveCartToStorage(): void {
      if (typeof localStorage !== 'undefined') {
        const data = {
          items: store.entities(),
          wishlist: store.wishlist()
        };
        localStorage.setItem('cart-ngrx-signals', JSON.stringify(data));
      }
    },

    // RxJS method for search with debounce
    search: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          // console.log('Search query:', query);
          patchState(store, { searchQuery: query });
        })
      )
    ),

    // Load products from service
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => productService.getProducts()),
        tap((products) => {
          // console.log('Loaded products:', products.length);
          patchState(store, { products, isLoading: false });
        })
      )
    ),

    loadProductsTest: async () => {
      patchState(store, { isLoading: true });

      const products = await firstValueFrom(productService.getProducts());

      patchState(store, {products, isLoading: false})
    }
  })),

  // Add lifecycle hooks
  withHooks({
    onInit(store) {
      // Load cart from storage on init
      store.loadCartFromStorage();

      // Load products on init
      store.loadProducts();

      // Auto-save effect
      effect(() => {
        const items = store.entities();
        const wishlist = store.wishlist();

        // Save to localStorage whenever cart or wishlist changes
        if (typeof localStorage !== 'undefined') {
          const data = { items, wishlist };
          localStorage.setItem('cart-ngrx-signals', JSON.stringify(data));
        }
      });

      // Analytics logging effect
      effect(() => {
        const items = store.entities();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const stats = store.categoryStats();
        const discountInfo = store.discountInfo();

        if (totalItems > 0) {
          console.log('📊 Cart Analytics:', {
            totalItems,
            categoryBreakdown: stats,
            discounts: discountInfo,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Cart history tracking effect
      effect(() => {
        const items = store.entities();
        if (items.length > 0) {
          // Debounce history tracking to avoid too many snapshots
          setTimeout(() => {
            const currentItems = store.entities();
            if (JSON.stringify(currentItems) === JSON.stringify(items)) {
              store.saveCurrentCart();
            }
          }, 2000);
        }
      });
    },

    onDestroy(store) {
      // Final save before destroy
      store.saveCartToStorage();
    }
  })
);

// Export as injectable service
@Injectable({ providedIn: 'root' })
export class CartNgrxSignalsService extends CartStore {}
