import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCartRxjsService } from '../services/shopping-cart-rxjs.service';
import { ProductService } from '../../shared/services/product.service';
import { CartItem, CartSummary, Product } from '../../shared/models';

@Component({
  selector: 'app-cart-basic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-basic.component.html',
  styleUrls: ['./cart-basic.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartBasicComponent implements OnInit, OnDestroy {
  cartItems$: Observable<CartItem[]>;
  cartSummary$: Observable<CartSummary>;
  totalItems$: Observable<number>;
  products$: Observable<Product[]>;

  private subscription = new Subscription();

  // Inject services using modern approach
  private cartService = inject(ShoppingCartRxjsService);
  private productService = inject(ProductService);

  constructor() {
    this.cartItems$ = this.cartService.items$;
    this.cartSummary$ = this.cartService.getCartSummary();
    this.totalItems$ = this.cartService.getTotalItems();
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    console.log('Cart Basic Component initialized');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  onRemoveFromCart(productId: string): void {
    this.cartService.removeItem(productId);
  }

  onUpdateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  incrementQuantity(productId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decrementQuantity(productId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  trackByProductId(index: number, item: Product): string {
    return item.id;
  }

  trackByCartItemId(index: number, item: CartItem): string {
    return item.productId;
  }
}
