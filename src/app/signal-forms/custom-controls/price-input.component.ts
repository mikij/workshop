import { Component, input, signal, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

/**
 * 💰 CUSTOM PRICE INPUT CONTROL
 *
 * This component demonstrates a sophisticated custom form control
 * for handling monetary values with proper formatting and validation.
 *
 * KEY CONCEPTS:
 * - Implements FormValueControl<number> interface
 * - Handles currency formatting and parsing
 * - Provides multiple currency support
 * - Real-time validation and formatting
 * - Accessibility features for screen readers
 *
 * LEARNING OBJECTIVES:
 * - Complex number formatting in custom controls
 * - Internationalization considerations
 * - Advanced validation patterns
 * - User experience optimization for financial inputs
 */

interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  symbolPosition: 'before' | 'after';
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  'USD': { code: 'USD', symbol: '$', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.', symbolPosition: 'before' },
  'EUR': { code: 'EUR', symbol: '€', decimals: 2, thousandsSeparator: '.', decimalSeparator: ',', symbolPosition: 'after' },
  'GBP': { code: 'GBP', symbol: '£', decimals: 2, thousandsSeparator: ',', decimalSeparator: '.', symbolPosition: 'before' },
  'JPY': { code: 'JPY', symbol: '¥', decimals: 0, thousandsSeparator: ',', decimalSeparator: '.', symbolPosition: 'before' }
};

@Component({
  selector: 'app-price-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="price-input" [class.disabled]="disabled()">
      @if (label()) {
        <label class="price-label" [attr.for]="inputId()">
          {{ label() }}
          @if (required()) {
            <span class="required-indicator">*</span>
          }
        </label>
      }

      <div class="price-input-wrapper" [class.error]="hasError()">
        <!-- Currency Symbol (Before) -->
        @if (currencyConfig().symbolPosition === 'before') {
          <span class="currency-symbol prefix">{{ currencyConfig().symbol }}</span>
        }

        <!-- Main Price Input -->
        <input
          [id]="inputId()"
          type="text"
          class="price-field"
          [value]="displayValue()"
          [disabled]="disabled()"
          [placeholder]="placeholder()"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-label]="getAriaLabel()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
          (paste)="onPaste($event)">

        <!-- Currency Symbol (After) -->
        @if (currencyConfig().symbolPosition === 'after') {
          <span class="currency-symbol suffix">{{ currencyConfig().symbol }}</span>
        }

        <!-- Currency Selector -->
        @if (showCurrencySelector() && availableCurrencies().length > 1) {
          <select
            class="currency-selector"
            [value]="currency()"
            [disabled]="disabled()"
            (change)="onCurrencyChange($event)">
            @for (curr of availableCurrencies(); track curr.code) {
              <option [value]="curr.code">{{ curr.code }}</option>
            }
          </select>
        }

        <!-- Loading/Validation Spinner -->
        @if (isValidating()) {
          <div class="validation-spinner">
            <span class="spinner"></span>
          </div>
        }
      </div>

      <!-- Price Range Display -->
      @if (showRange() && (minPrice() > 0 || maxPrice() < 1000)) {
        <div class="price-range">
          <span class="range-label">Allowed range:</span>
          <span class="range-values">
            {{ formatCurrency(minPrice()) }} - {{ formatCurrency(maxPrice()) }}
          </span>
        </div>
      }

      <!-- Price Suggestions -->
      @if (suggestions().length > 0 && showSuggestions() && !disabled()) {
        <div class="price-suggestions">
          <span class="suggestions-label">Suggested prices:</span>
          <div class="suggestions-list">
            @for (suggestion of suggestions(); track suggestion.value) {
              <button
                type="button"
                class="suggestion-button"
                [class.active]="currentValue() === suggestion.value"
                (click)="selectSuggestion(suggestion)">
                {{ formatCurrency(suggestion.value) }}
                @if (suggestion.label) {
                  <span class="suggestion-label">{{ suggestion.label }}</span>
                }
              </button>
            }
          </div>
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
        <div class="help-text" [id]="helpId()">
          {{ helpText() }}
        </div>
      }

      <!-- Price Analysis (Advanced Feature) -->
      @if (showAnalysis() && currentValue() > 0) {
        <div class="price-analysis">
          <div class="analysis-item">
            <span class="analysis-label">Tax ({{ taxRate() * 100 }}%):</span>
            <span class="analysis-value">{{ formatCurrency(taxAmount()) }}</span>
          </div>
          <div class="analysis-item">
            <span class="analysis-label">Total with tax:</span>
            <span class="analysis-value total">{{ formatCurrency(totalWithTax()) }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .price-input {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .price-input.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .price-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .required-indicator {
      color: #dc3545;
    }

    .price-input-wrapper {
      display: flex;
      align-items: center;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      transition: all 0.2s ease;
      position: relative;
    }

    .price-input-wrapper:focus-within {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .price-input-wrapper.error {
      border-color: #dc3545;
    }

    .price-input-wrapper.error:focus-within {
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }

    .currency-symbol {
      padding: 0.75rem;
      color: #6c757d;
      font-weight: 600;
      user-select: none;
      background: #f8f9fa;
    }

    .currency-symbol.prefix {
      border-right: 1px solid #e9ecef;
    }

    .currency-symbol.suffix {
      border-left: 1px solid #e9ecef;
    }

    .price-field {
      flex: 1;
      padding: 0.75rem;
      border: none;
      font-size: 1.1rem;
      font-weight: 600;
      text-align: right;
      background: transparent;
      color: #2c3e50;
    }

    .price-field:focus {
      outline: none;
    }

    .price-field::placeholder {
      color: #adb5bd;
      font-weight: normal;
    }

    .currency-selector {
      padding: 0.5rem;
      border: none;
      border-left: 1px solid #e9ecef;
      background: #f8f9fa;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      color: #495057;
    }

    .currency-selector:focus {
      outline: none;
      background: #e9ecef;
    }

    .validation-spinner {
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

    .price-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #6c757d;
    }

    .range-label {
      font-weight: 600;
    }

    .range-values {
      font-weight: 700;
      color: #495057;
    }

    .price-suggestions {
      margin-top: 0.25rem;
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

    .suggestion-button:hover {
      border-color: #007bff;
      background: #f8f9ff;
    }

    .suggestion-button.active {
      border-color: #007bff;
      background: #007bff;
      color: white;
    }

    .suggestion-label {
      font-size: 0.6rem;
      opacity: 0.7;
      margin-top: 0.125rem;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #dc3545;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .help-text {
      font-size: 0.75rem;
      color: #6c757d;
    }

    .price-analysis {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 0.75rem;
      margin-top: 0.25rem;
    }

    .analysis-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .analysis-item:last-child {
      margin-bottom: 0;
      padding-top: 0.25rem;
      border-top: 1px solid #dee2e6;
    }

    .analysis-label {
      color: #6c757d;
    }

    .analysis-value {
      font-weight: 600;
      color: #495057;
    }

    .analysis-value.total {
      color: #007bff;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .price-input-wrapper {
        flex-wrap: wrap;
      }

      .currency-selector {
        order: 3;
        border-left: none;
        border-top: 1px solid #e9ecef;
        width: 100%;
      }
    }
  `]
})
export class PriceInputComponent implements FormValueControl<number> {
  // Form Control Interface Implementation
  value = model<number>(0);

  // Configuration Inputs
  currency = input<string>('USD');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  minPrice = input<number>(0);
  maxPrice = input<number>(Number.MAX_SAFE_INTEGER);

  // UI Configuration
  label = input<string>('');
  placeholder = input<string>('');
  helpText = input<string>('');
  showCurrencySelector = input<boolean>(false);
  showRange = input<boolean>(false);
  showSuggestions = input<boolean>(false);
  showAnalysis = input<boolean>(false);

  // Available currencies for selector
  availableCurrencies = input<CurrencyConfig[]>([CURRENCIES['USD'], CURRENCIES['EUR'], CURRENCIES['GBP']]);

  // Price suggestions
  suggestions = input<Array<{value: number, label?: string}>>([]);

  // Tax calculation (for analysis)
  taxRate = input<number>(0.08);

  // Internal state
  protected inputId = signal(`price-${Math.random().toString(36).substr(2, 9)}`);
  protected errorId = signal(`error-${this.inputId()}`);
  protected helpId = signal(`help-${this.inputId()}`);
  private validationError = signal<string | null>(null);
  protected isValidating = signal<boolean>(false);
  private rawInput = signal<string>('');
  private hasFocus = signal<boolean>(false);

  // Computed properties
  currentValue = computed(() => this.value());
  currencyConfig = computed(() => CURRENCIES[this.currency()] || CURRENCIES['USD']);
  hasError = computed(() => !!this.validationError());
  errorMessage = computed(() => this.validationError());

  displayValue = computed(() => {
    if (this.hasFocus() && this.rawInput()) {
      return this.rawInput();
    }
    return this.currentValue() > 0 ? this.formatCurrencyNumber(this.currentValue()) : '';
  });

  taxAmount = computed(() => this.currentValue() * this.taxRate());
  totalWithTax = computed(() => this.currentValue() + this.taxAmount());

  /**
   * Handle input changes
   */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    this.rawInput.set(rawValue);

    // Parse the input value
    const numericValue = this.parseInput(rawValue);
    if (!isNaN(numericValue)) {
      this.value.set(numericValue);
      this.validateValue();
    }
  }

  /**
   * Handle input focus
   */
  onFocus(): void {
    this.hasFocus.set(true);
    this.rawInput.set(this.formatCurrencyNumber(this.currentValue()));
  }

  /**
   * Handle input blur
   */
  onBlur(): void {
    this.hasFocus.set(false);
    this.rawInput.set('');
    this.validateValue();
  }

  /**
   * Handle keyboard shortcuts
   */
  onKeyDown(event: KeyboardEvent): void {
    // Allow navigation and editing keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
    const config = this.currencyConfig();

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow decimal separator
    if (event.key === config.decimalSeparator && config.decimals > 0) {
      return;
    }

    // Allow digits
    if (/^\d$/.test(event.key)) {
      return;
    }

    // Prevent all other keys
    event.preventDefault();
  }

  /**
   * Handle paste events
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const numericValue = this.parseInput(pastedText);

    if (!isNaN(numericValue)) {
      this.value.set(numericValue);
      this.validateValue();
    }
  }

  /**
   * Handle currency change
   */
  onCurrencyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    // Currency change would trigger parent form to handle conversion if needed
    console.log('Currency changed to:', select.value);
  }

  /**
   * Select a suggested price
   */
  selectSuggestion(suggestion: {value: number, label?: string}): void {
    this.value.set(suggestion.value);
    this.validateValue();
  }

  /**
   * Parse input string to number
   */
  private parseInput(input: string): number {
    const config = this.currencyConfig();

    // Remove currency symbol and spaces
    let cleaned = input.replace(new RegExp(`[${config.symbol}\\s]`, 'g'), '');

    // Replace thousands separators
    cleaned = cleaned.replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '');

    // Replace decimal separator with dot for parsing
    if (config.decimalSeparator !== '.') {
      cleaned = cleaned.replace(config.decimalSeparator, '.');
    }

    return parseFloat(cleaned) || 0;
  }

  /**
   * Format number for display (without currency symbol)
   */
  private formatCurrencyNumber(value: number): string {
    const config = this.currencyConfig();
    return value.toFixed(config.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);
  }

  /**
   * Format currency with symbol
   */
  formatCurrency(value: number): string {
    const config = this.currencyConfig();
    const formatted = this.formatCurrencyNumber(value);

    return config.symbolPosition === 'before'
      ? `${config.symbol}${formatted}`
      : `${formatted}${config.symbol}`;
  }

  /**
   * Validate current value
   */
  private validateValue(): void {
    const value = this.currentValue();

    if (this.required() && value <= 0) {
      this.validationError.set('Price is required');
      return;
    }

    if (value < this.minPrice()) {
      this.validationError.set(`Minimum price is ${this.formatCurrency(this.minPrice())}`);
      return;
    }

    if (value > this.maxPrice()) {
      this.validationError.set(`Maximum price is ${this.formatCurrency(this.maxPrice())}`);
      return;
    }

    this.validationError.set(null);
  }

  /**
   * Get ARIA described by attribute
   */
  protected getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.helpText()) ids.push(this.helpId());
    if (this.hasError()) ids.push(this.errorId());
    return ids.join(' ');
  }

  /**
   * Get ARIA label
   */
  protected getAriaLabel(): string {
    const config = this.currencyConfig();
    return `Price in ${config.code}`;
  }

  /**
   * 🎯 WORKSHOP EXTENSIONS:
   *
   * Students can extend this control with:
   * 1. Real-time currency conversion using exchange rates API
   * 2. Price history tracking and trends
   * 3. Integration with payment processors for validation
   * 4. Bulk pricing calculator
   * 5. Discount and coupon code integration
   * 6. Subscription pricing models
   * 7. International tax calculations
   * 8. Price comparison with competitors
   */
}
