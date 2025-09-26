import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, minLength, min, max, Control, submit } from '@angular/forms/signals';
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
  imports: [CommonModule, ReactiveFormsModule, Control],
  template: `
    <div class="product-form-container">
      <h2>🛍️ Product Management Form</h2>
      <p class="task-description">
        Create and edit products using Angular Signal Forms with real-time validation
      </p>

      <form class="product-form" (ngSubmit)="onSubmit()">
        
        <!-- Product Name Field -->
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input 
            id="name"
            type="text"
            class="form-control"
            [class.error]="productForm.name().errors().length > 0"
            [control]="productForm.name"
            placeholder="Enter product name">
          
          @if (productForm.name().errors().length > 0 && productForm.name().touched()) {
            <div class="error-message">
              {{ getFieldError('name') }}
            </div>
          }
        </div>

        <!-- Category Selection -->
        <div class="form-group">
          <label for="category">Category *</label>
          <select 
            id="category" 
            class="form-control"
            [class.error]="productForm.category().errors().length > 0"
            [control]="productForm.category">
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
          
          @if (productForm.category().errors().length > 0 && productForm.category().touched()) {
            <div class="error-message">
              {{ getFieldError('category') }}
            </div>
          }
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
              [class.error]="productForm.price().errors().length > 0"
              [control]="productForm.price"
              placeholder="0.00">
          </div>
          
          @if (productForm.price().errors().length > 0 && productForm.price().touched()) {
            <div class="error-message">
              {{ getFieldError('price') }}
            </div>
          }
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            class="form-control"
            [class.error]="productForm.description().errors().length > 0"
            [control]="productForm.description"
            rows="4"
            placeholder="Describe the product..."
            maxlength="500"></textarea>
          
          <!-- Character count with signals -->
          <div class="form-help">
            <small>Characters: {{ characterCount() }}/500</small>
          </div>

          @if (productForm.description().errors().length > 0 && productForm.description().touched()) {
            <div class="error-message">
              {{ getFieldError('description') }}
            </div>
          }
        </div>

        <!-- In Stock Toggle -->
        <div class="form-group">
          <div class="checkbox-wrapper">
            <input 
              id="inStock"
              type="checkbox"
              class="checkbox"
              [control]="productForm.inStock">
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
            [control]="productForm.imageUrl"
            placeholder="https://example.com/product-image.jpg">
          
          <!-- Image Preview -->
          @if (hasValidImageUrl()) {
            <div class="image-preview">
              <img [src]="productForm.imageUrl().value()" alt="Product preview" class="preview-image">
            </div>
          }
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="submit"
            class="btn btn-primary"
            [disabled]="!isFormValid() || productForm().submitting()">
            @if (productForm().submitting()) {
              <span class="loading-spinner"></span>
              Saving...
            } @else {
              Save Product
            }
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
          <ul>
            <li>Form Valid: <code>{{ isFormValid() }}</code></li>
            <li>Form Touched: <code>{{ isFormTouched() }}</code></li>
            <li>Form Dirty: <code>{{ isFormDirty() }}</code></li>
            <li>Submitting: <code>{{ productForm().submitting() }}</code></li>
            <li>Description Length: <code>{{ characterCount() }}</code></li>
          </ul>
          
          <details>
            <summary>Form Values</summary>
            <pre>{{ productForm().value() | json }}</pre>
          </details>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="message-area">
        @if (successMessage()) {
          <div class="success-message">
            {{ successMessage() }}
          </div>
        }
        
        @if (errorMessage()) {
          <div class="error-message">
            {{ errorMessage() }}
          </div>
        }
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

    .success-message {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .image-preview {
      margin-top: 0.75rem;
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background: #f8f9fa;
    }

    .preview-image {
      max-width: 200px;
      max-height: 200px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .debug-panel details {
      margin-top: 1rem;
    }

    .debug-panel pre {
      background: #f1f3f4;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      overflow-x: auto;
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
  
  // Signal Form Implementation
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
      // Basic validation rules
      required(f.name);
      required(f.category);
      required(f.price);
      min(f.price, 0.01);
      minLength(f.description, 10);
    }
  );

  // Form state signals
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  
  // Computed properties for form state
  isFormValid = computed(() => this.productForm().valid());
  isFormTouched = computed(() => this.productForm().touched());
  isFormDirty = computed(() => this.productForm().dirty());
  characterCount = computed(() => this.productForm.description().value().length);
  
  // Image preview computed
  hasValidImageUrl = computed(() => {
    const url = this.productForm.imageUrl().value();
    return url && url.startsWith('http') && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif'));
  });

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
    await submit(this.productForm, async (form: any) => {
      this.successMessage.set(null);
      this.errorMessage.set(null);
      
      try {
        const productData = form().value();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/error for demo
        if (Math.random() > 0.2) {
          this.successMessage.set('✅ Product created successfully!');
          this.resetForm();
        } else {
          throw new Error('Server validation failed');
        }
        
        return []; // No errors
      } catch (error) {
        this.errorMessage.set('❌ Failed to create product. Please try again.');
        return []; // Handle errors in UI, not form validation
      }
    });
  }

  /**
   * 🎯 WORKSHOP TASK 1.4: IMPLEMENT FORM RESET
   * 
   * Implement proper form reset functionality using signals
   */
  resetForm() {
    this.productForm().reset();
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
  getFieldError(fieldName: keyof ProductFormData): string | null {
    const field = this.productForm[fieldName];
    const errors = field().errors();
    
    if (errors.length === 0) return null;
    
    // Return appropriate error message based on error type
    const error = errors[0];
    switch (error.kind) {
      case 'required': 
        return `${this.getFieldDisplayName(fieldName)} is required`;
      case 'min': 
        return `${this.getFieldDisplayName(fieldName)} must be greater than ${(error as any).min}`;
      case 'minLength':
        return `${this.getFieldDisplayName(fieldName)} must be at least ${(error as any).minLength} characters`;
      default: 
        return error.message || 'Invalid value';
    }
  }

  private getFieldDisplayName(fieldName: keyof ProductFormData): string {
    const displayNames: Record<keyof ProductFormData, string> = {
      name: 'Product name',
      category: 'Category',
      price: 'Price',
      description: 'Description',
      inStock: 'In stock',
      imageUrl: 'Image URL'
    };
    return displayNames[fieldName];
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