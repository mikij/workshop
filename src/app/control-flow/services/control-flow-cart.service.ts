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

export interface CartMetrics {
  sessionDuration: number;
  itemsAdded: number;
  itemsRemoved: number;
  totalInteractions: number;
  averageItemPrice: number;
}

/**
 * CONTROL FLOW MODULE - Modern Angular Template Syntax
 * 
 * This service demonstrates integration with Angular's new control flow syntax
 * (@if, @for, @switch, @defer) while providing cart functionality and performance metrics.
 * 
 * KEY CONCEPTS TO LEARN:
 * - Signal-based state management for templates
 * - Performance monitoring and metrics
 * - Integration with @defer for lazy loading
 * - Template optimization patterns
 * - Analytics and user interaction tracking
 * 
 * TEMPLATE INTEGRATION:
 * - Signals work seamlessly with new control flow
 * - Computed values automatically update @if/@for/@switch
 * - Performance metrics support @defer decisions
 * - Analytics data drives conditional rendering
 */
@Injectable({
  providedIn: 'root'
})
export class ControlFlowCartService {
  
  // TODO: Create core state signals for control flow integration
  // REQUIREMENTS:
  // 1. Cart items for @for loops
  // 2. Session tracking for performance metrics
  // 3. Interaction counting for analytics
  //
  // LEARNING: Signals integrate perfectly with new control flow syntax
  // - items() works directly in @for (item of cartService.items(); track item.id)
  // - Computed values work in @if (cartService.totalItems() > 0)
  // - No need for async pipe or subscription management
  //
  // SYNTAX HINTS:
  // private items = signal<CartItem[]>([]);
  // private sessionStartTime = signal<Date>(new Date());
  // private interactionCount = signal<number>(0);
  
  // TODO: Implement cart items signal
  // HINT: private items = signal<CartItem[]>([]);
  private items = signal<CartItem[]>([]);
  
  // TODO: Implement session tracking signal
  // HINT: private sessionStartTime = signal<Date>(new Date());
  private sessionStartTime = signal<Date>(new Date());
  
  // TODO: Implement interaction counter signal
  // HINT: private interactionCount = signal<number>(0);
  private interactionCount = signal<number>(0);
  
  // TODO: Create readonly accessors for template usage
  // REQUIREMENTS:
  // 1. cartItems for @for loops
  // 2. sessionStart for time calculations
  //
  // LEARNING: These readonly signals can be used directly in templates
  // Template usage: @for (item of cartService.cartItems(); track item.id)
  // Template usage: @if (cartService.cartItems().length > 0)
  //
  // HINT: public readonly cartItems = this.items.asReadonly();
  public readonly cartItems = this.items.asReadonly();
  public readonly sessionStart = this.sessionStartTime.asReadonly();
  
  // TODO: Implement computed values for template control flow
  // REQUIREMENTS:
  // 1. totalItems for @if conditions
  // 2. cartSummary for price displays
  // 3. cartMetrics for performance monitoring
  //
  // LEARNING: Computed signals are perfect for control flow conditions
  // - Use in @if: @if (cartService.totalItems() > 0)
  // - Use in @switch: @switch (cartService.cartStatus())
  // - Automatic recalculation when dependencies change
  
  // TODO: Implement totalItems computed
  // REQUIREMENTS: Sum all item quantities
  // HINT: computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0))
  // USAGE: @if (cartService.totalItems() > 0) { ... }
  public readonly totalItems = computed(() => {
    /**
     * CONTROL FLOW INTEGRATION:
     * This computed signal is perfect for @if conditions in templates:
     * - @if (cartService.totalItems() > 0) { show cart }
     * - @if (cartService.totalItems() > 10) { show bulk discount }
     * - Automatically recalculates when items change
     * - No manual subscription or change detection needed
     */
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });
  
