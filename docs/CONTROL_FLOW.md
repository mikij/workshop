# Control Flow - Modern Angular Template Syntax

Welcome to the **Control Flow** module of the Angular Shopping Cart Workshop! This module focuses on mastering Angular's new control flow syntax (@if, @for, @switch) and the powerful @defer directive for performance optimization.

## 🗺️ Workshop Structure & Navigation

This module provides **2 focused routes** to guide your learning journey:

### Route 1: `/control-flow` - Main Learning Space
**Comprehensive workspace for control flow migration and examples**
- **Purpose**: Convert structural directives to new control flow syntax with interactive examples
- **Focus**: @if, @for, @switch implementation, migration, and practical usage
- **File**: `cart-control-flow.component.ts`
- **When to use**: Start here for complete control flow learning experience

### Route 2: `/control-flow/performance` - Performance Optimization
**@defer implementation and performance monitoring**
- **Purpose**: Learn @defer triggers and measure performance improvements
- **Focus**: Lazy loading, viewport triggers, performance metrics, optimization strategies
- **File**: `performance-monitor.component.ts`
- **When to use**: After mastering control flow syntax, optimize with @defer patterns

## 🎯 Learning Path & Navigation Guide

**📋 Recommended Learning Sequence:**

1. **Start at `/control-flow`** (Complete Migration & Examples - 45 minutes)
   - Convert all structural directives to new syntax
   - Complete TODOs for @if, @for, @switch migration
   - Explore comprehensive examples and patterns
   - Test cart functionality with modern control flow

2. **Move to `/control-flow/performance`** (Performance Optimization - 30 minutes)
   - Implement @defer with different triggers
   - Monitor real-time performance improvements
   - Learn optimization strategies and best practices
   - Test performance simulations

**🧭 Navigation Tips:**
- Start with the main route for comprehensive learning
- Master control flow syntax before moving to performance
- Both routes contain working examples and hands-on exercises
- Use browser navigation to move between routes

## 🎯 Learning Objectives

By completing this module, you will:

- Master the new Angular control flow syntax (@if, @for, @switch)
- Migrate from structural directives (*ngIf, *ngFor, *ngSwitch) to modern syntax
- Implement advanced @defer patterns for performance optimization
- Understand different @defer triggers (viewport, interaction, timer, idle)
- Build complex conditional rendering scenarios
- Optimize template performance through deferred loading
- Create responsive layouts with intelligent loading strategies

## 🚀 Performance Benefits & Why @defer Matters

**Template Performance Improvements:**
- **20-30% faster rendering** with new control flow syntax
- **Reduced memory usage** through intelligent component loading
- **Better change detection** performance with optimized tracking
- **Smaller initial bundle** size with @defer lazy loading

**@defer Trigger Strategies:**
- **`on viewport`**: Load when user scrolls to content (recommended for below-fold content)
- **`on interaction`**: Load when user interacts with trigger element (great for modals, dropdowns)
- **`on timer(5s)`**: Load after specified time delay (useful for non-critical analytics)
- **`on idle`**: Load when browser is idle (perfect for background operations)

**Measurable Performance Gains:**
- **Initial page load**: 15-40% faster with proper @defer usage
- **Core Web Vitals**: Improved LCP and FID scores
- **Memory usage**: 20-30% reduction in initial memory footprint
- **User experience**: Progressive loading creates smoother interactions

## 📁 Files You'll Work With

**Route Components (The 2 Learning Stages):**
- `src/app/control-flow/components/cart-control-flow.component.ts` - **Route 1** (comprehensive migration workspace with examples)
- `src/app/control-flow/components/performance-monitor.component.ts` - **Route 2** (@defer performance optimization and monitoring)

**Supporting Files:**
- `src/app/control-flow/services/control-flow-cart.service.ts` - Cart service with signal-based state and performance tracking
- `src/app/control-flow/control-flow.routes.ts` - Route definitions for the 2 learning stages

**CSS Files (Pre-styled):**
- `cart-control-flow.component.css` - Styling for main workspace and examples
- `performance-monitor.component.css` - Styling for performance dashboard and metrics

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

### Step 1: Start Your Development Environment
```bash
# Ensure you're in the workshop directory
cd shopping-cart-workshop

# Start the development server
npm start

# Open browser to workshop
# Navigate to: http://localhost:4200
```

### Step 2: Navigate to Control Flow Module
1. **Click "Control Flow"** in the main navigation
2. **You'll land at `/control-flow`** - the main learning space
3. **Begin with basic migration tasks** in the component file

