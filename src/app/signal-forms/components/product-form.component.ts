import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, minLength, min, max } from '@angular/forms/signals';
import { Product } from '../../shared/models/product.model';
import { Category } from '../../shared/models/category.model';
import { ProductService } from '../../shared/services/product.service';

/**
 * 🛍️ TASK 1: PRODUCT MANAGEMENT FORM (BEGINNER LEVEL)
 * 
 * LEARNING OBJECTIVES:
 * - Create signal-driven forms with validation
 * - Display validation errors using signals
 * - Submit forms with the submit() function
 * - Integrate with existing services
 * 
 * WORKSHOP INSTRUCTIONS:
 * 1. Replace FormBuilder with signal forms API
 * 2. Implement signal-driven validation display
 * 3. Create computed properties for form state
 * 4. Add form submission with error handling
 * 
 * SUCCESS CRITERIA:
 * ✅ Form validates required fields (name, category, price)
 * ✅ Validation errors display in real-time
 * ✅ Form submission works with loading states
 * ✅ Success/error messages show appropriately
 */

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-form-container">
      <h2>🛍️ Product Management Form</h2>
      <p class="task-description">
        Create and edit products using Angular Signal Forms with real-time validation
      </p>

      <!-- TODO: Replace with signal-driven form -->
      <form class="product-form" (ngSubmit)="onSubmit()">
        
        <!-- Product Name Field -->
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input 
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter product name">
          
          <!-- TODO: Add signal-driven error display -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement signal-based error display</p>
            <small>Expected: Show "Product name is required" when empty</small>
          </div>
        </div>

        <!-- Category Selection -->
        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" class="form-control">
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
          
          <!-- TODO: Add category validation -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement category selection validation</p>
          </div>
        </div>

        <!-- Price Field -->
        <div class="form-group">
          <label for="price">Price *</label>
          <div class="input-group">
            <span class="input-prefix">$</span>
            <input 
              id="price"
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              placeholder="0.00">
          </div>
          
          <!-- TODO: Add price validation (positive number) -->
          <div class="error-placeholder">
            <p>⚠️ TODO: Implement price validation</p>
            <small>Expected: Price must be positive number</small>
          </div>
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            class="form-control"
            rows="4"
            placeholder="Describe the product..."
            maxlength="500"></textarea>
          
          <!-- Character count with signals -->
          <div class="form-help">
            <!-- TODO: Add signal-driven character counter -->
            <small>⚠️ TODO: Show character count (0/500)</small>
          </div>
        </div>

        <!-- In Stock Toggle -->
        <div class="form-group">
          <div class="checkbox-wrapper">
            <input 
              id="inStock"
              type="checkbox"
              class="checkbox">
            <label for="inStock">Product is in stock</label>
          </div>
        </div>

        <!-- Image URL Field -->
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input 
            id="imageUrl"
            type="url"
            class="form-control"
            placeholder="https://example.com/product-image.jpg">
          
          <!-- Image Preview -->
          <!-- TODO: Add conditional image preview -->
          <div class="image-preview-placeholder">
            <p>⚠️ TODO: Add image preview when URL is valid</p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <!-- TODO: Implement proper form state management -->
          <button 
            type="submit"
            class="btn btn-primary"
            disabled>
            <!-- TODO: Add loading state with signals -->
            Save Product
          </button>
          
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="resetForm()">
            Reset Form
          </button>
        </div>
      </form>

      <!-- Form State Debug Panel (Development Only) -->
      <div class="debug-panel">
        <h4>🔍 Form State (Debug)</h4>
        <div class="debug-content">
          <!-- TODO: Add signal-driven form state display -->
          <div class="debug-placeholder">
            <p>⚠️ TODO: Implement form state debugging</p>
            <ul>
              <li>Form Valid: <code>unknown</code></li>
              <li>Form Touched: <code>unknown</code></li>
              <li>Form Dirty: <code>unknown</code></li>
              <li>Submitting: <code>unknown</code></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="message-area">
        <!-- TODO: Add signal-driven success/error messages -->
        <div class="message-placeholder">
          <p>⚠️ TODO: Implement success/error message display</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .task-description {
      background: #e7f3ff;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      margin-bottom: 2rem;
      color: #0056b3;
    }

    .product-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .input-group {
      display: flex;
      align-items: center;
    }

    .input-prefix {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-right: none;
      border-radius: 8px 0 0 8px;
      padding: 0.75rem;
      font-weight: 600;
      color: #6c757d;
    }

    .input-group .form-control {
      border-radius: 0 8px 8px 0;
      border-left: none;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox {
      width: 1.2rem;
      height: 1.2rem;
    }

    .form-help {
      margin-top: 0.25rem;
    }

    .form-help small {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    /* Placeholder Styles for TODOs */
    .error-placeholder,
    .debug-placeholder,
    .message-placeholder,
    .image-preview-placeholder {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      color: #856404;
      font-size: 0.875rem;
    }

    .error-placeholder p,
    .debug-placeholder p,
    .message-placeholder p,
    .image-preview-placeholder p {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
    }

    .error-placeholder small {
      font-style: italic;
    }

    .debug-panel {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      border: 1px solid #dee2e6;
    }

    .debug-panel h4 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    .debug-placeholder ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .debug-placeholder li {
      padding: 0.25rem 0;
      display: flex;
      justify-content: space-between;
    }

    .debug-placeholder code {
      background: #e9ecef;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.8rem;
    }

    .message-area {
      margin-top: 1.5rem;
      min-height: 60px;
    }

    @media (max-width: 768px) {
      .product-form-container {
        padding: 1rem;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn {
        justify-content: center;
      }
    }
  `]
})
export class ProductFormComponent {
  private productService = inject(ProductService);
  
  // TODO: Replace these placeholder signals with actual form implementation
  
  /**
   * 🎯 WORKSHOP TASK 1.1: CREATE SIGNAL FORM
   * 
   * Replace the placeholder signals below with a proper signal form:
   * 
   * Example:
   * productForm = form(
   *   signal<ProductFormData>({
   *     name: '',
   *     category: '',
   *     price: 0,
   *     description: '',
   *     inStock: true,
   *     imageUrl: ''
   *   }),
   *   (f) => {
   *     // Add validation rules here
   *     required(f.name);
   *     required(f.category);
   *     // ... add more validations
   *   }
   * );
   */
  
  // Placeholder signals - TODO: Replace with signal form
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  
  /**
   * 🎯 WORKSHOP TASK 1.2: IMPLEMENT COMPUTED PROPERTIES
   * 
   * Create computed properties for form state:
   * - isFormValid: computed(() => this.productForm().valid())
   * - isFormTouched: computed(() => this.productForm().touched())
   * - characterCount: computed(() => this.productForm.description().value().length)
   */
  
  // Placeholder computeds - TODO: Implement real computeds
  isFormValid = computed(() => false);
  isFormTouched = computed(() => false);
  characterCount = computed(() => 0);

  /**
   * 🎯 WORKSHOP TASK 1.3: IMPLEMENT FORM SUBMISSION
   * 
   * Replace this method with proper signal form submission using the submit() function:
   * 
   * async onSubmit() {
   *   await submit(this.productForm, async (form) => {
   *     const productData = form().value();
   *     const result = await this.productService.createProduct(productData);
   *     
   *     this.successMessage.set('Product created successfully!');
   *     this.resetForm();
   *     
   *     // Return any server errors
   *     return result.errors;
   *   });
   * }
   */
  async onSubmit() {
    // TODO: Implement signal form submission
    console.log('🚧 TODO: Implement form submission with signal forms');
    
    // Placeholder implementation
    this.isSubmitting.set(true);
    
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.errorMessage.set('TODO: Implement actual form submission');
    }, 1000);
  }

  /**
   * 🎯 WORKSHOP TASK 1.4: IMPLEMENT FORM RESET
   * 
   * Implement proper form reset functionality using signals
   */
  resetForm() {
    // TODO: Reset the signal form
    console.log('🚧 TODO: Reset signal form');
    
    // Clear messages
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  /**
   * 🎯 WORKSHOP TASK 1.5: ADD VALIDATION ERROR DISPLAY
   * 
   * Create methods to get validation errors for form fields:
   * 
   * getFieldError(fieldName: string): string | null {
   *   const field = this.productForm[fieldName as keyof ProductFormData];
   *   const errors = field().errors();
   *   
   *   if (errors.length === 0) return null;
   *   
   *   // Return appropriate error message based on error type
   *   const error = errors[0];
   *   switch (error.kind) {
   *     case 'required': return `${fieldName} is required`;
   *     case 'min': return `${fieldName} must be greater than ${error.min}`;
   *     // ... handle other error types
   *     default: return error.message || 'Invalid value';
   *   }
   * }
   */
  getFieldError(fieldName: string): string | null {
    // TODO: Implement field error retrieval
    return `TODO: Get ${fieldName} validation errors`;
  }

  /**
   * 🎯 BONUS CHALLENGES:
   * 
   * 1. Add image preview functionality when imageUrl is valid
   * 2. Implement auto-save functionality (save draft every 30 seconds)
   * 3. Add confirmation dialog when leaving page with unsaved changes
   * 4. Implement field-level async validation (e.g., check product name uniqueness)
   * 5. Add accessibility features (aria-labels, keyboard navigation)
   */
}