import { Injectable, inject, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

// TODO: These will be created as part of the workshop exercises
// import { CART_CONFIG, CartConfig } from '../config/cart-config';
// import { Logger } from './logger.service';
// import { AnalyticsService } from './analytics.service';

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  tax: number;
  finalPrice: number;
}

export interface CartMetadata {
  sessionId: string;
  created: Date;
  lastUpdated: Date;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class InjectCartService {
  // Modern inject() pattern - no constructor injection needed!
  private http = inject(HttpClient);
  
  // TODO: Students will implement these optional injections
  // Optional injection with fallbacks
  // private analytics = inject(AnalyticsService, { optional: true });
  // private logger = inject(Logger, { optional: true });
  
  // Configuration injection
  // private config = inject(CART_CONFIG, { optional: true }) ?? this.getDefaultConfig();
  
  // Platform-specific injection example
  // private storage = inject(PLATFORM_ID) === 'browser' 
  //   ? inject(BrowserStorageService)
  //   : inject(ServerStorageService);
  
  // Core state using signals
  private cartItems = signal<CartItem[]>([]);
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  // Readonly accessors
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // Computed values - automatically recalculate when dependencies change
  public readonly summary = computed<CartSummary>(() => {
    const items = this.cartItems();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discounts
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    
    // Progressive tax calculation (using default config for now)
    const taxRate = 0.08; // TODO: Use injected config
    const subtotal = totalPrice - totalDiscount;
    const tax = subtotal * taxRate;
    const finalPrice = subtotal + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // Computed analytics
  public readonly analytics = computed(() => {
    const items = this.cartItems();
    const metadata = this.cartMeta();
    
    const categories = new Set(items.map(item => item.category));
    const averageItemPrice = items.length > 0 
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
      : 0;
    
    const sessionDuration = Date.now() - metadata.created.getTime();
    
    return {
      uniqueCategories: categories.size,
      averageItemPrice,
      sessionDurationMinutes: Math.floor(sessionDuration / (1000 * 60)),
      cartVersion: metadata.version,
      lastActivity: metadata.lastUpdated,
      injectionMethod: 'inject() function',
      serviceType: 'Modern DI Service'
    };
  });
  
  // Computed validation
  public readonly validation = computed(() => {
    const items = this.cartItems();
    const summary = this.summary();
    
    const maxItems = 100; // TODO: Use injected config
    const hasItems = items.length > 0;
    const hasValidQuantities = items.every(item => item.quantity > 0);
    const hasValidPrices = items.every(item => item.price > 0);
    const totalUnderLimit = summary.totalItems <= maxItems;
    
    const isValid = hasItems && hasValidQuantities && hasValidPrices && totalUnderLimit;
    const errors: string[] = [];
    
    if (!hasItems) errors.push('Cart is empty');
    if (!hasValidQuantities) errors.push('Invalid quantities detected');
    if (!hasValidPrices) errors.push('Invalid prices detected');
    if (!totalUnderLimit) errors.push(`Too many items in cart (max: ${maxItems})`);
    
    return {
      isValid,
      errors,
      canCheckout: isValid && summary.finalPrice > 0
    };
  });

  constructor() {
    this.loadCartFromStorage();
    this.setupEffects();
    this.logInjectionInfo();
  }

  // Cart operations
  addItem(product: Product): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || '',
        category: product.category,
        discount: product.discount || 0
      };
      
      this.cartItems.update(items => [...items, newItem]);
      this.updateMetadata();
      
      // TODO: Track with injected analytics service
      // this.analytics?.track('item_added', { productId: product.id });
      console.log('Analytics: item_added', { productId: product.id });
    }
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.updateMetadata();
    
    // TODO: Track with injected analytics service
    // this.analytics?.track('item_removed', { itemId });
    console.log('Analytics: item_removed', { itemId });
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    this.updateMetadata();
    
    // TODO: Track with injected analytics service
    // this.analytics?.track('quantity_updated', { itemId, quantity });
    console.log('Analytics: quantity_updated', { itemId, quantity });
  }

  clearCart(): void {
    const itemCount = this.cartItems().length;
    this.cartItems.set([]);
    this.updateMetadata();
    
    // TODO: Track with injected analytics service
    // this.analytics?.track('cart_cleared', { itemCount });
    console.log('Analytics: cart_cleared', { itemCount });
  }

  // Advanced operations using inject() pattern
  duplicateItem(itemId: string): void {
    const item = this.cartItems().find(i => i.id === itemId);
    if (item) {
      const duplicatedItem: CartItem = {
        ...item,
        id: this.generateId(),
        quantity: 1
      };
      
      this.cartItems.update(items => [...items, duplicatedItem]);
      this.updateMetadata();
      
      // TODO: Log with injected logger service
      // this.logger?.info('Item duplicated', { originalId: itemId, newId: duplicatedItem.id });
      console.log('Logger: Item duplicated', { originalId: itemId, newId: duplicatedItem.id });
    }
  }

  // Export/Import functionality
  exportCart(): string {
    const exportData = {
      items: this.cartItems(),
      metadata: this.cartMeta(),
      summary: this.summary(),
      analytics: this.analytics(),
      exportDate: new Date().toISOString(),
      exportedWith: 'inject() service pattern',
      version: '1.0.0'
    };
    
    // TODO: Log with injected logger service
    // this.logger?.info('Cart exported', { itemCount: exportData.items.length });
    console.log('Logger: Cart exported', { itemCount: exportData.items.length });
    
    return JSON.stringify(exportData, null, 2);
  }

