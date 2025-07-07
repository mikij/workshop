# Modern Dependency Injection - inject() Patterns & Advanced DI

Welcome to the **Modern Dependency Injection** module of the Angular Shopping Cart Workshop! This module focuses on mastering the inject() function, advanced provider patterns, and modern service composition techniques.

## 🎯 Learning Objectives

By completing this module, you will:

- Master the inject() function vs constructor injection patterns
- Create advanced provider functions and custom injection tokens
- Understand injection context and runInInjectionContext usage
- Implement modern service composition patterns
- Build functional approaches to dependency injection
- Create testable services with inject() patterns
- Design provider hierarchies and scoping strategies

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/inject/components/inject-cart.component.ts` - **STARTER FILE** (main workspace)
- `src/app/inject/services/inject-cart.service.ts` - Service using inject() patterns
- `src/app/inject/providers/cart-providers.ts` - Advanced provider functions

**Supporting Files:**
- `src/app/inject/utils/injection-utils.ts` - Utility functions with inject()
- `src/app/inject/config/cart-config.ts` - Configuration and tokens

## 🏗 Architecture Overview

The inject() implementation uses modern functional DI patterns:

```
┌─────────────────────────────────────────────┐
│              Application Layer              │
│  ┌─────────────────────────────────────┐   │
│  │         main.ts                     │   │
│  │  bootstrapApplication()             │   │
│  │  - Custom provider functions        │   │
│  │  - Injection token setup           │   │
│  │  - Hierarchical providers          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ provides
                  ▼
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │      Components using inject()      │   │
│  │  - Field-based injection           │   │
│  │  - Functional composition           │   │
│  │  - Conditional injection            │   │
│  │  - No constructor dependencies      │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ uses
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │       Services with inject()        │   │
│  │  - Field-based service injection   │   │
│  │  - Factory function patterns       │   │
│  │  - Provider composition             │   │
│  │  - Advanced injection patterns     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Understand inject() vs Constructor Injection

The inject() function provides a more functional approach to dependency injection:

```typescript
// Traditional constructor injection
@Component({})
export class TraditionalComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}
}

// Modern inject() approach
@Component({})
export class ModernComponent {
  private http = inject(HttpClient);
  private router = inject(Router);  
  private cartService = inject(CartService);
  
  // Conditional injection
  private analytics = inject(AnalyticsService, { optional: true });
}
```

### Step 2: Navigate to Inject Module

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Inject" in the navigation
4. Explore the modern DI patterns

## 📝 Implementation Tasks

### Task 1: Convert Component to inject() Pattern

**Goal**: Refactor a component from constructor injection to inject() pattern.

**Requirements**:
```typescript
// TODO: Convert from constructor injection to inject()
@Component({
  selector: 'inject-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inject-cart">
      <h2>Modern inject() Cart</h2>
      
      <!-- TODO: Implement cart with inject() services -->
      <div class="cart-content">
        <!-- Cart implementation -->
      </div>
    </div>
  `
})
export class InjectCartComponent {
  // TODO: Replace constructor injection with inject()
  
  // OLD: Constructor injection approach
  // constructor(
  //   private cartService: CartService,
  //   private router: Router,
  //   private analytics: AnalyticsService
  // ) {}
  
  // NEW: inject() approach
  private cartService = inject(InjectCartService);
  private router = inject(Router);
  private analytics = inject(AnalyticsService, { optional: true });
  
  // TODO: Optional injection with default values
  private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
  
  // TODO: Conditional injection based on environment
  private logger = inject(Logger, { 
    optional: isPlatformBrowser(inject(PLATFORM_ID)) 
  });
  
