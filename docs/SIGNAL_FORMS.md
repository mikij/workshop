# 🔥 Angular Signal Forms Workshop

Welcome to the comprehensive Angular Signal Forms workshop! This hands-on learning experience will guide you through mastering Angular's experimental Signal-Based Forms API through practical shopping cart scenarios.

## 🎯 Workshop Overview

This workshop consists of 4 progressive tasks that build upon each other:

1. **🛍️ Product Management Form (Beginner)** - Basic signal forms with validation
2. **🛒 Multi-Step Checkout Form (Intermediate)** - Complex conditional validation 
3. **👤 User Profile Form (Intermediate)** - Nested forms and dynamic sections
4. **⭐ Custom Controls (Advanced)** - Building reusable form controls

## 📚 Learning Objectives

By completing this workshop, you will:

- ✅ Master the `form()` function and signal-driven validation
- ✅ Understand `FormValueControl` and `FormCheckboxControl` interfaces
- ✅ Build complex forms with conditional validation using `applyWhen()`
- ✅ Create custom form controls that integrate with signal forms
- ✅ Handle form submission with the `submit()` function
- ✅ Implement real-time validation and error handling
- ✅ Build accessible and user-friendly form interfaces

## 🚀 Getting Started

### Prerequisites

- Angular 18+ with Signal Forms enabled
- Basic understanding of Angular Signals
- Familiarity with reactive forms concepts

### Installation

1. Navigate to the Signal Forms workshop:
   ```bash
   cd src/app/signal-forms
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Navigate to `/signal-forms` in your browser

## 📖 Workshop Tasks

### Task 1: Product Management Form (Beginner)

**Location**: `components/product-form.component.ts`

**Objectives**:
- Replace traditional FormBuilder with `form()` function
- Implement signal-driven validation display
- Create computed properties for form state
- Handle form submission with `submit()`

**Key Concepts**:
```typescript
// Signal Form Creation
productForm = form(
  signal<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    description: '',
    inStock: true,
    imageUrl: ''
  }),
  (f) => {
    required(f.name);
    required(f.category);
    required(f.price);
    min(f.price, 0.01);
    minLength(f.description, 10);
  }
);

// Form Submission
async onSubmit() {
  await submit(this.productForm, async (form) => {
    const productData = form().value();
    const result = await this.productService.createProduct(productData);
    return result.errors;
  });
}
```

**Success Criteria**:
- ✅ Form validates required fields (name, category, price)
- ✅ Validation errors display in real-time
- ✅ Form submission works with loading states
- ✅ Success/error messages show appropriately

### Task 2: Multi-Step Checkout Form (Intermediate)

**Location**: `components/checkout-form.component.ts`

**Objectives**:
- Build multi-step forms with signal-driven navigation
- Implement conditional validation based on user selections
- Handle cross-field validation and dependencies
- Create smooth step progression with validation

**Key Concepts**:
```typescript
// Multi-Step Form with Conditional Validation
checkoutForm = form(
  signal<CheckoutFormData>({
    shipping: { firstName: '', lastName: '', email: '', ... },
    payment: { method: 'credit', cardNumber: '', ... },
    options: { expeditedShipping: false, ... }
  }),
  (f) => {
    // Shipping validation
    required(f.shipping.firstName);
    required(f.shipping.lastName);
    email(f.shipping.email);
    
    // Conditional payment validation
    applyWhen(
      f,
      ({ value }) => value().payment.method !== 'paypal',
      (form) => {
        required(form.payment.cardNumber);
        required(form.payment.expiryDate);
        pattern(form.payment.cardNumber, /^\d{16}$/);
      }
    );
  }
);
```

**Success Criteria**:
- ✅ Step navigation works smoothly
- ✅ Conditional validation based on payment method
- ✅ Address validation with optional "same as billing"
- ✅ Form progression tracking
- ✅ Comprehensive error handling and display

### Task 3: User Profile Form (Intermediate)

**Location**: `components/user-profile-form.component.ts`

**Objectives**:
- Create nested forms with signal-driven structure
- Implement dynamic sections based on user preferences
- Handle complex validation rules across multiple sections
- Manage conditional field visibility

**Key Concepts**:
```typescript
// Nested Form with Dynamic Sections
profileForm = form(
  signal<UserProfileFormData>({
    personal: { firstName: '', lastName: '', userType: 'customer', ... },
    address: { includeAddress: false, street: '', ... },
    merchant: { businessName: '', businessType: '', ... },
    preferences: { newsletter: false, notifications: 'email', ... },
    security: { changePassword: false, newPassword: '', ... }
  }),
  (f) => {
    // Personal section validation
    required(f.personal.firstName);
    required(f.personal.lastName);
    required(f.personal.email);
    
    // Conditional merchant validation
    applyWhen(
      f,
      ({ value }) => value().personal.userType === 'merchant',
      (form) => {
        required(form.merchant.businessName);
        required(form.merchant.businessType);
      }
    );
    
    // Conditional address validation
    applyWhen(
      f,
      ({ value }) => value().address.includeAddress,
      (form) => {
        required(form.address.street);
        required(form.address.city);
      }
    );
  }
);
```

**Success Criteria**:
- ✅ Nested form structure with multiple sections
- ✅ Dynamic sections based on user selections
- ✅ Cross-section validation working correctly
- ✅ Smooth UI transitions for conditional fields
- ✅ Comprehensive error handling and display

### Task 4: Custom Form Controls (Advanced)

**Location**: `components/review-form.component.ts` + `custom-controls/`

**Objectives**:
- Build custom controls implementing `FormValueControl<T>`
- Create reusable rating, quantity, and price controls
- Integrate custom controls with form validation
- Handle complex user interactions

**Key Concepts**:
```typescript
// Custom Rating Control
@Component({
  selector: 'app-rating-control',
  // ... template and styles
})
export class RatingControlComponent implements FormValueControl<number> {
  value = model<number>(0);
  maxRating = input<number>(5);
  disabled = input<boolean>(false);
  