  // TODO: Implement cartSummary computed
  // REQUIREMENTS:
  // 1. Calculate totalItems, totalPrice, totalDiscount
  // 2. Calculate 8% tax rate
  // 3. Calculate final price
  //
  // LEARNING: This computed value can drive template decisions
  // Template usage: @if (cartService.cartSummary().finalPrice > 100) { ... }
  public readonly cartSummary = computed<CartSummary>(() => {
    /**
     * CONTROL FLOW INTEGRATION:
     * This computed signal enables complex template conditions:
     * - @if (cartService.cartSummary().finalPrice > 100) { show free shipping }
     * - @switch (cartService.cartSummary().totalItems) { case 0: empty; case 1: single; default: multiple }
     * - @defer (when cartService.cartSummary().totalPrice > 500) { load premium features }
     * 
     * PERFORMANCE BENEFITS:
     * - Memoized calculations - only recalculates when items change
     * - Supports template optimization decisions
     * - No need for manual pipe operators or async handling
     */
    const items = this.items();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate bulk discount: 5% off for orders > $200, 10% off for orders > $500
    let discountRate = 0;
    if (totalPrice > 500) {
      discountRate = 0.10;
    } else if (totalPrice > 200) {
      discountRate = 0.05;
    }
    
    const totalDiscount = totalPrice * discountRate;
    const discountedPrice = totalPrice - totalDiscount;
    const tax = discountedPrice * 0.08; // 8% tax rate
    const finalPrice = discountedPrice + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // TODO: Implement performance metrics computed
  // REQUIREMENTS:
  // 1. Calculate session duration in minutes
  // 2. Count items added (from items length)
  // 3. Track total interactions
  // 4. Calculate average item price
  //
  // LEARNING: Performance metrics help with @defer decisions
  // Template usage: @defer (when cartService.cartMetrics().sessionDuration > 5)
  public readonly cartMetrics = computed<CartMetrics>(() => {
    /**
     * CONTROL FLOW INTEGRATION:
     * Performance metrics drive intelligent template decisions:
     * - @defer (when cartService.cartMetrics().sessionDuration > 5) { load advanced features }
     * - @if (cartService.cartMetrics().totalInteractions > 10) { show power user tips }
     * - @switch (cartService.cartMetrics().itemsAdded) { show different engagement messages }
     * 
     * TEMPLATE OPTIMIZATION:
     * - Use session duration to determine when to show expensive components
     * - Use interaction count to personalize user experience
     * - Use average price to show relevant product suggestions
     */
    const now = new Date();
    const sessionStart = this.sessionStartTime();
    const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / (1000 * 60)); // minutes
    
    const items = this.items();
    const itemsAdded = items.length;
    const itemsRemoved = 0; // TODO: Track removed items in a separate signal if needed
    const totalInteractions = this.interactionCount();
    
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const averageItemPrice = totalQuantity > 0 ? totalPrice / totalQuantity : 0;
    
    return {
      sessionDuration,
      itemsAdded,
      itemsRemoved,
      totalInteractions,
      averageItemPrice
    };
  });
  
  // TODO: Implement performance stats computed for @defer integration
  // REQUIREMENTS:
  // 1. Item count for memory estimates
  // 2. Last update timestamp
  // 3. Computation time measurement
  // 4. Memory usage estimation
  //
  // LEARNING: Performance stats help determine when to defer expensive components
  // Template usage: @defer (when cartService.performanceStats().itemCount > 10)
  public readonly performanceStats = computed(() => {
    /**
     * CONTROL FLOW INTEGRATION FOR @DEFER:
     * These performance stats are crucial for @defer optimization:
     * - @defer (when cartService.performanceStats().itemCount > 10) { load heavy components }
     * - @defer (when cartService.performanceStats().computationTime < 5) { load if fast }
     * - @defer (when cartService.performanceStats().memoryUsage < 1000) { load if memory OK }
     * 
     * PERFORMANCE OPTIMIZATION:
     * - Monitor computation time to avoid blocking the UI
     * - Track memory usage to prevent excessive resource consumption
     * - Use item count thresholds to defer expensive operations
     * - Provide data-driven decisions for when to load components
     */
    const startTime = performance.now();
    const items = this.items();
    const itemCount = items.length;
    
    // Simulate computation time measurement
    const computationTime = this.measureComputationTime();
    
    // Estimate memory usage based on item count and complexity
    const memoryUsage = this.estimateMemoryUsage(items);
    
    const endTime = performance.now();
    const actualComputationTime = endTime - startTime;
    
    return {
      itemCount,
      lastUpdate: new Date().toISOString(),
      computationTime: Math.max(computationTime, actualComputationTime),
      memoryUsage
    };
  });

  constructor() {
    // TODO: Initialize service
    // REQUIREMENTS:
    // 1. Load cart from storage
    // 2. Set up reactive effects
    //
    // HINT: Call this.loadCartFromStorage() and this.setupEffects()
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // TODO: Implement cart operations that integrate with control flow
  // LEARNING: These methods update signals that automatically update templates
  
  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item exists (by productId)
  // 2. Update quantity or add new item
  // 3. Increment interaction counter
  // 4. Maintain immutable state
  //
  // TEMPLATE INTEGRATION:
  // - Updates this.items() signal
  // - Automatically triggers @if/@for updates in templates
  // - No manual change detection needed
  //
  // HINTS:
  // - Use this.items() to get current items
  // - Use this.items.update() to modify state
  // - Call this.incrementInteraction() to track user actions
  addItem(product: Product): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * When this method updates the items signal, it automatically triggers:
     * - @for loops to re-render with new items
     * - @if conditions to show/hide cart sections
     * - @switch cases to update cart status
     * - Computed signals to recalculate totals
     * 
     * TEMPLATE REACTIVITY:
     * - No manual change detection needed
     * - No async pipes or subscriptions required
     * - Immediate UI updates when signal changes
     */
    this.items.update(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === product.id
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity (immutable pattern)
        return currentItems.map((item, index) => 
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
        return [...currentItems, newItem];
      }
    });
    
    // Track user interaction for analytics
    this.incrementInteraction();
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by itemId
  // 2. Update items signal
  // 3. Increment interaction counter
  //
  // HINT: Use this.items.update(items => items.filter(...))
  removeItem(itemId: string): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Removing items triggers automatic template updates:
     * - @for loops automatically remove the item from the list
     * - @if (cartService.totalItems() > 0) will update if cart becomes empty
     * - @switch conditions will update based on new item count
     * - All computed signals recalculate automatically
     * 
     * TEMPLATE OPTIMIZATION:
     * - Use track by item.id in @for for efficient DOM updates
     * - Angular's control flow will only update the specific item that changed
     */
    this.items.update(currentItems => 
      currentItems.filter(item => item.id !== itemId)
    );
    
    // Track user interaction for analytics
    this.incrementInteraction();
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. Handle quantity <= 0 (remove item)
  // 2. Update item quantity
  // 3. Increment interaction counter
  //
  // HINT: Use this.items.update(items => items.map(...))
  updateQuantity(itemId: string, quantity: number): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Quantity updates demonstrate the power of signal-based reactivity:
     * - @if (item.quantity > 1) { show quantity controls }
     * - @switch (item.quantity) { show different quantity displays }
     * - Computed totals automatically recalculate
     * - @defer conditions may trigger based on new totals
     * 
     * BUSINESS LOGIC:
     * - Handle edge case: quantity <= 0 removes the item
     * - Maintain data integrity with immutable updates
     * - Track all interactions for analytics
     */
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      this.removeItem(itemId);
      return;
    }
    