  importCart(cartData: string): boolean {
    try {
      const data = JSON.parse(cartData);
      
      // Validate import data structure
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid cart data structure');
      }

      // Validate item structure using type guards
      const isValidItem = (item: any): item is CartItem => {
        return typeof item.id === 'string' &&
               typeof item.productId === 'string' &&
               typeof item.name === 'string' &&
               typeof item.price === 'number' &&
               typeof item.quantity === 'number';
      };

      if (!data.items.every(isValidItem)) {
        throw new Error('Invalid cart item structure');
      }

      // Import the cart state
      this.cartItems.set(data.items);
      this.updateMetadata();

      // TODO: Log with injected logger service
      // this.logger?.info('Cart imported successfully', { itemCount: data.items.length });
      console.log('Logger: Cart imported successfully', { 
        itemCount: data.items.length,
        importDate: data.exportDate 
      });

      return true;
    } catch (error) {
      // TODO: Log error with injected logger service
      // this.logger?.error('Failed to import cart', error);
      console.error('Logger: Failed to import cart', error);
      return false;
    }
  }

  // Performance and analytics methods using inject() services
  measurePerformance(): Promise<any> {
    return new Promise((resolve) => {
      const start = performance.now();
      
      // Simulate some operations
      this.summary();
      this.analytics();
      this.validation();
      
      const end = performance.now();
      const performanceData = {
        operationTime: end - start,
        itemCount: this.cartItems().length,
        computedValues: 3,
        injectionMethod: 'inject() function',
        timestamp: new Date().toISOString()
      };
      
      // TODO: Track with injected analytics service
      // this.analytics?.track('performance_measured', performanceData);
      console.log('Analytics: performance_measured', performanceData);
      
      resolve(performanceData);
    });
  }

  // Dependency introspection (useful for debugging inject() patterns)
  getInjectionInfo(): any {
    return {
      serviceName: 'InjectCartService',
      injectionMethod: 'inject() function',
      dependencies: {
        required: ['HttpClient'],
        optional: [
          // 'AnalyticsService',
          // 'Logger',
          // 'CART_CONFIG'
        ],
        conditional: [
          // 'BrowserStorageService',
          // 'ServerStorageService'
        ]
      },
      features: [
        'Field-based injection',
        'Optional dependencies',
        'Configuration injection',
        'Platform-specific services',
        'Factory functions'
      ],
      benefits: [
        'No constructor boilerplate',
        'Cleaner service organization',
        'Better tree-shaking',
        'Functional composition support'
      ]
    };
  }

  // Private methods
  private setupEffects(): void {
    // Auto-save cart to localStorage
    effect(() => {
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('inject-cart', JSON.stringify({
            items,
            metadata
          }));
        } catch (error) {
          // TODO: Log error with injected logger service
          // this.logger?.error('Failed to save cart to storage', error);
          console.error('Logger: Failed to save cart to storage', error);
        }
      }
    });

    // Performance and analytics tracking effect
    effect(() => {
      const analytics = this.analytics();
      const validation = this.validation();
      
      // TODO: Send analytics with injected analytics service
      // this.analytics?.track('cart_state_updated', { analytics, validation });
      
      // For now, just log to console
      console.log('Analytics: cart_state_updated', { 
        sessionDuration: analytics.sessionDurationMinutes,
        itemCount: analytics.uniqueCategories,
        isValid: validation.isValid 
      });
    });

    // Validation monitoring effect
    effect(() => {
      const validation = this.validation();
      if (!validation.isValid) {
        // TODO: Log warning with injected logger service
        // this.logger?.warn('Cart validation issues', validation.errors);
        console.warn('Logger: Cart validation issues', validation.errors);
      }
    });
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('inject-cart');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.items && Array.isArray(data.items)) {
            this.cartItems.set(data.items);
          }
          if (data.metadata) {
            this.cartMeta.set({
              ...data.metadata,
              created: new Date(data.metadata.created),
              lastUpdated: new Date(data.metadata.lastUpdated)
            });
          }
        }
      } catch (error) {
        // TODO: Log error with injected logger service
        // this.logger?.error('Failed to load cart from storage', error);
        console.error('Logger: Failed to load cart from storage', error);
      }
    }
  }

  private updateMetadata(): void {
    this.cartMeta.update(meta => ({
      ...meta,
      lastUpdated: new Date(),
      version: meta.version + 1
    }));
  }

  private generateId(): string {
    return `inject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logInjectionInfo(): void {
    const injectionInfo = this.getInjectionInfo();
    
    // TODO: Log with injected logger service
    // this.logger?.info('Service initialized with inject() pattern', injectionInfo);
    console.log('Logger: Service initialized with inject() pattern', injectionInfo);
  }

  // TODO: These methods will be implemented when optional services are added
  // private getDefaultConfig(): CartConfig {
  //   return {
  //     maxItems: 100,
  //     taxRate: 0.08,
  //     currency: 'USD',
  //     enableAnalytics: true,
  //     enableLogging: true
  //   };
  // }
}