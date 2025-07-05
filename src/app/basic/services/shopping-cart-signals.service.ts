import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartSignalsService {
  
  private items = signal<CartItem[]>([]);
  
  public readonly cartItems = this.items.asReadonly();
  
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

  public readonly totalItems = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  public readonly isEmpty = computed(() => {
    return this.items().length === 0;
  });

  constructor() {
    this.loadCartFromStorage();
    
    effect(() => {
      this.saveCartToStorage();
    });
  }

  addItem(product: Product): void {
    const currentItems = this.items();
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
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
      
      this.items.update(items => [...items, newItem]);
    }
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  getItemQuantity(productId: string): number {
    const item = this.items().find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  hasItem(productId: string): boolean {
    return this.items().some(item => item.productId === productId);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart-items-signals', JSON.stringify(this.items()));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items-signals');
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