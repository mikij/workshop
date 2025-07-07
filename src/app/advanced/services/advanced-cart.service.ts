import { Injectable, signal, computed, effect, resource, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartSummary, Product } from '../../shared/models';

// TODO: Understand these interfaces for advanced cart features
// LEARNING: TypeScript interfaces define the shape of complex data
interface CartState {
  items: CartItem[];
  lastUpdated: Date;
  version: number;
}

interface CartAnalytics {
  totalSessions: number;
  averageSessionValue: number;
  topCategories: { category: string; count: number }[];
  abandonmentRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedCartService {
  
  // TODO: Create versioned cart state signal
  // HINT: Use signal<CartState>() with initial state
  // LEARNING: Versioned state enables:
  // - Optimistic updates
  // - Conflict detection
  // - Audit trails
  // - Rollback capabilities
  // SYNTAX: private cartState = signal<CartState>({ items: [], lastUpdated: new Date(), version: 1 });
  private cartState = signal<CartState>({
    items: [],
    lastUpdated: new Date(),
    version: 1
  });

  // TODO: Create session and history management signals
  // HINT: Use signal<Date>() for sessionStartTime
  // HINT: Use signal<CartState[]>() for cartHistory
  // LEARNING: Session tracking enables analytics and user behavior insights
  // SYNTAX: private sessionStartTime = signal<Date>(new Date());
  // SYNTAX: private cartHistory = signal<CartState[]>([]);
  private sessionStartTime = signal<Date>(new Date());
  private cartHistory = signal<CartState[]>([]);
  private maxHistorySize = 50;

  // TODO: Create computed properties for external access
  // REQUIREMENTS:
  // 1. cartItems: Extract items from cartState
  // 2. cartSummary: Advanced calculations with bulk discounts and luxury tax
  // 3. cartAnalytics: Session tracking and category analysis
  // 4. cartMetrics: Performance and usage metrics
  //
  // LEARNING: Advanced computed patterns:
  // - Versioned state access
  // - Complex business rules
  // - Multi-level calculations
  // - Real-time analytics
  //
  // SYNTAX HINT for cartItems:
  // public readonly cartItems = computed(() => this.cartState().items);
  public readonly cartItems = computed(() => this.cartState().items);

  // IMPLEMENTED: Advanced cart summary with enterprise business rules
  // REQUIREMENTS:
  // 1. Basic calculations: totalItems, totalPrice
  // 2. Bulk discount logic: quantity > 3 gets minimum 15% discount
  // 3. Luxury tax system:
  //    - Items over $1000: 15% tax rate
  //    - Other items: 8% tax rate
  // 4. Item-level tax calculation (more precise than flat rate)
  //
  // LEARNING: Enterprise-grade business logic
  // - Complex discount rules
  // - Multiple tax rates
  // - Item-level calculations
  // - Advanced pricing strategies
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.cartState().items;
    
    // Calculate total items (sum of all quantities)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate line totals with advanced business rules
    const itemCalculations = items.map(item => {
      // Base price calculation
      const basePrice = item.price * item.quantity;
      
      // Bulk discount logic: quantities > 3 get minimum 15% discount
      // Use Math.max to ensure discount only increases (never decreases)
      const bulkDiscount = item.quantity > 3 ? Math.max(0.15, item.discount || 0) : (item.discount || 0);
      const discountAmount = basePrice * bulkDiscount;
      const discountedPrice = basePrice - discountAmount;
      
      // Luxury tax system: item-level tax calculation for precision
      // Items over $1000 get 15% tax, others get 8% tax
      const taxRate = item.price > 1000 ? 0.15 : 0.08;
      const taxAmount = discountedPrice * taxRate;
      
      return {
        basePrice,
        discountAmount,
        discountedPrice,
        taxAmount,
        finalPrice: discountedPrice + taxAmount
      };
    });
    
    // Aggregate all calculations
    const totalPrice = itemCalculations.reduce((sum, calc) => sum + calc.basePrice, 0);
    const totalDiscount = itemCalculations.reduce((sum, calc) => sum + calc.discountAmount, 0);
    const tax = itemCalculations.reduce((sum, calc) => sum + calc.taxAmount, 0);
    const finalPrice = itemCalculations.reduce((sum, calc) => sum + calc.finalPrice, 0);
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });

  // IMPLEMENTED: Cart analytics computation
  // REQUIREMENTS:
  // 1. Calculate total sessions from history
  // 2. Calculate average session value
  // 3. Analyze top categories by quantity
  // 4. Calculate abandonment rate
  //
  // LEARNING: Business intelligence with signals
  // - Real-time analytics
  // - Session tracking
  // - Behavioral analysis
  // - Conversion metrics
  //
  // HINTS:
  // - Get history: this.cartHistory()
  // - Session value: sum of (price * quantity) for each session
  // - Category analysis: group items and sort by quantity
  // - Abandonment rate: (sessions - 1) / sessions * 100
  public readonly cartAnalytics = computed<CartAnalytics>(() => {
    const history = this.cartHistory();
    const currentItems = this.cartState().items;
    
    // Calculate total sessions from history length
    const totalSessions = Math.max(1, history.length);
    
    // Calculate session values (price * quantity for each historical session)
    const sessionValues = history.map(session => 
      session.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    );
    
    // Calculate average session value
    const totalSessionValue = sessionValues.reduce((sum, value) => sum + value, 0);
    const averageSessionValue = totalSessionValue / totalSessions;
    
    // Analyze top categories by quantity across all sessions
    const categoryStats = new Map<string, number>();
    
    // Aggregate categories from all sessions
    history.forEach(session => {
      session.items.forEach(item => {
        const currentCount = categoryStats.get(item.category) || 0;
        categoryStats.set(item.category, currentCount + item.quantity);
      });
    });
    
    // Convert to array and sort by quantity (descending)
    const topCategories = Array.from(categoryStats.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
    
    // Calculate abandonment rate
    // Logic: sessions without final purchase / total sessions * 100
    // Simplified: sessions that didn't reach checkout (sessions - 1) / sessions * 100
    const abandonmentRate = totalSessions > 1 ? ((totalSessions - 1) / totalSessions) * 100 : 0;
    
    return {
      totalSessions,
      averageSessionValue,
      topCategories,
      abandonmentRate
    };
  });

  // IMPLEMENTED: Performance metrics computation
  // REQUIREMENTS:
  // 1. Calculate session duration in minutes
  // 2. Calculate cart value per minute
  // 3. Count unique categories
  // 4. Calculate average item price
  // 5. Track cart version and last modified time
  //
  // LEARNING: Performance monitoring with signals
  // - Real-time metrics
  // - User engagement tracking
  // - Efficiency measurements
  // - Version tracking
  public readonly cartMetrics = computed(() => {
    const currentState = this.cartState();
    const sessionStart = this.sessionStartTime();
    const currentTime = new Date();
    
    // Calculate session duration in minutes
    const sessionDurationMs = currentTime.getTime() - sessionStart.getTime();
    const sessionDurationMinutes = Math.max(1, sessionDurationMs / (1000 * 60)); // Minimum 1 minute
    
    // Calculate current cart value
    const cartValue = currentState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate cart value per minute (engagement metric)
    const cartValuePerMinute = cartValue / sessionDurationMinutes;
    
    // Count unique categories
    const uniqueCategories = new Set(currentState.items.map(item => item.category)).size;
    
    // Calculate average item price (weighted by quantity)
    const totalQuantity = currentState.items.reduce((sum, item) => sum + item.quantity, 0);
    const averageItemPrice = totalQuantity > 0 
      ? currentState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) / totalQuantity
      : 0;
    
    return {
      sessionDurationMinutes: Math.round(sessionDurationMinutes * 100) / 100, // Round to 2 decimal places
      cartValuePerMinute: Math.round(cartValuePerMinute * 100) / 100,
      uniqueCategories,
      averageItemPrice: Math.round(averageItemPrice * 100) / 100,
      cartVersion: currentState.version,
      lastModified: currentState.lastUpdated
    };
  });

  // TODO: Implement Resource API for server synchronization
  // REQUIREMENTS:
  // 1. Create syncTrigger signal to control when sync happens
  // 2. Use resource() to create reactive data fetching
  // 3. Simulate API call with network delay
  // 4. Handle success and error states
  // 5. Include version and timestamp in sync data
  //
  // LEARNING: Resource API patterns
  // - Declarative data fetching
  // - Automatic loading states
  // - Error handling and retry logic
  // - Reactive dependencies
  //
  // SYNTAX HINT:
  // private syncTrigger = signal<number>(0);
  // public readonly cartSyncResource = resource({
  //   loader: async () => { ... }
  // });
  private syncTrigger = signal<number>(0);
  
  public readonly cartSyncResource = resource({
    // IMPLEMENTED: Resource API for server synchronization
    // LEARNING: Resource API provides declarative data fetching with automatic loading states
    // - Reactive dependencies on syncTrigger changes
    // - Built-in loading, error, and success states
    // - Automatic cleanup and cancellation
    // - Optimistic updates with rollback capability
    loader: async () => {
      // Get current sync trigger to make this reactive
      const trigger = this.syncTrigger();
      
      // Simulate network delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const cartState = this.cartState();
        
        // Simulate API call with cart data
        const syncData = {
          items: cartState.items,
          version: cartState.version,
          lastUpdated: cartState.lastUpdated.toISOString(),
          sessionId: this.generateId(),
          trigger: trigger
        };
        
        // Simulate server response
        // In real implementation, this would be: await this.http.post('/api/cart/sync', syncData).toPromise()
        console.log('Syncing cart data:', syncData);
        
        // Simulate occasional sync failures for error handling demonstration
        if (Math.random() < 0.1) {
          throw new Error('Sync failed: Server temporarily unavailable');
        }
        
        return {
          success: true,
          message: `Cart synced successfully (version ${cartState.version})`,
          serverVersion: cartState.version,
          syncedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('Cart sync failed:', error);
        return {
          success: false,
          message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          serverVersion: null,
          syncedAt: null
        };
      }
    }
  });

  // TODO: Implement dependency injection
  // LEARNING: Modern Angular injection
  // - Use inject() function instead of constructor parameters
  // - Better for functional programming patterns
  // - Easier testing and mocking
  // SYNTAX: private http = inject(HttpClient);
  private http = inject(HttpClient);

  constructor() {
    // TODO: Initialize service
    // REQUIREMENTS:
    // 1. Load cart from localStorage
    // 2. Set up reactive effects
    //
    // HINT: Call this.loadCartFromStorage() and this.setupEffects()
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // IMPLEMENTED: Advanced effects setup
  // REQUIREMENTS:
  // 1. Auto-save effect: Save cart when state changes
  // 2. History management effect: Track state changes for undo/redo
  // 3. Sync scheduling effect: Periodic server synchronization
  // 4. Analytics logging effect: Log cart changes for business intelligence
  //
  // LEARNING: Advanced effect patterns
  // - Multiple effects for different concerns
  // - Cleanup functions for intervals
  // - Conditional logic in effects
  // - Memory management
  //
  // SYNTAX HINTS:
  // effect(() => { this.saveCartToStorage(this.cartState()); });
  // effect(() => { 
  //   const interval = setInterval(...);
  //   return () => clearInterval(interval);
  // });
  private setupEffects(): void {
    // 1. Auto-save effect: Persist cart state to localStorage
    // LEARNING: Reactive persistence - automatically saves when state changes
    effect(() => {
      const state = this.cartState();
      this.saveCartToStorage(state);
    });
    
    // 2. History management effect: Track state changes for undo/redo
    // LEARNING: Maintains bounded history for memory efficiency
    effect(() => {
      const currentState = this.cartState();
      const history = this.cartHistory();
      
      // Only add to history if state actually changed (avoid duplicate entries)
      const lastHistoryState = history[history.length - 1];
      if (!lastHistoryState || lastHistoryState.version !== currentState.version) {
        const updatedHistory = [...history, { ...currentState }];
        
        // Maintain bounded history (keep only last N states for memory efficiency)
        if (updatedHistory.length > this.maxHistorySize) {
          updatedHistory.shift(); // Remove oldest state
        }
        
        this.cartHistory.set(updatedHistory);
      }
    });
    
    // 3. Sync scheduling effect: Periodic server synchronization
    // LEARNING: Cleanup functions prevent memory leaks
    effect(() => {
      // Sync every 30 seconds for demo purposes (in production, this might be longer)
      const interval = setInterval(() => {
        // Only sync if cart has items to avoid unnecessary API calls
        if (this.cartState().items.length > 0) {
          this.triggerSync();
        }
      }, 30000);
      
      // Cleanup function to prevent memory leaks
      return () => clearInterval(interval);
    });
    
    // 4. Analytics logging effect: Log cart changes for business intelligence
    // LEARNING: Conditional effects for performance optimization
    effect(() => {
      const state = this.cartState();
      const analytics = this.cartAnalytics();
      
      // Log significant cart changes for analytics
      if (state.items.length > 0) {
        console.log('Cart Analytics Update:', {
          version: state.version,
          itemCount: state.items.length,
          totalValue: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          sessionDuration: this.cartMetrics().sessionDurationMinutes,
          topCategories: analytics.topCategories.slice(0, 3), // Top 3 categories
          timestamp: new Date().toISOString()
        });
      }
    });
    
    console.log('Advanced effects initialized: auto-save, history tracking, sync scheduling, analytics logging');
  }

  // TODO: Implement enhanced cart operations
  // LEARNING: Advanced state management
  // - Versioned state updates
  // - Centralized state modification
  // - Automatic metadata updates
  // - History tracking

  // IMPLEMENTED: Enhanced addItem with configurable quantity
  // REQUIREMENTS:
  // 1. Support adding multiple quantities at once
  // 2. Handle existing items by updating quantity
  // 3. Create new items with proper CartItem structure
  // 4. Use centralized updateCartState method
  //
  // HINTS:
  // - Default parameter: quantity: number = 1
  // - Use findIndex for efficient lookup
  // - Delegate to updateCartState for consistency
  addItem(product: Product, quantity: number = 1): void {
    // LEARNING: Defensive programming - validate inputs
    if (quantity <= 0) {
      console.warn('Cannot add item with quantity <= 0');
      return;
    }
    
    const currentItems = [...this.cartState().items];
    
    // Efficient lookup using findIndex for O(n) performance
    const existingIndex = currentItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      // Update existing item quantity
      // LEARNING: Immutable updates - create new object instead of mutating
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + quantity
      };
    } else {
      // Create new cart item with proper structure
      // LEARNING: Complete object initialization with all required fields
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        category: product.category,
        discount: product.discount || 0
      };
      
      currentItems.push(newItem);
    }
    
    // Centralized state update ensures consistency
    this.updateCartState(currentItems);
  }

  // IMPLEMENTED: removeItem method
  // REQUIREMENTS:
  // 1. Filter out item by productId
  // 2. Use updateCartState for centralized updates
  removeItem(productId: string): void {
    // LEARNING: Functional programming approach using filter
    // Creates new array without mutation for better predictability
    const currentItems = this.cartState().items;
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    
    // Only update if item was actually removed (performance optimization)
    if (updatedItems.length !== currentItems.length) {
      this.updateCartState(updatedItems);
    } else {
      console.warn(`Item with productId ${productId} not found in cart`);
    }
  }

  // IMPLEMENTED: updateQuantity method
  // REQUIREMENTS:
  // 1. Handle edge case: quantity <= 0 (remove item)
  // 2. Update item quantity with map transformation
  // 3. Use updateCartState for centralized updates
  updateQuantity(productId: string, quantity: number): void {
    // LEARNING: Edge case handling for business logic
    if (quantity <= 0) {
      // Delegate to removeItem for consistency
      this.removeItem(productId);
      return;
    }
    
    const currentItems = this.cartState().items;
    
    // LEARNING: Functional transformation using map
    // Creates new array with updated item quantities
    const updatedItems = currentItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: quantity
        };
      }
      return item;
    });
    
    // Verify item exists before updating
    const itemExists = currentItems.some(item => item.productId === productId);
    if (!itemExists) {
      console.warn(`Item with productId ${productId} not found in cart`);
      return;
    }
    
    this.updateCartState(updatedItems);
  }

  // IMPLEMENTED: clearCart method
  // REQUIREMENTS:
  // 1. Clear all items by calling updateCartState with empty array
  clearCart(): void {
    // LEARNING: Simple but important - centralized state management
    // Even simple operations go through updateCartState for consistency
    this.updateCartState([]);
  }

  // TODO: Implement advanced operations
  // LEARNING: Enterprise cart features
  // - Item duplication
  // - Wishlist integration
  // - Bulk operations
  // - Cart optimization

  // IMPLEMENTED: duplicateItem method
  // REQUIREMENTS:
  // 1. Find item by productId
  // 2. Create duplicate with new ID and quantity 1
  // 3. Add to cart using updateCartState
  duplicateItem(productId: string): void {
    const currentItems = this.cartState().items;
    
    // Find the item to duplicate
    const itemToDuplicate = currentItems.find(item => item.productId === productId);
    
    if (!itemToDuplicate) {
      console.warn(`Item with productId ${productId} not found for duplication`);
      return;
    }
    
    // LEARNING: Object spread with selective property override
    // Create duplicate with new ID and reset quantity
    const duplicatedItem: CartItem = {
      ...itemToDuplicate,
      id: this.generateId(), // New unique ID
      quantity: 1 // Reset to quantity 1
    };
    
    // Add duplicate to cart
    const updatedItems = [...currentItems, duplicatedItem];
    this.updateCartState(updatedItems);
  }

  // IMPLEMENTED: applyBulkDiscount method
  // REQUIREMENTS:
  // 1. Apply discount to all items or specific category
  // 2. Use Math.max to ensure discount only increases
  // 3. Update all affected items with map transformation
  //
  // BUSINESS LOGIC:
  // - categoryOrAll === 'all': Apply to all items
  // - Otherwise: Apply only to items in specified category
  // - Discount can only increase, never decrease
  applyBulkDiscount(categoryOrAll: string, discountPercent: number): void {
    // LEARNING: Input validation for business operations
    if (discountPercent < 0 || discountPercent > 1) {
      console.warn('Discount percent must be between 0 and 1');
      return;
    }
    
    const currentItems = this.cartState().items;
    
    // LEARNING: Functional transformation with conditional logic
    const updatedItems = currentItems.map(item => {
      // Determine if item should receive discount
      const shouldApplyDiscount = categoryOrAll === 'all' || item.category === categoryOrAll;
      
      if (shouldApplyDiscount) {
        // LEARNING: Business rule enforcement - discount can only increase
        const currentDiscount = item.discount || 0;
        const newDiscount = Math.max(currentDiscount, discountPercent);
        
        return {
          ...item,
          discount: newDiscount
        };
      }
      
      return item;
    });
    
    // Count affected items for user feedback
    const affectedCount = updatedItems.filter((item, index) => 
      item.discount !== currentItems[index].discount
    ).length;
    
    if (affectedCount > 0) {
      console.log(`Applied ${discountPercent * 100}% discount to ${affectedCount} items`);
      this.updateCartState(updatedItems);
    } else {
      console.log('No items were affected by the bulk discount');
    }
  }

  // TODO: Implement history and undo operations
  // LEARNING: Undo/redo patterns with signals
  // - History management
  // - State restoration
  // - Time travel debugging

  // IMPLEMENTED: undoLastChange method
  // REQUIREMENTS:
  // 1. Check if history has previous states
  // 2. Restore previous state from history
  // 3. Use cartState.set() to restore state
  //
  // HINTS:
  // - Check history.length > 1
  // - Get previous state: history[history.length - 2]
  // - Restore with spread operator: { ...previousState }
  undoLastChange(): void {
    const history = this.cartHistory();
    
    // LEARNING: Defensive programming - check preconditions
    if (history.length <= 1) {
      console.warn('No previous state available for undo');
      return;
    }
    
    // Get the previous state (second to last in history)
    const previousState = history[history.length - 2];
    
    // LEARNING: Direct state restoration bypasses normal update flow
    // We use .set() instead of updateCartState to avoid creating new history entries
    this.cartState.set({
      ...previousState,
      // Increment version to maintain version consistency
      version: previousState.version + 1,
      lastUpdated: new Date()
    });
    
    // Remove the last state from history since we've undone it
    const updatedHistory = history.slice(0, -1);
    this.cartHistory.set(updatedHistory);
    
    console.log(`Undid last change, restored to version ${previousState.version}`);
  }

  // TODO: Implement export/import functionality
  // REQUIREMENTS:
  // 1. Export: Create JSON string with cart state, analytics, and metadata
  // 2. Import: Parse JSON and restore cart state with validation
  //
  // LEARNING: Data portability and serialization
  // - JSON serialization
  // - Data validation
  // - Error handling
  // - Metadata preservation

  exportCart(): string {
    // IMPLEMENTED: Cart export functionality
    // LEARNING: Data serialization for portability
    try {
      const currentState = this.cartState();
      const analytics = this.cartAnalytics();
      const metrics = this.cartMetrics();
      
      // Create comprehensive export data
      const exportData = {
        // Core cart data
        cartState: currentState,
        
        // Analytics and metrics for complete picture
        analytics: analytics,
        metrics: metrics,
        
        // Export metadata
        exportMetadata: {
          exportDate: new Date().toISOString(),
          exportVersion: '1.0',
          serviceVersion: 'AdvancedCartService',
          itemCount: currentState.items.length,
          totalValue: currentState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        
        // Session information
        sessionData: {
          sessionStartTime: this.sessionStartTime().toISOString(),
          sessionDurationMinutes: metrics.sessionDurationMinutes
        }
      };
      
      return JSON.stringify(exportData, null, 2); // Pretty-printed JSON
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  importCart(cartData: string): boolean {
    // IMPLEMENTED: Cart import with validation
    // LEARNING: Data validation and error handling for external data
    try {
      // Parse JSON data
      const importData = JSON.parse(cartData);
      
      // Validate data structure
      if (!importData.cartState || !Array.isArray(importData.cartState.items)) {
        throw new Error('Invalid cart data structure');
      }
      
      // Validate required fields in cart state
      const { cartState } = importData;
      if (typeof cartState.version !== 'number' || !cartState.lastUpdated) {
        throw new Error('Invalid cart state metadata');
      }
      
      // Validate individual items
      for (const item of cartState.items) {
        if (!item.id || !item.productId || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
          throw new Error('Invalid item data in cart');
        }
      }
      
      // Create validated cart state
      const validatedState: CartState = {
        items: cartState.items,
        lastUpdated: new Date(cartState.lastUpdated),
        version: cartState.version
      };
      
      // Import the cart state
      this.cartState.set(validatedState);
      
      // Reset session time if session data is available
      if (importData.sessionData?.sessionStartTime) {
        this.sessionStartTime.set(new Date(importData.sessionData.sessionStartTime));
      }
      
      console.log(`Successfully imported cart with ${validatedState.items.length} items`);
      return true;
      
    } catch (error) {
      console.error('Import failed:', error);
      
      // Don't modify state on import failure
      return false;
    }
  }

  // IMPLEMENTED: Centralized state update method
  // REQUIREMENTS:
  // 1. Update cart state with new items
  // 2. Increment version number
  // 3. Update lastUpdated timestamp
  // 4. Trigger all computed signals and effects
  //
  // LEARNING: Centralized state management
  // - Single point of truth for updates
  // - Automatic metadata management
  // - Consistent versioning
  // - Simplified debugging
  //
  // SYNTAX HINT:
  // this.cartState.set({
  //   items: newItems,
  //   lastUpdated: new Date(),
  //   version: currentState.version + 1
  // });
  private updateCartState(newItems: CartItem[]): void {
    // LEARNING: Centralized state management pattern
    // All state changes go through this method for consistency
    const currentState = this.cartState();
    
    // Create new state with automatic metadata updates
    const newState: CartState = {
      items: newItems,
      lastUpdated: new Date(),
      version: currentState.version + 1
    };
    
    // Update state - this will trigger all computed signals and effects
    this.cartState.set(newState);
    
    // Log state changes for debugging (in development)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('Cart state updated:', {
        version: newState.version,
        itemCount: newItems.length,
        totalValue: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });
    }
  }

  // TODO: Implement public API methods for advanced features
  // LEARNING: External service interface
  // - Clean API for components
  // - Encapsulated internal state
  // - Utility methods

  // IMPLEMENTED: getCartHistory method
  // REQUIREMENTS: Return read-only access to cart history
  getCartHistory() {
    // LEARNING: Defensive copying for read-only access
    // Return deep copy to prevent external modification
    return this.cartHistory().map(state => ({
      ...state,
      items: state.items.map(item => ({ ...item })),
      lastUpdated: new Date(state.lastUpdated)
    }));
  }

  // IMPLEMENTED: triggerSync method
  // REQUIREMENTS: Manually trigger cart synchronization
  // HINT: Update syncTrigger signal to trigger resource reload
  triggerSync(): void {
    // LEARNING: Signal-based resource triggering
    // Updating the syncTrigger signal will cause the resource to reload
    const currentTrigger = this.syncTrigger();
    this.syncTrigger.set(currentTrigger + 1);
    
    console.log('Manual sync triggered');
  }

  // IMPLEMENTED: resetSession method
  // REQUIREMENTS:
  // 1. Reset session start time to now
  // 2. Clear cart history
  resetSession(): void {
    // LEARNING: Session management for analytics reset
    this.sessionStartTime.set(new Date());
    this.cartHistory.set([]);
    
    console.log('Session reset - analytics and history cleared');
  }

  // IMPLEMENTED: Additional enterprise methods for component compatibility
  moveToWishlist(productId: string): void {
    // IMPLEMENTED: Wishlist functionality
    // LEARNING: Cross-service integration patterns
    const currentItems = this.cartState().items;
    const itemToMove = currentItems.find(item => item.productId === productId);
    
    if (!itemToMove) {
      console.warn(`Item with productId ${productId} not found in cart`);
      return;
    }
    
    // In a real implementation, this would integrate with a WishlistService
    // For now, we'll simulate the wishlist operation
    console.log('Moving item to wishlist:', {
      productId: itemToMove.productId,
      name: itemToMove.name,
      price: itemToMove.price,
      quantity: itemToMove.quantity
    });
    
    // Remove item from cart after moving to wishlist
    this.removeItem(productId);
    
    // In a real implementation:
    // this.wishlistService.addItem(itemToMove);
    // this.notificationService.showSuccess(`${itemToMove.name} moved to wishlist`);
  }

  optimizeCart(): void {
    // IMPLEMENTED: Cart optimization
    // LEARNING: Business logic for cart optimization
    const currentItems = this.cartState().items;
    
    if (currentItems.length === 0) {
      console.log('Cart is empty, no optimization needed');
      return;
    }
    
    // Optimization strategies:
    // 1. Consolidate duplicate products (same productId)
    // 2. Apply bulk discounts where applicable
    // 3. Remove items with zero quantity
    // 4. Sort items by category for better UX
    
    // Step 1: Consolidate duplicate products
    const consolidatedItems = new Map<string, CartItem>();
    
    currentItems.forEach(item => {
      const existing = consolidatedItems.get(item.productId);
      if (existing) {
        // Merge quantities and keep the better discount
        consolidatedItems.set(item.productId, {
          ...existing,
          quantity: existing.quantity + item.quantity,
          discount: Math.max(existing.discount || 0, item.discount || 0)
        });
      } else {
        consolidatedItems.set(item.productId, { ...item });
      }
    });
    
    // Step 2: Apply automatic bulk discounts
    const optimizedItems = Array.from(consolidatedItems.values())
      .filter(item => item.quantity > 0) // Remove zero quantity items
      .map(item => {
        // Apply bulk discount if quantity > 5 (more aggressive than manual bulk discount)
        if (item.quantity > 5) {
          const currentDiscount = item.discount || 0;
          const bulkDiscount = 0.20; // 20% discount for large quantities
          return {
            ...item,
            discount: Math.max(currentDiscount, bulkDiscount)
          };
        }
        return item;
      })
      // Step 3: Sort by category for better organization
      .sort((a, b) => a.category.localeCompare(b.category));
    
    // Calculate optimization results
    const originalCount = currentItems.length;
    const optimizedCount = optimizedItems.length;
    const itemsConsolidated = originalCount - optimizedCount;
    
    // Update cart with optimized items
    this.updateCartState(optimizedItems);
    
    console.log('Cart optimization completed:', {
      originalItems: originalCount,
      optimizedItems: optimizedCount,
      itemsConsolidated: itemsConsolidated,
      bulkDiscountsApplied: optimizedItems.filter(item => (item.discount || 0) >= 0.20).length
    });
  }

  restoreCartFromHistory(index: number): void {
    // IMPLEMENTED: History restoration
    // LEARNING: Time-travel debugging and state restoration
    const history = this.cartHistory();
    
    // Validate index
    if (index < 0 || index >= history.length) {
      console.warn(`Invalid history index: ${index}. Available range: 0-${history.length - 1}`);
      return;
    }
    
    const targetState = history[index];
    
    // Restore state from history
    // We use direct .set() to avoid creating new history entries
    this.cartState.set({
      ...targetState,
      // Update version and timestamp for current restoration
      version: targetState.version + 1,
      lastUpdated: new Date()
    });
    
    console.log(`Restored cart from history index ${index}, version ${targetState.version}`);
  }

  // Helper methods (already implemented for you)
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(state: CartState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('advanced-cart-state', JSON.stringify(state));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem('advanced-cart-state');
      if (savedState) {
        try {
          const state = JSON.parse(savedState) as CartState;
          
          // CRITICAL FIX: Convert lastUpdated string back to Date object
          // When JSON.parse() deserializes the state, Date objects become strings
          // We need to explicitly convert them back to Date instances
          const restoredState: CartState = {
            ...state,
            lastUpdated: new Date(state.lastUpdated), // Convert string to Date
            items: state.items || [] // Ensure items array exists
          };
          
          this.cartState.set(restoredState);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
          // Initialize with default state if loading fails
          this.cartState.set({
            items: [],
            lastUpdated: new Date(),
            version: 1
          });
        }
      }
    }
  }
}