  // TODO: Implement component methods using injected services
  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.analytics?.trackEvent('add_to_cart', { productId: product.id });
  }
  
  navigateToCheckout(): void {
    this.router.navigate(['/inject/checkout']);
  }
}
```

### Task 2: Create Advanced Provider Functions

**Goal**: Build sophisticated provider functions for complex DI scenarios.

**Provider Functions**:
```typescript
// TODO: Create cart-providers.ts
export function provideInjectCart(config?: Partial<CartConfig>) {
  return [
    // Core cart service
    InjectCartService,
    
    // Configuration
    { 
      provide: CART_CONFIG, 
      useValue: { ...DEFAULT_CART_CONFIG, ...config } 
    },
    
    // Analytics provider with factory
    {
      provide: CartAnalyticsService,
      useFactory: () => {
        const config = inject(CART_CONFIG);
        const http = inject(HttpClient);
        return new CartAnalyticsService(config.analytics, http);
      }
    },
    
    // Storage provider based on environment
    {
      provide: STORAGE_SERVICE,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        return isPlatformBrowser(platformId) 
          ? new BrowserStorageService()
          : new ServerStorageService();
      }
    }
  ];
}

// TODO: Specialized providers for different features
export function provideCartPersistence() {
  return [
    {
      provide: CartPersistenceService,
      useFactory: () => {
        const storage = inject(STORAGE_SERVICE);
        const config = inject(CART_CONFIG);
        return new CartPersistenceService(storage, config.persistence);
      }
    }
  ];
}

export function provideCartAnalytics(analyticsConfig?: AnalyticsConfig) {
  return [
    { provide: ANALYTICS_CONFIG, useValue: analyticsConfig },
    {
      provide: CartAnalyticsService,
      useFactory: () => {
        const config = inject(ANALYTICS_CONFIG, { optional: true });
        const http = inject(HttpClient);
        return config 
          ? new CartAnalyticsService(config, http)
          : new NoOpAnalyticsService();
      }
    }
  ];
}
```

### Task 3: Implement Service with inject() Patterns

**Goal**: Create a service that exclusively uses inject() for all dependencies.

**Service Implementation**:
```typescript
@Injectable({
  providedIn: 'root'
})
export class InjectCartService {
  // TODO: Use inject() for all dependencies instead of constructor
  private http = inject(HttpClient);
  private storage = inject(STORAGE_SERVICE);
  private config = inject(CART_CONFIG);
  private analytics = inject(CartAnalyticsService, { optional: true });
  private logger = inject(Logger, { optional: true });
  
  // TODO: State management with signals
  private cartItems = signal<CartItem[]>([]);
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date()
  });
  
  // TODO: Readonly accessors
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // TODO: Computed values
  public readonly summary = computed(() => {
    const items = this.cartItems();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      totalPrice: total,
      totalItems: itemCount,
      tax: total * this.config.taxRate,
      finalPrice: total * (1 + this.config.taxRate)
    };
  });
  
  constructor() {
    // TODO: Initialization logic using injected services
    this.loadCartFromStorage();
    this.setupAutoSave();
  }
  
  // TODO: Implement methods using injected dependencies
  addItem(product: Product): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        addedAt: new Date()
      };
      
      this.cartItems.update(items => [...items, newItem]);
      this.updateMetadata();
      this.analytics?.trackEvent('item_added', { productId: product.id });
    }
  }
  
  private loadCartFromStorage(): void {
    try {
      const stored = this.storage.getItem('inject-cart');
      if (stored) {
        const data = JSON.parse(stored);
        this.cartItems.set(data.items || []);
        this.cartMeta.set(data.metadata || this.createDefaultMetadata());
      }
    } catch (error) {
      this.logger?.error('Failed to load cart from storage', error);
    }
  }
  
  private setupAutoSave(): void {
    // TODO: Auto-save using effects
    effect(() => {
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      try {
        this.storage.setItem('inject-cart', JSON.stringify({
          items,
          metadata
        }));
      } catch (error) {
        this.logger?.error('Failed to save cart to storage', error);
      }
    });
  }
}
```

### Task 4: Advanced Injection Patterns

**Goal**: Implement sophisticated injection patterns for complex scenarios.

**Injection Utilities**:
```typescript
// TODO: Create injection-utils.ts
export function createCartFactory(customConfig?: Partial<CartConfig>) {
  return () => {
    // This function runs in injection context
    const baseConfig = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
    const http = inject(HttpClient);
    const storage = inject(STORAGE_SERVICE);
    
    const config = { ...baseConfig, ...customConfig };
    return new InjectCartService(config, http, storage);
  };
}

