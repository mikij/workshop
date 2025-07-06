# Basic Level - RxJS Shopping Cart Implementation

Welcome to the **Basic Level** of the Angular Shopping Cart Workshop! In this level, you'll implement a reactive shopping cart using traditional RxJS patterns with BehaviorSubjects and Observables.

## 🎯 Learning Objectives

By completing this level, you will:

- Master RxJS `BehaviorSubject` and `Observable` patterns
- Implement reactive state management for a shopping cart
- Handle asynchronous operations and side effects
- Create reactive UI components that respond to state changes
- Understand data flow in reactive applications
- Implement local storage persistence

## 📁 Files You'll Work With

**Primary Files:**
- `src/app/basic/services/shopping-cart-rxjs.service.ts` - **STARTER FILE** (your main workspace)
- `src/app/basic/components/cart-basic.component.ts` - UI component (pre-built)

**Reference Files:**
- `src/app/basic/services/shopping-cart-signals.service.ts` - **SOLUTION** (don't peek too early!)
- `src/app/shared/services/product.service.ts` - Product data service (pre-built)

## 🏗 Architecture Overview

The RxJS implementation follows these patterns:

```
┌─────────────────────────────────────────────┐
│              Component Layer                │
│  ┌─────────────────────────────────────┐   │
│  │     CartBasicComponent              │   │
│  │  - Subscribes to cart state        │   │
│  │  - Displays products and cart      │   │
│  │  - Handles user interactions       │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ subscribes to
                  ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│  ┌─────────────────────────────────────┐   │
│  │   ShoppingCartRxjsService           │   │
│  │  - BehaviorSubject<CartItem[]>      │   │
│  │  - Observable streams               │   │
│  │  - State management logic          │   │
│  │  - LocalStorage persistence        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Examine the Starter Code

Open `src/app/basic/services/shopping-cart-rxjs.service.ts` and examine the starter code:

```typescript
@Injectable({ providedIn: 'root' })
export class ShoppingCartRxjsService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  
  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();
  
  constructor() {
    // TODO: Load items from localStorage if available
    // TODO: Auto-update total when items change
  }
  
  // TODO: Implement methods
}
```

### Step 2: Navigate to Basic Level

1. Start the development server: `npm start`
2. Open your browser to `http://localhost:4200`
3. Click on "Basic Level" in the navigation
4. You should see the basic shopping cart interface

## 📝 Implementation Tasks

### Task 1: Initialize the Service

**Goal**: Set up the service constructor with localStorage loading and automatic total calculation.

**Requirements**:
```typescript
constructor() {
  // Load cart from localStorage on initialization
  this.loadCartFromStorage();
  
  // Subscribe to items changes and update total automatically
  this.items$.subscribe(items => {
    const total = this.calculateTotal(items);
    this.totalSubject.next(total);
  });
}
```

**Key Concepts**:
- Service initialization
- Reactive streams setup
- Automatic derived state calculation

### Task 2: Implement `addItem` Method

**Goal**: Add products to the cart, handling both new items and quantity updates.

**Method Signature**:
```typescript
addItem(product: Product): void
```

**Requirements**:
- If item doesn't exist, add it with quantity 1
- If item exists, increase quantity by 1
- Update the BehaviorSubject with new state
- Save to localStorage

**Hints**:
```typescript
addItem(product: Product): void {
  const currentItems = this.itemsSubject.value;
  const existingItem = currentItems.find(item => item.productId === product.id);
  
  if (existingItem) {
    // TODO: Update quantity
  } else {
    // TODO: Create new CartItem and add to array
  }
  
  // TODO: Update BehaviorSubject and save to storage
}
```

### Task 3: Implement `removeItem` Method

**Goal**: Remove items from the cart completely.

**Method Signature**:
```typescript
removeItem(productId: string): void
```

**Requirements**:
- Remove item with matching productId
- Update BehaviorSubject
- Save to localStorage

### Task 4: Implement `updateQuantity` Method

**Goal**: Update the quantity of an existing cart item.

**Method Signature**:
```typescript
updateQuantity(productId: string, quantity: number): void
```

**Requirements**:
- If quantity ≤ 0, remove the item
- Otherwise, update the item's quantity
- Update BehaviorSubject
- Save to localStorage

### Task 5: Implement `clearCart` Method

**Goal**: Remove all items from the cart.

**Method Signature**:
```typescript
clearCart(): void
```

**Requirements**:
- Set items to empty array
- Update BehaviorSubject
- Clear localStorage

### Task 6: Implement `getCartSummary` Method

**Goal**: Create an Observable that provides calculated cart totals.

**Method Signature**:
```typescript
getCartSummary(): Observable<CartSummary>
```

**Requirements**:
- Return Observable that emits CartSummary
- Calculate total items, total price, discounts, tax, and final price
- Use the `map` operator to transform cart items

