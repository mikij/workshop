import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, minLength, min, max, submit } from '@angular/forms/signals';

/**
 * ⭐ TASK 4: PRODUCT REVIEW FORM WITH CUSTOM CONTROLS (ADVANCED LEVEL)
 * 
 * LEARNING OBJECTIVES:
 * - Build custom form controls that integrate with signal forms
 * - Implement FormValueControl and FormCheckboxControl interfaces
 * - Create reusable controls with proper validation
 * - Handle complex user interactions within custom controls
 * - Integrate custom controls with form validation system
 * 
 * WORKSHOP INSTRUCTIONS:
 * 1. Create custom rating control with star interaction
 * 2. Build photo upload control with preview and validation
 * 3. Implement tag selector with dynamic addition/removal
 * 4. Create recommendation toggle with conditional fields
 * 5. Handle form submission with custom control data
 * 
 * SUCCESS CRITERIA:
 * ✅ Custom rating control with proper validation
 * ✅ Photo upload with preview and file validation
 * ✅ Dynamic tag selector working correctly
 * ✅ Custom controls integrate with signal form validation
 * ✅ Comprehensive error handling for custom controls
 */

interface ReviewFormData {
  // Basic Review Information
  rating: number;
  title: string;
  content: string;
  
  // Custom Controls
  photos: File[];
  tags: string[];
  
  // Recommendation
  wouldRecommend: boolean;
  recommendationReason: string;
  
  // Additional Info
  purchaseVerified: boolean;
  anonymous: boolean;
  
  // Product Usage
  usageDuration: 'less-week' | 'week-month' | 'month-year' | 'over-year';
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="review-form-container">
      <h2>⭐ Product Review Form</h2>
      <p class="task-description">
        Submit your product review using custom signal form controls
      </p>

      <!-- Product Information Display -->
      <div class="product-info">
        <div class="product-card">
          <img src="https://via.placeholder.com/120x120" alt="Product" class="product-image">
          <div class="product-details">
            <h4>Sample Product Name</h4>
            <p class="product-price">$29.99</p>
            <p class="product-category">Electronics</p>
          </div>
        </div>
      </div>

      <!-- TODO: Replace with signal-driven form -->
      <form class="review-form" (ngSubmit)="onSubmit()">
        
        <!-- RATING SECTION -->
        <div class="form-section">
          <h3>📊 Overall Rating</h3>
          
          <div class="form-group">
            <label>Your Rating *</label>
            
            <!-- TODO: Custom Rating Control -->
            <div class="custom-rating-placeholder">
              <p>⚠️ TODO: Implement custom star rating control</p>
              <div class="rating-preview">
                <span class="star-placeholder">⭐ ⭐ ⭐ ⭐ ⭐</span>
                <span class="rating-text">(Click stars to rate)</span>
              </div>
              <div class="rating-labels">
                <span>1 = Poor</span>
                <span>2 = Fair</span>
                <span>3 = Good</span>
                <span>4 = Very Good</span>
                <span>5 = Excellent</span>
              </div>
            </div>
            
            <!-- Validation placeholder -->
            <div class="error-placeholder">
              <p>⚠️ TODO: Rating validation (required, 1-5)</p>
            </div>
          </div>
        </div>

        <!-- REVIEW CONTENT SECTION -->
        <div class="form-section">
          <h3>✍️ Your Review</h3>
          
          <div class="form-group">
            <label for="title">Review Title *</label>
            <input 
              id="title"
              type="text"
              class="form-control"
              placeholder="Summarize your experience"
              maxlength="100">
            
            <!-- TODO: Add character counter -->
            <div class="char-counter-placeholder">
              <small>⚠️ TODO: Character counter (0/100)</small>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Title validation (required, min 5 chars)</p>
            </div>
          </div>

          <div class="form-group">
            <label for="content">Detailed Review *</label>
            <textarea 
              id="content"
              class="form-control"
              rows="6"
              placeholder="Share your detailed experience with this product..."
              maxlength="1000"></textarea>
            
            <!-- TODO: Add character counter and writing tips -->
            <div class="textarea-helper-placeholder">
              <div class="writing-tips">
                <p>⚠️ TODO: Writing tips and character counter</p>
                <ul>
                  <li>Describe what you liked and disliked</li>
                  <li>Mention how you used the product</li>
                  <li>Include pros and cons</li>
                </ul>
                <small>Characters: 0/1000</small>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Content validation (required, min 20 chars)</p>
            </div>
          </div>
        </div>

        <!-- PHOTO UPLOAD SECTION -->
        <div class="form-section">
          <h3>📸 Photos (Optional)</h3>
          
          <div class="form-group">
            <label>Upload Photos</label>
            <p class="form-help">Add up to 5 photos to showcase your experience</p>
            
            <!-- TODO: Custom Photo Upload Control -->
            <div class="photo-upload-placeholder">
              <p>⚠️ TODO: Implement custom photo upload control</p>
              <div class="upload-area">
                <div class="upload-icon">📷</div>
                <p>Click to upload or drag and drop</p>
                <small>PNG, JPG up to 5MB each (max 5 photos)</small>
              </div>
              
