import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

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
 * STANDALONE MODULE - Module-Free Angular Architecture
 * 
 * This service demonstrates cart functionality in a standalone component architecture
 * without any NgModule dependencies. It showcases modern Angular patterns.
 * 
 * KEY CONCEPTS TO LEARN:
 * - Service design for standalone components
 * - Signal-based state management
 * - Computed values for derived state
 * - Effects for side effects
 * - Progressive tax calculation
 * - Advanced cart operations
 * - Import/export functionality
 * - Analytics and validation
 * 
 * STANDALONE ARCHITECTURE BENEFITS:
 * - No NgModule boilerplate
 * - Direct service injection
 * - Better tree-shaking
 * - Simpler component composition
 * - Cleaner dependency management
 */
@Injectable({
  providedIn: 'root'
})
export class StandaloneCartService {
  
  // TODO: Create signal-based state management for standalone architecture
  // REQUIREMENTS:
  // 1. Cart items signal for state management
  // 2. Cart metadata signal for session tracking
  // 3. Readonly accessors for external access
  //
  // LEARNING: Signals work perfectly with standalone components
  // - No subscription management needed
  // - Automatic change detection
  // - Direct template integration
  // - Computed values for derived state
  //
  // SYNTAX HINTS:
  // private cartItems = signal<CartItem[]>([]);
  // private cartMeta = signal<CartMetadata>({ ... });
  // public readonly items = this.cartItems.asReadonly();
  
  // TODO: Implement cart items signal
  // HINT: private cartItems = signal<CartItem[]>([]);
  private cartItems = signal<CartItem[]>([]);
  
  // TODO: Implement cart metadata signal
  // REQUIREMENTS: sessionId, created, lastUpdated, version
  // HINT: Use crypto.randomUUID() for sessionId
  // SYNTAX: private cartMeta = signal<CartMetadata>({ ... });
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  // TODO: Create readonly accessors for standalone components
  // REQUIREMENTS:
  // 1. items accessor for cart items
  // 2. metadata accessor for session info
  //
  // LEARNING: Readonly signals prevent external modification
  // Standalone components can inject and use these directly
  // Template usage: {{ cartService.items().length }}
  //
  // HINT: public readonly items = this.cartItems.asReadonly();
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // TODO: Implement computed cart summary with progressive tax
  // REQUIREMENTS:
  // 1. Calculate totalItems, totalPrice, totalDiscount
  // 2. Progressive tax calculation:
  //    - Orders over $1000: 12% tax
  //    - Orders over $500: 10% tax
  //    - Orders under $500: 8% tax
  // 3. Calculate final price
  //
  // LEARNING: Computed signals automatically recalculate
  // Perfect for standalone components - no manual subscriptions
  public readonly summary = computed<CartSummary>(() => {
    const items = this.cartItems();
    
    // STANDALONE ARCHITECTURE BENEFIT: No manual subscription management
    // The computed signal automatically recalculates when cartItems change
    // This eliminates the need for OnDestroy lifecycle hooks or manual unsubscriptions
    // that would be required with traditional services and observables
    
    // Calculate totals with immutable functional approach
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
      return sum + ((item.discount || 0) * item.quantity);
    }, 0);
    
    // Progressive tax calculation based on order value
    // This business logic is perfect for standalone components
    // as it's self-contained and doesn't require external module configuration
    const subtotal = totalPrice - totalDiscount;
    let taxRate = 0.08; // Default 8% for orders under $500
    
    if (subtotal > 1000) {
      taxRate = 0.12; // 12% for orders over $1000
    } else if (subtotal > 500) {
      taxRate = 0.10; // 10% for orders over $500
    }
    
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
  
