# Standalone Components - Module-Free Angular Architecture

Welcome to the **Standalone Components** module of the Angular Shopping Cart Workshop! This module focuses on building modern Angular applications without NgModules, implementing lazy loading, and creating scalable component architectures.

## 🎯 Learning Objectives

By completing this module, you will:

- Master standalone component architecture and eliminate NgModules
- Implement feature-based routing with lazy loading
- Create modular cart features as standalone components
- Build component composition patterns without modules
- Understand modern Angular application bootstrapping
- Implement progressive migration strategies from modules to standalone
- Design scalable standalone component hierarchies

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/standalone/components/standalone-cart.component.ts` - **STARTER FILE** (main workspace)
- `src/app/standalone/components/standalone-product-list.component.ts` - Product catalog component
- `src/app/standalone/components/standalone-checkout.component.ts` - Checkout flow component

**Supporting Files:**
- `src/app/standalone/services/standalone-cart.service.ts` - Cart service for standalone architecture
- `src/app/standalone/standalone.routes.ts` - Route definitions for standalone features
- `src/app/standalone/shared/` - Shared standalone components and utilities

## 🏗 Architecture Overview

The Standalone implementation eliminates NgModules entirely:

```
┌─────────────────────────────────────────────┐
│              Application Layer              │
│  ┌─────────────────────────────────────┐   │
│  │         main.ts                     │   │
│  │  bootstrapApplication()             │   │
│  │  - provideRouter()                  │   │
│  │  - provideHttpClient()              │   │
│  │  - Custom providers                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ bootstraps
                  ▼
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │      AppComponent (standalone)      │   │
│  │  imports: [RouterOutlet]            │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │   Feature Components (standalone)   │   │
│  │  - Direct component imports         │   │
│  │  - No NgModule dependencies         │   │
│  │  - Lazy loaded via routing          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ uses services
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │     StandaloneCartService           │   │
│  │  - Injectable without module        │   │
│  │  - Direct service injection         │   │
│  │  - Provider function patterns       │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Understand Standalone Components

Standalone components eliminate the need for NgModules:

```typescript
// Traditional NgModule approach
@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, FormsModule],
  exports: [CartComponent]
})
export class CartModule {}

// Standalone component approach  
@Component({
  selector: 'cart-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`
})
export class CartComponent {}
```

### Step 2: Navigate to Standalone Module

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Standalone" in the navigation
4. Explore the module-free architecture

## 📝 Implementation Tasks

### Task 1: Create Standalone Cart Component

**Goal**: Build a complete cart component without any NgModule dependencies.

**Requirements**:
```typescript
// TODO: Create standalone cart component
@Component({
  selector: 'standalone-cart',
  standalone: true,
  imports: [
    // TODO: Import necessary modules and components directly
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // TODO: Import shared standalone components
  ],
  template: `
    <div class="standalone-cart">
      <h2>Standalone Shopping Cart</h2>
      
      <!-- TODO: Implement cart header with item count -->
      <div class="cart-header">
        <!-- Cart summary and controls -->
      </div>
      
      <!-- TODO: Implement cart items list -->
      <div class="cart-items">
        <!-- List of cart items -->
      </div>
      
      <!-- TODO: Implement cart actions -->
      <div class="cart-actions">
        <!-- Clear, save, checkout buttons -->
      </div>
    </div>
  `,
  styleUrls: ['./standalone-cart.component.css']
})
export class StandaloneCartComponent {
  // TODO: Inject services using inject() function
  private cartService = inject(StandaloneCartService);
  private router = inject(Router);
  
  // TODO: Implement component logic
}
```

### Task 2: Implement Feature-Based Routing

**Goal**: Create a standalone routing structure without any modules.

**Route Configuration**:
```typescript
// TODO: Create standalone.routes.ts
export const STANDALONE_ROUTES: Routes = [
  {
    path: '',
    component: StandaloneCartComponent,
    title: 'Standalone Cart'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/standalone-product-list.component')
      .then(m => m.StandaloneProductListComponent),
    title: 'Products - Standalone'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./components/standalone-checkout.component')
      .then(m => m.StandaloneCheckoutComponent),
    title: 'Checkout - Standalone'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./components/standalone-product-detail.component')
      .then(m => m.StandaloneProductDetailComponent),
    title: 'Product Details'
  }
];
```

**Integration with Main Routes**:
```typescript
// TODO: Update main app.routes.ts
export const routes: Routes = [
  // ... existing routes
  {
    path: 'standalone',
    loadChildren: () => import('./standalone/standalone.routes')
      .then(m => m.STANDALONE_ROUTES),
    title: 'Standalone Components Workshop'
  }
];
```

### Task 3: Build Standalone Product List Component

**Goal**: Create a product listing component with advanced features.

**Requirements**:
```typescript
@Component({
  selector: 'standalone-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // TODO: Import shared components
    StandaloneProductCardComponent,
    StandaloneFilterPanelComponent,
    StandalonePaginationComponent
  ],
  template: `
    <div class="product-list-container">
      <!-- TODO: Implement search and filter panel -->
      <standalone-filter-panel
        [categories]="availableCategories()"
        [priceRange]="priceRange()"
        (filtersChanged)="onFiltersChanged($event)">
      </standalone-filter-panel>
      
      <!-- TODO: Implement product grid -->
      <div class="product-grid">
        @for (product of filteredProducts(); track product.id) {
          <standalone-product-card
            [product]="product"
            [isInCart]="isProductInCart(product.id)"
            (addToCart)="onAddToCart($event)"
            (viewDetails)="onViewDetails($event)">
          </standalone-product-card>
        } @empty {
          <div class="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        }
      </div>
      
      <!-- TODO: Implement pagination -->
      <standalone-pagination
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        [itemsPerPage]="itemsPerPage()"
        (pageChanged)="onPageChanged($event)">
      </standalone-pagination>
    </div>
  `
})
export class StandaloneProductListComponent {
  // TODO: Implement component logic with signals
  private productService = inject(ProductService);
  private cartService = inject(StandaloneCartService);
  
