import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartComputedService {
  
  // TODO: Create private writable signals for cart state
  // HINT: Use signal<CartItem[]>([]) for items
  // HINT: Use signal<string>('all') for selectedCategory
  // HINT: Use signal<string>('') for searchQuery
  // HINT: Use signal<'asc' | 'desc'>('asc') for sortOrder
  // LEARNING: Signals are the new reactive primitive in Angular
  // - They automatically track dependencies
  // - Components can read them directly in templates
  // - Updates are fine-grained and efficient
  private items = signal<CartItem[]>([]);
  private selectedCategory = signal<string>('all');
  private searchQuery = signal<string>('');
  private sortOrder = signal<'asc' | 'desc'>('asc');

  // TODO: Create readonly signals for external access
  // HINT: Use asReadonly() to expose signals that cannot be modified from outside
  // LEARNING: This protects your internal state while allowing components to read values
  // SYNTAX: public readonly cartItems = this.items.asReadonly();
  // SYNTAX: public readonly currentCategory = this.selectedCategory.asReadonly();
  // SYNTAX: public readonly currentSearch = this.searchQuery.asReadonly();
  // SYNTAX: public readonly currentSort = this.sortOrder.asReadonly();
  public readonly cartItems = this.items.asReadonly();
  public readonly currentCategory = this.selectedCategory.asReadonly();
  public readonly currentSearch = this.searchQuery.asReadonly();
  public readonly currentSort = this.sortOrder.asReadonly();

  // TODO: Implement computed for cart summary with advanced calculations
  // REQUIREMENTS:
  // 1. Calculate totalItems (sum of all quantities)
  // 2. Calculate totalPrice (sum of price * quantity for each item)
  // 3. Calculate totalDiscount (sum of discount amounts)
  // 4. Calculate progressive tax based on subtotal:
  //    - Orders over $1000: 12% tax
  //    - Orders over $500: 10% tax
  //    - Orders under $500: 8% tax
  // 5. Calculate finalPrice (subtotal + tax)
  //
  // LEARNING: computed() creates derived state that automatically updates
  // - Dependencies are tracked automatically
  // - Only recalculates when dependencies change
  // - Memoized for performance
  //
  // SYNTAX HINT:
  // public readonly cartSummary = computed<CartSummary>(() => {
  //   const items = this.items();
  //   // ... calculations
  //   return { totalItems, totalPrice, totalDiscount, tax, finalPrice };
  // });
  public readonly cartSummary = computed<CartSummary>(() => {
    // Get current items from signal - this creates a dependency
    const items = this.items();
    
    // Calculate total items (sum of all quantities)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate total price (sum of price × quantity for each item)
    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Calculate total discount (sum of discount amounts)
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    
    // Calculate progressive tax based on subtotal
    const subtotal = totalPrice - totalDiscount;
    let tax: number;
    
    if (subtotal > 1000) {
      tax = subtotal * 0.12; // 12% for orders over $1000
    } else if (subtotal > 500) {
      tax = subtotal * 0.10; // 10% for orders over $500
    } else {
      tax = subtotal * 0.08; // 8% for orders under $500
    }
    
    // Calculate final price
    const finalPrice = subtotal + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });

  // TODO: Implement computed for filtered and sorted items
  // REQUIREMENTS:
  // 1. Filter by selected category (if not 'all')
  // 2. Filter by search query (name or category contains search text)
  // 3. Sort by total value (price * quantity) in ascending or descending order
  //
  // LEARNING: Multi-dependency computed signals
  // - This computed depends on items, selectedCategory, searchQuery, and sortOrder
  // - Automatically updates when ANY dependency changes
  // - Efficient - only recalculates when needed
  //
  // HINTS:
  // - Get values: this.items(), this.selectedCategory(), this.searchQuery(), this.sortOrder()
  // - Filter by category: items.filter(item => item.category === category)
  // - Filter by search: items.filter(item => item.name.toLowerCase().includes(search))
  // - Sort by value: items.sort((a, b) => compare aValue and bValue)
  public readonly filteredItems = computed(() => {
    // Get all dependencies - computed automatically tracks these
    const items = this.items();
    const category = this.selectedCategory();
    const search = this.searchQuery().toLowerCase();
    const sortOrder = this.sortOrder();
    
    // Start with all items
    let filtered = items;
    
    // Filter by category if not 'all'
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    // Filter by search query (name or category)
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) || 
        item.category.toLowerCase().includes(search)
      );
    }
    
    // Sort by total value (price × quantity)
    const sorted = filtered.sort((a, b) => {
      const aValue = a.price * a.quantity;
      const bValue = b.price * b.quantity;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted;
  });

  // TODO: Implement computed for category statistics
  // REQUIREMENTS:
  // 1. Group items by category
  // 2. Calculate count and total value per category
  // 3. Return array of { category, itemCount, totalValue }
  //
  // LEARNING: Advanced data processing with computed
  // - Use Map for efficient grouping
  // - Transform to array for easier consumption
  // - Provides real-time analytics
  //
  // HINTS:
  // - Use Map<string, { count: number; total: number }>() for grouping
  // - Iterate with items.forEach()
  // - Convert to array: Array.from(stats.entries()).map(...)
  public readonly categoryStats = computed(() => {
    const items = this.items();
    
    // Use Map for efficient grouping
    const stats = new Map<string, { count: number; total: number }>();
    
    // Group items by category and calculate stats
    items.forEach(item => {
      const existing = stats.get(item.category) || { count: 0, total: 0 };
      stats.set(item.category, {
        count: existing.count + item.quantity,
        total: existing.total + (item.price * item.quantity)
      });
    });
    
    // Convert Map to array and return sorted by total value
    return Array.from(stats.entries())
      .map(([category, data]) => ({
        category,
        itemCount: data.count,
        totalValue: data.total
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  });

  // TODO: Implement computed for discount information
  // REQUIREMENTS:
  // 1. Check if cart has any discounted items
  // 2. Count number of discounted items
  // 3. Calculate total savings
  // 4. Calculate average discount percentage
  //
  // LEARNING: Computed can depend on other computed signals
  // - This computed uses this.cartSummary().totalDiscount
  // - Creates a chain of reactive dependencies
  //
  // HINTS:
  // - Filter discounted items: items.filter(item => item.discount && item.discount > 0)
  // - Use this.cartSummary().totalDiscount for total savings
  // - Calculate average: sum of discounts / number of discounted items
  public readonly discountInfo = computed(() => {
    const items = this.items();
    const summary = this.cartSummary(); // Depend on other computed signal
    
    // Filter items that have discounts
    const discountedItems = items.filter(item => item.discount && item.discount > 0);
    
    // Calculate average discount percentage
    const averageDiscount = discountedItems.length > 0
      ? discountedItems.reduce((sum, item) => sum + (item.discount || 0), 0) / discountedItems.length
      : 0;
    
    return {
      hasDiscounts: discountedItems.length > 0,
      discountedItemsCount: discountedItems.length,
      totalSavings: summary.totalDiscount, // Use computed summary
      averageDiscount
    };
  });

  // TODO: Implement computed for shipping information
  // REQUIREMENTS:
  // 1. Free shipping threshold: $500
  // 2. Standard shipping cost: $15
  // 3. Calculate if eligible for free shipping
  // 4. Calculate amount needed for free shipping
  // 5. Estimate delivery time (2-3 days free, 5-7 days standard)
  //
  // BUSINESS LOGIC:
  // - Free shipping: finalPrice >= $500
  // - Shipping cost: $0 if free, $15 if standard
  // - Amount for free shipping: Math.max(0, $500 - finalPrice)
  public readonly shippingInfo = computed(() => {
    const summary = this.cartSummary();
    const freeShippingThreshold = 500;
    
    // Determine if eligible for free shipping
    const isEligible = summary.finalPrice >= freeShippingThreshold;
    
    // Calculate amount needed for free shipping
    const amountForFreeShipping = Math.max(0, freeShippingThreshold - summary.finalPrice);
    
    return {
      isEligibleForFreeShipping: isEligible,
      isFreeShipping: isEligible, // Template compatibility
      shippingCost: isEligible ? 0 : 15,
      amountForFreeShipping,
      estimatedDelivery: isEligible ? '2-3 business days' : '5-7 business days'
    };
  });

  // TODO: Implement computed for recommendations
  // REQUIREMENTS:
  // 1. Get unique categories from current cart
  // 2. Recommend categories not in cart (from: electronics, clothing, books)
  // 3. Calculate total unique items and average item price
  //
  // LEARNING: Advanced array operations in computed
  // - Use Set for unique values: [...new Set(items.map(...))]
  // - Filter for recommendations: categories.filter(cat => !inCart.includes(cat))
  public readonly recommendations = computed(() => {
    const items = this.items();
    
    // Available categories for recommendations
    const allCategories = ['electronics', 'clothing', 'books', 'home', 'sports'];
    
    // Get unique categories currently in cart
    const categoriesInCart = [...new Set(items.map(item => item.category))];
    
    // Suggest categories not in cart
    const suggestedCategories = allCategories.filter(cat => !categoriesInCart.includes(cat));
    
    // Calculate total unique items
    const totalUniqueItems = items.length;
    
    // Calculate average item price
    const averageItemPrice = items.length > 0
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length
      : 0;
    
    return {
      suggestedCategories,
      totalUniqueItems,
      averageItemPrice
    };
  });

  constructor() {
    // TODO: Load cart from localStorage
    // HINT: Call loadCartFromStorage() method
    this.loadCartFromStorage();

    // TODO: Effect for auto-saving cart
    // REQUIREMENTS:
    // 1. Create effect that runs when items() signal changes
    // 2. Call saveCartToStorage() to persist changes
    //
    // LEARNING: Effects handle side effects
    // - Automatically run when dependencies change
    // - Perfect for persistence, logging, analytics
    // - No manual subscription management needed
    //
    // SYNTAX HINT:
    // effect(() => {
    //   this.saveCartToStorage();
    // });
    effect(() => {
      this.saveCartToStorage();
    });

    // TODO: Effect for logging cart changes
    // REQUIREMENTS:
    // 1. Create effect that logs cart analytics when cart changes
    // 2. Only log when cart has items (avoid empty cart noise)
    // 3. Log: total items, final price, number of categories
    //
    // LEARNING: Conditional effects
    // - Use if statements inside effects
    // - Can depend on multiple computed signals
    // - Automatically batched for efficiency
    //
    // SYNTAX HINT:
    // effect(() => {
    //   const summary = this.cartSummary();
    //   if (summary.totalItems > 0) {
    //     console.log('Cart updated:', { ... });
    //   }
    // });
    effect(() => {
      const summary = this.cartSummary();
      const categoryStats = this.categoryStats();
      
      if (summary.totalItems > 0) {
        console.log('Cart Analytics:', {
          totalItems: summary.totalItems,
          finalPrice: summary.finalPrice,
          numberOfCategories: categoryStats.length,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  // TODO: Implement basic cart operations using signals
  // LEARNING: Signal updates vs RxJS
  // - RxJS: this.itemsSubject.next(newValue)
  // - Signals: this.items.set(newValue) or this.items.update(fn)
  // - Signals: Automatic computed recalculation
  // - Signals: Automatic effect execution

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item exists by productId
  // 2. If exists: use updateQuantity to increase by 1
  // 3. If new: create CartItem and use this.items.update() to add it
  //
  // HINTS:
  // - Get current items: this.items()
  // - Find existing: items.find(item => item.productId === product.id)
  // - Update signal: this.items.update(items => [...items, newItem])
  addItem(product: Product): void {
    // Get current items from signal
    const currentItems = this.items();
    
    // Check if product already exists in cart
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Item exists - increase quantity by 1
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Item doesn't exist - create new CartItem
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        discount: product.discount || 0
      };
      
      // Add new item using signal update
      // The update function receives current items and returns new array
      this.items.update(items => [...items, newItem]);
    }
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by productId using filter
  // 2. Update the items signal
  //
  // HINTS:
  // - Use this.items.update() with filter
  // - Filter: items => items.filter(item => item.productId !== productId)
  removeItem(productId: string): void {
    // Update signal by filtering out the target item
    this.items.update(items => 
      items.filter(item => item.productId !== productId)
    );
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. If quantity <= 0, remove the item
  // 2. Otherwise, update the item's quantity using map
  //
  // HINTS:
  // - Check quantity <= 0, call this.removeItem(productId)
  // - Use this.items.update() with map
  // - Map: items => items.map(item => condition ? {...item, quantity} : item)
  updateQuantity(productId: string, quantity: number): void {
    // Handle edge case: quantity <= 0 means remove item
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    // Update signal using map to transform the matching item
    this.items.update(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity } // Update quantity for matching item
          : item // Keep other items unchanged
      )
    );
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Set items to empty array
  //
  // HINTS:
  // - Use this.items.set([])
  clearCart(): void {
    // Set signal to empty array - this triggers all computed signals and effects
    this.items.set([]);
  }

  // TODO: Implement filter and sort methods
  // LEARNING: Signal setters
  // - Use .set() to completely replace signal value
  // - These methods update filter/sort signals
  // - filteredItems computed automatically recalculates

  // TODO: Implement setCategory method
  // REQUIREMENTS: Set the selectedCategory signal
  // HINT: this.selectedCategory.set(category)
  setCategory(category: string): void {
    // Update category filter signal - this automatically updates filteredItems computed
    this.selectedCategory.set(category);
  }

  // TODO: Implement setSearchQuery method
  // REQUIREMENTS: Set the searchQuery signal
  // HINT: this.searchQuery.set(query)
  setSearchQuery(query: string): void {
    // Update search filter signal - this automatically updates filteredItems computed
    this.searchQuery.set(query);
  }

  // TODO: Implement setSortOrder method
  // REQUIREMENTS: Set the sortOrder signal
  // HINT: this.sortOrder.set(order)
  setSortOrder(order: 'asc' | 'desc'): void {
    // Update sort order signal - this automatically updates filteredItems computed
    this.sortOrder.set(order);
  }

  // Helper methods (already implemented for you)
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items-computed', JSON.stringify(this.items()));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items-computed');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.items.set(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}