              <!-- Photo previews placeholder -->
              <div class="photo-previews-placeholder">
                <p>⚠️ TODO: Photo previews with remove buttons</p>
                <div class="preview-grid">
                  <!-- Photo preview items would appear here -->
                </div>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Photo validation (file size, type, count)</p>
            </div>
          </div>
        </div>

        <!-- TAGS SECTION -->
        <div class="form-section">
          <h3>🏷️ Tags</h3>
          
          <div class="form-group">
            <label>Add Tags</label>
            <p class="form-help">Add tags that describe your experience</p>
            
            <!-- TODO: Custom Tag Selector Control -->
            <div class="tag-selector-placeholder">
              <p>⚠️ TODO: Implement custom tag selector control</p>
              
              <!-- Suggested tags -->
              <div class="suggested-tags">
                <h5>Suggested Tags:</h5>
                <div class="tag-options">
                  <button type="button" class="tag-option">Quality</button>
                  <button type="button" class="tag-option">Value</button>
                  <button type="button" class="tag-option">Fast Shipping</button>
                  <button type="button" class="tag-option">Easy to Use</button>
                  <button type="button" class="tag-option">Durable</button>
                  <button type="button" class="tag-option">Great Design</button>
                </div>
              </div>
              
              <!-- Custom tag input -->
              <div class="custom-tag-input">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Add custom tag..."
                  maxlength="20">
                <button type="button" class="btn btn-sm btn-primary">Add</button>
              </div>
              
              <!-- Selected tags -->
              <div class="selected-tags-placeholder">
                <p>⚠️ TODO: Display selected tags with remove buttons</p>
                <div class="selected-tags">
                  <!-- Selected tag items would appear here -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RECOMMENDATION SECTION -->
        <div class="form-section">
          <h3>👍 Recommendation</h3>
          
          <div class="form-group">
            <label>Would you recommend this product? *</label>
            
            <div class="recommendation-toggle">
              <div class="toggle-options">
                <button 
                  type="button"
                  class="toggle-option"
                  [class.active]="false">
                  👍 Yes, I recommend it
                </button>
                <button 
                  type="button"
                  class="toggle-option"
                  [class.active]="false">
                  👎 No, I don't recommend it
                </button>
              </div>
            </div>
            
            <!-- TODO: Conditional recommendation reason -->
            <div class="conditional-reason-placeholder">
              <p>⚠️ TODO: Show reason field based on recommendation</p>
              <div class="form-group" style="margin-top: 1rem;">
                <label for="recommendationReason">Why? (Optional)</label>
                <textarea 
                  id="recommendationReason"
                  class="form-control"
                  rows="3"
                  placeholder="Explain your recommendation..."
                  maxlength="300"></textarea>
                <small class="form-help">Characters: 0/300</small>
              </div>
            </div>
            
            <div class="error-placeholder">
              <p>⚠️ TODO: Recommendation validation (required)</p>
            </div>
          </div>
        </div>

        <!-- USAGE INFORMATION SECTION -->
        <div class="form-section">
          <h3>⏱️ Usage Information</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="usageDuration">How long have you owned this product?</label>
              <select id="usageDuration" class="form-control">
                <option value="">Select duration</option>
                <option value="less-week">Less than a week</option>
                <option value="week-month">1 week to 1 month</option>
                <option value="month-year">1 month to 1 year</option>
                <option value="over-year">Over 1 year</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="usageFrequency">How often do you use it?</label>
              <select id="usageFrequency" class="form-control">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ADDITIONAL OPTIONS SECTION -->
        <div class="form-section">
          <h3>⚙️ Additional Options</h3>
          
          <div class="form-group">
            <div class="checkbox-wrapper">
              <input 
                id="purchaseVerified"
                type="checkbox"
                class="checkbox">
              <label for="purchaseVerified">This is a verified purchase</label>
            </div>
            <small class="form-help">Check this if you purchased the product from our store</small>
          </div>

          <div class="form-group">
            <div class="checkbox-wrapper">
              <input 
                id="anonymous"
                type="checkbox"
                class="checkbox">
              <label for="anonymous">Submit review anonymously</label>
            </div>
            <small class="form-help">Your name will not be displayed with the review</small>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="resetForm()">
            Reset Form
          </button>
          
          <button 
            type="button"
            class="btn btn-outline-primary"
            (click)="saveDraft()">
            Save Draft
          </button>
          
          <button 
            type="submit"
            class="btn btn-primary"
            [disabled]="!isFormValid()">
            <!-- TODO: Add loading state -->
            Submit Review ⭐
          </button>
        </div>
      </form>