**CartSummary Interface**:
```typescript
interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  tax: number;           // 8% of (totalPrice - totalDiscount)
  finalPrice: number;    // totalPrice - totalDiscount + tax
}
```

### Task 7: Implement `getTotalItems` Method

**Goal**: Create an Observable that emits the total number of items.

**Method Signature**:
```typescript
getTotalItems(): Observable<number>
```

**Requirements**:
- Return Observable<number>
- Sum all item quantities
- Use RxJS operators

### Task 8: Implement Helper Methods

**Goal**: Complete the utility methods for the service.

**Methods to Implement**:

```typescript
private calculateTotal(items: CartItem[]): number {
  // Calculate the total price of all items
  // Include quantity multiplication
}

private generateId(): string {
  // Generate unique ID for cart items
  // Combine timestamp and random string
}

private saveCartToStorage(): void {
  // Save current cart items to localStorage
  // Handle browser compatibility
}

private loadCartFromStorage(): void {
  // Load cart items from localStorage
  // Handle JSON parsing errors gracefully
}
```

## ✅ Testing Your Implementation

### Manual Testing

1. **Add Items**: Click "Add to Cart" on various products
2. **Quantity Updates**: Use +/- buttons to modify quantities
3. **Remove Items**: Click "Remove" buttons
4. **Clear Cart**: Use "Clear Cart" button
5. **Persistence**: Refresh the page and verify cart persists
6. **Calculations**: Verify totals, discounts, and tax are correct

### Automated Testing

Run the test suite for the basic level:

## 🧪 Code Examples

### Adding an Item (Complete Example)

```typescript
addItem(product: Product): void {
  const currentItems = this.itemsSubject.value;
  const existingItem = currentItems.find(item => item.productId === product.id);
  
  if (existingItem) {
    // Item exists, increase quantity
    this.updateQuantity(product.id, existingItem.quantity + 1);
  } else {
    // New item, add to cart
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
    
    const updatedItems = [...currentItems, newItem];
    this.itemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }
}
```

### Cart Summary with RxJS Operators

```typescript
getCartSummary(): Observable<CartSummary> {
  return this.items$.pipe(
    map(items => {
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalDiscount = items.reduce((sum, item) => {
        const discount = item.discount || 0;
        return sum + (item.price * item.quantity * discount / 100);
      }, 0);
      
      const tax = (totalPrice - totalDiscount) * 0.08;
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
```

## 🔧 Debugging Tips

### Common Issues

**Issue**: "Cannot read property 'value' of undefined"
**Solution**: Ensure BehaviorSubject is properly initialized

**Issue**: Items not persisting after page refresh
**Solution**: Check localStorage browser compatibility and error handling

**Issue**: Cart total not updating automatically  
**Solution**: Verify subscription in constructor is set up correctly

### Using Angular DevTools

1. Open Angular DevTools in your browser
2. Navigate to the "Components" tab
3. Select the CartBasicComponent
4. Observe the service subscriptions and data flow

### Console Debugging

Add debug logging to your service:

```typescript
addItem(product: Product): void {
  console.log('Adding item:', product);
  // ... implementation
  console.log('Current cart:', this.itemsSubject.value);
}
```

## 📊 Performance Considerations

### RxJS Best Practices Applied

1. **Memory Management**: Component properly unsubscribes in `ngOnDestroy`
2. **Efficient Updates**: Using `BehaviorSubject.next()` for state updates
3. **Derived State**: Automatic total calculation via subscription
4. **Immutability**: Creating new arrays instead of mutating existing ones

### What You'll Learn

- How to manage reactive state with RxJS
- Subscription management and cleanup
- Data transformation with operators
- Side effect handling (localStorage)
- Testing reactive services

## 🎯 Success Criteria

You've successfully completed the Basic Level when:

- ✅ Cart functionality works in the browser
- ✅ Items persist across page refreshes
- ✅ Calculations are accurate (including tax and discounts)
- ✅ Code follows RxJS best practices
- ✅ No memory leaks or subscription issues

## 🚀 Ready for the Next Level?

Once you've completed the Basic Level:

1. **Review your implementation** against the solution file
2. **Understand the RxJS patterns** you've implemented
3. **Consider the challenges** of this approach (subscription management, boilerplate)
4. **Move to [Intermediate Level](./INTERMEDIATE.md)** to see how Signals can simplify this code

## 💡 Key Takeaways

The RxJS approach provides:
- **Powerful reactive patterns** for complex data flows
- **Fine-grained control** over subscriptions and operators
- **Mature ecosystem** with extensive operator library
- **Excellent interoperability** with existing Angular code

However, it also introduces:
- **Subscription management complexity**
- **Memory leak potential** if not handled properly  
- **Verbose syntax** for simple state management
- **Learning curve** for developers new to reactive programming

In the next level, you'll see how Angular Signals can address these challenges while maintaining the reactive benefits!

---

**Next:** [Intermediate Level - Signals + Computed](./INTERMEDIATE.md)
