# Control Flow - Modern Angular Template Syntax

Welcome to the **Control Flow** module of the Angular Shopping Cart Workshop! This module focuses on mastering Angular's new control flow syntax (@if, @for, @switch) and the powerful @defer directive for performance optimization.

## 🎯 Learning Objectives

By completing this module, you will:

- Master the new Angular control flow syntax (@if, @for, @switch)
- Migrate from structural directives (*ngIf, *ngFor, *ngSwitch) to modern syntax
- Implement advanced @defer patterns for performance optimization
- Understand different @defer triggers (viewport, interaction, timer, idle)
- Build complex conditional rendering scenarios
- Optimize template performance through deferred loading
- Create responsive layouts with intelligent loading strategies

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/control-flow/components/cart-control-flow.component.ts` - **STARTER FILE** (main workspace)
- `src/app/control-flow/components/product-filter.component.ts` - Advanced filtering component
- `src/app/control-flow/components/cart-analytics.component.ts` - Deferred analytics dashboard

**Supporting Files:**
- `src/app/control-flow/services/control-flow-cart.service.ts` - Cart service with filtering
- `src/app/control-flow/components/product-recommendations.component.ts` - Deferred recommendations

## 🏗 Architecture Overview

The Control Flow implementation showcases modern template patterns:

```
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │     CartControlFlowComponent        │   │
│  │  - @if for conditional rendering    │   │
│  │  - @for with advanced tracking      │   │
│  │  - @switch for state management     │   │
│  │  - @defer for performance          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ modern templates
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │     ControlFlowCartService          │   │
│  │  - Signals for reactive state      │   │
│  │  - Advanced filtering logic        │   │
│  │  - Performance monitoring          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Understand the New Control Flow

Angular's new control flow provides better performance and developer experience:

```html
<!-- Old structural directives -->
<div *ngIf="user">Welcome {{ user.name }}</div>
<div *ngFor="let item of items; trackBy: trackById">{{ item.name }}</div>

<!-- New control flow -->
@if (user()) {
  <div>Welcome {{ user().name }}</div>
}
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### Step 2: Navigate to Control Flow Module

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Control Flow" in the navigation
4. Explore the modern template syntax examples

## 📝 Implementation Tasks

### Task 1: Basic Control Flow Migration

**Goal**: Convert existing structural directives to new control flow syntax.

**Requirements**:
```html
<!-- TODO: Convert to @if syntax -->
<div *ngIf="cartService.cartItems().length > 0">
  <h2>Shopping Cart ({{ cartService.totalItems() }} items)</h2>
</div>

<!-- TODO: Convert to @for with proper tracking -->
<div *ngFor="let item of cartService.cartItems(); trackBy: trackById">
  <div class="cart-item">{{ item.name }}</div>
</div>

<!-- TODO: Convert to @switch for cart status -->
<div [ngSwitch]="cartStatus()">
  <div *ngSwitchCase="'empty'">Your cart is empty</div>
  <div *ngSwitchCase="'loading'">Loading cart...</div>
  <div *ngSwitchDefault>Cart loaded</div>
</div>
```

**New Implementation**:
```html
@if (cartService.cartItems().length > 0) {
  <h2>Shopping Cart ({{ cartService.totalItems() }} items)</h2>
}

@for (item of cartService.cartItems(); track item.id) {
  <div class="cart-item">{{ item.name }}</div>
}

