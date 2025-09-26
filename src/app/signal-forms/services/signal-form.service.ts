import { Injectable, signal } from '@angular/core';
import { Observable, from } from 'rxjs';

/**
 * 🔧 SIGNAL FORM SERVICE
 * 
 * This service provides utility functions for working with signal forms,
 * including form state management, validation helpers, and data persistence.
 * 
 * KEY CONCEPTS:
 * - Centralized form state management
 * - Form persistence and restoration
 * - Validation utilities
 * - Form analytics and tracking
 * 
 * LEARNING OBJECTIVES:
 * - Service integration with signal forms
 * - State management patterns
 * - Form persistence strategies
 * - Error handling and recovery
 */

export interface FormState {
  id: string;
  data: any;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: Record<string, string[]>;
  lastSaved: Date | null;
  version: number;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class SignalFormService {
  
  // Active form states
  private formStates = signal<Map<string, FormState>>(new Map());
  
  // Auto-save configuration
  private autoSaveInterval = 30000; // 30 seconds
  private autoSaveTimers = new Map<string, ReturnType<typeof setTimeout>>();
  
  /**
   * Register a new form for tracking
   */
  registerForm(formId: string, initialData: any = {}): void {
    const formState: FormState = {
      id: formId,
      data: { ...initialData },
      isValid: false,
      isDirty: false,
      isTouched: false,
      errors: {},
      lastSaved: null,
      version: 1
    };
    
    const currentStates = this.formStates();
    currentStates.set(formId, formState);
    this.formStates.set(new Map(currentStates));
    
    // Load saved data if available
    this.loadFormData(formId);
    
    console.log(`📝 Form registered: ${formId}`);
  }

  /**
   * Unregister a form and cleanup
   */
  unregisterForm(formId: string): void {
    const currentStates = this.formStates();
    currentStates.delete(formId);
    this.formStates.set(new Map(currentStates));
    
    // Clear auto-save timer
    const timer = this.autoSaveTimers.get(formId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(formId);
    }
    
    console.log(`🗑️ Form unregistered: ${formId}`);
  }

  /**
   * Update form state
   */
  updateFormState(formId: string, updates: Partial<FormState>): void {
    const currentStates = this.formStates();
    const existingState = currentStates.get(formId);
    
    if (existingState) {
      const updatedState: FormState = {
        ...existingState,
        ...updates,
        version: existingState.version + 1
      };
      
      currentStates.set(formId, updatedState);
      this.formStates.set(new Map(currentStates));
      
      // Trigger auto-save if data changed
      if (updates.data || updates.isDirty) {
        this.scheduleAutoSave(formId);
      }
    }
  }

  /**
   * Get current form state
   */
  getFormState(formId: string): FormState | null {
    return this.formStates().get(formId) || null;
  }

  /**
   * Enable auto-save for a form
   */
  enableAutoSave(formId: string, intervalMs: number = this.autoSaveInterval): void {
    // Clear existing timer
    const existingTimer = this.autoSaveTimers.get(formId);
    if (existingTimer) {
      clearInterval(existingTimer);
    }
    
    // Set new timer
    const timer = setInterval(() => {
      const state = this.getFormState(formId);
      if (state && state.isDirty) {
        this.saveFormData(formId);
      }
    }, intervalMs);
    
    this.autoSaveTimers.set(formId, timer);
    console.log(`⏰ Auto-save enabled for form: ${formId} (${intervalMs}ms interval)`);
  }

  /**
   * Disable auto-save for a form
   */
  disableAutoSave(formId: string): void {
    const timer = this.autoSaveTimers.get(formId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(formId);
      console.log(`🛑 Auto-save disabled for form: ${formId}`);
    }
  }

  /**
   * Schedule auto-save (debounced)
   */
  private scheduleAutoSave(formId: string): void {
    const timer = this.autoSaveTimers.get(formId);
    if (timer) {
      clearTimeout(timer);
    }
    
    const newTimer = setTimeout(() => {
      this.saveFormData(formId);
    }, 2000); // 2 second delay
    
    this.autoSaveTimers.set(formId, newTimer);
  }

  /**
   * Save form data to localStorage
   */
  saveFormData(formId: string): void {
    const state = this.getFormState(formId);
    if (!state) return;
    
    try {
      const saveData = {
        data: state.data,
        version: state.version,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`signal-form-${formId}`, JSON.stringify(saveData));
      
      // Update last saved timestamp
      this.updateFormState(formId, { 
        lastSaved: new Date(),
        isDirty: false 
      });
      
      console.log(`💾 Form data saved: ${formId}`);
    } catch (error) {
      console.error(`❌ Failed to save form data for ${formId}:`, error);
    }
  }

  /**
   * Load form data from localStorage
   */
  loadFormData(formId: string): any {
    try {
      const savedData = localStorage.getItem(`signal-form-${formId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Update form state with loaded data
        this.updateFormState(formId, {
          data: parsed.data,
          lastSaved: new Date(parsed.savedAt),
          isDirty: false
        });
        
        console.log(`📂 Form data loaded: ${formId}`);
        return parsed.data;
      }
    } catch (error) {
      console.error(`❌ Failed to load form data for ${formId}:`, error);
    }
    
    return null;
  }

  /**
   * Clear saved form data
   */
  clearFormData(formId: string): void {
    try {
      localStorage.removeItem(`signal-form-${formId}`);
      
      // Reset form state
      this.updateFormState(formId, {
        lastSaved: null,
        isDirty: false
      });
      
      console.log(`🗑️ Form data cleared: ${formId}`);
    } catch (error) {
      console.error(`❌ Failed to clear form data for ${formId}:`, error);
    }
  }

  /**
   * Validate form data using custom validation rules
   */
  validateFormData(formId: string, validationRules: any): FormValidationResult {
    const state = this.getFormState(formId);
    if (!state) {
      return { isValid: false, errors: { form: ['Form not found'] }, warnings: {} };
    }

    // TODO: Implement comprehensive validation logic
    // This is a placeholder for workshop implementation
    const result: FormValidationResult = {
      isValid: Object.keys(state.errors).length === 0,
      errors: state.errors,
      warnings: {}
    };

    return result;
  }

  /**
   * Export form data for backup or transfer
   */
  exportFormData(formId: string): string | null {
    const state = this.getFormState(formId);
    if (!state) return null;
    
    const exportData = {
      formId,
      data: state.data,
      version: state.version,
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import form data from backup
   */
  importFormData(formId: string, importData: string): boolean {
    try {
      const parsed = JSON.parse(importData);
      
      if (parsed.formId !== formId) {
        console.error('❌ Form ID mismatch during import');
        return false;
      }
      
      this.updateFormState(formId, {
        data: parsed.data,
        version: parsed.version || 1,
        isDirty: true
      });
      
      console.log(`📥 Form data imported: ${formId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to import form data for ${formId}:`, error);
      return false;
    }
  }

  /**
   * Get form analytics
   */
  getFormAnalytics(formId: string): any {
    const state = this.getFormState(formId);
    if (!state) return null;

    return {
      formId,
      version: state.version,
      isValid: state.isValid,
      isDirty: state.isDirty,
      isTouched: state.isTouched,
      errorCount: Object.keys(state.errors).length,
      lastSaved: state.lastSaved,
      hasAutoSave: this.autoSaveTimers.has(formId)
    };
  }

  /**
   * Reset form to initial state
   */
  resetForm(formId: string, initialData: any = {}): void {
    this.updateFormState(formId, {
      data: { ...initialData },
      isValid: false,
      isDirty: false,
      isTouched: false,
      errors: {},
      version: 1
    });
    
    // Clear saved data
    this.clearFormData(formId);
    
    console.log(`🔄 Form reset: ${formId}`);
  }

  /**
   * 🎯 WORKSHOP EXTENSIONS:
   * 
   * Students can extend this service with:
   * 1. Form submission queue for offline scenarios
   * 2. Real-time collaborative editing
   * 3. Form version history and rollback
   * 4. Advanced validation with async rules
   * 5. Form templates and cloning
   * 6. Integration with external APIs
   * 7. Form analytics and user behavior tracking
   * 8. Multi-language form support
   */
}