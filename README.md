# Angular Shopping Cart Workshop

**Master the transition from RxJS to Angular Signals through building a comprehensive shopping cart application**

[![Angular](https://img.shields.io/badge/Angular-18+-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Angular_Signals-Latest-green.svg)](https://angular.dev/guide/signals)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Workshop Overview

This comprehensive workshop guides you through the evolution of reactive programming in Angular, from traditional RxJS patterns to modern Angular Signals. Build a feature-rich shopping cart application while learning cutting-edge Angular patterns and best practices.

### 🏆 Key Learning Outcomes

- **Master Angular Signals**: Understand reactive primitives and fine-grained reactivity
- **Migrate from RxJS**: Learn systematic migration strategies and patterns
- **Build Production-Ready UIs**: Implement responsive, accessible, and performant interfaces
- **Advanced State Management**: Handle complex application state with modern patterns
- **Performance Optimization**: Leverage signals for optimal change detection
- **Real-World Patterns**: Apply enterprise-grade architecture and testing strategies

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Angular CLI** 18+
- Modern browser with developer tools
- **Angular DevTools** extension (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd shopping-cart-workshop

# Install dependencies
npm install

# Start the development server
npm start

# Open browser to http://localhost:4200
```

## 📚 Workshop Levels

### 🟢 Level 1: Basic (RxJS Implementation)
**Master traditional reactive patterns**

- Learn RxJS BehaviorSubject and Observable patterns
- Implement reactive state management
- Handle asynchronous operations and side effects
- Build reactive UI components
- **Files**: `src/app/basic/services/shopping-cart-rxjs.service.ts`

### 🟡 Level 2: Intermediate (Signals + Computed)
**Transition to modern reactive programming**

- Understand Angular Signals fundamentals
- Implement computed signals for derived state
- Use effects for side effects and persistence
- Build advanced filtering and analytics
- **Files**: `src/app/intermediate/services/cart-computed.service.ts`

### 🔴 Level 3: Advanced (Resource API + Performance)
**Build production-ready applications**

- Master the Resource API for data fetching
- Implement complex signal compositions
- Build comprehensive analytics and monitoring
- Create export/import functionality
- **Files**: `src/app/advanced/services/product-resource.service.ts`

## 🎨 Modern UI Features

### 3-Column Responsive Cart Layout
Our cart implementation features a modern, responsive 3-column layout:

```
┌─────────────────────────────────────────────────────┐
│  [Image]  │        Item Details        │   Actions   │
│   80px    │                           │    160px    │
│           │  ┌─────────────────────┐   │             │
│           │  │ Name & Category     │   │ [Duplicate] │
│           │  │ Price per unit      │   │ [Wishlist]  │
│           │  └─────────────────────┘   │ [Remove]    │
│           │  ┌─────────────────────┐   │             │
│           │  │ [−] [2] [+] | $50   │   │             │
│           │  └─────────────────────┘   │             │
└─────────────────────────────────────────────────────┘
```

**Key Improvements:**
- **Responsive Design**: Adapts from 3-column desktop to single-column mobile
- **Accessibility**: 44px touch targets, ARIA labels, keyboard navigation
- **Performance**: Optimized CSS Grid with efficient breakpoints
- **Consistency**: Unified design across all three workshop levels

### Responsive Breakpoints
- **Desktop (1400px+)**: Full 3-column layout with spacious controls
- **Tablet (1200px-1400px)**: Compact 3-column with smaller elements
- **Mobile (768px-1200px)**: Stacked layout with larger touch targets
- **Small Mobile (<768px)**: Single column with centered content

## 🏗 Architecture

### Branch Strategy

| Branch | Purpose | Status |
|--------|---------|--------|
| `workshop-starter` | Educational skeleton code with TODOs | ✅ Current |
| `workshop-complete` | Full solution with comments | ✅ Ready |
| `production-ready` | Optimized production implementation | ✅ Ready |
| `main` | Final polished version | 🔄 In Progress |

### Project Structure

```
shopping-cart-workshop/
├── src/app/
│   ├── basic/              # Level 1: RxJS patterns
│   │   ├── services/       # State management services
│   │   └── components/     # UI components
│   ├── intermediate/       # Level 2: Signals + Computed
│   │   ├── services/       # Advanced signal patterns
│   │   └── components/     # Enhanced UI with filters
│   ├── advanced/          # Level 3: Resource API
│   │   ├── services/       # Production-ready services
│   │   └── components/     # Feature-rich components
│   └── shared/            # Common utilities and models
├── docs/                  # Comprehensive documentation
├── tests/                 # Test suites for each level
└── assets/               # Static resources and data
```

## 🛠 Available Commands

```bash
# Development
npm start                    # Start development server
npm run build               # Build for production
npm run test                # Run all tests
npm run lint                # Lint the codebase

# Level-specific testing
npm run test:basic          # Test basic level
npm run test:intermediate   # Test intermediate level
npm run test:advanced       # Test advanced level

# Documentation
npm run docs:serve          # Serve documentation locally
npm run docs:build          # Build documentation
```

## ✨ Features Implemented

### Core Shopping Cart
- ✅ **Add/Remove Products**: Intuitive cart management
- ✅ **Quantity Controls**: Responsive +/- buttons with validation
- ✅ **Real-time Calculations**: Automatic totals, tax, and discounts
- ✅ **Persistence**: LocalStorage with error handling
- ✅ **Bulk Operations**: Multi-item actions and optimizations

### Advanced Features
- ✅ **Smart Filtering**: Category, search, and price range filters
- ✅ **Dynamic Sorting**: Multiple sort options with live updates
- ✅ **Pagination**: Efficient data loading and navigation
- ✅ **Analytics Dashboard**: Real-time metrics and insights
- ✅ **Export/Import**: JSON-based cart data exchange
- ✅ **Wishlist Management**: Save items for later
- ✅ **History Tracking**: Undo/redo operations

### UI/UX Excellence
- ✅ **Responsive Design**: Mobile-first, progressive enhancement
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Modern Styling**: Clean, professional interface
- ✅ **Loading States**: Skeleton screens and progress indicators
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Performance**: Optimized rendering and minimal re-renders

## 🧪 Testing Strategy

### Automated Testing
- **Unit Tests**: Comprehensive service and component testing
- **Integration Tests**: End-to-end workflow validation
- **Performance Tests**: Signal update efficiency testing
- **Accessibility Tests**: Automated a11y validation

### Manual Testing Checklist
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design on various screen sizes
- ✅ Keyboard navigation and screen reader support
- ✅ Touch device usability
- ✅ Performance under load

## 📖 Documentation

| Document | Purpose |
|----------|--------|
| [Setup Instructions](docs/INSTRUCTIONS.md) | Getting started guide |
| [Basic Level Guide](docs/BASIC.md) | RxJS implementation |
| [Intermediate Guide](docs/INTERMEDIATE.md) | Signals transition |
| [Advanced Guide](docs/ADVANCED.md) | Resource API mastery |
| [Layout Guide](docs/LAYOUT_IMPROVEMENTS.md) | UI design patterns |
| [Branch Guide](docs/BRANCH_GUIDE.md) | Git workflow |
| [Changelog](docs/CHANGELOG.md) | Version history |

## 🎯 Success Criteria

You've mastered the workshop when you can:

- ✅ **Explain** the differences between RxJS and Signals
- ✅ **Implement** reactive state management with both approaches
- ✅ **Migrate** existing RxJS code to Signals systematically
- ✅ **Build** responsive, accessible UIs with modern patterns
- ✅ **Optimize** performance using fine-grained reactivity
- ✅ **Apply** production-ready patterns and error handling

## 🤝 Contributing

This workshop is designed for learning. Feel free to:

- **Experiment**: Modify code and explore different approaches
- **Extend**: Add new features or improve existing ones
- **Share**: Discuss learnings and insights with others
- **Report Issues**: Help improve the workshop experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team**: For Signals and the Resource API
- **Community**: For feedback and contributions
- **Educators**: For sharing knowledge and best practices

---

**Ready to start your Angular Signals journey?** 🚀

👉 **[Begin with Setup Instructions](docs/INSTRUCTIONS.md)**
