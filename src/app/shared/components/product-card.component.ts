import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-card" [class.out-of-stock]="!product().inStock">
      <div class="product-image">
        <img [src]="product().image" [alt]="product().name" loading="lazy" />
        @if (product().discount) {
          <div class="discount-badge">
            -{{ product().discount }}%
          </div>
        }
        <div class="product-overlay">
          <button 
            class="btn btn-primary btn-small"
            [disabled]="!product().inStock"
            (click)="onQuickAdd()"
          >
            Quick Add
          </button>
        </div>
      </div>
      
      <div class="product-content">
        <div class="product-header">
          <h3>{{ product().name }}</h3>
          <div class="product-rating">
            <span class="stars">{{ getStarRating() }}</span>
            <span class="rating-value">{{ product().rating }}</span>
          </div>
        </div>
        
        <p class="product-description">{{ product().description }}</p>
        
        @if (product().tags && product().tags?.length) {
          <div class="product-tags">
            @for (tag of product().tags?.slice(0, 3) || []; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        }
        
        <div class="product-footer">
          <div class="product-price">
            @if (product().discount) {
              <span class="original-price">
                \${{ product().price.toFixed(2) }}
              </span>
            }
            <span class="current-price">
              \${{ getFinalPrice().toFixed(2) }}
            </span>
          </div>
          
          <div class="product-actions">
            <button 
              class="btn btn-outline btn-small"
              (click)="onAddToWishlist()"
              [class.active]="isInWishlist()"
              title="Add to Wishlist"
            >
              ♡
            </button>
            <button 
              class="btn btn-primary"
              [disabled]="!product().inStock"
              (click)="onAddToCart()"
            >
              {{ product().inStock ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  // Modern input/output functions
  product = input.required<Product>();
  isInWishlist = input<boolean>(false);
  showQuickActions = input<boolean>(true);
  
  addToCart = output<Product>();
  addToWishlist = output<string>();
  productClick = output<Product>();

  onAddToCart(): void {
    if (this.product().inStock) {
      this.addToCart.emit(this.product());
    }
  }

  onQuickAdd(): void {
    if (this.product().inStock) {
      this.addToCart.emit(this.product());
    }
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product().id);
  }

  onProductClick(): void {
    this.productClick.emit(this.product());
  }

  getFinalPrice(): number {
    const discount = this.product().discount;
    if (discount) {
      return this.product().price * (1 - discount / 100);
    }
    return this.product().price;
  }

  getStarRating(): string {
    const rating = Math.round(this.product().rating);
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}