  // TODO: Implement computed analytics for standalone components
  // REQUIREMENTS:
  // 1. Count unique categories
  // 2. Calculate average item price
  // 3. Calculate session duration in minutes
  // 4. Track cart version and last activity
  //
  // LEARNING: Analytics computed values are perfect for dashboards
  // Standalone components can use these directly without subscriptions
  public readonly analytics = computed(() => {
    const items = this.cartItems();
    const metadata = this.cartMeta();
    
    // STANDALONE ARCHITECTURE BENEFIT: Direct reactive analytics
    // Dashboard components can bind directly to this computed signal
    // No need for complex observable chains or manual state management
    // The computed signal automatically updates when cart data changes
    
    // Calculate unique categories using Set for efficiency
    const uniqueCategories = new Set(items.map(item => item.category)).size;
    
    // Calculate average item price (total value / total quantity)
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const averageItemPrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
    
    // Calculate session duration in minutes
    const sessionDurationMinutes = Math.floor(
      (Date.now() - metadata.created.getTime()) / (1000 * 60)
    );
    
    // EDUCATIONAL: Analytics in standalone architecture
    // This computed signal provides real-time insights without requiring
    // separate analytics services or complex state management patterns
    return {
      uniqueCategories,
      averageItemPrice: Math.round(averageItemPrice * 100) / 100, // Round to 2 decimal places
      sessionDurationMinutes,
      cartVersion: metadata.version,
      lastActivity: metadata.lastUpdated
    };
  });
  
  // TODO: Implement computed validation for form integration
  // REQUIREMENTS:
  // 1. Validate cart has items
  // 2. Validate item quantities are positive
  // 3. Validate item prices are positive
  // 4. Check total items under limit (max 100)
  // 5. Check if can checkout
  //
  // LEARNING: Validation computed signals enable reactive forms
  // Standalone checkout components can use this directly
  public readonly validation = computed(() => {
    const items = this.cartItems();
    const errors: string[] = [];
    
    // STANDALONE ARCHITECTURE BENEFIT: Reactive validation
    // Form components can bind directly to this computed signal
    // No need for separate validation services or complex form state management
    // The validation updates automatically when cart state changes
    
    // Rule 1: Cart must have items
    if (items.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Rule 2: All quantities must be positive
    const invalidQuantities = items.filter(item => item.quantity <= 0);
    if (invalidQuantities.length > 0) {
      errors.push(`Invalid quantities found for ${invalidQuantities.length} items`);
    }
    
    // Rule 3: All prices must be positive
    const invalidPrices = items.filter(item => item.price <= 0);
    if (invalidPrices.length > 0) {
      errors.push(`Invalid prices found for ${invalidPrices.length} items`);
    }
    
    // Rule 4: Total items under limit (max 100)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 100) {
      errors.push(`Too many items (${totalItems}/100 max)`);
    }
    
    // Rule 5: Additional business rules for checkout
    const summary = this.summary();
    if (summary.finalPrice <= 0) {
      errors.push('Invalid total price');
    }
    
    const isValid = errors.length === 0;
    const canCheckout = isValid && items.length > 0 && summary.finalPrice > 0;
    
    // EDUCATIONAL: Validation in standalone components
    // This computed signal eliminates the need for manual validation chains
    // and provides immediate feedback to form components
    return {
      isValid,
      errors,
      canCheckout
    };
  });

