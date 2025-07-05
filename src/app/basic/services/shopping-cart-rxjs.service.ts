import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartRxjsService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    // TODO: Load items from localStorage if available
    this.loadCartFromStorage();
  }

  // TODO: Implement addItem method
  // HINT: Check if item already exists, if yes - increase quantity, if no - add new item
  addItem(product: Product): void {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // TODO: Increase quantity of existing item
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // TODO: Add new item to cart
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
      
      this.itemsSubject.next([...currentItems, newItem]);
      this.saveCartToStorage();
    }
  }

  // TODO: Implement removeItem method
  removeItem(productId: string): void {
    const currentItems = this.itemsSubject.value;
    // TODO: Filter out the item with matching productId
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // TODO: Implement updateQuantity method
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.itemsSubject.value;
    // TODO: Update quantity of specific item
    const updatedItems = currentItems.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );
    
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // TODO: Implement clearCart method
  clearCart(): void {
    // TODO: Clear all items from cart
    this.itemsSubject.next([]);
    this.saveCartToStorage();
  }

  // TODO: Implement getCartSummary method that returns Observable<CartSummary>
  getCartSummary(): Observable<CartSummary> {
    return this.items$.pipe(
      map(items => {
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
      })
    );
  }

  // TODO: Implement getTotalItems method
  getTotalItems(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  // Helper methods
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