export function injectOptionalService<T>(token: Type<T> | InjectionToken<T>): T | null {
  try {
    return inject(token, { optional: true });
  } catch {
    return null;
  }
}

export function injectWithFallback<T>(
  token: Type<T> | InjectionToken<T>,
  fallback: T
): T {
  return inject(token, { optional: true }) ?? fallback;
}

// TODO: Conditional injection based on feature flags
export function injectIfFeatureEnabled<T>(
  token: Type<T> | InjectionToken<T>,
  feature: string
): T | null {
  const featureFlags = inject(FEATURE_FLAGS, { optional: true });
  
  if (featureFlags?.isEnabled(feature)) {
    return inject(token, { optional: true });
  }
  
  return null;
}

// TODO: Runtime injection context creation
export function createInjectionContext(providers: Provider[]) {
  const injector = Injector.create({ providers });
  
  return <T>(fn: () => T): T => {
    return runInInjectionContext(injector, fn);
  };
}
```

### Task 5: Functional Service Composition

**Goal**: Create services using functional composition patterns with inject().

**Functional Services**:
```typescript
// TODO: Functional service creation patterns
export function createCartAnalytics() {
  const http = inject(HttpClient);
  const config = inject(ANALYTICS_CONFIG, { optional: true });
  
  return {
    trackEvent: (event: string, data: any) => {
      if (!config?.enabled) return;
      
      return http.post(`${config.endpoint}/events`, {
        event,
        data,
        timestamp: new Date().toISOString()
      });
    },
    
    trackPageView: (page: string) => {
      if (!config?.enabled) return;
      
      return http.post(`${config.endpoint}/pageviews`, {
        page,
        timestamp: new Date().toISOString()
      });
    }
  };
}

export function createCartValidator() {
  const config = inject(CART_CONFIG);
  
  return {
    validateItem: (item: CartItem): ValidationResult => {
      const errors: string[] = [];
      
      if (item.quantity <= 0) {
        errors.push('Quantity must be greater than 0');
      }
      
      if (item.quantity > config.maxQuantityPerItem) {
        errors.push(`Quantity cannot exceed ${config.maxQuantityPerItem}`);
      }
      
      if (item.price <= 0) {
        errors.push('Price must be greater than 0');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },
    
    validateCart: (items: CartItem[]): ValidationResult => {
      if (items.length > config.maxItemsPerCart) {
        return {
          isValid: false,
          errors: [`Cart cannot contain more than ${config.maxItemsPerCart} items`]
        };
      }
      
      const itemValidations = items.map(item => this.validateItem(item));
      const allErrors = itemValidations.flatMap(v => v.errors);
      
      return {
        isValid: allErrors.length === 0,
        errors: allErrors
      };
    }
  };
}

// TODO: Composable service factories
export function createCartService(options?: CartServiceOptions) {
  const storage = inject(STORAGE_SERVICE);
  const analytics = injectOptionalService(CartAnalyticsService);
  const validator = createCartValidator();
  
  const cartItems = signal<CartItem[]>([]);
  
  return {
    items: cartItems.asReadonly(),
    
    addItem: (product: Product) => {
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        addedAt: new Date()
      };
      
      const validation = validator.validateItem(newItem);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      cartItems.update(items => [...items, newItem]);
      analytics?.trackEvent('item_added', { productId: product.id });
    },
    
    removeItem: (productId: string) => {
      cartItems.update(items => items.filter(item => item.productId !== productId));
      analytics?.trackEvent('item_removed', { productId });
    },
    
    clear: () => {
      cartItems.set([]);
      analytics?.trackEvent('cart_cleared');
    }
  };
}
```


### Task 6: Advanced Provider Hierarchies

**Goal**: Create sophisticated provider hierarchies and scoping strategies.

**Provider Hierarchies**:
```typescript
// TODO: Multi-level provider configuration
export function provideCartFeature() {
  return makeEnvironmentProviders([
    // Core services
    InjectCartService,
    
    // Feature-specific providers
    { provide: CART_FEATURE_CONFIG, useValue: CART_FEATURE_DEFAULTS },
    
    // Scoped providers
    {
      provide: CartSessionService,
      useFactory: () => {
        const storage = inject(STORAGE_SERVICE);
        const config = inject(CART_FEATURE_CONFIG);
        return new CartSessionService(storage, config.session);
      }
    }
  ]);
}