  selectRating(rating: number): void {
    if (!this.disabled()) {
      this.value.set(rating);
    }
  }
}

// Using Custom Control in Form
reviewForm = form(
  signal<ReviewFormData>({
    rating: 0,
    title: '',
    content: '',
    photos: [],
    tags: []
  }),
  (f) => {
    required(f.rating);
    min(f.rating, 1);
    max(f.rating, 5);
    required(f.title);
    minLength(f.content, 20);
  }
);
```

**Success Criteria**:
- ✅ Custom rating control with proper validation
- ✅ Photo upload with preview and file validation
- ✅ Dynamic tag selector working correctly
- ✅ Custom controls integrate with signal form validation
- ✅ Comprehensive error handling for custom controls

## 🔧 Advanced Features

### Form State Management

The workshop includes a `SignalFormService` for advanced form state management:

```typescript
// Register form for auto-save and persistence
this.signalFormService.registerForm('checkout-form', initialData);

// Enable auto-save every 30 seconds
this.signalFormService.enableAutoSave('checkout-form', 30000);

// Save form manually
this.signalFormService.saveFormData('checkout-form');

// Load saved data
const savedData = this.signalFormService.loadFormData('checkout-form');
```

### Custom Validation

Create custom validators for complex business logic:

```typescript
function customEmailValidator(control: any) {
  return (form: any) => {
    const email = form.value();
    if (email.endsWith('@company.com')) {
      return null; // Valid
    }
    return [{ kind: 'custom', message: 'Must use company email' }];
  };
}
```

### Async Validation

Handle server-side validation with `validateAsync()`:

```typescript
// In form definition
validateAsync(f.email, async (value) => {
  const exists = await this.userService.checkEmailExists(value);
  return exists ? [{ kind: 'exists', message: 'Email already taken' }] : [];
});
```

## 🧪 Testing Your Implementation

Run the built-in tests to verify your implementation:

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

## 🎯 Bonus Challenges

Once you've completed the core tasks, try these advanced challenges:

### Level 1: Enhanced UX
- Add form auto-save functionality
- Implement smooth animations between form steps
- Create loading states and progress indicators
- Add keyboard navigation support

### Level 2: Advanced Features
- Build form templates and cloning system
- Add real-time collaborative editing
- Implement form version history
- Create advanced validation with external APIs

### Level 3: Performance & Scale
- Implement virtual scrolling for large forms
- Add form state caching and optimization
- Create form analytics and tracking
- Build multi-language form support

## 📋 Workshop Checklist

Track your progress through the workshop:

- [ ] **Setup Complete**: Project running and accessible
- [ ] **Task 1 Complete**: Product form with signal validation
- [ ] **Task 2 Complete**: Multi-step checkout with conditional logic
- [ ] **Task 3 Complete**: User profile with nested forms
- [ ] **Task 4 Complete**: Custom controls integration
- [ ] **Documentation**: Read through all provided examples
- [ ] **Testing**: All form validations working correctly
- [ ] **Bonus**: Attempted at least one advanced challenge

## 🆘 Troubleshooting

### Common Issues

**Form not updating**: Ensure you're using `signal()` for form data and updating values correctly.

**Validation not working**: Check that validation functions are called within the form definition callback.

**Custom controls not integrating**: Verify that custom controls implement `FormValueControl<T>` interface correctly.

**Performance issues**: Make sure you're using `computed()` for derived state and avoiding unnecessary re-renders.

### Getting Help

- Check the TODO comments in each component for specific guidance
- Review the working examples in the Angular source code
- Refer to the Signal Forms documentation
- Ask questions in the workshop discussion forum

## 🎓 Next Steps

After completing this workshop:

1. Explore the Signal Forms source code in `/packages/forms/signals`
2. Build your own custom form controls for your projects
3. Integrate Signal Forms into existing applications
4. Share your learnings with the Angular community

## 📄 Additional Resources

- [Angular Signal Forms Documentation](https://angular.dev/guide/forms)
- [Signal Forms API Reference](https://angular.dev/api/forms/signals)
- [Workshop Slides](/slides.md#signal-based-forms)
- [Community Examples and Patterns](https://github.com/angular/angular/discussions)

---

Happy coding! 🚀 Remember, the best way to learn is by building. Don't be afraid to experiment and try new approaches as you work through the workshop tasks.