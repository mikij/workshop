import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartNgrxSignalsService } from '../services/cart-ngrx-signals.service';
import { CartStoreWithFeaturesService } from '../services/cart-store-with-features.service';
import { ProductCardComponent } from '../../shared/components';
import { Product } from '../../shared/models';
import {patchState} from '@ngrx/signals';
import {addEntity} from '@ngrx/signals/entities';

// Define category type based on actual product categories
type CategoryType = 'electronics' | 'clothing' | 'books' | 'home' | 'sports';

@Component({
  selector: 'app-cart-ngrx-signals',
  templateUrl: './cart-ngrx-signals.component.html',
  styleUrls: ['./cart-ngrx-signals.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent
  ]
})
export class CartNgrxSignalsComponent {
  protected readonly cartStore = inject(CartNgrxSignalsService);
  protected readonly featuresStore = inject(CartStoreWithFeaturesService);

  // Product data
  categories: (CategoryType | 'all')[] = ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];

  // UI state
  activeTab: 'products' | 'cart' | 'analytics' | 'comparison' | 'features' = 'products';
  searchQuery = '';

  // Getter to switch between stores based on active tab
  get currentStore() {
    return this.activeTab === 'features' ? this.featuresStore : this.cartStore;
  }

  // Methods for template
  onAddToCart(product: Product): void {
    this.cartStore.addItem(product);
    // Also add to features store for demonstration
    this.featuresStore.addItem(product);
  }

  onRemoveFromCart(id: string): void {
    this.cartStore.removeItem(id);
    // Also remove from features store
    this.featuresStore.removeItem(id);
  }

  onUpdateQuantity(id: string, change: number): void {
    const item = this.cartStore.entities().find(i => i.id === id);
    if (item) {
      this.cartStore.updateQuantity(id, item.quantity + change);
      // Sync with features store
      this.featuresStore.updateQuantity(id, item.quantity + change);
    }
  }

  onClearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartStore.clearCart();
      // Sync with features store
      this.featuresStore.clearCart();
    }
  }

  onCategoryChange(category: CategoryType | 'all'): void {
    this.cartStore.setCategory(category);
    this.featuresStore.setCategory(category);
  }

  onSearchChange(query: string): void {
    this.cartStore.search(query);
    this.featuresStore.search(query);
  }

  onToggleSortOrder(): void {
    this.cartStore.toggleSortOrder();
    this.featuresStore.toggleSortOrder();
  }

  onToggleWishlist(product: Product): void {
    this.cartStore.toggleWishlist(product.id);
    this.featuresStore.toggleWishlist(product.id);

    // If removing from wishlist, don't track as recently viewed
    if (!this.cartStore.isInWishlist()(product.id)) {
      this.cartStore.addToRecentlyViewed(product);
      this.featuresStore.addToRecentlyViewed(product);
    }
  }

  onRestorePreviousCart(): void {
    this.cartStore.restorePreviousCart();
  }

  isInCart(productId: string): boolean {
    return this.cartStore.entities().some(item => item.productId === productId);
  }

  getCartQuantity(productId: string): number {
    const item = this.cartStore.entities().find(i => i.productId === productId);
    return item?.quantity || 0;
  }

  // Comparison data methods
  getNgrxStoreComparison() {
    return {
      name: '@ngrx/store',
      pros: [
        'Battle-tested and mature',
        'Excellent DevTools support',
        'Time-travel debugging',
        'Middleware ecosystem',
        'Redux pattern familiarity',
        'Complex async flow handling'
      ],
      cons: [
        'Verbose boilerplate code',
        'Steep learning curve',
        'Requires multiple files (actions, reducers, effects)',
        'Over-engineering for simple cases',
        'Heavy bundle size'
      ],
      bestFor: 'Large enterprise applications with complex state requirements',
      example: `// Actions
export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Product }>()
);

// Reducer
const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { product }) => ({
    ...state,
    items: [...state.items, product]
  }))
);

// Effects
@Injectable()
export class CartEffects {
  saveCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      tap(() => this.saveToLocalStorage())
    ), { dispatch: false }
  );
}`
    };
  }

  getNgrxSignalsComparison() {
    return {
      name: '@ngrx/signals',
      pros: [
        'Minimal boilerplate',
        'Type-safe by default',
        'Built-in entity management',
        'Excellent computed state support',
        'Smaller bundle size',
        'Easy to learn and use',
        'Fine-grained reactivity'
      ],
      cons: [
        'Newer, less mature',
        'Smaller ecosystem',
        'Less middleware support',
        'No time-travel debugging (yet)',
        'Different mental model from Redux'
      ],
      bestFor: 'Modern Angular apps prioritizing developer experience and performance',
      example: `// Single file setup
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] }),
  withEntities<CartItem>(),
  withComputed((store) => ({
    total: computed(() =>
      store.entities().reduce((sum, item) =>
        sum + item.price * item.quantity, 0)
    )
  })),
  withMethods((store) => ({
    addItem: (product: Product) =>
      patchState(store, addEntity(product))
  }))
);`
    };
  }

  getAngularSignalsComparison() {
    return {
      name: 'Angular Signals (only)',
      pros: [
        'Zero external dependencies',
        'Native to Angular',
        'Simplest mental model',
        'Smallest bundle size',
        'Great for component state',
        'Automatic cleanup'
      ],
      cons: [
        'No built-in patterns',
        'Manual entity management',
        'No DevTools integration',
        'Limited ecosystem',
        'More code for complex scenarios'
      ],
      bestFor: 'Simple to medium complexity apps, component-level state',
      example: `// Service with signals
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  total = computed(() =>
    this.items().reduce((sum, item) =>
      sum + item.price * item.quantity, 0)
  );

  addItem(product: Product) {
    this.items.update(items => [...items, product]);
  }
}`
    };
  }

  getResourceApiComparison() {
    return {
      name: 'Angular Resource API',
      pros: [
        'Built-in loading states',
        'Automatic error handling',
        'Request deduplication',
        'Caching out of the box',
        'Optimistic updates',
        'Server state focus'
      ],
      cons: [
        'Only for async data',
        'Not for local state',
        'Limited to HTTP patterns',
        'Less flexible than signals',
        'Newer API, still evolving'
      ],
      bestFor: 'Apps with heavy server interaction and data fetching needs',
      example: `// Resource for products
productsResource = resource({
  loader: () => this.http.get<Product[]>('/api/products'),

  // Automatic caching and deduplication
  cache: {
    ttl: 60000, // 1 minute
    key: (params) => params.category
  }
});

// In template
@if (productsResource.isLoading()) {
  <loading-spinner />
} @else if (productsResource.error()) {
  <error-message [error]="productsResource.error()" />
} @else {
  <product-list [products]="productsResource.value()" />
}`
    };
  }
}