  // TODO: Implement filtering and pagination logic
}
```

### Task 4: Create Standalone Service Architecture

**Goal**: Build services that work optimally with standalone components.

**Service Implementation**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class StandaloneCartService {
  // TODO: Implement service using modern patterns
  private cartItems = signal<CartItem[]>([]);
  private cartMeta = signal<CartMetadata>({
    created: new Date(),
    lastUpdated: new Date(),
    sessionId: crypto.randomUUID()
  });
  
  // TODO: Expose readonly signals
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // TODO: Computed values
  public readonly summary = computed(() => {
    const items = this.cartItems();
    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      uniqueProducts: items.length
    };
  });
  
  // TODO: Implement cart operations
  addItem(product: Product): void {
    // Implementation
  }
  
  removeItem(productId: string): void {
    // Implementation
  }
  
  updateQuantity(productId: string, quantity: number): void {
    // Implementation
  }
}
```

### Task 5: Implement Advanced Standalone Patterns

**Goal**: Create sophisticated component composition without modules.

**Shared Component Library**:
```typescript
// TODO: Create shared standalone components
@Component({
  selector: 'standalone-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card">
      <img [src]="product().image" [alt]="product().name">
      
      <div class="product-info">
        <h3>{{ product().name }}</h3>
        <p class="price">{{ product().price | currency }}</p>
        
        @if (product().discount > 0) {
          <div class="discount-badge">
            {{ product().discount }}% OFF
          </div>
        }
        
        <div class="product-actions">
          @if (isInCart()) {
            <button class="in-cart" disabled>
              ✓ In Cart
            </button>
          } @else {
            <button (click)="onAddToCart()">
              Add to Cart
            </button>
          }
          
          <button (click)="onViewDetails()" class="view-details">
            View Details
          </button>
        </div>
      </div>
    </div>
  `
})
export class StandaloneProductCardComponent {
  // TODO: Implement with input signals
  product = input.required<Product>();
  isInCart = input<boolean>(false);
  
  addToCart = output<Product>();
  viewDetails = output<Product>();
  
  onAddToCart() {
    this.addToCart.emit(this.product());
  }
  
