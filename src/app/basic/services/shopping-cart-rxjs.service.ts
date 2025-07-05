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
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // TODO: Create a public observable that components can subscribe to
  // HINT: Use asObservable() to expose the subject as an observable
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // TODO: Load items from localStorage if available
    // HINT: Call loadCartFromStorage() method
    this.loadCartFromStorage();
  }

  // TODO: Implement addItem method
  // REQUIREMENTS:
  // - Check if item already exists in cart
  // - If exists: increase quantity by 1
  // - If not exists: add new item with quantity 1
  // - Save to localStorage after changes
  addItem(product: Product): void {
    // TODO: Get current items from the BehaviorSubject
    const currentItems = this.itemsSubject.value;
    
    // TODO: Check if item already exists by productId
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // TODO: If item exists, increase quantity
      // HINT: Use updateQuantity method with existingItem.quantity + 1
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // TODO: If item doesn't exist, create new CartItem
      // HINT: Create object with id, productId, name, price, quantity, image, category, discount
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
      
      // TODO: Add new item to cart and save
      // HINT: Use spread operator to create new array with existing items + new item
      this.itemsSubject.next([...currentItems, newItem]);
      this.saveCartToStorage();
    }
  }

  // TODO: Implement removeItem method
  // REQUIREMENTS:
  // - Remove item by productId
  // - Update the BehaviorSubject with filtered array
  // - Save to localStorage
  removeItem(productId: string): void {
    // TODO: Get current items
    const currentItems = this.itemsSubject.value;
    
    // TODO: Filter out the item with matching productId
    // HINT: Use filter() method to keep items that don't match the productId
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    
    // TODO: Update the BehaviorSubject and save
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // TODO: Implement updateQuantity method
  // REQUIREMENTS:
  // - If quantity <= 0, remove the item
  // - Otherwise, update the item's quantity
  // - Save to localStorage
  updateQuantity(productId: string, quantity: number): void {
    // TODO: Handle edge case - if quantity is 0 or negative, remove item
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    // TODO: Get current items
    const currentItems = this.itemsSubject.value;
    
    // TODO: Update quantity of specific item
    // HINT: Use map() to transform the array, updating only the matching item
    const updatedItems = currentItems.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );
    
    // TODO: Update the BehaviorSubject and save
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // TODO: Implement clearCart method
  // REQUIREMENTS:
  // - Set items to empty array
  // - Save to localStorage
  clearCart(): void {
    // TODO: Clear all items from cart
    // HINT: Set the BehaviorSubject to empty array
    this.itemsSubject.next([]);
    this.saveCartToStorage();
  }

  // TODO: Implement getCartSummary method that returns Observable<CartSummary>
  // REQUIREMENTS:
  // - Calculate totalItems (sum of all quantities)
  // - Calculate totalPrice (sum of price * quantity for each item)
  // - Calculate totalDiscount (sum of discount amounts)
  // - Calculate tax (8% of subtotal after discounts)
  // - Calculate finalPrice (totalPrice - totalDiscount + tax)
  getCartSummary(): Observable<CartSummary> {
    return this.items$.pipe(
      map(items => {
        // TODO: Calculate total items count
        // HINT: Use reduce() to sum up all item quantities
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // TODO: Calculate total price before discounts
        // HINT: Use reduce() to sum up (price * quantity) for each item
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // TODO: Calculate total discount amount
        // HINT: For each item, calculate (price * quantity * discount%) and sum them
        const totalDiscount = items.reduce((sum, item) => {
          const discount = item.discount || 0;
          return sum + (item.price * item.quantity * discount / 100);
        }, 0);
        
        // TODO: Calculate tax (8% of subtotal after discounts)
        const tax = (totalPrice - totalDiscount) * 0.08;
        
        // TODO: Calculate final price
        const finalPrice = totalPrice - totalDiscount + tax;

        // TODO: Return CartSummary object
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
  // - Return Observable<number> of total items count
  // - Use items$ observable and map to total quantity
  getTotalItems(): Observable<number> {
    return this.items$.pipe(
      // TODO: Transform items array to total count
      // HINT: Use map() and reduce() to sum all quantities
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  // Helper methods (already implemented for you)
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