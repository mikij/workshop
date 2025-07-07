import { Injectable, inject, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

// TODO: Uncomment these imports as you implement inject() patterns in Task 3:
// import { CART_CONFIG, FEATURE_FLAGS, DEFAULT_CART_CONFIG, CartConfig } from '../config/cart-config';
// import { injectOptionalService, injectWithFallback } from '../utils/injection-utils';
// import { PLATFORM_ID, isPlatformBrowser } from '@angular/common';

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

/**
 * INJECT MODULE - Modern Dependency Injection Patterns
 * 
 * This service demonstrates modern Angular dependency injection using the inject() function
 * instead of traditional constructor-based injection.
 * 
 * KEY CONCEPTS TO LEARN:
 * - Field-based injection with inject()
 * - Optional dependency injection
 * - Configuration injection patterns
 * - Platform-specific service injection
 * - Provider function patterns
 * - Factory function injection
 * - Multi-provider patterns
 * 
 * BENEFITS OF inject() FUNCTION:
 * - No constructor boilerplate
 * - Better tree-shaking support
 * - Cleaner service organization
 * - Functional composition support
 * - Better testing patterns
 */
@Injectable({
  providedIn: 'root'
})
export class InjectCartService {
  
  // TODO: Implement modern dependency injection with inject() function
  // REQUIREMENTS:
  // 1. Use inject() instead of constructor injection
  // 2. Demonstrate required, optional, and conditional injection
  // 3. Show configuration injection patterns
  // 4. Implement platform-specific service injection
  //
  // LEARNING: Modern inject() patterns
  // - Required services: inject(ServiceClass)
  // - Optional services: inject(ServiceClass, { optional: true })
  // - Configuration: inject(CONFIG_TOKEN, { optional: true }) ?? defaultConfig
  // - Platform-specific: inject(PLATFORM_ID) === 'browser' ? BrowserService : ServerService
  //
  // SYNTAX EXAMPLES:
  // private http = inject(HttpClient);
  // private analytics = inject(AnalyticsService, { optional: true });
  // private config = inject(CART_CONFIG, { optional: true }) ?? this.getDefaultConfig();
  
  // TODO: TASK 3 - Convert constructor injection to modern inject() patterns
  //
  // STEP 1: Replace constructor dependencies with inject() field injection
  // private http = inject(HttpClient);
  //
  // STEP 2: Add optional service injection with error handling
  // private analytics = inject(AnalyticsService, { optional: true });
  // private logger = inject(Logger, { optional: true });
  //
  // STEP 3: Add configuration injection with fallback values
  // private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
  //
  // STEP 4: Add platform-specific service injection for SSR compatibility
  // private storage = isPlatformBrowser(inject(PLATFORM_ID))
  //   ? inject(BrowserStorageService, { optional: true })
  //   : inject(ServerStorageService, { optional: true });
  //
  // STEP 5: Add feature flag based conditional injection
  // private advancedFeatures = inject(FEATURE_FLAGS)?.advancedCart
  //   ? inject(AdvancedCartService, { optional: true })
  //   : null;
  //
  // LEARNING OBJECTIVES:
  // - Field-based injection eliminates constructor boilerplate
  // - Optional injection gracefully handles missing services
  // - Configuration injection enables customizable behavior
  // - Platform-specific injection enables SSR compatibility
  // - Conditional injection supports feature flag patterns
  
  private cartItems = signal<CartItem[]>([]);
  
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  public readonly summary = computed<CartSummary>(() => {
    const items = this.cartItems();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount);
    }, 0);
    
    // TODO: After implementing inject() patterns, use injected config:
    // const taxRate = this.config?.taxRate ?? 0.08;
    const taxRate = 0.08; // 8% default tax rate
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
  
  public readonly analytics = computed(() => {
    const items = this.cartItems();
    const metadata = this.cartMeta();
    
    // Calculate unique categories
    const uniqueCategories = new Set(items.map(item => item.category)).size;
    
    // Calculate average item price
    const averageItemPrice = items.length > 0
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length
      : 0;
    
    // Calculate session duration
    const sessionDurationMs = Date.now() - metadata.created.getTime();
    const sessionDurationMinutes = Math.floor(sessionDurationMs / 60000);
    
    return {
      uniqueCategories,
      averageItemPrice,
      sessionDurationMinutes,
      cartVersion: metadata.version,
      lastActivity: metadata.lastUpdated,
      injectionMethod: 'inject() function',
      serviceType: 'Modern DI Service'
    };
  });
  
  public readonly validation = computed(() => {
    const items = this.cartItems();
    const errors: string[] = [];
    
    // Check if cart has items
    if (items.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Validate quantities are positive
    const invalidQuantities = items.filter(item => item.quantity <= 0);
    if (invalidQuantities.length > 0) {
      errors.push('Some items have invalid quantities');
    }
    
    // Validate prices are positive
    const invalidPrices = items.filter(item => item.price <= 0);
    if (invalidPrices.length > 0) {
      errors.push('Some items have invalid prices');
    }
    
    // TODO: After implementing inject() patterns, use injected config:
    // const maxItems = this.config?.maxItems ?? 100;
    const maxItems = 100; // Default limit
    if (items.length > maxItems) {
      errors.push(`Cart exceeds maximum item limit of ${maxItems}`);
    }
    
    const isValid = errors.length === 0;
    const canCheckout = isValid && items.length > 0;
    
    return {
      isValid,
      errors,
      canCheckout
    };
  });

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
    this.setupEffects();
    this.logInjectionInfo();
  }

  addItem(product: Product): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          discount: product.discount || 0,
          image: product.image
        };
        return [...items, newItem];
      }
    });
    
    this.updateMetadata();
    
    // TODO: After implementing inject() patterns, use injected analytics service:
    // this.analytics?.trackEvent('item_added', { productId: product.id, name: product.name });
    console.log(`Added item: ${product.name}`);
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.updateMetadata();
    
    // TODO: After implementing inject() patterns, use injected analytics service:
    // this.analytics?.trackEvent('item_removed', { itemId });
    console.log(`Removed item with ID: ${itemId}`);
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    this.cartItems.update(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    
    this.updateMetadata();
    
    // TODO: After implementing inject() patterns, use injected analytics service:
    // this.analytics?.trackEvent('quantity_updated', { itemId, quantity });
    console.log(`Updated quantity for item ${itemId} to ${quantity}`);
  }

  clearCart(): void {
    const itemCount = this.cartItems().length;
    this.cartItems.set([]);
    this.updateMetadata();
    
    // TODO: After implementing inject() patterns, use injected analytics service:
    // this.analytics?.trackEvent('cart_cleared', { itemCount });
    console.log(`Cleared cart with ${itemCount} items`);
  }

  duplicateItem(itemId: string): void {
    const items = this.cartItems();
    const itemToDuplicate = items.find(item => item.id === itemId);
    
    if (!itemToDuplicate) {
      // TODO: Log error with injected logger service
      console.error(`Item with ID ${itemId} not found`);
      return;
    }
    
    const duplicatedItem: CartItem = {
      ...itemToDuplicate,
      id: this.generateId()
    };
    
    this.cartItems.update(items => [...items, duplicatedItem]);
    this.updateMetadata();
    
    // TODO: Log with injected logger service
    console.log(`Duplicated item: ${itemToDuplicate.name}`);
  }

  exportCart(): string {
    const exportData = {
      items: this.cartItems(),
      metadata: this.cartMeta(),
      summary: this.summary(),
      exportedAt: new Date(),
      version: '1.0'
    };
    
    // TODO: Log export operation with injected logger service
    console.log('Exporting cart data');
    
    return JSON.stringify(exportData, null, 2);
  }

  importCart(cartData: string): boolean {
    try {
      const data = JSON.parse(cartData);
      
      // Validate structure
      if (!data.items || !Array.isArray(data.items)) {
        // TODO: Log error with injected logger service
        console.error('Invalid cart data: missing items array');
        return false;
      }
      
      // Validate each item
      const validItems = data.items.filter((item: any) => {
        return item.id && item.name && item.price > 0 && item.quantity > 0;
      });
      
      // Import valid items
      this.cartItems.set(validItems);
      
      // Update metadata
      if (data.metadata) {
        this.cartMeta.update(meta => ({
          ...meta,
          lastUpdated: new Date(),
          version: meta.version + 1
        }));
      }
      
      // TODO: Log import operation with injected logger service
      console.log(`Imported ${validItems.length} items`);
      
      return true;
    } catch (error) {
      // TODO: Log error with injected logger service
      console.error('Failed to import cart:', error);
      return false;
    }
  }

  measurePerformance(): Promise<any> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Measure signal access times
      const measurements = {
        itemsAccess: 0,
        summaryComputation: 0,
        analyticsComputation: 0,
        validationComputation: 0
      };
      
      // Measure items access
      const itemsStart = performance.now();
      const items = this.cartItems();
      measurements.itemsAccess = performance.now() - itemsStart;
      
      // Measure summary computation
      const summaryStart = performance.now();
      const summary = this.summary();
      measurements.summaryComputation = performance.now() - summaryStart;
      
      // Measure analytics computation
      const analyticsStart = performance.now();
      const analytics = this.analytics();
      measurements.analyticsComputation = performance.now() - analyticsStart;
      
      // Measure validation computation
      const validationStart = performance.now();
      const validation = this.validation();
      measurements.validationComputation = performance.now() - validationStart;
      
      const totalTime = performance.now() - startTime;
      
      const result = {
        measurements,
        totalTime,
        itemCount: items.length,
        injectionMethod: 'inject() function',
        performanceNote: 'Signals provide efficient reactive updates'
      };
      
      // TODO: Track analytics with injected analytics service
      console.log('Performance measurement completed:', result);
      
      resolve(result);
    });
  }

  getInjectionInfo(): any {
    return {
      serviceName: 'InjectCartService',
      injectionMethod: 'inject() function',
      dependencies: {
        required: ['HttpClient'],
        optional: [
          // TODO: After implementing inject() patterns, list:
          // 'AnalyticsService', 'Logger', 'ConfigValidator'
        ],
        conditional: [
          // TODO: After implementing inject() patterns, list:
          // 'BrowserStorageService', 'ServerStorageService', 'AdvancedCartService'
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

  private setupEffects(): void {
    effect(() => {
      // Auto-save cart to localStorage
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      if (typeof localStorage !== 'undefined') {
        const cartData = {
          items,
          metadata,
          savedAt: new Date()
        };
        localStorage.setItem('inject-cart', JSON.stringify(cartData));
        console.log('Auto-saved cart to localStorage');
      }
    });

    effect(() => {
      const analytics = this.analytics();
      console.log('Analytics updated:', {
        uniqueCategories: analytics.uniqueCategories,
        averagePrice: analytics.averageItemPrice,
        sessionMinutes: analytics.sessionDurationMinutes
      });
    });

    effect(() => {
      const validation = this.validation();
      if (!validation.isValid && validation.errors.length > 0) {
        console.warn('Cart validation errors:', validation.errors);
      }
    });
  }

  private loadCartFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedData = localStorage.getItem('inject-cart');
        if (savedData) {
          const { items, metadata } = JSON.parse(savedData);
          
          // Restore items
          if (items && Array.isArray(items)) {
            this.cartItems.set(items);
          }
          
          // Update metadata while preserving session ID
          if (metadata) {
            this.cartMeta.update(meta => ({
              ...meta,
              lastUpdated: new Date(),
              version: metadata.version || 1
            }));
          }
          
          console.log('Loaded cart from localStorage');
        }
      }
    } catch (error) {
      // TODO: Log error with injected logger service
      console.error('Failed to load cart from storage:', error);
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
    // Log injection information for debugging
    const info = this.getInjectionInfo();
    console.log('InjectCartService initialized:', info);
    
    // TODO: Use injected logger service when available
    console.log('Using modern inject() pattern for dependency injection');
  }

  // TODO: These methods will be implemented when optional services are added
  // LEARNING: Configuration and provider patterns with inject()
  //
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