  constructor() {
    // TODO: Initialize standalone service
    // REQUIREMENTS:
    // 1. Load cart from localStorage
    // 2. Set up reactive effects
    //
    // LEARNING: Standalone services initialize the same way as module services
    // No special initialization needed for standalone architecture
    //
    // HINT: Call this.loadCartFromStorage() and this.setupEffects()
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // TODO: Implement cart operations for standalone components
  // LEARNING: These methods work seamlessly with standalone components
  
  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item already exists (by productId)
  // 2. Update quantity or add new item
  // 3. Update metadata (timestamp and version)
  // 4. Maintain immutable state
  //
  // STANDALONE INTEGRATION:
  // - Works directly with standalone components
  // - No module dependencies
  // - Automatic change detection via signals
  //
  // HINTS:
  // - Use this.cartItems() to get current state
  // - Use this.cartItems.update() to modify state
  // - Call this.updateMetadata() after changes
  addItem(product: Product): void {
    // STANDALONE ARCHITECTURE BENEFIT: Direct signal updates
    // No need for actions, reducers, or complex state management patterns
    // The signal update automatically triggers change detection in components
    
    this.cartItems.update(items => {
      // Check if item already exists (by productId)
      const existingItemIndex = items.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        // EDUCATIONAL: Immutable update pattern for signals
        // This ensures change detection works correctly in standalone components
        return items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
        
        // STANDALONE BENEFIT: Simple array spread for immutable updates
        return [...items, newItem];
      }
    });
    
    // Update metadata to track changes
    // This pattern works seamlessly with standalone components
    this.updateMetadata();
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by itemId (not productId)
  // 2. Update metadata
  //
  // HINT: Use this.cartItems.update(items => items.filter(...))
  removeItem(itemId: string): void {
    // STANDALONE ARCHITECTURE BENEFIT: Simple filtering operations
    // No need for complex action dispatching or state management boilerplate
    // The filter operation automatically triggers reactivity in components
    
    this.cartItems.update(items => 
      items.filter(item => item.id !== itemId)
    );
    
    // EDUCATIONAL: Metadata tracking in standalone architecture
    // This helps with debugging and analytics without requiring external services
    this.updateMetadata();
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. Handle quantity <= 0 (remove item)
  // 2. Update item quantity
  // 3. Update metadata
  //
  // HINT: Use this.cartItems.update(items => items.map(...))
  updateQuantity(itemId: string, quantity: number): void {
    // STANDALONE ARCHITECTURE BENEFIT: Declarative quantity updates
    // Business logic is contained within the service without external dependencies
    // The map operation preserves immutability for optimal change detection
    
    this.cartItems.update(items => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return items.filter(item => item.id !== itemId);
      }
      
      // Update item quantity
      return items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      );
    });
    
    // EDUCATIONAL: Single source of truth in standalone architecture
    // All quantity changes go through this method, ensuring consistency
    this.updateMetadata();
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Clear all items
  // 2. Update metadata
  //
  // HINT: Use this.cartItems.set([])
  clearCart(): void {
    // STANDALONE ARCHITECTURE BENEFIT: Simple state reset
    // No need for complex action dispatching or state tree management
    // The signal set operation immediately updates all dependent components
    
    this.cartItems.set([]);
    
    // EDUCATIONAL: Clean slate pattern in standalone architecture
    // This operation is atomic and immediately visible to all components
    this.updateMetadata();
  }

  // TODO: Implement advanced operations for standalone architecture
  
  // TODO: Implement duplicateItem method
  // REQUIREMENTS:
  // 1. Find item by itemId
  // 2. Create duplicate with new ID and quantity 1
  // 3. Add to cart
  // 4. Update metadata
  duplicateItem(itemId: string): void {
    // STANDALONE ARCHITECTURE BENEFIT: Self-contained business logic
    // No need for external services or complex dependency injection
    // The operation is immediately reflected in all consuming components
    
    this.cartItems.update(items => {
      const itemToDuplicate = items.find(item => item.id === itemId);
      
      if (!itemToDuplicate) {
        console.warn(`Item with id ${itemId} not found for duplication`);
        return items;
      }
      
      // Create duplicate with new ID and quantity 1
      const duplicatedItem: CartItem = {
        ...itemToDuplicate,
        id: this.generateId(),
        quantity: 1
      };
      
      // EDUCATIONAL: Immutable array operations in standalone architecture
      // This pattern ensures optimal performance and change detection
      return [...items, duplicatedItem];
    });
    
    this.updateMetadata();
  }