### Step 3: Understand the Migration Pattern
Angular's new control flow provides better performance and cleaner syntax:

```html
<!-- OLD: Structural directives (what you'll convert FROM) -->
<div *ngIf="cartService.cartItems().length > 0">
  <div *ngFor="let item of cartService.cartItems(); trackBy: trackById">
    {{ item.name }}
  </div>
</div>

<!-- NEW: Control flow syntax (what you'll convert TO) -->
@if (cartService.cartItems().length > 0) {
  @for (item of cartService.cartItems(); track item.id) {
    {{ item.name }}
  }
}
```

### Step 4: Follow the Focused Learning Path
1. **Route 1**: `/control-flow` → Complete migration & examples (START HERE)
2. **Route 2**: `/control-flow/performance` → @defer optimization & monitoring

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

### Task 6: Performance Monitoring Dashboard (`/control-flow/performance`)

**Goal**: Learn @defer triggers and monitor real-time performance improvements.

**What the Performance Route Does:**
- **Real-time metrics tracking**: Monitor render times, memory usage, and FPS
- **@defer simulation**: Compare immediate vs deferred loading performance
- **Interactive performance testing**: Test different @defer triggers
- **Performance optimization tips**: Learn when to use each @defer trigger

**Key Features to Explore:**
```html
<!-- Real-time performance monitoring -->
@if (performanceMetrics().length > 0) {
  <div class="metrics-grid">
    @for (metric of performanceMetrics(); track metric.name) {
      <div class="metric-card" [class]="'status-' + metric.status">
        <h3>{{ metric.name }}</h3>
        <span class="value">{{ metric.value }}{{ metric.unit }}</span>
        
        @switch (metric.status) {
          @case ('good') {
            <div class="status-indicator good">✓ Good</div>
          }
          @case ('warning') {
            <div class="status-indicator warning">⚠ Warning</div>
          }
          @case ('critical') {
            <div class="status-indicator critical">⚠ Critical</div>
          }
        }
      </div>
    }
  </div>
}

<!-- @defer simulation tools -->
<div class="defer-controls">
  <button (click)="simulateHeavyComponent()">
    Simulate Heavy Component (Immediate)
  </button>
  <button (click)="simulateDeferredLoad()">
    Simulate @defer Load (Optimized)
  </button>
</div>

<!-- Compare loading performance -->
@if (simulationResults().length > 0) {
  @for (result of simulationResults(); track result.timestamp) {
    <div class="simulation-item">
      <strong>{{ result.type }}</strong>
      <span>Load Time: {{ result.loadTime }}ms</span>
      <span>Memory: {{ result.memoryUsage }}MB</span>
      <span [class]="result.deferred ? 'deferred' : 'immediate'">
        {{ result.deferred ? 'Deferred ✓' : 'Immediate' }}
      </span>
    </div>
  }
}
```

**Performance Testing Workflow:**
1. **Navigate to `/control-flow/performance`**
2. **Click "Start Monitoring"** to begin real-time metrics
3. **Run simulations** to compare immediate vs deferred loading
4. **Observe performance differences** in load times and memory usage
5. **Learn @defer trigger patterns** from the optimization tips section

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

## 🎯 Success Criteria & Migration Phases

### Phase 1: Complete Migration (`/control-flow`) ✅
**You've completed this phase when:**
- ✅ All `*ngIf` converted to `@if` syntax
- ✅ All `*ngFor` converted to `@for` with proper `track` expressions
- ✅ All `[ngSwitch]` converted to `@switch/@case/@default`
- ✅ Complex nested @if/@for/@switch combinations work
- ✅ @empty states display for empty arrays
- ✅ Local variables ($index, $first, $last) work in @for loops
- ✅ Cart functionality works identically to before migration
- ✅ No console errors or template compilation issues

**Verification Steps:**
1. **Add items to cart** → Cart displays correctly with @if
2. **Remove items** → @for updates properly with tracking
3. **Use filters** → @switch handles different filter types
4. **Check empty states** → @else conditions work properly
5. **Test complex patterns** → Nested control flow works smoothly

### Phase 2: Performance Optimization (`/control-flow/performance`) ✅
**You've completed this phase when:**
- ✅ @defer triggers work correctly (viewport, interaction, timer, idle)
- ✅ Performance monitoring shows measurable improvements
- ✅ Loading states provide smooth user experience
- ✅ Heavy components load only when needed
- ✅ Page load time improves by 15-30%

**Performance Verification:**
1. **Open DevTools Performance tab**
2. **Record loading with and without @defer**
3. **Compare initial bundle size and load times**
4. **Verify deferred components load on triggers**

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