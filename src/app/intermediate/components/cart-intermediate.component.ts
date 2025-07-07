import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComputedService } from '../services/cart-computed.service';
import { CartEffectsService } from '../services/cart-effects.service';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-intermediate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-intermediate.component.html',
  styleUrls: ['./cart-intermediate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIntermediateComponent implements OnInit {
  // Inject services using modern approach
  public cartService = inject(CartComputedService);
  public effectsService = inject(CartEffectsService);
  private productService = inject(ProductService);
  
  products$: Observable<Product[]>;
  
  constructor() {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    console.log('Cart Intermediate Component initialized');
  }

  // Cart operations - Use single source of truth (main cart service)
  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
    // Also add to recently viewed via effects service
    this.effectsService.addToRecentlyViewed(product);
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
    this.onUpdateQuantity(productId, currentQuantity + 1);
  }

  decrementQuantity(productId: string, currentQuantity: number): void {
    this.onUpdateQuantity(productId, currentQuantity - 1);
  }

  // Filter and sort operations
  onCategoryChange(category: string): void {
    this.cartService.setCategory(category);
  }

  onSearchChange(query: string): void {
    this.cartService.setSearchQuery(query);
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.cartService.setSortOrder(order);
  }

  // Wishlist operations
  onAddToWishlist(productId: string): void {
    this.effectsService.addToWishlist(productId);
  }

  onRemoveFromWishlist(productId: string): void {
    this.effectsService.removeFromWishlist(productId);
  }

  isInWishlist(productId: string): boolean {
    return this.effectsService.isInWishlist(productId);
  }

  // History operations
  onRestorePreviousCart(): void {
    this.effectsService.restorePreviousCart();
  }

  canRestorePreviousCart(): boolean {
    return this.effectsService.getPreviousCartState() !== null;
  }

  // View operations
  onViewProduct(product: Product): void {
    this.effectsService.addToRecentlyViewed(product);
  }

  // Utility methods
  getUniqueCategories(): string[] {
    return ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];
  }

  trackByProductId(index: number, item: any): string {
    return item.productId || item.id;
  }
}