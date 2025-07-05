# Shopping Cart Workshop - Setup Instructions

Welcome to the **Angular RxJS → Signals Migration Workshop**! This comprehensive workshop will guide you through migrating a shopping cart implementation from RxJS patterns to Angular Signals.

## 🎯 Workshop Overview

This workshop is divided into three progressive levels:

- **Basic Level**: Traditional RxJS implementation with BehaviorSubjects and Observables
- **Intermediate Level**: Migration to Signals with computed values and effects
- **Advanced Level**: Advanced patterns using Resource API and performance optimization

## 🚀 Getting Started

### Prerequisites

Before starting the workshop, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher) 
- **Angular CLI** (version 18 or higher)
- A modern code editor (VS Code recommended)
- **Angular DevTools** browser extension (recommended)

### Setup Instructions

1. **Clone or download the project**
   ```bash
   cd shopping-cart-workshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

5. **Install Angular DevTools** (if not already installed)
   - Chrome: [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/)
   - Firefox: [Angular DevTools](https://addons.mozilla.org/en-US/firefox/addon/angular-devtools/)

## 📁 Project Structure

```
shopping-cart-workshop/
├── src/
│   ├── app/
│   │   ├── basic/              # Level 1: RxJS Implementation
│   │   │   ├── services/
│   │   │   │   ├── shopping-cart-rxjs.service.ts    # STARTER CODE
│   │   │   │   └── shopping-cart-signals.service.ts # SOLUTION
│   │   │   └── components/
│   │   ├── intermediate/       # Level 2: Signals + Computed
│   │   │   ├── services/
│   │   │   │   ├── cart-computed.service.ts         # STARTER CODE  
│   │   │   │   └── cart-effects.service.ts          # ADDITIONAL FEATURES
│   │   │   └── components/
│   │   ├── advanced/          # Level 3: Resource API + Advanced
│   │   │   ├── services/
│   │   │   │   ├── product-resource.service.ts      # STARTER CODE
│   │   │   │   └── advanced-cart.service.ts         # SOLUTION
│   │   │   └── components/
│   │   └── shared/           # Shared models, components, utilities
│   ├── assets/
│   │   ├── data/
│   │   │   └── products.json  # Mock product data
│   │   └── styles/           # CSS variables and components
│   └── environments/
├── tests/                    # Comprehensive test suites
├── docs/                     # Workshop documentation
└── package.json
```

## 🎓 Workshop Levels

### Level 1: Basic (RxJS Implementation)
**Learning Objectives:**
- Master RxJS BehaviorSubject and Observable patterns
- Implement reactive state management
- Handle asynchronous operations
- Create reactive UI components

**Key Files:**
- `src/app/basic/services/shopping-cart-rxjs.service.ts`
- `src/app/basic/components/cart-basic.component.ts`

### Level 2: Intermediate (Signals + Computed)
**Learning Objectives:**
- Understand Angular Signals fundamentals
- Learn computed signals for derived state
- Implement effects for side effects
- Compare RxJS vs Signals patterns

**Key Files:**
- `src/app/intermediate/services/cart-computed.service.ts`
- `src/app/intermediate/services/cart-effects.service.ts`
- `src/app/intermediate/components/cart-intermediate.component.ts`

### Level 3: Advanced (Resource API + Performance)
**Learning Objectives:**
- Master the Resource API for data fetching
- Implement advanced signal patterns
- Optimize performance with fine-grained reactivity
- Build production-ready cart analytics

**Key Files:**
- `src/app/advanced/services/product-resource.service.ts`
- `src/app/advanced/services/advanced-cart.service.ts`
- `src/app/advanced/components/cart-advanced.component.ts`

## 🛠 Available Scripts

```bash
# Development
npm start                    # Start development server
npm run build               # Build for production
npm run test                # Run all tests
npm run lint                # Lint the codebase

# Level-specific commands
npm run start:basic         # Start basic level only
npm run start:intermediate  # Start intermediate level only  
npm run start:advanced      # Start advanced level only

# Testing by level
npm run test:basic          # Test basic level
npm run test:intermediate   # Test intermediate level
npm run test:advanced       # Test advanced level
```

## 🧭 Navigation

The workshop includes a navigation header that allows you to switch between levels:

- **Basic Level** (Green badge): RxJS implementation
- **Intermediate Level** (Orange badge): Signals + Computed  
- **Advanced Level** (Red badge): Resource API + Advanced patterns

Each level is fully functional and can be explored independently.

## 📊 Features Implemented

### Shopping Cart Functionality
- ✅ Add/remove products to/from cart
- ✅ Update item quantities
- ✅ Real-time price calculation with discounts
- ✅ Tax calculation (progressive rates)
- ✅ Shipping cost calculation
- ✅ Cart persistence (localStorage)
- ✅ Bulk operations and optimizations

### Product Catalog
- ✅ Product grid with search and filtering
- ✅ Category-based filtering
- ✅ Price range filtering
- ✅ Multiple sorting options
- ✅ Pagination support
- ✅ Product recommendations

### Advanced Features (Level 3)
- ✅ Cart analytics and metrics
- ✅ Session tracking
- ✅ Export/import functionality
- ✅ Undo/redo operations
- ✅ Performance monitoring
- ✅ Real-time sync simulation

## 🔧 Development Tools

### Angular DevTools
Use Angular DevTools to inspect:
- Signal values and dependencies
- Component tree and change detection
- Performance profiler
- Dependency injection tree

### Browser DevTools
Monitor in the Console:
- Cart state changes
- Performance metrics
- Local storage operations
- Network requests (in advanced level)

## 🐛 Troubleshooting

### Common Issues

**Issue:** `ng serve` fails to start
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Angular DevTools not showing signals
**Solution:** 
- Ensure you have Angular DevTools extension installed
- Refresh the page after opening DevTools
- Make sure you're using Angular 16+

**Issue:** Tests failing
**Solution:**
```bash
# Run tests with more verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- --include="**/basic/**"
```

**Issue:** TypeScript compilation errors
**Solution:**
- Ensure you're using TypeScript 5.4+
- Check that all imports are correct
- Verify that experimental signals are enabled

### Browser Compatibility

This workshop requires:
- Chrome 100+ (recommended for best DevTools experience)
- Firefox 100+
- Safari 15+
- Edge 100+

## 📚 Additional Resources

### Documentation
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [RxJS Documentation](https://rxjs.dev)
- [Angular DevTools Guide](https://angular.dev/tools/devtools)

### Reference Materials
- [signals RFC](https://github.com/angular/angular/discussions/49685)
- [Resource API RFC](https://github.com/angular/angular/discussions/51365)
- [Migration Guide: RxJS to Signals](https://angular.dev/guide/signals#migrating-from-rxjs)

## 🎯 Workshop Goals

By the end of this workshop, you will:

1. **Understand** the fundamental differences between RxJS and Signals
2. **Implement** reactive state management using both approaches
3. **Migrate** existing RxJS code to Signals systematically
4. **Optimize** performance using fine-grained reactivity
5. **Build** production-ready applications with modern Angular patterns

## 🤝 Getting Help

If you encounter issues during the workshop:

1. **Check the documentation** in the `docs/` folder
2. **Review the test files** for expected behavior
3. **Use Angular DevTools** to inspect signal state
4. **Look at the solution files** for reference
5. **Check the browser console** for error messages

## 📝 Next Steps

1. Start with the [Basic Level Instructions](./BASIC.md)
2. Complete the exercises in order
3. Run tests to verify your implementation
4. Review the solution code when ready
5. Move to the next level

Good luck with your Angular Signals journey! 🚀