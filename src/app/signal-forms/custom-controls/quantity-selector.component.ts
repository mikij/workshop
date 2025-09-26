import { Component, input, signal, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

/**
 * 🔢 CUSTOM QUANTITY SELECTOR CONTROL
 *
 * This component demonstrates an advanced custom form control
 * with increment/decrement functionality and validation.
 *
 * KEY CONCEPTS:
 * - Implements FormValueControl<number> interface
 * - Handles min/max constraints with validation
 * - Provides multiple interaction methods (buttons, input, keyboard)
 * - Shows loading states and disabled states
 * - Custom validation with error display
 *
 * LEARNING OBJECTIVES:
 * - Advanced FormValueControl implementation
 * - Complex validation logic within custom controls
 * - Accessibility considerations (ARIA, keyboard support)
 * - Performance optimization with signal-based updates
 */

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quantity-selector" [class.disabled]="disabled()">
      @if (label()) {
        <label class="quantity-label" [attr.for]="inputId()">
          {{ label() }}
          @if (required()) {
            <span class="required-indicator">*</span>
          }
        </label>
      }

      <div class="quantity-controls" [class.compact]="variant() === 'compact'">
        <!-- Decrement Button -->
        <button
          type="button"
          class="quantity-button decrement"
          [disabled]="!canDecrement()"
          [attr.aria-label]="'Decrease quantity'"
          (click)="decrement()">
          @if (variant() === 'compact') {
            <span class="button-icon">−</span>
          } @else {
            <span class="button-icon">−</span>
            <span class="button-text">Remove</span>
          }
        </button>

        <!-- Quantity Input -->
        <div class="quantity-input-wrapper">
          <input
            [id]="inputId()"
            type="number"
            class="quantity-input"
            [class.error]="hasError()"
            [value]="currentQuantity()"
            [min]="effectiveMin()"
            [max]="effectiveMax()"
            [step]="step()"
            [disabled]="disabled() || loading()"
            [attr.aria-describedby]="errorId()"
            [attr.aria-invalid]="hasError()"
            (input)="onInputChange($event)"
            (blur)="onInputBlur()"
            (keydown)="onKeyDown($event)">

          @if (loading()) {
            <div class="loading-spinner">
              <span class="spinner"></span>
            </div>
          }

          @if (showUnit() && unit()) {
            <span class="quantity-unit">{{ unit() }}</span>
          }
        </div>

        <!-- Increment Button -->
        <button
          type="button"
          class="quantity-button increment"
          [disabled]="!canIncrement()"
          [attr.aria-label]="'Increase quantity'"
          (click)="increment()">
          @if (variant() === 'compact') {
            <span class="button-icon">+</span>
          } @else {
            <span class="button-icon">+</span>
            <span class="button-text">Add</span>
          }
        </button>
      </div>

      <!-- Stock Information -->
      @if (showStock() && maxStock()) {
        <div class="stock-info">
          @if (currentQuantity() > 0) {
            <span class="stock-remaining">
              {{ remainingStock() }} {{ unit() || 'items' }} remaining
            </span>
          }
          @if (isLowStock()) {
            <span class="low-stock-warning">⚠️ Limited stock</span>
          }
        </div>
      }

      <!-- Error Messages -->
      @if (hasError() && errorMessage()) {
        <div class="error-message" [id]="errorId()" role="alert">
          <span class="error-icon">⚠️</span>
          {{ errorMessage() }}
        </div>
      }

      <!-- Help Text -->
      @if (helpText() && !hasError()) {
        <div class="help-text">
          {{ helpText() }}
        </div>
      }

      <!-- Quantity Suggestions (bulk pricing, etc.) -->
      @if (suggestions().length > 0 && showSuggestions()) {
        <div class="quantity-suggestions">
          <span class="suggestions-label">Popular quantities:</span>
          <div class="suggestions-list">
            @for (suggestion of suggestions(); track suggestion.value) {
              <button
                type="button"
                class="suggestion-button"
                [class.active]="currentQuantity() === suggestion.value"
                [disabled]="suggestion.value > effectiveMax()"
                (click)="selectSuggestion(suggestion.value)">
                {{ suggestion.value }}{{ unit() }}
                @if (suggestion.label) {
                  <span class="suggestion-label">{{ suggestion.label }}</span>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .quantity-selector {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .quantity-selector.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .quantity-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .required-indicator {
      color: #dc3545;
      margin-left: 0.25rem;
    }

    .quantity-controls {
      display: flex;
      align-items: stretch;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      transition: border-color 0.2s ease;
    }

    .quantity-controls:focus-within {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .quantity-controls.compact {
      max-width: 120px;
    }

    .quantity-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.75rem;
      border: none;
      background: #f8f9fa;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 44px;
    }

    .quantity-button:hover:not(:disabled) {
      background: #e9ecef;
    }

    .quantity-button:active {
      background: #dee2e6;
    }

    .quantity-button:disabled {
      background: #f8f9fa;
      color: #6c757d;
      cursor: not-allowed;
    }

    .quantity-button.increment {
      border-left: 1px solid #e9ecef;
    }

    .quantity-button.decrement {
      border-right: 1px solid #e9ecef;
    }

    .button-icon {
      font-size: 1.2rem;
      font-weight: bold;
      line-height: 1;
    }

    .button-text {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .quantity-input-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }

    .quantity-input {
      width: 100%;
      padding: 0.75rem;
      border: none;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      background: transparent;
      outline: none;
      -moz-appearance: textfield;
    }

    .quantity-input::-webkit-outer-spin-button,
    .quantity-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .quantity-input.error {
      color: #dc3545;
    }

    .quantity-unit {
      position: absolute;
      right: 0.75rem;
      color: #6c757d;
      font-size: 0.875rem;
      pointer-events: none;
    }

    .loading-spinner {
      position: absolute;
      right: 0.75rem;
      display: flex;
      align-items: center;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #e9ecef;
      border-top: 2px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .stock-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #6c757d;
    }

    .low-stock-warning {
      color: #fd7e14;
      font-weight: 600;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #dc3545;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .error-icon {
      font-size: 0.9rem;
    }

    .help-text {
      font-size: 0.75rem;
      color: #6c757d;
      font-style: italic;
    }

    .quantity-suggestions {
      margin-top: 0.5rem;
    }

    .suggestions-label {
      font-size: 0.75rem;
      color: #495057;
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }

    .suggestions-list {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    .suggestion-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.375rem 0.75rem;
      border: 1px solid #dee2e6;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.75rem;
    }

    .suggestion-button:hover:not(:disabled) {
      border-color: #007bff;
      background: #f8f9ff;
    }

    .suggestion-button.active {
      border-color: #007bff;
      background: #007bff;
      color: white;
    }

    .suggestion-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .suggestion-label {
      font-size: 0.6rem;
      opacity: 0.7;
      margin-top: 0.125rem;
    }

    @media (max-width: 768px) {
      .quantity-controls:not(.compact) {
        flex-direction: column;
      }

      .quantity-button {
        min-width: auto;
        padding: 0.5rem;
      }

      .button-text {
        display: none;
      }
    }
  `]
})
export class QuantitySelectorComponent implements FormValueControl<number> {
  // Form Control Interface Implementation
  value = model<number>(0);

  // FormUiControl Interface Implementation
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  // Configuration Inputs
  minValue = input<number>(0);
  maxValue = input<number>(100);
  step = input<number>(1);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  required = input<boolean>(false);

  // UI Configuration
  label = input<string>('');
  unit = input<string>('');
  helpText = input<string>('');
  variant = input<'default' | 'compact'>('default');
  showUnit = input<boolean>(true);
  showStock = input<boolean>(false);
  showSuggestions = input<boolean>(false);
  maxStock = input<number | null>(null);

  // Quantity suggestions (e.g., bulk pricing tiers)
  suggestions = input<Array<{value: number, label?: string}>>([]);

  // Internal state
  protected inputId = signal(`quantity-${Math.random().toString(36).substr(2, 9)}`);
  protected errorId = signal(`error-${this.inputId()}`);
  private validationError = signal<string | null>(null);

  // Computed properties
  currentQuantity = computed(() => this.value());
  
  effectiveMin = computed(() => this.min() ?? this.minValue());
  effectiveMax = computed(() => this.max() ?? this.maxValue());

  canIncrement = computed(() =>
    !this.disabled() && !this.loading() && this.currentQuantity() < this.effectiveMax()
  );

  canDecrement = computed(() =>
    !this.disabled() && !this.loading() && this.currentQuantity() > this.effectiveMin()
  );

  remainingStock = computed(() => {
    const stock = this.maxStock();
    return stock ? Math.max(0, stock - this.currentQuantity()) : 0;
  });

  isLowStock = computed(() => {
    const stock = this.maxStock();
    if (!stock) return false;
    const remaining = this.remainingStock();
    return remaining > 0 && remaining <= Math.max(5, stock * 0.1);
  });

  hasError = computed(() => !!this.validationError());
  errorMessage = computed(() => this.validationError());

  /**
   * Increment quantity
   */
  increment(): void {
    if (this.canIncrement()) {
      const newValue = this.currentQuantity() + this.step();
      this.updateValue(Math.min(newValue, this.effectiveMax()));
    }
  }

  /**
   * Decrement quantity
   */
  decrement(): void {
    if (this.canDecrement()) {
      const newValue = this.currentQuantity() - this.step();
      this.updateValue(Math.max(newValue, this.effectiveMin()));
    }
  }

  /**
   * Handle direct input changes
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value)) {
      this.updateValue(value);
    }
  }

  /**
   * Handle input blur for validation
   */
  onInputBlur(): void {
    this.validateValue();
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.increment();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.decrement();
        break;
    }
  }

  /**
   * Select a suggested quantity
   */
  selectSuggestion(value: number): void {
    if (value <= this.effectiveMax() && !this.disabled()) {
      this.updateValue(value);
    }
  }

  /**
   * Update value with validation
   */
  private updateValue(newValue: number): void {
    const clampedValue = Math.max(this.effectiveMin(), Math.min(newValue, this.effectiveMax()));
    this.value.set(clampedValue);
    this.validateValue();
  }

  /**
   * Validate current value
   */
  private validateValue(): void {
    const value = this.currentQuantity();

    if (this.required() && value === 0) {
      this.validationError.set('Quantity is required');
      return;
    }

    if (value < this.effectiveMin()) {
      this.validationError.set(`Minimum quantity is ${this.effectiveMin()}`);
      return;
    }

    if (value > this.effectiveMax()) {
      this.validationError.set(`Maximum quantity is ${this.effectiveMax()}`);
      return;
    }

    const stock = this.maxStock();
    if (stock && value > stock) {
      this.validationError.set(`Only ${stock} items in stock`);
      return;
    }

    this.validationError.set(null);
  }

  /**
   * 🎯 WORKSHOP EXTENSIONS:
   *
   * Students can extend this control with:
   * 1. Bulk pricing tiers with visual indicators
   * 2. Animation effects for increment/decrement
   * 3. Voice control integration
   * 4. Gesture support for mobile devices
   * 5. Integration with inventory management systems
   * 6. Cart synchronization for multi-item scenarios
   * 7. Wishlist integration ("save for later")
   * 8. Subscription/recurring order options
   */
}