    this.items.update(currentItems => 
      currentItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    
    // Track user interaction for analytics
    this.incrementInteraction();
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Clear all items
  // 2. Increment interaction counter
  //
  // HINT: Use this.items.set([])
  clearCart(): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Clearing the cart triggers comprehensive template updates:
     * - @if (cartService.totalItems() > 0) will hide cart content
     * - @for loops will remove all items from the DOM
     * - @switch (cartService.totalItems()) will show empty state
     * - @defer conditions based on item count will trigger
     * 
     * UX CONSIDERATIONS:
     * - This is a destructive action that should be confirmed
     * - All computed values reset to empty state
     * - Session analytics continue tracking
     */
    this.items.set([]);
    
    // Track user interaction for analytics
    this.incrementInteraction();
  }

  // TODO: Implement analytics and filtering methods for control flow
  // LEARNING: These methods provide data for complex template conditions
  
  // TODO: Implement getFilteredItems method
  // REQUIREMENTS:
  // 1. Filter by category (optional)
  // 2. Filter by max price (optional)
  // 3. Return filtered CartItem array
  //
  // TEMPLATE USAGE:
  // @for (item of cartService.getFilteredItems('electronics'); track item.id)
  getFilteredItems(category?: string, maxPrice?: number): CartItem[] {
    /**
     * CONTROL FLOW INTEGRATION:
     * This method provides filtered data for complex template conditions:
     * - @for (item of cartService.getFilteredItems('electronics'); track item.id)
     * - @if (cartService.getFilteredItems('sale').length > 0) { show sale banner }
     * - @switch (cartService.getFilteredItems().length) { show different views }
     * 
     * TEMPLATE OPTIMIZATION:
     * - Use with @defer to load filtered views only when needed
     * - Combine with other computed signals for complex conditions
     * - Perfect for category-based or price-based filtering UIs
     */
    const currentItems = this.items();
    
    return currentItems.filter(item => {
      // Filter by category if specified
      if (category && item.category !== category) {
        return false;
      }
      
      // Filter by max price if specified
      if (maxPrice && item.price > maxPrice) {
        return false;
      }
      
      return true;
    });
  }

