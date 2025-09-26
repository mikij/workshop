import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, pattern, applyWhen, submit, Control } from '@angular/forms/signals';

/**
 * 🛒 TASK 2: MULTI-STEP CHECKOUT FORM (INTERMEDIATE LEVEL)
 *
 * LEARNING OBJECTIVES:
 * - Build complex multi-step forms with signal forms
 * - Implement conditional validation based on user selections
 * - Handle cross-field validation and dependencies
 * - Manage form state across multiple steps
 * - Create smooth user experience with step navigation
 *
 * WORKSHOP INSTRUCTIONS:
 * 1. Create multi-step form with signal-driven navigation
 * 2. Implement conditional validation for payment methods
 * 3. Add cross-field validation for address matching
 * 4. Create progress indicator with signals
 * 5. Handle form submission with comprehensive error handling
 *
 * SUCCESS CRITERIA:
 * ✅ Step navigation works smoothly
 * ✅ Conditional validation based on payment method
 * ✅ Address validation with optional "same as billing"
 * ✅ Form progression tracking
 * ✅ Comprehensive error handling and display
 */

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutFormData {
  // Shipping Information
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Payment Information
  payment: {
    method: 'credit' | 'debit' | 'paypal';
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: {
      sameAsShipping: boolean;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  // Order Options
  options: {
    expeditedShipping: boolean;
    giftWrap: boolean;
    specialInstructions: string;
  };
}

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Control],
  template: `
    <div class="checkout-container">
      <h2>🛒 Multi-Step Checkout Form</h2>
      <p class="task-description">
        Complete the checkout process with conditional validation and multi-step navigation
      </p>

      <!-- Progress Indicator -->
      <div class="progress-steps">
        <div class="step" [class.active]="currentStep() === 'shipping'" [class.completed]="isStepCompleted('shipping')">
          <div class="step-number">1</div>
          <div class="step-label">Shipping</div>
        </div>
        <div class="step-divider"></div>
        <div class="step" [class.active]="currentStep() === 'payment'" [class.completed]="isStepCompleted('payment')">
          <div class="step-number">2</div>
          <div class="step-label">Payment</div>
        </div>
        <div class="step-divider"></div>
        <div class="step" [class.active]="currentStep() === 'review'" [class.completed]="isStepCompleted('review')">
          <div class="step-number">3</div>
          <div class="step-label">Review</div>
        </div>
      </div>

      <!-- TODO: Replace with signal-driven form -->
      <form class="checkout-form">

        <!-- STEP 1: SHIPPING INFORMATION -->
        @if (currentStep() === 'shipping') {
          <div class="form-step">
            <h3>📦 Shipping Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  class="form-control"
                  [class.error]="getFieldError('shipping.firstName')"
                  [control]="checkoutForm.shipping.firstName"
                  placeholder="John">
                @if (getFieldError('shipping.firstName') && checkoutForm.shipping.firstName().touched()) {
                  <div class="error-message">
                    {{ getFieldError('shipping.firstName') }}
                  </div>
                }
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  class="form-control"
                  placeholder="Doe">
                <!-- TODO: Add signal-driven validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Last name validation</p>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  placeholder="john.doe@example.com">
                <!-- TODO: Add email validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Email validation</p>
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  class="form-control"
                  placeholder="(555) 123-4567">
                <!-- TODO: Add phone validation -->
                <div class="error-placeholder">
                  <p>⚠️ TODO: Phone validation</p>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="address">Address *</label>
              <input
                id="address"
                type="text"
                class="form-control"
                placeholder="123 Main Street">
              <!-- TODO: Add address validation -->
              <div class="error-placeholder">
                <p>⚠️ TODO: Address validation</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City *</label>
                <input
                  id="city"
                  type="text"
                  class="form-control"
                  placeholder="New York">
              </div>

              <div class="form-group">
                <label for="state">State *</label>
                <select id="state" class="form-control">
                  <option value="">Select State</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <!-- Add more states -->
                </select>
              </div>

              <div class="form-group">
                <label for="zipCode">ZIP Code *</label>
                <input
                  id="zipCode"
                  type="text"
                  class="form-control"
                  placeholder="10001">
              </div>
            </div>
          </div>
        }

        <!-- STEP 2: PAYMENT INFORMATION -->
        @if (currentStep() === 'payment') {
          <div class="form-step">
            <h3>💳 Payment Information</h3>

            <div class="form-group">
              <label>Payment Method *</label>
              <div class="radio-group">
                <div class="radio-option">
                  <input
                    id="credit"
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    [checked]="checkoutForm.payment.method().value() === 'credit'"
                    (change)="checkoutForm.payment.method().value.set('credit')">
                  <label for="credit">💳 Credit Card</label>
                </div>
                <div class="radio-option">
                  <input
                    id="debit"
                    type="radio"
                    name="paymentMethod"
                    value="debit"
                    [checked]="checkoutForm.payment.method().value() === 'debit'"
                    (change)="checkoutForm.payment.method().value.set('debit')">
                  <label for="debit">💳 Debit Card</label>
                </div>
                <div class="radio-option">
                  <input
                    id="paypal"
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    [checked]="checkoutForm.payment.method().value() === 'paypal'"
                    (change)="checkoutForm.payment.method().value.set('paypal')">
                  <label for="paypal">🏦 PayPal</label>
                </div>
              </div>
            </div>

            <!-- Conditional card fields based on payment method -->
            @if (checkoutForm.payment.method().value() !== 'paypal') {
              <div class="form-row">
                <div class="form-group">
                  <label for="cardNumber">Card Number *</label>
                  <input
                    id="cardNumber"
                    type="text"
                    class="form-control"
                    [class.error]="getFieldError('payment.cardNumber')"
                    [control]="checkoutForm.payment.cardNumber"
                    placeholder="1234 5678 9012 3456">
                  @if (getFieldError('payment.cardNumber') && checkoutForm.payment.cardNumber().touched()) {
                    <div class="error-message">
                      {{ getFieldError('payment.cardNumber') }}
                    </div>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expiryDate">Expiry Date *</label>
                  <input
                    id="expiryDate"
                    type="text"
                    class="form-control"
                    placeholder="MM/YY">
                </div>

                <div class="form-group">
                  <label for="cvv">CVV *</label>
                  <input
                    id="cvv"
                    type="text"
                    class="form-control"
                    placeholder="123">
                </div>
              </div>

              <div class="form-group">
                <label for="cardholderName">Cardholder Name *</label>
                <input
                  id="cardholderName"
                  type="text"
                  class="form-control"
                  [class.error]="getFieldError('payment.cardholderName')"
                  [control]="checkoutForm.payment.cardholderName"
                  placeholder="John Doe">
                @if (getFieldError('payment.cardholderName') && checkoutForm.payment.cardholderName().touched()) {
                  <div class="error-message">
                    {{ getFieldError('payment.cardholderName') }}
                  </div>
                }
              </div>
            }

            <!-- Billing Address -->
            <h4>🏠 Billing Address</h4>
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input
                  id="sameAsShipping"
                  type="checkbox"
                  class="checkbox">
                <label for="sameAsShipping">Same as shipping address</label>
              </div>
            </div>

            <!-- TODO: Conditional billing address fields -->
            <div class="conditional-billing-placeholder">
              <p>⚠️ TODO: Show billing address fields only when different from shipping</p>
              <!-- Billing address fields would go here -->
            </div>
          </div>
        }

        <!-- STEP 3: REVIEW & OPTIONS -->
        @if (currentStep() === 'review') {
          <div class="form-step">
            <h3>📋 Review Your Order</h3>

            <!-- Order Summary -->
            <div class="order-summary">
              <!-- TODO: Display form data summary -->
              <div class="summary-placeholder">
                <p>⚠️ TODO: Display order summary with form data</p>
                <div class="summary-section">
                  <h5>Shipping Information</h5>
                  <p>Name, address, etc. from form</p>
                </div>
                <div class="summary-section">
                  <h5>Payment Information</h5>
                  <p>Payment method, billing address, etc.</p>
                </div>
              </div>
            </div>

            <!-- Additional Options -->
            <h4>📦 Shipping Options</h4>
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input
                  id="expeditedShipping"
                  type="checkbox"
                  class="checkbox">
                <label for="expeditedShipping">Expedited shipping (+$15.00)</label>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-wrapper">
                <input
                  id="giftWrap"
                  type="checkbox"
                  class="checkbox">
                <label for="giftWrap">Gift wrap (+$5.00)</label>
              </div>
            </div>

            <div class="form-group">
              <label for="specialInstructions">Special Instructions</label>
              <textarea
                id="specialInstructions"
                class="form-control"
                rows="3"
                placeholder="Any special delivery instructions..."></textarea>
            </div>

            <!-- Terms and Conditions -->
            <div class="form-group">
              <div class="checkbox-wrapper">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  class="checkbox">
                <label for="agreeToTerms">
                  I agree to the <a href="#" target="_blank">Terms and Conditions</a> *
                </label>
              </div>
            </div>
          </div>
        }

        <!-- Form Navigation -->
        <div class="form-navigation">
          <button
            type="button"
            class="btn btn-secondary"
            [disabled]="currentStep() === 'shipping'"
            (click)="goToPreviousStep()">
            ← Previous
          </button>

          @if (currentStep() !== 'review') {
            <button
              type="button"
              class="btn btn-primary"
              [disabled]="!canProceedToNextStep()"
              (click)="goToNextStep()">
              Next →
            </button>
          } @else {
            <button
              type="submit"
              class="btn btn-success"
              [disabled]="!isFormValid()"
              (click)="onSubmit()">
              <!-- TODO: Add loading state -->
              Complete Order 🎉
            </button>
          }
        </div>
      </form>

      <!-- Step Validation Status -->
      <div class="validation-status">
        <h4>🔍 Step Validation Status</h4>
        <div class="status-grid">
          <ul>
            <li>Shipping: <code [class.valid]="isShippingValid()" [class.invalid]="!isShippingValid()">{{ isShippingValid() ? '✅ Valid' : '❌ Invalid' }}</code></li>
            <li>Payment: <code [class.valid]="isPaymentValid()" [class.invalid]="!isPaymentValid()">{{ isPaymentValid() ? '✅ Valid' : '❌ Invalid' }}</code></li>
            <li>Review: <code [class.valid]="isReviewValid()" [class.invalid]="!isReviewValid()">{{ isReviewValid() ? '✅ Valid' : '❌ Invalid' }}</code></li>
            <li>Current Method: <code>{{ checkoutForm.payment.method().value() }}</code></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
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

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }

    .step.active,
    .step.completed {
      opacity: 1;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: background 0.2s ease;
    }

    .step.active .step-number {
      background: #007bff;
      color: white;
    }

    .step.completed .step-number {
      background: #28a745;
      color: white;
    }

    .step-label {
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
    }

    .step-divider {
      width: 60px;
      height: 2px;
      background: #e9ecef;
      margin: 0 1rem;
    }

    .checkout-form {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-step {
      padding: 2rem;
      min-height: 400px;
    }

    .form-step h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      border-bottom: 2px solid #f8f9fa;
      padding-bottom: 0.5rem;
    }

    .form-step h4 {
      margin: 2rem 0 1rem 0;
      color: #495057;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-row.triple {
      grid-template-columns: 1fr 1fr 1fr;
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

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .radio-option:hover {
      border-color: #007bff;
    }

    .radio-option input[type="radio"]:checked + label {
      color: #007bff;
      font-weight: 600;
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

    .form-navigation {
      display: flex;
      justify-content: space-between;
      padding: 1.5rem 2rem;
      background: #f8f9fa;
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

    .btn-secondary:hover:not(:disabled) {
      background: #545b62;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #1e7e34;
    }

    .order-summary {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-section {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    .summary-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .summary-section h5 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .validation-status {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      border: 1px solid #dee2e6;
    }

    .validation-status h4 {
      margin: 0 0 1rem 0;
      color: #495057;
    }

    /* Placeholder Styles */
    .error-placeholder,
    .conditional-fields-placeholder,
    .conditional-billing-placeholder,
    .summary-placeholder,
    .status-placeholder {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      color: #856404;
      font-size: 0.875rem;
    }

    .error-placeholder p,
    .status-placeholder p {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
    }

    .status-placeholder ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
    }

    .status-placeholder li {
      padding: 0.25rem 0;
      display: flex;
      justify-content: space-between;
    }

    .status-placeholder code,
    .validation-status code {
      background: #e9ecef;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.8rem;
    }

    .validation-status code.valid {
      background: #d4edda;
      color: #155724;
    }

    .validation-status code.invalid {
      background: #f8d7da;
      color: #721c24;
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .checkout-container {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .progress-steps {
        padding: 1rem;
      }

      .step-divider {
        display: none;
      }

      .form-navigation {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class CheckoutFormComponent {

  // Signal Form Implementation
  checkoutForm = form(
    signal<CheckoutFormData>({
      shipping: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      },
      payment: {
        method: 'credit' as const,
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: {
          sameAsShipping: true,
          address: '',
          city: '',
          state: '',
          zipCode: ''
        }
      },
      options: {
        expeditedShipping: false,
        giftWrap: false,
        specialInstructions: ''
      }
    }),
    (f) => {
      // Shipping validation
      required(f.shipping.firstName);
      required(f.shipping.lastName);
      required(f.shipping.email);
      email(f.shipping.email);
      required(f.shipping.phone);
      required(f.shipping.address);
      required(f.shipping.city);
      required(f.shipping.state);
      required(f.shipping.zipCode);
      pattern(f.shipping.zipCode, /^\d{5}$/);

      // Conditional payment validation
      applyWhen(
        f,
        ({ value }) => value().payment.method !== 'paypal',
        (form) => {
          required(form.payment.cardNumber);
          pattern(form.payment.cardNumber, /^\d{16}$/);
          required(form.payment.expiryDate);
          pattern(form.payment.expiryDate, /^\d{2}\/\d{2}$/);
          required(form.payment.cvv);
          pattern(form.payment.cvv, /^\d{3,4}$/);
          required(form.payment.cardholderName);
        }
      );

      // Conditional billing address validation
      applyWhen(
        f,
        ({ value }) => !value().payment.billingAddress.sameAsShipping,
        (form) => {
          required(form.payment.billingAddress.address);
          required(form.payment.billingAddress.city);
          required(form.payment.billingAddress.state);
          required(form.payment.billingAddress.zipCode);
          pattern(form.payment.billingAddress.zipCode, /^\d{5}$/);
        }
      );
    }
  );

  // Current step management
  currentStep = signal<CheckoutStep>('shipping');

  /**
   * 🎯 WORKSHOP TASK 2.1: CREATE MULTI-STEP SIGNAL FORM
   *
   * Create a comprehensive checkout form with signal-driven validation:
   *
   * checkoutForm = form(
   *   signal<CheckoutFormData>({
   *     shipping: { firstName: '', lastName: '', ... },
   *     payment: { method: 'credit', cardNumber: '', ... },
   *     options: { expeditedShipping: false, ... }
   *   }),
   *   (f) => {
   *     // Shipping validation
   *     required(f.shipping.firstName);
   *     required(f.shipping.lastName);
   *     required(f.shipping.email);
   *     email(f.shipping.email);
   *     // ... add more validations
   *
   *     // Conditional payment validation
   *     applyWhen(
   *       f,
   *       ({ value }) => value().payment.method !== 'paypal',
   *       (form) => {
   *         required(form.payment.cardNumber);
   *         required(form.payment.expiryDate);
   *         required(form.payment.cvv);
   *       }
   *     );
   *   }
   * );
   */

  // Step validation computed properties
  isShippingValid = computed((): boolean => {
    const shipping = this.checkoutForm.shipping;
    return (
      !shipping.firstName().errors().length &&
      !shipping.lastName().errors().length &&
      !shipping.email().errors().length &&
      !shipping.phone().errors().length &&
      !shipping.address().errors().length &&
      !shipping.city().errors().length &&
      !shipping.state().errors().length &&
      !shipping.zipCode().errors().length &&
      !!shipping.firstName().value() &&
      !!shipping.lastName().value() &&
      !!shipping.email().value() &&
      !!shipping.phone().value() &&
      !!shipping.address().value() &&
      !!shipping.city().value() &&
      !!shipping.state().value() &&
      !!shipping.zipCode().value()
    );
  });

  isPaymentValid = computed((): boolean => {
    const payment = this.checkoutForm.payment;
    const paymentMethod = payment.method().value();

    // PayPal doesn't need card validation
    if (paymentMethod === 'paypal') {
      return true;
    }

    // Card validation
    const cardFieldsValid = (
      !payment.cardNumber().errors().length &&
      !payment.expiryDate().errors().length &&
      !payment.cvv().errors().length &&
      !payment.cardholderName().errors().length &&
      !!payment.cardNumber().value() &&
      !!payment.expiryDate().value() &&
      !!payment.cvv().value() &&
      !!payment.cardholderName().value()
    );

    // Billing address validation if different from shipping
    const sameAsShipping = payment.billingAddress.sameAsShipping().value();
    const billingValid = sameAsShipping || (
      !payment.billingAddress.address().errors().length &&
      !payment.billingAddress.city().errors().length &&
      !payment.billingAddress.state().errors().length &&
      !payment.billingAddress.zipCode().errors().length &&
      !!payment.billingAddress.address().value() &&
      !!payment.billingAddress.city().value() &&
      !!payment.billingAddress.state().value() &&
      !!payment.billingAddress.zipCode().value()
    );

    return cardFieldsValid && billingValid;
  });

  isReviewValid = computed((): boolean => {
    // For review step, we just need shipping and payment to be valid
    return this.isShippingValid() && this.isPaymentValid();
  });

  /**
   * 🎯 WORKSHOP TASK 2.3: IMPLEMENT STEP NAVIGATION
   */
  canProceedToNextStep(): boolean {
    // TODO: Implement step-specific validation logic
    const step = this.currentStep();
    switch (step) {
      case 'shipping':
        return this.isShippingValid();
      case 'payment':
        return this.isPaymentValid();
      case 'review':
        return this.isReviewValid();
      default:
        return false;
    }
  }

  goToNextStep() {
    // TODO: Implement next step navigation with validation
    const current = this.currentStep();
    if (current === 'shipping') {
      this.currentStep.set('payment');
    } else if (current === 'payment') {
      this.currentStep.set('review');
    }
  }

  goToPreviousStep() {
    // TODO: Implement previous step navigation
    const current = this.currentStep();
    if (current === 'payment') {
      this.currentStep.set('shipping');
    } else if (current === 'review') {
      this.currentStep.set('payment');
    }
  }


  // Form submission
  async onSubmit() {
    await submit(this.checkoutForm, async (form: any) => {
      try {
        const checkoutData = form().value();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate success
        console.log('✅ Order submitted successfully!', checkoutData);
        alert('🎉 Order placed successfully! Order #' + Math.random().toString(36).substring(7).toUpperCase());

        return []; // No errors
      } catch (error) {
        console.error('❌ Checkout failed:', error);
        return []; // Handle errors in UI
      }
    });
  }

  isFormValid(): boolean {
    return this.isShippingValid() && this.isPaymentValid() && this.isReviewValid();
  }

  isStepCompleted(step: CheckoutStep): boolean {
    switch (step) {
      case 'shipping': return this.isShippingValid();
      case 'payment': return this.isPaymentValid();
      case 'review': return this.isReviewValid();
      default: return false;
    }
  }

  // Helper methods for field errors
  getFieldError(fieldPath: string): string | null {
    const pathParts = fieldPath.split('.');
    let field: any = this.checkoutForm();

    for (const part of pathParts) {
      field = field[part];
      if (!field) return null;
    }

    const errors = field().errors();
    if (errors.length === 0) return null;

    const error = errors[0];
    switch (error.kind) {
      case 'required': return `This field is required`;
      case 'email': return `Please enter a valid email address`;
      case 'pattern':
        if (fieldPath.includes('zipCode')) return `ZIP code must be 5 digits`;
        if (fieldPath.includes('cardNumber')) return `Card number must be 16 digits`;
        if (fieldPath.includes('expiryDate')) return `Format: MM/YY`;
        if (fieldPath.includes('cvv')) return `CVV must be 3-4 digits`;
        return `Invalid format`;
      default: return error.message || 'Invalid value';
    }
  }

  /**
   * 🎯 BONUS CHALLENGES:
   *
   * 1. Add form data persistence across steps (localStorage)
   * 2. Implement address validation with external API
   * 3. Add credit card validation with Luhn algorithm
   * 4. Create smooth animations between steps
   * 5. Add form auto-save functionality
   * 6. Implement "Edit" links in review step to go back to specific fields
   */
}