export function provideCartTesting() {
  return [
    { provide: STORAGE_SERVICE, useClass: MockStorageService },
    { provide: CartAnalyticsService, useClass: MockAnalyticsService },
    { provide: CART_CONFIG, useValue: TEST_CART_CONFIG }
  ];
}

// TODO: Route-level providers
export const CART_ROUTES: Routes = [
  {
    path: 'cart',
    component: InjectCartComponent,
    providers: [
      // Route-specific cart configuration
      { provide: CART_CONFIG, useValue: ROUTE_SPECIFIC_CONFIG },
      
      // Route-scoped services
      CartSessionService
    ]
  },
  {
    path: 'admin',
    component: AdminCartComponent,
    providers: [
      // Admin-specific cart configuration
      { provide: CART_CONFIG, useValue: ADMIN_CART_CONFIG },
      
      // Admin-only services
      AdminCartService
    ]
  }
];
```

## ✅ Testing Your Implementation

### Manual Testing Checklist

**inject() Conversion**:
- ✅ All components work with inject() instead of constructor injection
- ✅ Optional injections handle missing services gracefully
- ✅ Conditional injection works based on environment/features

**Provider Functions**:
- ✅ Custom provider functions create correct service instances
- ✅ Configuration is properly injected and used
- ✅ Factory functions have access to all required dependencies

**Service Composition**:
- ✅ Functional services work correctly
- ✅ Service factories create properly configured instances
- ✅ Injection utilities handle edge cases correctly

### Automated Testing

```bash
# Run tests for inject-based services
npm run test -- --grep="inject"

# Test specific injection patterns
npm run test -- src/app/inject/services/inject-cart.service.spec.ts
```

## 🧪 Code Examples

### Complete inject() Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class CompleteInjectService {
  // Basic service injection
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Optional service injection
  private analytics = inject(AnalyticsService, { optional: true });
  private logger = inject(Logger, { optional: true });
  
  // Configuration injection with fallback
  private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CONFIG;
  
  // Platform-specific injection
  private storage = inject(PLATFORM_ID).pipe(
    map(platformId => isPlatformBrowser(platformId) 
      ? inject(BrowserStorageService)
      : inject(ServerStorageService)
    )
  );
  
  // Conditional injection based on feature flags
  private advancedFeatures = (() => {
    const features = inject(FEATURE_FLAGS, { optional: true });
    return features?.isEnabled('advanced-cart') 
      ? inject(AdvancedCartService, { optional: true })
      : null;
  })();
  
  // Signal-based state
  private items = signal<CartItem[]>([]);
  
  // Public API
  public readonly cartItems = this.items.asReadonly();
  
  constructor() {
    this.initializeService();
  }
  
  private initializeService() {
    // Use injected services for initialization
    this.loadPersistedData();
    this.setupAnalytics();
    this.configureAdvancedFeatures();
  }
  
  addItem(product: Product) {
    // Implementation using injected services
    this.items.update(items => [...items, this.createCartItem(product)]);
    this.analytics?.trackEvent('item_added', { productId: product.id });
    this.logger?.debug('Item added to cart', product);
  }
  
  private createCartItem(product: Product): CartItem {
    return {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      addedAt: new Date()
    };
  }
}
```

### Advanced Provider Factory