  // TODO: Implement getTopCategories method
  // REQUIREMENTS:
  // 1. Group items by category
  // 2. Calculate count and total value per category
  // 3. Sort by total value descending
  // 4. Return array of { category, count, total }
  //
  // TEMPLATE USAGE:
  // @for (cat of cartService.getTopCategories(); track cat.category) {
  //   @if (cat.total > 100) { ... }
  // }
  getTopCategories(): Array<{ category: string; count: number; total: number }> {
    /**
     * CONTROL FLOW INTEGRATION:
     * Category analysis enables sophisticated template logic:
     * - @for (cat of cartService.getTopCategories(); track cat.category) { show category stats }
     * - @if (cat.total > 100) { show premium category badge }
     * - @switch (cat.count) { show different category displays }
     * - @defer (when getTopCategories().length > 3) { load detailed analytics }
     * 
     * BUSINESS INTELLIGENCE:
     * - Provides insights into customer purchasing patterns
     * - Supports dynamic UI based on cart composition
     * - Enables personalized recommendations
     */
    const currentItems = this.items();
    
    // Group items by category
    const categoryMap = new Map<string, { count: number; total: number }>();
    
    currentItems.forEach(item => {
      const category = item.category;
      const itemTotal = item.price * item.quantity;
      
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.count += item.quantity;
        existing.total += itemTotal;
      } else {
        categoryMap.set(category, {
          count: item.quantity,
          total: itemTotal
        });
      }
    });
    