@switch (cartStatus()) {
  @case ('empty') {
    <div>Your cart is empty</div>
  }
  @case ('loading') {
    <div>Loading cart...</div>
  }
  @default {
    <div>Cart loaded</div>
  }
}
```

### Task 2: Advanced Conditional Rendering

**Goal**: Implement complex nested conditions with the new syntax.

**Requirements**:
```html
<!-- Complex nested conditions -->
@if (user()) {
  @switch (user().role) {
    @case ('premium') {
      @if (cartService.cartSummary().finalPrice > 500) {
        <div class="premium-benefits">
          <h3>Premium Benefits Applied!</h3>
          <p>Free shipping and 10% discount</p>
        </div>
      } @else {
        <div class="premium-upgrade">
          <p>Spend ${{ 500 - cartService.cartSummary().finalPrice | number:'1.2-2' }} more for free shipping!</p>
        </div>
      }
    }
    @case ('regular') {
      <div class="regular-user">
        <p>Upgrade to Premium for exclusive benefits!</p>
      </div>
    }
    @default {
      <div class="guest-user">
        <p>Sign in for personalized experience</p>
      </div>
    }
  }
} @else {
  <div class="auth-prompt">
    <button>Sign In</button>
  </div>
}
```

### Task 3: Enhanced @for with Advanced Features

**Goal**: Implement advanced list rendering with proper tracking and empty states.

**Requirements**:
```html
<!-- Advanced @for with empty state and local variables -->
@for (item of filteredItems(); track item.id; let i = $index; let isFirst = $first; let isLast = $last) {
  <div class="cart-item" [class.first]="isFirst" [class.last]="isLast">
    <span class="item-number">{{ i + 1 }}</span>
    <div class="item-details">
      <h4>{{ item.name }}</h4>
      <p>{{ item.price | currency }}</p>
      
      <!-- Nested @if for item-specific features -->
      @if (item.discount > 0) {
        <div class="discount-badge">
          {{ item.discount }}% OFF
        </div>
      }
      
      <!-- Quantity controls with @if -->
      <div class="quantity-controls">
        @if (item.quantity > 1) {
          <button (click)="decreaseQuantity(item.id)">-</button>
        } @else {
          <button (click)="removeItem(item.id)" class="remove">Remove</button>
        }
        <span>{{ item.quantity }}</span>
        <button (click)="increaseQuantity(item.id)">+</button>
      </div>
    </div>
  </div>
} @empty {
  <div class="empty-cart">
    <h3>Your cart is empty</h3>
    <p>Add some products to get started!</p>
    <button routerLink="/products">Browse Products</button>
  </div>
}
```

### Task 4: Implement @defer for Performance

**Goal**: Use @defer to optimize loading of heavy components.

**Basic @defer Usage**:
```html
<!-- Defer heavy analytics component -->
@defer {
  <cart-analytics-dashboard [cartData]="cartService.cartItems()" />
} @loading {
  <div class="analytics-skeleton">
    <div class="skeleton-chart"></div>
    <div class="skeleton-metrics"></div>
  </div>
} @error {
  <div class="analytics-error">
    <p>Failed to load analytics</p>
    <button (click)="retryAnalytics()">Retry</button>
  </div>
} @placeholder {
  <div class="analytics-placeholder">
    <p>Analytics will load when ready</p>
  </div>
}
```

**Advanced @defer with Triggers**:
```html
<!-- Defer product recommendations until user scrolls to view -->
@defer (on viewport) {
  <product-recommendations 
    [currentCart]="cartService.cartItems()"
    [userPreferences]="userService.preferences()" />
} @loading (minimum 500ms) {
  <div class="recommendations-loading">
    <div class="skeleton-product" *ngFor="let i of [1,2,3,4]"></div>
  </div>
} @placeholder (minimum 1s) {
  <div class="recommendations-placeholder">
    <h3>Recommended for You</h3>
    <p>Scroll down to see personalized recommendations</p>
  </div>
}

<!-- Defer cart history on user interaction -->
@defer (on interaction; on timer(5s)) {
  <cart-history [history]="cartService.cartHistory()" />
} @loading {
  <div>Loading cart history...</div>
}

<!-- Defer expensive calculations until browser is idle -->
@defer (on idle) {
  <cart-optimization-suggestions [cart]="cartService.cartItems()" />
}
```

### Task 5: Complex Filter Implementation

**Goal**: Build an advanced filtering system using @switch and nested conditions.

**Requirements**:
```html
<div class="filter-panel">
  @switch (activeFilterType()) {
    @case ('category') {
      <div class="category-filters">
        @for (category of availableCategories(); track category.id) {
          <button 
            [class.active]="selectedCategory() === category.id"
            (click)="setCategory(category.id)">
            {{ category.name }} ({{ category.count }})
          </button>
        }
      </div>
    }
    @case ('price') {
      <div class="price-filters">
        @for (range of priceRanges(); track range.id) {
          <label>
            <input 
              type="radio" 
              [checked]="selectedPriceRange() === range.id"
              (change)="setPriceRange(range.id)">
            {{ range.label }}
          </label>
        }
      </div>
    }
    @case ('discount') {
      <div class="discount-filters">
        @if (hasDiscountedItems()) {
          @for (discount of discountTiers(); track discount.value) {
            <button 
              [class.active]="selectedDiscount() === discount.value"
              (click)="setDiscount(discount.value)">
              {{ discount.label }}
            </button>
          }
        } @else {
          <p>No discounted items available</p>
        }
      </div>
    }
    @default {
      <div class="all-filters">
        <p>Select a filter type above</p>
      </div>
    }
  }
