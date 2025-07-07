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
  
  // CONTROL FLOW INTEGRATION: Core state signals for template syntax
  // 
  // LEARNING: Signals integrate perfectly with new control flow syntax
  // - items() works directly in @for (item of cartService.items(); track item.id)
  // - Computed values work in @if (cartService.totalItems() > 0)
  // - No need for async pipe or subscription management
  //
  // TEMPLATE USAGE EXAMPLES:
  // @for (item of cartService.cartItems(); track item.id) { ... }
  // @if (cartService.totalItems() > 0) { ... }
  // @switch (cartService.cartMetrics().sessionDuration) { ... }
  
  // Core state signals for control flow integration
  private items = signal<CartItem[]>([]);
  private sessionStartTime = signal<Date>(new Date());
  private interactionCount = signal<number>(0);
  
  // READONLY ACCESSORS: For template control flow integration
  //
  // LEARNING: These readonly signals can be used directly in templates
  // Template usage: @for (item of cartService.cartItems(); track item.id)
  // Template usage: @if (cartService.cartItems().length > 0)
  //
  public readonly cartItems = this.items.asReadonly();
  public readonly sessionStart = this.sessionStartTime.asReadonly();
  
  // COMPUTED VALUES: For template control flow conditions
  //
  // LEARNING: Computed signals are perfect for control flow conditions
  // - Use in @if: @if (cartService.totalItems() > 0)
  // - Use in @switch: @switch (cartService.cartStatus())
  // - Automatic recalculation when dependencies change
  
  // Total items for @if conditions - USAGE: @if (cartService.totalItems() > 0) { ... }
  public readonly totalItems = computed(() => {
    // Sum all item quantities for use in @if conditions
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });
  
  // Cart summary for complex @if/@switch conditions
  // LEARNING: This computed value can drive template decisions
  // Template usage: @if (cartService.cartSummary().finalPrice > 100) { ... }
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.items();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    const tax = (totalPrice - totalDiscount) * 0.08; // 8% tax
    const finalPrice = totalPrice - totalDiscount + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // Performance metrics for @defer decision making
  // LEARNING: Performance metrics help with @defer decisions
  // Template usage: @defer (when cartService.cartMetrics().sessionDuration > 5)
  public readonly cartMetrics = computed<CartMetrics>(() => {
    const items = this.items();
    const now = new Date();
    const sessionDuration = (now.getTime() - this.sessionStartTime().getTime()) / (1000 * 60); // minutes
    const itemsAdded = items.length;
    const itemsRemoved = Math.max(0, this.interactionCount() - itemsAdded); // Rough estimate
    const totalInteractions = this.interactionCount();
    const averageItemPrice = items.length > 0 
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
      : 0;
    
    return {
      sessionDuration,
      itemsAdded,
      itemsRemoved,
      totalInteractions,
      averageItemPrice
    };
  });
  
  // Performance stats for @defer optimization
  // LEARNING: Performance stats help determine when to defer expensive components
  // Template usage: @defer (when cartService.performanceStats().itemCount > 10)
  public readonly performanceStats = computed(() => {
    const items = this.items();
    const itemCount = items.length;
    const lastUpdate = new Date().toISOString();
    const computationTime = this.measureComputationTime();
    const memoryUsage = this.estimateMemoryUsage(items);
    
    return {
      itemCount,
      lastUpdate,
      computationTime,
      memoryUsage
    };
  });

  constructor() {
    // Initialize service for control flow integration
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // CART OPERATIONS: Integrate with control flow templates
  // LEARNING: These methods update signals that automatically update templates
  // 
  // TEMPLATE INTEGRATION:
  // - Updates this.items() signal
  // - Automatically triggers @if/@for updates in templates
  // - No manual change detection needed
  
  addItem(product: Product): void {
    this.items.update(items => {
      const existingItem = items.find(item => item.productId === product.id);
      if (existingItem) {
        // Update quantity of existing item
        return items.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: this.generateId(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image || '',
          category: product.category,
          discount: product.discount
        };
        return [...items, newItem];
      }
    });
    this.incrementInteraction();
  }

  removeItem(itemId: string): void {
    this.items.update(items => items.filter(item => item.id !== itemId));
    this.incrementInteraction();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    this.items.update(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    this.incrementInteraction();
  }

  clearCart(): void {
    this.items.set([]);
    this.incrementInteraction();
  }

  // ANALYTICS METHODS: Provide data for complex template conditions
  // LEARNING: These methods provide data for complex template conditions
  
  // TEMPLATE USAGE: @for (item of cartService.getFilteredItems('electronics'); track item.id)
  getFilteredItems(category?: string, maxPrice?: number): CartItem[] {
    let filteredItems = this.items();
    
    if (category) {
      filteredItems = filteredItems.filter(item => 
        item.category === category
      );
    }
    
    if (maxPrice !== undefined) {
      filteredItems = filteredItems.filter(item => 
        item.price <= maxPrice
      );
    }
    
    return filteredItems;
  }

  // TEMPLATE USAGE:
  // @for (cat of cartService.getTopCategories(); track cat.category) {
  //   @if (cat.total > 100) { ... }
  // }
  getTopCategories(): Array<{ category: string; count: number; total: number }> {
    const categoryMap = new Map<string, { count: number; total: number }>();
    
    this.items().forEach(item => {
      const category = item.category;
      const itemTotal = item.price * item.quantity;
      
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.count += item.quantity;
        existing.total += itemTotal;
      } else {
        categoryMap.set(category, { count: item.quantity, total: itemTotal });
      }
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  // REACTIVE EFFECTS: Support control flow template decisions
  // LEARNING: Effects automatically run when signals change
  // Perfect for side effects that support template decisions
  private setupEffects(): void {
    // Auto-save cart to localStorage when items change
    effect(() => {
      const items = this.items();
      try {
        localStorage.setItem('control-flow-cart', JSON.stringify(items));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    });

    // Log performance metrics for monitoring and @defer optimization
    effect(() => {
      const stats = this.performanceStats();
      if (stats.itemCount > 5) {
        console.log('Performance metrics (for @defer optimization):', stats);
      }
    });
  }

  // STORAGE OPERATIONS: Support cart persistence
  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem('control-flow-cart');
      if (stored) {
        const items = JSON.parse(stored);
        this.items.set(items);
      }
    } catch (error) {
      console.warn('Failed to load cart from storage:', error);
    }
  }

  // UTILITY METHODS
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementInteraction(): void {
    this.interactionCount.update(count => count + 1);
  }

  // Additional methods needed by template
  public totalPrice(): number {
    return this.cartSummary().totalPrice;
  }

  public operationCount(): number {
    return this.interactionCount();
  }

  // PERFORMANCE MEASUREMENT: Support @defer decision making in templates
  // LEARNING: These support @defer decision making in templates
  
  // TEMPLATE USAGE: @defer (when cartService.performanceStats().computationTime < 10)
  private measureComputationTime(): number {
    const start = performance.now();
    this.cartSummary(); // Trigger computation
    const end = performance.now();
    return Math.round(end - start);
  }

  // TEMPLATE USAGE: @defer (when cartService.performanceStats().memoryUsage < 1000)
  private estimateMemoryUsage(items: CartItem[]): number {
    const bytesPerItem = 200; // Estimate
    return items.length * bytesPerItem;
  }
}