    // Convert to array and sort by total value descending
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        count: data.count,
        total: data.total
      }))
      .sort((a, b) => b.total - a.total);
  }

  // TODO: Implement reactive effects for control flow integration
  // REQUIREMENTS:
  // 1. Auto-save cart to localStorage
  // 2. Performance logging for monitoring
  //
  // LEARNING: Effects automatically run when signals change
  // Perfect for side effects that support template decisions
  private setupEffects(): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Effects provide automatic side effects that support template decisions:
     * - Auto-save ensures data persistence across sessions
     * - Performance logging helps optimize @defer conditions
     * - Runs automatically when signals change - no manual triggering needed
     * 
     * REACTIVE PATTERNS:
     * - Effects react to signal changes immediately
     * - Perfect for logging, storage, and analytics
     * - Support the data needed for intelligent template decisions
     */
    
    // Auto-save effect: Save cart whenever items change
    effect(() => {
      const items = this.items();
      try {
        const cartData = {
          items,
          sessionStart: this.sessionStartTime().toISOString(),
          interactions: this.interactionCount()
        };
        localStorage.setItem('control-flow-cart', JSON.stringify(cartData));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    });

    // Performance logging effect: Monitor metrics for @defer optimization
    effect(() => {
      const stats = this.performanceStats();
      const metrics = this.cartMetrics();
      
      // Log performance data for @defer optimization decisions
      if (stats.itemCount > 0) {
        console.log('Cart Performance Metrics:', {
          itemCount: stats.itemCount,
          computationTime: stats.computationTime,
          memoryUsage: stats.memoryUsage,
          sessionDuration: metrics.sessionDuration,
          totalInteractions: metrics.totalInteractions
        });
        
        // Log recommendations for @defer usage
        if (stats.itemCount > 10) {
          console.log('Recommendation: Consider @defer for heavy components');
        }
        if (stats.computationTime > 5) {
          console.log('Recommendation: Consider @defer for computation-heavy features');
        }
        if (metrics.sessionDuration > 10) {
          console.log('Recommendation: User is engaged, safe to load premium features');
        }
      }
    });
  }

  // TODO: Implement storage operations
  // REQUIREMENTS:
  // 1. Save cart to localStorage with 'control-flow-cart' key
  // 2. Load cart from localStorage on initialization
  // 3. Handle errors gracefully
  
  private loadCartFromStorage(): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Loading cart data sets up the initial state for template rendering:
     * - @if conditions will immediately reflect loaded cart state
     * - @for loops will render pre-existing items
     * - @switch cases will show appropriate cart status
     * - No loading states needed - signals update immediately
     * 
     * INITIALIZATION STRATEGY:
     * - Load cart items and restore session state
     * - Handle errors gracefully with fallback states
     * - Preserve user interactions and session timing
     */
    try {
      const savedData = localStorage.getItem('control-flow-cart');
      if (savedData) {
        const cartData = JSON.parse(savedData);
        
        // Restore cart items
        if (cartData.items && Array.isArray(cartData.items)) {
          this.items.set(cartData.items);
        }
        
        // Restore session start time
        if (cartData.sessionStart) {
          this.sessionStartTime.set(new Date(cartData.sessionStart));
        }
        
        // Restore interaction count
        if (typeof cartData.interactions === 'number') {
          this.interactionCount.set(cartData.interactions);
        }
        
        console.log('Cart loaded from storage:', {
          items: cartData.items?.length || 0,
          sessionStart: cartData.sessionStart,
          interactions: cartData.interactions
        });
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      // Initialize with empty state on error
      this.items.set([]);
      this.sessionStartTime.set(new Date());
      this.interactionCount.set(0);
    }
  }

  // TODO: Implement utility methods
  
  private generateId(): string {
    // TODO: Generate unique ID for cart items
    // HINT: Use timestamp and random string
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementInteraction(): void {
    /**
     * CONTROL FLOW INTEGRATION:
     * Interaction counting supports template personalization:
     * - @if (cartService.cartMetrics().totalInteractions > 5) { show tips }
     * - @defer (when cartService.cartMetrics().totalInteractions > 10) { load advanced features }
     * - @switch (interaction level) { show different user experience }
     * 
     * ANALYTICS BENEFITS:
     * - Track user engagement for A/B testing
     * - Determine when to show advanced features
     * - Support personalized user experiences
     */
    this.interactionCount.update(count => count + 1);
  }

  // TODO: Implement performance measurement methods
  // LEARNING: These support @defer decision making in templates
  
  private measureComputationTime(): number {
    /**
     * CONTROL FLOW INTEGRATION:
     * Computation time measurement supports @defer optimization:
     * - @defer (when cartService.performanceStats().computationTime < 10)
     * - Helps determine when expensive components should be loaded
     * - Provides data for performance-based template decisions
     * 
     * PERFORMANCE OPTIMIZATION:
     * - Measure actual computation time for cart operations
     * - Use data to make informed @defer decisions
     * - Prevent UI blocking with expensive operations
     */
    const startTime = performance.now();
    
    // Trigger computation of cart summary to measure performance
    const summary = this.cartSummary();
    const metrics = this.cartMetrics();
    
    const endTime = performance.now();
    const computationTime = endTime - startTime;
    
    // Return computation time in milliseconds
    return computationTime;
  }

  private estimateMemoryUsage(items: CartItem[]): number {
    /**
     * CONTROL FLOW INTEGRATION:
     * Memory usage estimation guides @defer loading decisions:
     * - @defer (when cartService.performanceStats().memoryUsage < 1000)
     * - Prevent memory bloat with large cart operations
     * - Support intelligent component loading strategies
     * 
     * MEMORY OPTIMIZATION:
     * - Estimate memory footprint of cart data
     * - Include item data, computed values, and metadata
     * - Use for performance-conscious template decisions
     */
    const baseItemSize = 200; // Estimated bytes per cart item (product + metadata)
    const computedDataSize = 100; // Estimated bytes for computed values
    const metadataSize = 50; // Estimated bytes for timestamps and IDs
    
    const totalItemMemory = items.length * baseItemSize;
    const totalComputedMemory = items.length * computedDataSize;
    const totalMetadataMemory = items.length * metadataSize;
    
    // Return total estimated memory usage in bytes
    return totalItemMemory + totalComputedMemory + totalMetadataMemory;
  }
}