  onViewDetails() {
    this.viewDetails.emit(this.product());
  }
}
```

### Task 6: Create Standalone Checkout Flow

**Goal**: Build a complete checkout process using standalone components.

**Checkout Component**:
```typescript
@Component({
  selector: 'standalone-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StandaloneOrderSummaryComponent,
    StandalonePaymentFormComponent,
    StandaloneShippingFormComponent
  ],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      
      <!-- TODO: Implement checkout steps -->
      <div class="checkout-steps">
        @switch (currentStep()) {
          @case ('shipping') {
            <standalone-shipping-form
              [form]="shippingForm"
              (stepCompleted)="onShippingCompleted($event)">
            </standalone-shipping-form>
          }
          @case ('payment') {
            <standalone-payment-form
              [form]="paymentForm"
              [orderTotal]="cartService.summary().totalPrice"
              (stepCompleted)="onPaymentCompleted($event)">
            </standalone-payment-form>
          }
          @case ('review') {
            <standalone-order-summary
              [cartItems]="cartService.items()"
              [shippingInfo]="shippingForm.value"
              [paymentInfo]="paymentForm.value"
              (orderPlaced)="onOrderPlaced($event)">
            </standalone-order-summary>
          }
          @default {
            <div>Invalid checkout step</div>
          }
        }
      </div>
      
      <!-- TODO: Implement step navigation -->
      <div class="step-navigation">
        <button 
          [disabled]="currentStep() === 'shipping'"
          (click)="previousStep()">
          Previous
        </button>
        
        <span>Step {{ stepNumber() }} of 3</span>
        
        <button 
          [disabled]="!canProceed()"
          (click)="nextStep()">
          {{ isLastStep() ? 'Place Order' : 'Next' }}
        </button>
      </div>
    </div>
  `
})
export class StandaloneCheckoutComponent {
  // TODO: Implement checkout logic
  private cartService = inject(StandaloneCartService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  
  currentStep = signal<'shipping' | 'payment' | 'review'>('shipping');
  
  // TODO: Implement forms and step management
}
```

### Task 7: Progressive Migration Strategy

**Goal**: Demonstrate migration from NgModule-based to standalone architecture.

**Migration Steps**:
```typescript
// Step 1: Convert leaf components (no dependencies)
@Component({
  selector: 'simple-button',
  standalone: true,  // Add standalone: true
  imports: [CommonModule],  // Add direct imports
  // Remove from NgModule declarations
  template: `<button><ng-content></ng-content></button>`
})
export class SimpleButtonComponent {}

// Step 2: Convert components with dependencies
@Component({
  selector: 'complex-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleButtonComponent  // Import standalone components
  ],
  template: `
    <form [formGroup]="form">
      <input formControlName="name">
      <simple-button type="submit">Submit</simple-button>
    </form>
  `
})
export class ComplexFormComponent {}

// Step 3: Update NgModule (remove converted components)
@NgModule({
  declarations: [
    // Remove: SimpleButtonComponent, ComplexFormComponent
  ],
  imports: [
    CommonModule,
    // Add: converted standalone components if needed
    SimpleButtonComponent,
    ComplexFormComponent
  ]
})
export class FeatureModule {}

// Step 4: Eventually eliminate NgModule entirely
// Replace with direct component imports in routes
```

### Task 8: Testing Standalone Components

**Goal**: Create comprehensive testing patterns for standalone architecture.

**Testing Examples**:
```typescript
describe('StandaloneCartComponent', () => {
  let component: StandaloneCartComponent;
  let fixture: ComponentFixture<StandaloneCartComponent>;
  let mockCartService: jasmine.SpyObj<StandaloneCartService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('StandaloneCartService', 
      ['addItem', 'removeItem', 'updateQuantity']);

    await TestBed.configureTestingModule({
      imports: [
        StandaloneCartComponent,  // Import the standalone component
        // Add other dependencies
      ],
      providers: [
        { provide: StandaloneCartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StandaloneCartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add item to cart', () => {
    const product = { id: '1', name: 'Test', price: 10 };
    
    component.addToCart(product);
    
    expect(mockCartService.addItem).toHaveBeenCalledWith(product);
  });
});

// Integration testing for route-level lazy loading
describe('Standalone Routes', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes(STANDALONE_ROUTES)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should lazy load standalone product list', async () => {
    await router.navigate(['/standalone/products']);
    
    expect(fixture.nativeElement.textContent).toContain('Products - Standalone');
  });
});
```

## ✅ Testing Your Implementation

### Manual Testing Checklist

**Standalone Architecture**:
- ✅ Application loads without any NgModules
- ✅ All components work as standalone entities
- ✅ Lazy loading works for route-level components
- ✅ Services inject properly without module providers

**Feature Functionality**:
- ✅ Cart operations work in standalone context
- ✅ Product listing and filtering work correctly
- ✅ Checkout flow progresses through all steps
- ✅ Navigation between standalone features works

**Performance**:
- ✅ Lazy loading improves initial bundle size
- ✅ Components load quickly when navigated to
- ✅ No unnecessary module loading overhead

### Automated Testing

```bash
# Run tests for standalone components
npm run test -- --grep="standalone"

# Test specific standalone component
npm run test -- src/app/standalone/components/standalone-cart.component.spec.ts
```

## 🧪 Code Examples

### Complete Standalone Component with Modern Patterns

```typescript
@Component({
  selector: 'advanced-standalone-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StandaloneProductCardComponent,
    StandaloneCartSummaryComponent
  ],
  template: `
    <div class="advanced-cart">
      <!-- Modern control flow -->
      @if (cartItems().length > 0) {
        <div class="cart-content">
          @for (item of cartItems(); track item.id) {
            <div class="cart-item">
              <h4>{{ item.name }}</h4>
              <span>{{ item.price | currency }}</span>
              
              <div class="quantity-controls">
                <button (click)="updateQuantity(item.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              
              <button (click)="removeItem(item.id)">Remove</button>
            </div>
          }
        </div>
        
        <standalone-cart-summary [summary]="cartSummary()" />
      } @else {
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <a routerLink="/standalone/products">Continue Shopping</a>
        </div>
      }
    </div>
  `
})
export class AdvancedStandaloneCartComponent {
  // Modern dependency injection
  private cartService = inject(StandaloneCartService);
  private router = inject(Router);
  
  // Signal-based state
  protected cartItems = this.cartService.items;
  protected cartSummary = this.cartService.summary;
  
  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }
  
  removeItem(productId: string) {
    this.cartService.removeItem(productId);
  }
}
```

### Provider Function Pattern

```typescript
// Custom provider functions for standalone architecture
export function provideStandaloneCart(config?: CartConfig) {
  return [
    StandaloneCartService,
    { provide: CART_CONFIG, useValue: config || DEFAULT_CART_CONFIG },
    provideCartPersistence(),
    provideCartAnalytics()
  ];
}

export function provideCartPersistence() {
  return {
    provide: CartPersistenceService,
    useFactory: () => {
      const storage = inject(STORAGE_TOKEN);
      return new CartPersistenceService(storage);
    }
  };
}

// Usage in main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStandaloneCart({
      autoSave: true,
      maxItems: 50
    })
  ]
});
```

## 🔧 Migration Tools and Strategies

### Automated Migration Script

```typescript
// migration-helper.ts
export class StandaloneMigrationHelper {
  static analyzeComponent(componentPath: string): MigrationAnalysis {
    // Analyze component dependencies
    // Suggest import list for standalone conversion
    // Identify potential issues
  }
  
  static generateStandaloneComponent(
    componentClass: any, 
    dependencies: string[]
  ): string {
    // Generate standalone component code
    // Include all necessary imports
    // Preserve existing functionality
  }
  
  static validateMigration(before: string, after: string): ValidationResult {
    // Compare functionality before/after migration
    // Ensure no breaking changes
    // Verify all dependencies are correctly imported
  }
}
```

### Migration Checklist

**Pre-Migration Assessment**:
- ✅ Identify all component dependencies
- ✅ Map NgModule structure and exports
- ✅ Document shared services and providers
- ✅ Plan migration order (leaf components first)

**During Migration**:
- ✅ Convert components to standalone one by one
- ✅ Update import statements
- ✅ Remove from NgModule declarations
- ✅ Test each conversion individually

**Post-Migration Cleanup**:
- ✅ Remove unused NgModules
- ✅ Update routing configuration
- ✅ Optimize provider configuration
- ✅ Update build and test configurations

## 📊 Performance Benefits

### Measured Improvements

**Bundle Size**:
- ✅ Reduced initial bundle size through lazy loading
- ✅ Better tree-shaking of unused components
- ✅ Eliminated NgModule overhead

**Runtime Performance**:
- ✅ Faster component instantiation
- ✅ Reduced memory usage
- ✅ Better change detection performance

**Developer Experience**:
- ✅ Simpler component structure
- ✅ Better IDE support and autocomplete
- ✅ Easier testing setup

### Performance Monitoring

```typescript
// Add performance monitoring to standalone components
@Component({
  // ... standalone configuration
})
export class MonitoredStandaloneComponent implements OnInit, OnDestroy {
  private loadStart = performance.now();
  
  ngOnInit() {
    const loadTime = performance.now() - this.loadStart;
    console.log(`Component loaded in ${loadTime}ms`);
  }
  
  ngOnDestroy() {
    console.log('Standalone component destroyed - auto cleanup');
  }
}
```

## 🎯 Success Criteria

You've successfully completed the Standalone module when:

- ✅ Complete cart application works without any NgModules
- ✅ All components are converted to standalone
- ✅ Lazy loading works for all feature routes
- ✅ Services integrate properly with standalone architecture
- ✅ Testing patterns work for standalone components
- ✅ Performance improvements are measurable
- ✅ Migration strategy is documented and tested
- ✅ Provider functions work correctly
- ✅ Code follows standalone best practices

## 💡 Key Takeaways

### Standalone Advantages

**Simplicity**:
- No NgModule boilerplate
- Direct component composition
- Clearer dependency management

**Performance**:
- Better tree-shaking
- Reduced bundle size
- Faster lazy loading

**Maintainability**:
- Easier refactoring
- Better component encapsulation
- Simpler testing setup

### Migration Strategy

**Gradual Approach**:
1. Start with leaf components (no dependencies)
2. Work your way up the dependency tree
3. Convert feature modules last
4. Eliminate root modules finally

**Best Practices**:
- ✅ Test each conversion step
- ✅ Maintain backward compatibility during transition
- ✅ Use provider functions for complex service setup
- ✅ Document migration progress and lessons learned

## 🚀 Next Steps

After mastering Standalone Components:

1. **Apply to existing projects**: Start gradual migration
2. **Optimize lazy loading**: Fine-tune route-level code splitting
3. **Create component libraries**: Build reusable standalone components
4. **Explore advanced patterns**: Complex provider configurations

---

**Next Module:** [Modern Dependency Injection](./INJECT.md)