```typescript
export function createAdvancedCartProvider(options: CartProviderOptions = {}) {
  return {
    provide: InjectCartService,
    useFactory: () => {
      // All these inject() calls happen in the injection context
      const http = inject(HttpClient);
      const storage = inject(STORAGE_SERVICE);
      const config = inject(CART_CONFIG);
      
      // Optional services
      const analytics = inject(AnalyticsService, { optional: true });
      const logger = inject(Logger, { optional: true });
      
      // Environment-specific services
      const platformId = inject(PLATFORM_ID);
      const syncService = isPlatformBrowser(platformId)
        ? inject(BrowserSyncService, { optional: true })
        : inject(ServerSyncService, { optional: true });
      
      // Create service with all dependencies
      const service = new InjectCartService(
        http,
        storage,
        { ...config, ...options.config }
      );
      
      // Configure optional features
      if (analytics) {
        service.enableAnalytics(analytics);
      }
      
      if (logger) {
        service.enableLogging(logger);
      }
      
      if (syncService && options.enableSync) {
        service.enableSync(syncService);
      }
      
      return service;
    }
  };
}
```

## 🔧 Debugging and Best Practices

### Common Issues

**Issue**: inject() called outside injection context
**Solution**: Ensure inject() is called in constructor, field initializer, or factory function

**Issue**: Circular dependency with inject()
**Solution**: Use forwardRef or restructure dependencies

**Issue**: Optional injection not working as expected
**Solution**: Check injection token and provider configuration

### Debugging Tips

```typescript
// Add debugging to injection
export class DebugInjectService {
  private http = (() => {
    console.log('Injecting HttpClient');
    return inject(HttpClient);
  })();
  
  private config = (() => {
    const config = inject(CART_CONFIG, { optional: true });
    console.log('Injected config:', config);
    return config ?? DEFAULT_CONFIG;
  })();
  
  constructor() {
    console.log('Service created with dependencies:', {
      hasHttp: !!this.http,
      configSource: this.config === DEFAULT_CONFIG ? 'default' : 'injected'
    });
  }
}
```

## 📊 Performance and Benefits

### inject() Advantages

**Code Organization**:
- ✅ Cleaner service constructors
- ✅ Better field-based organization
- ✅ More explicit dependency declarations

**Functionality**:
- ✅ Conditional injection capabilities
- ✅ Optional injection with fallbacks
- ✅ Better integration with functional patterns

**Development**:
- ✅ Better tree-shaking support
- ✅ Improved debugging capabilities
- ✅ Enhanced IDE experience

### Performance Considerations

```typescript
// Performance monitoring for inject() services
@Injectable()
export class PerformanceMonitoredService {
  private startTime = performance.now();
  
  private http = inject(HttpClient);
  private config = inject(CART_CONFIG);
  
  constructor() {
    const injectionTime = performance.now() - this.startTime;
    console.log(`Service injection took ${injectionTime}ms`);
  }
}
```

## 🎯 Success Criteria

You've successfully completed the Inject module when:

- ✅ All components and services use inject() instead of constructor injection
- ✅ Advanced provider functions work correctly
- ✅ Optional and conditional injection patterns work as expected
- ✅ Functional service composition patterns are implemented
- ✅ Provider hierarchies and scoping work correctly
- ✅ Injection utilities handle edge cases properly
- ✅ Performance is equivalent or better than constructor injection

## 💡 Key Takeaways

### inject() Advantages

**Modern Patterns**:
- More functional approach to DI
- Better alignment with modern JavaScript
- Improved tree-shaking potential

**Flexibility**:
- Conditional and optional injection
- Runtime dependency resolution
- Better factory function support

**Maintainability**:
- Clearer dependency declarations
- Easier refactoring
- Better IDE support

### When to Use inject()

**Use inject() when**:
- ✅ Building new components/services
- ✅ Need conditional or optional injection
- ✅ Working with functional patterns
- ✅ Want cleaner field-based organization

**Use constructor injection when**:
- ✅ Working with legacy code
- ✅ Team prefers traditional patterns
- ✅ Need complex constructor logic
- ✅ Using class inheritance patterns

## 🚀 Next Steps

After mastering Modern DI with inject():

1. **Refactor existing services**: Gradually migrate to inject() patterns
2. **Create provider libraries**: Build reusable provider functions
3. **Explore advanced patterns**: Complex injection hierarchies
4. **Optimize for tree-shaking**: Functional service composition

---

**Workshop Complete!** You've now mastered all modern Angular patterns: Control Flow, Standalone Components, and Modern Dependency Injection.