      <!-- Form State Debug Panel -->
      <div class="debug-panel">
        <h4>🔍 Form State & Custom Controls</h4>
        <div class="debug-content">
          <!-- TODO: Add signal-driven form state display -->
          <div class="debug-placeholder">
            <p>⚠️ TODO: Implement form state debugging for custom controls</p>
            <ul>
              <li>Form Valid: <code>unknown</code></li>
              <li>Rating Value: <code>unknown</code></li>
              <li>Photos Count: <code>unknown</code></li>
              <li>Tags Count: <code>unknown</code></li>
              <li>Recommendation: <code>unknown</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-form-container {
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

    .product-info {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .product-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .product-image {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      object-fit: cover;
    }

    .product-details h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #007bff;
      margin: 0.25rem 0;
    }

    .product-category {
      color: #6c757d;
      margin: 0;
    }

    .review-form {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-section {
      padding: 2rem;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
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

    .form-help {
      color: #6c757d;
      font-size: 0.875rem;
      margin: 0.25rem 0 0.5rem 0;
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

    /* Custom Rating Control Styles */
    .rating-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .star-placeholder {
      font-size: 1.5rem;
      cursor: pointer;
    }

    .rating-text {
      color: #6c757d;
    }

    .rating-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #6c757d;
    }

    /* Photo Upload Control Styles */
    .upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      background: #f8f9fa;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .upload-area:hover {
      border-color: #007bff;
    }

    .upload-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    /* Tag Selector Control Styles */
    .suggested-tags h5 {
      margin: 0 0 0.75rem 0;
      color: #495057;
      font-size: 0.9rem;
    }

    .tag-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tag-option {
      padding: 0.375rem 0.75rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .tag-option:hover {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .custom-tag-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .custom-tag-input .form-control {
      flex: 1;
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    /* Recommendation Toggle Styles */
    .toggle-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .toggle-option {
      padding: 1rem;
      border: 2px solid #dee2e6;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      font-weight: 600;
    }

    .toggle-option:hover {
      border-color: #007bff;
    }

    .toggle-option.active {
      border-color: #007bff;
      background: #f8f9ff;
      color: #007bff;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      justify-content: flex-end;
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

    .btn-outline-primary {
      background: transparent;
      color: #007bff;
      border: 2px solid #007bff;
    }

    .btn-outline-primary:hover {
      background: #007bff;
      color: white;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
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

    /* Placeholder Styles */
    .custom-rating-placeholder,
    .photo-upload-placeholder,
    .photo-previews-placeholder,
    .tag-selector-placeholder,
    .selected-tags-placeholder,
    .conditional-reason-placeholder,
    .char-counter-placeholder,
    .textarea-helper-placeholder,
    .error-placeholder,
    .debug-placeholder {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      color: #856404;
      font-size: 0.875rem;
    }

    .textarea-helper-placeholder .writing-tips {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .textarea-helper-placeholder ul {
      margin: 0;
      padding-left: 1rem;
      flex: 1;
    }

    .debug-placeholder ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0 0;
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

    @media (max-width: 768px) {
      .review-form-container {
        padding: 1rem;
      }
      
      .product-card {
        flex-direction: column;
        text-align: center;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .toggle-options {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ReviewFormComponent {
  
  // TODO: Replace with signal form implementation
  isSubmitting = signal(false);
  
  /**
   * 🎯 WORKSHOP TASK 4.1: CREATE FORM WITH CUSTOM CONTROLS
   * 
   * Create a review form that uses custom form controls:
   * 
   * reviewForm = form(
   *   signal<ReviewFormData>({
   *     rating: 0,
   *     title: '',
   *     content: '',
   *     photos: [],
   *     tags: [],
   *     wouldRecommend: true,
   *     recommendationReason: '',
   *     purchaseVerified: false,
   *     anonymous: false,
   *     usageDuration: '',
   *     usageFrequency: ''
   *   }),
   *   (f) => {
   *     // Basic validation
   *     required(f.rating);
   *     min(f.rating, 1);
   *     max(f.rating, 5);
   *     required(f.title);
   *     minLength(f.title, 5);
   *     required(f.content);
   *     minLength(f.content, 20);
   *     required(f.wouldRecommend);
   *     
   *     // Custom validation for photos (max 5, valid file types)
   *     // Custom validation for tags (max 10 tags, valid tag format)
   *   }
   * );
   */

  /**
   * 🎯 WORKSHOP TASK 4.2: IMPLEMENT FORM VALIDATION
   */
  isFormValid(): boolean {
    // TODO: Check if form is valid including custom controls
    return false;
  }

  /**
   * 🎯 WORKSHOP TASK 4.3: IMPLEMENT FORM SUBMISSION
   */
  async onSubmit() {
    // TODO: Implement review form submission using submit()
    console.log('🚧 TODO: Implement review submission with custom controls');
  }

  resetForm() {
    // TODO: Reset the signal form and custom controls
    console.log('🚧 TODO: Reset review form');
  }

  saveDraft() {
    // TODO: Save form as draft to localStorage
    console.log('🚧 TODO: Save review draft');
  }

  /**
   * 🎯 BONUS CHALLENGES:
   * 
   * 1. Create RatingControl component that implements FormValueControl<number>
   * 2. Build PhotoUploadControl with drag-and-drop functionality
   * 3. Implement TagSelectorControl with autocomplete suggestions
   * 4. Add RecommendationToggleControl with animated transitions
   * 5. Create CharacterCounterControl for text fields
   * 6. Add real-time form validation feedback
   * 7. Implement review preview before submission
   * 8. Add review sentiment analysis integration
   */
}