</div>
```

### Task 6: Performance Monitoring Dashboard

**Goal**: Create a deferred dashboard that monitors template performance.

**Implementation**:
```html
<!-- Performance dashboard - deferred until explicitly requested -->
@defer (when showPerformanceMetrics()) {
  <div class="performance-dashboard">
    <h3>Template Performance Metrics</h3>
    
    @if (performanceData()) {
      <div class="metrics-grid">
        @for (metric of performanceData().metrics; track metric.name) {
          <div class="metric-card">
            <h4>{{ metric.name }}</h4>
            <span class="value">{{ metric.value }}</span>
            
            @switch (metric.status) {
              @case ('good') {
                <div class="status good">✓ Good</div>
              }
              @case ('warning') {
                <div class="status warning">⚠ Warning</div>
              }
              @case ('critical') {
                <div class="status critical">⚠ Critical</div>
              }
            }
          </div>
        }
      </div>
      
      <!-- Performance recommendations -->
      @if (performanceData().recommendations.length > 0) {
        <div class="recommendations">
          <h4>Performance Recommendations</h4>
          @for (rec of performanceData().recommendations; track rec.id) {
            <div class="recommendation">
              <strong>{{ rec.title }}</strong>
              <p>{{ rec.description }}</p>
            </div>
          }
        </div>
      }
    } @else {
      <div class="no-data">
        <p>No performance data available</p>
      </div>
    }
  </div>
} @loading {
  <div class="dashboard-loading">
    <div class="loading-spinner"></div>
    <p>Loading performance metrics...</p>
  </div>
} @placeholder {
  <button (click)="enablePerformanceMetrics()">
    Show Performance Metrics
  </button>
}
```

## ✅ Testing Your Implementation

### Manual Testing Checklist

**Control Flow Conversion**:
- ✅ All @if conditions render correctly
- ✅ @for loops display proper content with tracking
- ✅ @switch cases handle all states appropriately
- ✅ Empty states show when no data is available

**@defer Performance**:
- ✅ Heavy components load only when triggered
- ✅ Loading states display during deferred loading
- ✅ Error states handle failed component loads
- ✅ Placeholder states provide good UX
- ✅ Different triggers work as expected (viewport, interaction, timer)

**Complex Scenarios**:
- ✅ Nested conditions work properly
- ✅ Multiple @for loops with different tracking functions
- ✅ Complex filter combinations update correctly
- ✅ Performance improvements are noticeable

### Performance Testing

**Before/After Comparison**:
```typescript
// Component for performance testing
export class PerformanceTestComponent {
  // Test old vs new syntax performance
  renderCount = signal(0);
  
  ngAfterViewInit() {
    // Measure rendering performance
    const start = performance.now();
    // ... render operations
    const end = performance.now();
    console.log(`Rendering took ${end - start} milliseconds`);
  }
}
```

## 🧪 Code Examples

### Migration Example - Complex Filter Component

**Before (Structural Directives)**:
```html
<div class="filter-container">
  <div *ngIf="showFilters">
    <div *ngFor="let filter of availableFilters; trackBy: trackByFilter">
      <div [ngSwitch]="filter.type">
        <input *ngSwitchCase="'text'" 
               type="text" 
               [value]="filter.value"
               (input)="updateFilter(filter.id, $event)">
        <select *ngSwitchCase="'select'">
          <option *ngFor="let option of filter.options" 
                  [value]="option.value">
            {{ option.label }}
          </option>
        </select>
        <div *ngSwitchDefault>Unknown filter type</div>
      </div>
    </div>
  </div>