  // TODO: Implement applyBulkDiscount method
  // REQUIREMENTS:
  // 1. Apply discount to all items or specific category
  // 2. Ensure discount only increases (never decreases)
  // 3. Update metadata
  //
  // BUSINESS LOGIC:
  // - 'all': Apply to all items
  // - Category name: Apply only to items in that category
  applyBulkDiscount(categoryOrAll: string, discountPercent: number): void {
    // STANDALONE ARCHITECTURE BENEFIT: Complex business logic without external dependencies
    // The discount calculation is self-contained and immediately reactive
    // No need for separate pricing services or complex state management
    
    this.cartItems.update(items => {
      return items.map(item => {
        // Apply discount to all items or specific category
        const shouldApplyDiscount = categoryOrAll === 'all' || item.category === categoryOrAll;
        
        if (shouldApplyDiscount) {
          // Ensure discount only increases (never decreases)
          const currentDiscount = item.discount || 0;
          const newDiscount = Math.max(currentDiscount, discountPercent);
          
          // EDUCATIONAL: Immutable update pattern
          // This ensures change detection works correctly in standalone components
          return { ...item, discount: newDiscount };
        }
        
        return item;
      });
    });
    
    this.updateMetadata();
  }

  // TODO: Implement optimizeCart method
  // REQUIREMENTS:
  // 1. Remove duplicate items by merging quantities
  // 2. Optimize cart for better performance
  // 3. Update metadata
  //
  // LEARNING: Cart optimization is useful for standalone e-commerce apps
  optimizeCart(): void {
    // STANDALONE ARCHITECTURE BENEFIT: Performance optimization without external services
    // The optimization logic is self-contained and immediately effective
    // No need for separate optimization services or complex algorithms
    
    this.cartItems.update(items => {
      // Group items by productId to merge duplicates
      const productMap = new Map<string, CartItem>();
      
      items.forEach(item => {
        const existingItem = productMap.get(item.productId);
        
        if (existingItem) {
          // Merge quantities and keep the better discount
          existingItem.quantity += item.quantity;
          existingItem.discount = Math.max(
            existingItem.discount || 0,
            item.discount || 0
          );
        } else {
          // Add new item to map
          productMap.set(item.productId, { ...item });
        }
      });
      
      // Convert map back to array
      // EDUCATIONAL: Cart optimization in standalone architecture
      // This eliminates duplicate entries and improves performance
      return Array.from(productMap.values());
    });
    
    this.updateMetadata();
  }

  // TODO: Implement import/export functionality for standalone apps
  
  // TODO: Implement exportCart method
  // REQUIREMENTS:
  // 1. Serialize cart items, metadata, summary, analytics
  // 2. Include export date and version
  // 3. Return formatted JSON string
  //
  // LEARNING: Export functionality enables data portability
  exportCart(): string {
    // STANDALONE ARCHITECTURE BENEFIT: Self-contained data export
    // No need for external serialization services or complex export pipelines
    // The export includes all relevant data for complete cart reconstruction
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      items: this.cartItems(),
      metadata: this.cartMeta(),
      summary: this.summary(),
      analytics: this.analytics(),
      // EDUCATIONAL: Complete state snapshot for standalone architecture
      // This enables full cart restoration in any standalone application
      appInfo: {
        architecture: 'standalone',
        serviceVersion: '1.0.0',
        features: ['progressive-tax', 'bulk-discount', 'optimization', 'analytics']
      }
    };
    
