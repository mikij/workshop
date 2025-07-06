import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartRxjsService {
  // TODO: Create a private BehaviorSubject to hold cart items
  // HINT: Use BehaviorSubject<CartItem[]> and initialize with empty array
  // LEARNING: BehaviorSubject is perfect for state management because:
  // - It holds the current state (last emitted value)
  // - New subscribers immediately get the current state
  // - It's a special type of Subject that requires an initial value
  // SYNTAX: private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // TODO: Create a public observable that components can subscribe to
  // HINT: Use asObservable() to expose the subject as an observable
  // LEARNING: This pattern hides the Subject's next() method from consumers
  // Components can only read the stream, not modify it directly
  // SYNTAX: public items$ = this.itemsSubject.asObservable();
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // TODO: Load items from localStorage if available
    // HINT: Call loadCartFromStorage() method
    // LEARNING: Initialize cart state when service is created
    this.loadCartFromStorage();
  }

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // 1. Check if item already exists in cart (by productId)
  // 2. If exists: increase quantity by 1 using updateQuantity()
  // 3. If not exists: create new CartItem and add to cart
  // 4. Save to localStorage after changes
  // 
  // BUSINESS LOGIC:
  // - Each product can only appear once in cart (different quantities)
  // - New items start with quantity = 1
  // - Use immutable patterns (don't mutate existing arrays)
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Find existing: currentItems.find(item => item.productId === product.id)
  // - Create new CartItem with: id, productId, name, price, quantity, image, category, discount
  // - Update BehaviorSubject: this.itemsSubject.next(newArray)
  // - Generate ID: this.generateId()
  addItem(product: Product): void {
    // Get current cart state - BehaviorSubject.value gives us the latest state
    const currentItems = this.itemsSubject.value;
    
    // Check if product already exists in cart (by productId)
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Item exists - increase quantity by 1 using our updateQuantity method
      // This delegates to existing logic and maintains consistency
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Item doesn't exist - create new CartItem with quantity 1
      const newItem: CartItem = {
        id: this.generateId(), // Generate unique ID for this cart item
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // New items always start with quantity 1
        image: product.image,
        category: product.category,
        discount: product.discount || 0 // Default to 0 if no discount
      };
      
      // Create new array with existing items plus new item (immutable pattern)
      // Using spread operator ensures we don't mutate the existing array
      const updatedItems = [...currentItems, newItem];
      
      // Update the BehaviorSubject with new state
      // This triggers all subscribers (components) to update
      this.itemsSubject.next(updatedItems);
      
      // Persist changes to localStorage for cart recovery
      this.saveCartToStorage();
    }
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // 1. Remove item by productId from cart
  // 2. Update the BehaviorSubject with filtered array
  // 3. Save to localStorage
  //
  // HINTS:
  // - Get current items: this.itemsSubject.value
  // - Filter out target: currentItems.filter(item => item.productId !== productId)
  // - Update subject: this.itemsSubject.next(filteredItems)
  // - Save: this.saveCartToStorage()
  removeItem(productId: string): void {
    // Get current cart state
    const currentItems = this.itemsSubject.value;
    
    // Filter out the item with matching productId (immutable pattern)
    // This creates a new array without the target item
    const filteredItems = currentItems.filter(item => item.productId !== productId);
    
    // Update BehaviorSubject with filtered array
    // This automatically notifies all subscribers about the change
    this.itemsSubject.next(filteredItems);
    
    // Persist the updated cart to localStorage
    this.saveCartToStorage();
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // 1. If quantity <= 0, remove the item entirely
  // 2. Otherwise, update the item's quantity
  // 3. Save to localStorage
  //
  // EDGE CASES:
  // - Handle quantity 0 or negative (remove item)
  // - Update only the matching item, keep others unchanged
  //
  // HINTS:
  // - Check if quantity <= 0, then call this.removeItem(productId)
  // - Use map() to transform array: items.map(item => condition ? updatedItem : item)
  // - Use spread operator for immutable updates: { ...item, quantity }
  updateQuantity(productId: string, quantity: number): void {
    // Handle edge case: quantity <= 0 means remove the item
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    // Get current cart state
    const currentItems = this.itemsSubject.value;
    
    // Update only the matching item using map (immutable pattern)
    // Map creates a new array with transformed items
    const updatedItems = currentItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity } // Spread operator creates new object with updated quantity
        : item // Keep other items unchanged
    );
    
    // Update BehaviorSubject with new array
    this.itemsSubject.next(updatedItems);
    
    // Persist changes to localStorage
    this.saveCartToStorage();
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // 1. Set items to empty array
  // 2. Save to localStorage
  //
  // HINTS:
  // - Use this.itemsSubject.next([])
  // - Call this.saveCartToStorage()
  clearCart(): void {
    // Set cart to empty array - this triggers all reactive streams
    this.itemsSubject.next([]);
    
    // Clear localStorage as well
    this.saveCartToStorage();
  }

  // TODO: Implement getCartSummary method that returns Observable<CartSummary>
  // REQUIREMENTS:
  // 1. Calculate totalItems (sum of all quantities)
  // 2. Calculate totalPrice (sum of price * quantity for each item)
  // 3. Calculate totalDiscount (sum of discount amounts)
  // 4. Calculate tax (8% of subtotal after discounts)
  // 5. Calculate finalPrice (totalPrice - totalDiscount + tax)
  //
  // RXJS PATTERNS:
  // - Use this.items$.pipe(map(items => { ... }))
  // - Transform the items array into a CartSummary object
  // - This creates a reactive stream that updates when cart changes
  //
  // BUSINESS LOGIC:
  // - totalItems: sum of all item quantities
  // - totalPrice: sum of (price × quantity) for each item
  // - totalDiscount: sum of (price × quantity × discount%) for each item
  // - tax: 8% of (totalPrice - totalDiscount)
  // - finalPrice: totalPrice - totalDiscount + tax
  //
  // HINTS:
  // - Use reduce() for calculations: items.reduce((sum, item) => sum + value, 0)
  // - Discount calculation: (item.price * item.quantity * (item.discount || 0) / 100)
  // - Return CartSummary object with all calculated properties
  getCartSummary(): Observable<CartSummary> {
    // Return reactive stream that recalculates whenever items change
    // This is the power of RxJS - automatic updates when source data changes
    return this.items$.pipe(
      map(items => {
        // Calculate total items (sum of all quantities)
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Calculate total price (sum of price × quantity for each item)
        const totalPrice = items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        
        // Calculate total discount (sum of discount amounts)
        const totalDiscount = items.reduce((sum, item) => {
          const discount = item.discount || 0; // Default to 0 if no discount
          return sum + (item.price * item.quantity * discount / 100);
        }, 0);
        
        // Calculate tax (8% of subtotal after discounts)
        const tax = (totalPrice - totalDiscount) * 0.08;
        
        // Calculate final price (subtotal + tax)
        const finalPrice = totalPrice - totalDiscount + tax;
        
        // Return CartSummary object with all calculated values
        return {
          totalItems,
          totalPrice,
          totalDiscount,
          tax,
          finalPrice
        };
      })
    );
  }

  // TODO: Implement getTotalItems method
  // REQUIREMENTS:
  // 1. Return Observable<number> of total items count
  // 2. Use items$ observable and map to total quantity
  //
  // HINTS:
  // - Use this.items$.pipe(map(items => ...))
  // - Sum quantities: items.reduce((sum, item) => sum + item.quantity, 0)
  getTotalItems(): Observable<number> {
    // Return reactive stream of total item count
    // This automatically updates when cart items change
    return this.items$.pipe(
      map(items => {
        // Sum all quantities in the cart
        return items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );
  }

  // Helper methods (already implemented for you)
  // These handle utility functions like ID generation and localStorage
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items', JSON.stringify(this.itemsSubject.value));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems) as CartItem[];
          this.itemsSubject.next(items);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}