</div>
```

**After (New Control Flow)**:
```html
<div class="filter-container">
  @if (showFilters()) {
    @for (filter of availableFilters(); track filter.id) {
      @switch (filter.type) {
        @case ('text') {
          <input 
            type="text" 
            [value]="filter.value"
            (input)="updateFilter(filter.id, $event)">
        }
        @case ('select') {
          <select>
            @for (option of filter.options; track option.value) {
              <option [value]="option.value">
                {{ option.label }}
              </option>
            }
          </select>
        }
        @default {
          <div>Unknown filter type</div>
        }
      }
    }
  }
</div>
```

### Advanced @defer Patterns

```html
<!-- Intelligent loading strategy -->
<div class="content-sections">
  <!-- Critical content loads immediately -->
  <section class="critical-content">
    <cart-summary [cart]="cartService.cartItems()" />
  </section>
  
  <!-- Secondary content defers until viewport -->
  @defer (on viewport) {
    <section class="secondary-content">
      <product-recommendations />
    </section>
  } @placeholder {
    <div class="placeholder-section">
      <p>More content below...</p>
    </div>
  }
  
  <!-- Analytics defer until user shows interest -->
  @defer (on interaction; on timer(10s)) {
    <section class="analytics-content">
      <cart-analytics />
    </section>
  } @loading (minimum 300ms) {
    <div class="analytics-skeleton"></div>
  }
  
  <!-- Heavy calculations defer until browser idle -->
  @defer (on idle) {
    <section class="optimization-content">
      <cart-optimizer />
    </section>
  }
</div>
```

## 🔧 Debugging Tips

### Common Issues

**Issue**: @for not updating when data changes
**Solution**: Ensure proper tracking function and signal updates

**Issue**: @defer not triggering
**Solution**: Check viewport triggers and component visibility

**Issue**: Performance not improving with @defer
**Solution**: Profile component loading and adjust defer triggers

### Performance Debugging

```typescript
// Add performance monitoring
effect(() => {
  const start = performance.now();
  
  // Track template rendering
  console.log('Template rendered in:', performance.now() - start, 'ms');
});

// Monitor @defer loading
@defer (on viewport) {
  <heavy-component (loaded)="onComponentLoaded()" />
}

onComponentLoaded() {
  console.log('Deferred component loaded successfully');
}
```

## 📊 Performance Benefits

### Measured Improvements

**Template Performance**:
- ✅ 20-30% faster rendering with new control flow
- ✅ Reduced memory usage through @defer
- ✅ Better change detection performance
- ✅ Smaller bundle size

**@defer Benefits**:
- ✅ Reduced initial page load time
- ✅ Better Core Web Vitals scores
- ✅ Improved perceived performance
- ✅ Optimized resource usage

### Best Practices

1. **Use @defer for non-critical content** that can load later
2. **Choose appropriate triggers** based on user interaction patterns
3. **Provide meaningful loading states** for better UX
4. **Monitor performance impact** with browser dev tools
5. **Test on slower devices** to validate improvements

## 🎯 Success Criteria

You've successfully completed the Control Flow module when:

- ✅ All structural directives migrated to new control flow syntax
- ✅ Complex nested conditions work correctly
- ✅ @defer improves page load performance measurably
- ✅ Different @defer triggers work as expected
- ✅ Loading and error states provide good user experience
- ✅ Filter system works with new control flow
- ✅ Performance monitoring shows improvements
- ✅ Code follows modern Angular template best practices

## 💡 Key Takeaways

### New Control Flow Advantages

**Performance**:
- Better runtime performance than structural directives
- Improved change detection efficiency
- Smaller bundle size impact

**Developer Experience**:
- More intuitive syntax closer to JavaScript
- Better TypeScript integration
- Improved IDE support and autocomplete

**Maintainability**:
- Clearer conditional logic
- Better error messages
- Easier debugging and profiling

### @defer Benefits

**Performance Optimization**:
- Reduced initial bundle size
- Faster page load times
- Better resource utilization

**User Experience**:
- Progressive content loading
- Responsive interfaces
- Improved perceived performance

## 🚀 Next Steps

After mastering Control Flow:

1. **Apply to existing projects**: Gradually migrate structural directives
2. **Experiment with @defer**: Find optimal trigger combinations
3. **Monitor performance**: Use browser tools to measure improvements
4. **Explore advanced patterns**: Complex nested conditions and optimizations

---

**Next Module:** [Standalone Components & Routing](./STANDALONE.md)