    try {
      // STANDALONE BENEFIT: Simple JSON serialization
      // No complex serialization libraries or external dependencies required
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Cart export failed:', error);
      throw new Error('Failed to export cart data');
    }
  }

  // TODO: Implement importCart method
  // REQUIREMENTS:
  // 1. Parse JSON cart data
  // 2. Validate data structure and items
  // 3. Import to cart state
  // 4. Update metadata
  // 5. Return success/failure boolean
  //
  // LEARNING: Import with validation ensures data integrity
  importCart(cartData: string): boolean {
    // STANDALONE ARCHITECTURE BENEFIT: Self-contained data import with validation
    // No need for external validation services or complex import pipelines
    // The import process is atomic and immediately updates all dependent components
    
    try {
      const importData = JSON.parse(cartData);
      
      // Validate data structure
      if (!importData.items || !Array.isArray(importData.items)) {
        console.error('Invalid cart data: missing or invalid items array');
        return false;
      }
      
      // Validate each item structure
      const isValidItem = (item: any): item is CartItem => {
        return item && 
               typeof item.id === 'string' &&
               typeof item.productId === 'string' &&
               typeof item.name === 'string' &&
               typeof item.price === 'number' &&
               typeof item.quantity === 'number' &&
               typeof item.category === 'string' &&
               item.price > 0 &&
               item.quantity > 0;
      };
      
      const validItems = importData.items.filter(isValidItem);
      
      if (validItems.length !== importData.items.length) {
        console.warn(`Filtered ${importData.items.length - validItems.length} invalid items during import`);
      }
      
      if (validItems.length === 0) {
        console.error('No valid items found in import data');
        return false;
      }
      
      // Import validated items
      this.cartItems.set(validItems);
      
      // Update metadata with import information
      this.cartMeta.update(meta => ({
        ...meta,
        lastUpdated: new Date(),
        version: meta.version + 1
      }));
      
      // EDUCATIONAL: Successful import in standalone architecture
      // The import operation is atomic and immediately visible to all components
      console.log(`Successfully imported ${validItems.length} items`);
      return true;
      
    } catch (error) {
      console.error('Cart import failed:', error);
      return false;
    }
  }

  // TODO: Implement analytics methods for standalone dashboards
  
  // TODO: Implement getCategoryBreakdown method
  // REQUIREMENTS:
  // 1. Group items by category
  // 2. Calculate count and total value per category
  // 3. Sort by total value descending
  // 4. Return array of { category, count, total }
  //
  // STANDALONE USAGE: Dashboard components can display this data
  getCategoryBreakdown(): Array<{ category: string; count: number; total: number }> {
    // STANDALONE ARCHITECTURE BENEFIT: Real-time analytics without external services
    // Dashboard components can call this method directly for immediate insights
    // No need for separate analytics services or complex data processing pipelines
    
    const items = this.cartItems();
    const categoryMap = new Map<string, { count: number; total: number }>();
    
    // Group items by category and calculate totals
    items.forEach(item => {
      const categoryData = categoryMap.get(item.category) || { count: 0, total: 0 };
      
      categoryData.count += item.quantity;
      categoryData.total += (item.price * item.quantity) - ((item.discount || 0) * item.quantity);
      
      categoryMap.set(item.category, categoryData);
    });
    
    // Convert to array and sort by total value descending
    // EDUCATIONAL: Analytics in standalone architecture
    // This provides immediate insights without requiring external analytics services
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        count: data.count,
        total: Math.round(data.total * 100) / 100 // Round to 2 decimal places
      }))
      .sort((a, b) => b.total - a.total);
  }

  // TODO: Implement getTopItems method
  // REQUIREMENTS:
  // 1. Sort items by total value (price × quantity)
  // 2. Return top N items (default 5)
  // 3. Provide insights for recommendations
  //
  // STANDALONE USAGE: Product recommendation components
  getTopItems(limit: number = 5): CartItem[] {
    // STANDALONE ARCHITECTURE BENEFIT: Immediate product insights
    // Recommendation components can use this directly without external services
    // The analysis is based on real-time cart data and user behavior
    
    const items = this.cartItems();
    
    // Sort items by total value (price × quantity) descending
    // EDUCATIONAL: Business intelligence in standalone architecture
    // This provides immediate insights for product recommendations
    // without requiring separate analytics or recommendation services
    return items
      .map(item => ({
        ...item,
        totalValue: (item.price * item.quantity) - ((item.discount || 0) * item.quantity)
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, limit)
      .map(({ totalValue, ...item }) => item); // Remove temporary totalValue property
  }

  // TODO: Implement reactive effects for standalone architecture
  // REQUIREMENTS:
  // 1. Auto-save cart to localStorage
  // 2. Performance and analytics logging
  // 3. Validation monitoring
  //
  // LEARNING: Effects work the same in standalone as module architecture
  private setupEffects(): void {
    // STANDALONE ARCHITECTURE BENEFIT: Reactive effects without lifecycle management
    // Effects in standalone architecture work the same as in module-based architecture
    // but with cleaner dependency injection and no module boilerplate
    
    // Auto-save effect for persistence
    effect(() => {
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      // EDUCATIONAL: Automatic persistence in standalone architecture
      // This effect runs whenever cart items or metadata change
      // No manual subscription management or OnDestroy hooks required
      const cartData = {
        items,
        metadata: {
          ...metadata,
          created: metadata.created.toISOString(),
          lastUpdated: metadata.lastUpdated.toISOString()
        }
      };
      
      try {
        localStorage.setItem('standalone-cart', JSON.stringify(cartData));
        console.log('Cart auto-saved to localStorage');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    });

    // Analytics logging effect
    effect(() => {
      const analytics = this.analytics();
      
      // EDUCATIONAL: Real-time analytics in standalone architecture
      // This effect provides immediate insights without external analytics services
      // Dashboard components can react to these analytics automatically
      console.log('Cart Analytics Update:', {
        categories: analytics.uniqueCategories,
        avgPrice: analytics.averageItemPrice,
        sessionDuration: analytics.sessionDurationMinutes,
        version: analytics.cartVersion
      });
      
      // In a real application, you might send this data to an analytics service
      // But in standalone architecture, the service is self-contained
    });

    // Validation monitoring effect
    effect(() => {
      const validation = this.validation();
      
      // EDUCATIONAL: Reactive validation feedback in standalone architecture
      // Form components can react to validation changes automatically
      // No need for complex form state management or validation services
      if (!validation.isValid) {
        console.log('Cart Validation Issues:', validation.errors);
      }
      
      // This could trigger UI feedback, form state updates, or checkout flow changes
      // All without complex event handling or state management patterns
    });
  }

  // TODO: Implement storage operations for standalone persistence
  
  private loadCartFromStorage(): void {
    // STANDALONE ARCHITECTURE BENEFIT: Self-contained persistence
    // No need for external storage services or complex state hydration
    // The loading is immediate and doesn't require module configuration
    
    try {
      const savedCart = localStorage.getItem('standalone-cart');
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        
        // Validate and restore cart items
        if (cartData.items && Array.isArray(cartData.items)) {
          this.cartItems.set(cartData.items);
        }
        
        // Restore metadata with proper Date objects
        if (cartData.metadata) {
          this.cartMeta.set({
            sessionId: cartData.metadata.sessionId || crypto.randomUUID(),
            created: new Date(cartData.metadata.created || Date.now()),
            lastUpdated: new Date(cartData.metadata.lastUpdated || Date.now()),
            version: cartData.metadata.version || 1
          });
        }
        
        console.log('Cart loaded from localStorage successfully');
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      // EDUCATIONAL: Graceful error handling in standalone architecture
      // If loading fails, the cart starts fresh with default values
      // This ensures the application remains functional even with corrupted storage
    }
  }

  // TODO: Implement metadata update helper
  // REQUIREMENTS:
  // 1. Update lastUpdated timestamp
  // 2. Increment version number
  //
  // LEARNING: Metadata tracking helps with debugging and analytics
  private updateMetadata(): void {
    // STANDALONE ARCHITECTURE BENEFIT: Simple metadata tracking
    // No need for external state management or complex action patterns
    // The metadata update is atomic and immediately visible to all components
    
    this.cartMeta.update(meta => ({
      ...meta,
      lastUpdated: new Date(),
      version: meta.version + 1
    }));
    
    // EDUCATIONAL: Metadata in standalone architecture
    // This tracking helps with debugging, analytics, and audit trails
    // All without requiring external services or complex state management
  }

  // TODO: Implement utility methods
  
  private generateId(): string {
    // TODO: Generate unique ID for cart items
    // HINT: Use timestamp and random string with 'standalone-' prefix
    return `standalone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}