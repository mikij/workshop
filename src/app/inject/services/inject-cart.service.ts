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
  
  // TODO: Inject HttpClient using inject() function
  // HINT: private http = inject(HttpClient);
  // LEARNING: This replaces constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  
  // TODO: Implement optional service injection
  // HINT: Use { optional: true } parameter
  // SYNTAX: private analytics = inject(AnalyticsService, { optional: true });
  // LEARNING: Optional injection prevents errors if service is not provided
  // These services are optional - if not provided, they won't cause injection errors
  // private analytics = inject(AnalyticsService, { optional: true });
  // private logger = inject(Logger, { optional: true });
  
  // EDUCATIONAL: For now, we'll simulate optional services to demonstrate the pattern
  // In a real application, these would be actual service classes
  private analyticsService: any = null; // inject(AnalyticsService, { optional: true });
  private logger: any = null; // inject(Logger, { optional: true });
  
  // TODO: Implement configuration injection with fallback
  // HINT: Use nullish coalescing (??) for default values
  // SYNTAX: private config = inject(CONFIG_TOKEN, { optional: true }) ?? defaultConfig;
  // LEARNING: Configuration injection allows customizable service behavior
  // The nullish coalescing operator (??) provides elegant fallback to default config
  // private config = inject(CART_CONFIG, { optional: true }) ?? this.getDefaultConfig();
  
  // EDUCATIONAL: Simulating configuration injection with fallback pattern
  private config = this.getDefaultConfig(); // inject(CART_CONFIG, { optional: true }) ?? this.getDefaultConfig();
  
  // TODO: Implement platform-specific injection
  // HINT: Use inject(PLATFORM_ID) to detect browser vs server
  // SYNTAX: inject(PLATFORM_ID) === 'browser' ? BrowserService : ServerService
  // LEARNING: Platform-specific injection enables SSR compatibility
  // This pattern allows different services for browser vs server environments
  // private storage = inject(PLATFORM_ID) === 'browser' 
  //   ? inject(BrowserStorageService)
  //   : inject(ServerStorageService);
  
  // EDUCATIONAL: Simulating platform-specific injection
  // In a real app, this would use PLATFORM_ID to determine the environment
  private storage = typeof window !== 'undefined' ? 'browser-storage' : 'server-storage';
  
  // TODO: Create signal-based state management
  // REQUIREMENTS:
  // 1. Private signals for internal state
  // 2. Readonly accessors for external access
  // 3. Computed values for derived state
  //
  // HINT: Use signal<Type>(initialValue) for state
  // HINT: Use computed(() => calculation) for derived values
  // HINT: Use .asReadonly() for external access
  
  // TODO: Implement cart items signal
  // HINT: private cartItems = signal<CartItem[]>([]);
  private cartItems = signal<CartItem[]>([]);
  
  // TODO: Implement cart metadata signal
  // HINT: Include sessionId, created, lastUpdated, version
  // SYNTAX: private cartMeta = signal<CartMetadata>({ ... });
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  // TODO: Create readonly accessors using asReadonly()
  // REQUIREMENTS:
  // 1. public readonly items for cart items
  // 2. public readonly metadata for cart metadata
  //
  // HINT: public readonly items = this.cartItems.asReadonly();
  // LEARNING: asReadonly() prevents external modification while allowing reads
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // TODO: Implement computed cart summary
  // REQUIREMENTS:
  // 1. Calculate totalItems, totalPrice, totalDiscount
  // 2. Calculate progressive tax (8% default, TODO: use injected config)
  // 3. Calculate final price
  //
  // LEARNING: Computed signals automatically update when dependencies change
  // SYNTAX: computed(() => { const items = this.cartItems(); return calculation; })
  public readonly summary = computed<CartSummary>(() => {
    // IMPLEMENTATION: Comprehensive cart summary calculation
    // LEARNING: Computed signals automatically recalculate when dependencies change
    // This demonstrates reactive programming with modern Angular signals
    const items = this.cartItems();
    
    // Calculate total items and base price
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discount (example: 10% off orders over $100)
    const totalDiscount = totalPrice > 100 ? totalPrice * 0.10 : 0;
    
    // Calculate tax using injected configuration
    const taxableAmount = totalPrice - totalDiscount;
    const tax = taxableAmount * this.config.taxRate;
    
    // Calculate final price
    const finalPrice = taxableAmount + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // TODO: Implement computed analytics
  // REQUIREMENTS:
  // 1. Calculate unique categories
  // 2. Calculate average item price
  // 3. Calculate session duration
  // 4. Include injection method information
  //
  // HINT: Use Set for unique categories: new Set(items.map(item => item.category))
  // HINT: Session duration: Date.now() - metadata.created.getTime()
  public readonly analytics = computed(() => {
    // IMPLEMENTATION: Comprehensive analytics calculation
    // LEARNING: Computed signals can perform complex calculations and aggregations
    // This showcases how inject() services can provide rich analytics data
    const items = this.cartItems();
    const metadata = this.cartMeta();
    
    // Calculate unique categories using Set for deduplication
    const uniqueCategories = new Set(items.map(item => item.category || 'uncategorized')).size;
    
    // Calculate average item price
    const averageItemPrice = items.length > 0 
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
      : 0;
    
    // Calculate session duration in minutes
    const sessionDurationMinutes = (Date.now() - metadata.created.getTime()) / (1000 * 60);
    
    return {
      uniqueCategories,
      averageItemPrice: Math.round(averageItemPrice * 100) / 100, // Round to 2 decimal places
      sessionDurationMinutes: Math.round(sessionDurationMinutes * 100) / 100,
      cartVersion: metadata.version,
      lastActivity: metadata.lastUpdated,
      injectionMethod: 'inject() function',
      serviceType: 'Modern DI Service',
      totalItems: items.length,
      cartValue: this.summary().totalPrice,
      injectionFeatures: [
        'Field-based injection',
        'Optional dependencies',
        'Configuration injection',
        'Platform-specific services'
      ]
    };
  });
  
  // TODO: Implement computed validation
  // REQUIREMENTS:
  // 1. Validate cart has items
  // 2. Validate item quantities are positive
  // 3. Validate item prices are positive
  // 4. Check item count limit (TODO: use injected config)
  //
  // LEARNING: Computed validation provides real-time cart state checking
  public readonly validation = computed(() => {
    // IMPLEMENTATION: Comprehensive cart validation
    // LEARNING: Computed validation provides real-time state checking
    // This demonstrates how inject() services can provide reactive validation
    const items = this.cartItems();
    const errors: string[] = [];
    
    // Validate cart has items
    if (items.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Validate item quantities are positive
    const invalidQuantities = items.filter(item => item.quantity <= 0);
    if (invalidQuantities.length > 0) {
      errors.push(`Invalid quantities for ${invalidQuantities.length} items`);
    }
    
    // Validate item prices are positive
    const invalidPrices = items.filter(item => item.price <= 0);
    if (invalidPrices.length > 0) {
      errors.push(`Invalid prices for ${invalidPrices.length} items`);
    }
    
    // Check item count limit (using injected configuration)
    if (items.length > this.config.maxItems) {
      errors.push(`Too many items (${items.length}/${this.config.maxItems})`);
    }
    
    // Validate product data completeness
    const incompleteProducts = items.filter(item => 
      !item.productId || !item.name || !item.price
    );
    if (incompleteProducts.length > 0) {
      errors.push(`Incomplete product data for ${incompleteProducts.length} items`);
    }
    
    const isValid = errors.length === 0;
    const canCheckout = isValid && items.length > 0;
    
    return {
      isValid,
      errors,
      canCheckout,
      itemCount: items.length,
      maxItems: this.config.maxItems,
      validationMethod: 'inject() computed validation'
    };
  });

  constructor() {
    // TODO: Initialize service
    // REQUIREMENTS:
    // 1. Load cart from storage
    // 2. Set up reactive effects
    // 3. Log injection information for debugging
    //
    // HINT: Call this.loadCartFromStorage(), this.setupEffects(), this.logInjectionInfo()
    this.loadCartFromStorage();
    this.setupEffects();
    this.logInjectionInfo();
  }

  // TODO: Implement cart operations with modern patterns
  // LEARNING: These methods demonstrate how inject() services work with signals
  
  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item already exists
  // 2. Update quantity or add new item
  // 3. Update metadata
  // 4. Log analytics (TODO: use injected analytics service)
  //
  // HINTS:
  // - Use this.cartItems() to get current items
  // - Use this.cartItems.update() to modify state
  // - Use this.updateMetadata() to update timestamps
  addItem(product: Product): void {
    // IMPLEMENTATION: Advanced cart item addition with modern DI patterns
    // LEARNING: This method demonstrates how inject() services handle complex operations
    // with reactive state management and optional service integration
    
    // Validate product data
    if (!product.id || !product.name || product.price <= 0) {
      this.logger?.warn?.('Invalid product data:', product);
      throw new Error('Invalid product data');
    }
    
    // Check if item already exists in cart
    const existingItemIndex = this.cartItems().findIndex(item => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.cartItems.update(items => 
        items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      
      // Log analytics with optional service
      this.analyticsService?.track?.('item_quantity_updated', {
        productId: product.id,
        newQuantity: this.cartItems()[existingItemIndex].quantity + 1,
        injectionMethod: 'inject() function'
      });
    } else {
      // Add new item to cart
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
      
      this.cartItems.update(items => [...items, newItem]);
      
      // Log analytics with optional service
      this.analyticsService?.track?.('item_added', {
        productId: product.id,
        productTitle: product.name,
        productPrice: product.price,
        injectionMethod: 'inject() function'
      });
    }
    
    // Update metadata using helper method
    this.updateMetadata();
    
    // Log operation with optional logger service
    this.logger?.info?.(`Added item: ${product.name} (ID: ${product.id})`);
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Filter out item by ID
  // 2. Update metadata
  // 3. Log analytics
  //
  // HINT: Use this.cartItems.update(items => items.filter(...))
  removeItem(itemId: string): void {
    // IMPLEMENTATION: Item removal with modern DI patterns
    // LEARNING: This demonstrates reactive state updates with inject() services
    // and optional service integration for logging and analytics
    
    // Find item before removal for analytics
    const itemToRemove = this.cartItems().find(item => item.id === itemId);
    
    if (!itemToRemove) {
      this.logger?.warn?.(`Item not found for removal: ${itemId}`);
      return;
    }
    
    // Remove item from cart using signal update
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    
    // Update metadata
    this.updateMetadata();
    
    // Log analytics with optional service
    this.analyticsService?.track?.('item_removed', {
      itemId,
      productId: itemToRemove.productId,
      productTitle: itemToRemove.name,
      quantity: itemToRemove.quantity,
      injectionMethod: 'inject() function'
    });
    
    // Log operation with optional logger service
    this.logger?.info?.(`Removed item: ${itemToRemove.name} (ID: ${itemId})`);
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. Handle quantity <= 0 (remove item)
  // 2. Update item quantity
  // 3. Update metadata
  //
  // HINT: Use this.cartItems.update(items => items.map(...))
  updateQuantity(itemId: string, quantity: number): void {
    // IMPLEMENTATION: Quantity updates with modern DI patterns
    // LEARNING: This shows how inject() services handle conditional logic
    // with reactive updates and optional service integration
    
    // Validate quantity
    if (quantity < 0) {
      this.logger?.warn?.(`Invalid quantity: ${quantity}`);
      return;
    }
    
    // If quantity is 0, remove the item
    if (quantity === 0) {
      this.removeItem(itemId);
      return;
    }
    
    // Find item for analytics
    const existingItem = this.cartItems().find(item => item.id === itemId);
    
    if (!existingItem) {
      this.logger?.warn?.(`Item not found for quantity update: ${itemId}`);
      return;
    }
    
    const oldQuantity = existingItem.quantity;
    
    // Update item quantity
    this.cartItems.update(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    
    // Update metadata
    this.updateMetadata();
    
    // Log analytics with optional service
    this.analyticsService?.track?.('quantity_updated', {
      itemId,
      productId: existingItem.productId,
      oldQuantity,
      newQuantity: quantity,
      quantityChange: quantity - oldQuantity,
      injectionMethod: 'inject() function'
    });
    
    // Log operation with optional logger service
    this.logger?.info?.(`Updated quantity for ${existingItem.name}: ${oldQuantity} → ${quantity}`);
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Clear all items
  // 2. Update metadata
  // 3. Log analytics
  //
  // HINT: Use this.cartItems.set([])
  clearCart(): void {
    // IMPLEMENTATION: Cart clearing with modern DI patterns
    // LEARNING: This demonstrates how inject() services handle bulk operations
    // with comprehensive logging and analytics integration
    
    const itemCount = this.cartItems().length;
    const cartValue = this.summary().totalPrice;
    
    // Clear all items from cart
    this.cartItems.set([]);
    
    // Update metadata
    this.updateMetadata();
    
    // Log analytics with optional service
    this.analyticsService?.track?.('cart_cleared', {
      itemCount,
      cartValue,
      sessionId: this.cartMeta().sessionId,
      injectionMethod: 'inject() function'
    });
    
    // Log operation with optional logger service
    this.logger?.info?.(`Cart cleared: ${itemCount} items removed (value: $${cartValue.toFixed(2)})`);
  }

  // TODO: Implement advanced operations showcasing inject() patterns
  
  // TODO: Implement duplicateItem method
  // REQUIREMENTS:
  // 1. Find item by ID
  // 2. Create duplicate with new ID
  // 3. Add to cart
  // 4. Log with injected logger service (TODO)
  duplicateItem(itemId: string): void {
    // IMPLEMENTATION: Item duplication with modern DI patterns
    // LEARNING: This showcases advanced cart operations using inject() services
    // and demonstrates how to create new items from existing ones
    
    // Find the item to duplicate
    const itemToDuplicate = this.cartItems().find(item => item.id === itemId);
    
    if (!itemToDuplicate) {
      this.logger?.warn?.(`Item not found for duplication: ${itemId}`);
      return;
    }
    
    // Create a duplicate item with new ID
    const duplicatedItem: CartItem = {
      id: this.generateId(),
      productId: itemToDuplicate.productId,
      name: itemToDuplicate.name,
      price: itemToDuplicate.price,
      quantity: itemToDuplicate.quantity,
      image: itemToDuplicate.image,
      category: itemToDuplicate.category,
      discount: itemToDuplicate.discount
    };
    
    // Add duplicate to cart
    this.cartItems.update(items => [...items, duplicatedItem]);
    
    // Update metadata
    this.updateMetadata();
    
    // Log analytics with optional service
    this.analyticsService?.track?.('item_duplicated', {
      originalItemId: itemId,
      duplicatedItemId: duplicatedItem.id,
      productId: itemToDuplicate.productId,
      productTitle: itemToDuplicate.name,
      quantity: itemToDuplicate.quantity,
      injectionMethod: 'inject() function'
    });
    
    // Log operation with optional logger service
    this.logger?.info?.(`Duplicated item: ${itemToDuplicate.name} (Original: ${itemId}, Duplicate: ${duplicatedItem.id})`);
  }

  // TODO: Implement export/import functionality
  // REQUIREMENTS:
  // 1. Export: Serialize cart data with metadata
  // 2. Import: Parse and validate cart data
  // 3. Use injected logger service for operation logging (TODO)
  
  exportCart(): string {
    // IMPLEMENTATION: Cart export with modern DI patterns
    // LEARNING: This demonstrates data serialization with inject() services
    // and comprehensive metadata inclusion for full cart state preservation
    
    try {
      // Create comprehensive export data
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        injectionMethod: 'inject() function',
        serviceType: 'InjectCartService',
        metadata: this.cartMeta(),
        items: this.cartItems(),
        summary: this.summary(),
        analytics: this.analytics(),
        validation: this.validation(),
        configuration: {
          maxItems: this.config.maxItems,
          taxRate: this.config.taxRate,
          currency: this.config.currency
        }
      };
      
      // Serialize to JSON
      const serializedData = JSON.stringify(exportData, null, 2);
      
      // Log analytics with optional service
      this.analyticsService?.track?.('cart_exported', {
        itemCount: this.cartItems().length,
        cartValue: this.summary().totalPrice,
        exportSize: serializedData.length,
        injectionMethod: 'inject() function'
      });
      
      // Log operation with optional logger service
      this.logger?.info?.(`Cart exported: ${this.cartItems().length} items, ${serializedData.length} bytes`);
      
      return serializedData;
      
    } catch (error) {
      this.logger?.error?.('Cart export failed:', error);
      throw new Error(`Cart export failed: ${error}`);
    }
  }

  importCart(cartData: string): boolean {
    // IMPLEMENTATION: Cart import with comprehensive validation and modern DI patterns
    // LEARNING: This demonstrates data deserialization, validation, and error handling
    // with inject() services and proper state management
    
    try {
      // Parse JSON data
      const importData = JSON.parse(cartData);
      
      // Validate import data structure
      if (!importData || !importData.items || !Array.isArray(importData.items)) {
        this.logger?.warn?.('Invalid import data structure');
        return false;
      }
      
      // Validate each item in the import data
      const validItems = importData.items.filter((item: any) => {
        return item.id && item.product && item.product.id && 
               item.product.title && item.product.price > 0 && 
               item.quantity > 0;
      });
      
      if (validItems.length === 0) {
        this.logger?.warn?.('No valid items found in import data');
        return false;
      }
      
      // Check configuration limits
      if (validItems.length > this.config.maxItems) {
        this.logger?.warn?.(`Import exceeds maximum items limit: ${validItems.length}/${this.config.maxItems}`);
        return false;
      }
      
      // Clear current cart and import new items
      this.cartItems.set(validItems);
      
      // Update metadata for import
      this.cartMeta.update(meta => ({
        ...meta,
        lastUpdated: new Date(),
        version: meta.version + 1
      }));
      
      // Log analytics with optional service
      this.analyticsService?.track?.('cart_imported', {
        importedItemCount: validItems.length,
        skippedItemCount: importData.items.length - validItems.length,
        cartValue: this.summary().totalPrice,
        injectionMethod: 'inject() function'
      });
      
      // Log operation with optional logger service
      this.logger?.info?.(`Cart imported: ${validItems.length} items (${importData.items.length - validItems.length} skipped)`);
      
      return true;
      
    } catch (error) {
      this.logger?.error?.('Cart import failed:', error);
      return false;
    }
  }

  // TODO: Implement performance measurement using inject() services
  // REQUIREMENTS:
  // 1. Measure computation time
  // 2. Track analytics with injected service (TODO)
  // 3. Return performance data
  measurePerformance(): Promise<any> {
    // IMPLEMENTATION: Performance measurement with modern DI patterns
    // LEARNING: This demonstrates async operations with inject() services
    // and comprehensive performance tracking capabilities
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Simulate various cart operations for performance testing
      const operations = [
        () => this.summary(), // Test computed summary calculation
        () => this.analytics(), // Test computed analytics calculation
        () => this.validation(), // Test computed validation
        () => this.cartItems().length, // Test signal access
        () => this.cartMeta(), // Test metadata access
      ];
      
      // Measure each operation
      const operationResults = operations.map((operation, index) => {
        const operationStart = performance.now();
        const result = operation();
        const operationEnd = performance.now();
        
        return {
          operationIndex: index,
          operationName: operation.name || `Operation ${index}`,
          duration: operationEnd - operationStart,
          result: typeof result === 'object' ? 'computed' : result
        };
      });
      
      const endTime = performance.now();
      const totalDuration = endTime - startTime;
      
      // Create comprehensive performance report
      const performanceData = {
        totalDuration,
        operations: operationResults,
        cartMetrics: {
          itemCount: this.cartItems().length,
          cartValue: this.summary().totalPrice,
          uniqueCategories: this.analytics().uniqueCategories,
          sessionDuration: this.analytics().sessionDurationMinutes
        },
        injectionMetrics: {
          injectionMethod: 'inject() function',
          serviceType: 'InjectCartService',
          dependencyCount: this.getInjectionInfo().dependencies.required.length,
          optionalDependencyCount: this.getInjectionInfo().dependencies.optional.length
        },
        timestamp: new Date().toISOString()
      };
      
      // Log analytics with optional service
      this.analyticsService?.track?.('performance_measured', {
        totalDuration,
        operationCount: operations.length,
        itemCount: this.cartItems().length,
        injectionMethod: 'inject() function'
      });
      
      // Log operation with optional logger service
      this.logger?.info?.(`Performance measurement completed: ${totalDuration.toFixed(2)}ms total`);
      
      resolve(performanceData);
    });
  }

  // TODO: Implement dependency introspection
  // REQUIREMENTS:
  // 1. Document all injected dependencies
  // 2. List features and benefits of inject() pattern
  // 3. Provide debugging information
  //
  // LEARNING: This method helps understand inject() pattern benefits
  getInjectionInfo(): any {
    // IMPLEMENTATION: Comprehensive injection introspection
    // LEARNING: This method provides detailed information about modern DI patterns
    // and demonstrates self-documenting services with inject() function
    
    return {
      serviceName: 'InjectCartService',
      injectionMethod: 'inject() function',
      dependencies: {
        required: [
          'HttpClient' // Always required for API operations
        ],
        optional: [
          'AnalyticsService', // Optional for tracking user interactions
          'Logger', // Optional for debugging and monitoring
          'CART_CONFIG' // Optional configuration token
        ],
        conditional: [
          'BrowserStorageService', // Used in browser environment
          'ServerStorageService' // Used in server environment
        ]
      },
      features: [
        'Field-based injection with inject() function',
        'Optional dependencies with { optional: true }',
        'Configuration injection with fallback patterns',
        'Platform-specific service injection',
        'Factory function patterns for dynamic services',
        'Signal-based reactive state management',
        'Computed properties for derived state',
        'Effect-based side effect management'
      ],
      benefits: [
        'No constructor boilerplate - cleaner syntax',
        'Cleaner service organization - dependencies at field level',
        'Better tree-shaking - unused dependencies can be eliminated',
        'Functional composition support - easier to compose services',
        'Improved testability - easier to mock dependencies',
        'Better IDE support - clearer dependency visualization',
        'Reduced coupling - optional dependencies prevent tight coupling',
        'Enhanced maintainability - dependencies are self-documenting'
      ],
      patterns: {
        required: 'inject(ServiceClass)',
        optional: 'inject(ServiceClass, { optional: true })',
        configuration: 'inject(CONFIG_TOKEN, { optional: true }) ?? defaultConfig',
        platform: 'inject(PLATFORM_ID) === "browser" ? BrowserService : ServerService',
        factory: 'inject(FACTORY_TOKEN)()'
      },
      modernFeatures: {
        signals: 'Reactive state management with automatic change detection',
        computed: 'Derived state that updates automatically',
        effects: 'Side effects that respond to state changes',
        readonly: 'Immutable external API with .asReadonly()'
      },
      comparisonWithConstructor: {
        traditional: 'constructor(private http: HttpClient, private logger?: Logger) {}',
        modern: 'private http = inject(HttpClient); private logger = inject(Logger, { optional: true });',
        advantages: [
          'No constructor parameters',
          'Clearer dependency purpose',
          'Better optional dependency handling',
          'More flexible service composition'
        ]
      }
    };
  }

  // TODO: Implement reactive effects using inject() pattern
  // REQUIREMENTS:
  // 1. Auto-save effect for persistence
  // 2. Analytics tracking effect (TODO: use injected analytics)
  // 3. Validation monitoring effect
  //
  // LEARNING: Effects handle side effects in signal-based architecture
  private setupEffects(): void {
    // IMPLEMENTATION: Comprehensive reactive effects with modern DI patterns
    // LEARNING: Effects handle side effects in signal-based architecture
    // These effects demonstrate how inject() services work with reactive programming
    
    // Auto-save effect - persists cart state automatically
    effect(() => {
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      // Auto-save cart data to storage when items change
      if (items.length > 0) {
        const cartData = {
          items,
          metadata,
          savedAt: new Date().toISOString(),
          injectionMethod: 'inject() function'
        };
        
        try {
          // Use platform-specific storage (simulated)
          if (this.storage === 'browser-storage' && typeof localStorage !== 'undefined') {
            localStorage.setItem('inject-cart-data', JSON.stringify(cartData));
          }
          
          this.logger?.debug?.('Cart auto-saved with inject() service');
        } catch (error) {
          this.logger?.error?.('Auto-save failed:', error);
        }
      }
    });

    // Analytics tracking effect - tracks cart state changes
    effect(() => {
      const analytics = this.analytics();
      
      // Track analytics data when cart changes
      if (analytics.totalItems > 0) {
        this.analyticsService?.track?.('cart_state_changed', {
          ...analytics,
          injectionMethod: 'inject() function',
          effectType: 'reactive_analytics',
          timestamp: new Date().toISOString()
        });
        
        this.logger?.debug?.('Analytics tracked via inject() service effect');
      }
    });

    // Validation monitoring effect - monitors cart validity
    effect(() => {
      const validation = this.validation();
      
      // Monitor validation state and log issues
      if (!validation.isValid) {
        this.logger?.warn?.('Cart validation issues detected:', {
          errors: validation.errors,
          canCheckout: validation.canCheckout,
          injectionMethod: 'inject() function',
          validationEffect: true
        });
      } else {
        this.logger?.debug?.('Cart validation passed via inject() service');
      }
      
      // Track validation events
      this.analyticsService?.track?.('cart_validation_check', {
        isValid: validation.isValid,
        errorCount: validation.errors.length,
        canCheckout: validation.canCheckout,
        injectionMethod: 'inject() function'
      });
    });
  }

  // TODO: Implement storage operations
  // REQUIREMENTS:
  // 1. Save cart data to localStorage
  // 2. Load cart data from localStorage
  // 3. Handle errors gracefully
  // 4. Log operations with injected logger (TODO)
  
  private loadCartFromStorage(): void {
    // IMPLEMENTATION: Storage loading with modern DI patterns
    // LEARNING: This demonstrates platform-specific operations with inject() services
    // and proper error handling for storage operations
    
    try {
      // Use platform-specific storage (simulated)
      if (this.storage === 'browser-storage' && typeof localStorage !== 'undefined') {
        const savedData = localStorage.getItem('inject-cart-data');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Validate loaded data structure
          if (parsedData.items && Array.isArray(parsedData.items)) {
            // Restore cart items
            this.cartItems.set(parsedData.items);
            
            // Restore metadata if available
            if (parsedData.metadata) {
              this.cartMeta.update(currentMeta => ({
                ...currentMeta,
                ...parsedData.metadata,
                lastUpdated: new Date() // Update to current time
              }));
            }
            
            this.logger?.info?.(`Cart loaded from storage: ${parsedData.items.length} items`);
            
            // Track successful load
            this.analyticsService?.track?.('cart_loaded_from_storage', {
              itemCount: parsedData.items.length,
              injectionMethod: 'inject() function',
              storageType: this.storage
            });
          }
        }
      } else {
        // Server-side storage simulation
        this.logger?.info?.('Server-side storage loading (simulated)');
      }
    } catch (error: any) {
      this.logger?.error?.('Failed to load cart from storage:', error);
      
      // Track failed load
      this.analyticsService?.track?.('cart_load_failed', {
        error: error.toString(),
        injectionMethod: 'inject() function',
        storageType: this.storage
      });
    }
  }

  // TODO: Implement metadata update helper
  // REQUIREMENTS:
  // 1. Update lastUpdated timestamp
  // 2. Increment version number
  //
  // HINT: Use this.cartMeta.update(meta => ({ ...meta, lastUpdated: new Date(), version: meta.version + 1 }))
  private updateMetadata(): void {
    // IMPLEMENTATION: Metadata update with modern DI patterns
    // LEARNING: This demonstrates signal updates with inject() services
    // and comprehensive metadata management
    
    this.cartMeta.update(currentMeta => ({
      ...currentMeta,
      lastUpdated: new Date(),
      version: currentMeta.version + 1
    }));
    
    // Log metadata update with optional logger service
    this.logger?.debug?.(`Metadata updated: version ${this.cartMeta().version}`);
    
    // Track metadata update with optional analytics service
    this.analyticsService?.track?.('cart_metadata_updated', {
      version: this.cartMeta().version,
      sessionId: this.cartMeta().sessionId,
      injectionMethod: 'inject() function'
    });
  }

  // TODO: Implement utility methods
  
  private generateId(): string {
    // TODO: Generate unique ID for cart items
    // HINT: Use timestamp and random string combination
    return `inject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logInjectionInfo(): void {
    // IMPLEMENTATION: Comprehensive injection information logging
    // LEARNING: This demonstrates service introspection with inject() services
    // and comprehensive debugging information for modern DI patterns
    
    const injectionInfo = this.getInjectionInfo();
    
    // Log with optional logger service or fallback to console
    const logMessage = `
🚀 InjectCartService Initialized

📋 Service Information:
   • Service: ${injectionInfo.serviceName}
   • Injection Method: ${injectionInfo.injectionMethod}
   • Dependencies: ${injectionInfo.dependencies.required.length} required, ${injectionInfo.dependencies.optional.length} optional

🔧 Features:
${injectionInfo.features.map((feature: string) => `   • ${feature}`).join('\n')}

✨ Benefits:
${injectionInfo.benefits.map((benefit: string) => `   • ${benefit}`).join('\n')}

🎯 Modern Patterns:
   • Required: ${injectionInfo.patterns.required}
   • Optional: ${injectionInfo.patterns.optional}
   • Configuration: ${injectionInfo.patterns.configuration}
   • Platform: ${injectionInfo.patterns.platform}

📊 Service State:
   • Storage: ${this.storage}
   • Config: ${JSON.stringify(this.config, null, 2)}
   • Session ID: ${this.cartMeta().sessionId}
`;
    
    if (this.logger?.info) {
      this.logger.info(logMessage);
    } else {
      console.log(logMessage);
    }
    
    // Track service initialization
    this.analyticsService?.track?.('inject_service_initialized', {
      serviceName: injectionInfo.serviceName,
      injectionMethod: injectionInfo.injectionMethod,
      dependencyCount: injectionInfo.dependencies.required.length + injectionInfo.dependencies.optional.length,
      sessionId: this.cartMeta().sessionId,
      timestamp: new Date().toISOString()
    });
  }

  // IMPLEMENTATION: Configuration and provider patterns with inject()
  // LEARNING: Default configuration provides fallback when injection token is not provided
  // This demonstrates the configuration injection pattern with modern DI
  
  private getDefaultConfig(): any {
    return {
      maxItems: 100,
      taxRate: 0.08,
      currency: 'USD',
      enableAnalytics: true,
      enableLogging: true,
      autoSave: true,
      validationEnabled: true,
      performanceTracking: true,
      injectionMethod: 'inject() function',
      configSource: 'default_fallback'
    };
  }
}