import { inject, Injector, Type, InjectionToken, runInInjectionContext, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CART_CONFIG, FEATURE_FLAGS, CartConfig } from '../config/cart-config';

/**
 * Utility functions demonstrating advanced inject() patterns
 * These are used in Tasks 4 and 5 of the inject() workshop
 */

/**
 * TODO: This will be implemented as part of Task 4
 * Factory function that creates cart services using inject()
 */
export function createCartFactory(customConfig?: Partial<CartConfig>) {
  return () => {
    // TODO: This function runs in injection context
    // Students will implement this to use inject() for dependencies
    const baseConfig = inject(CART_CONFIG, { optional: true }) ?? { maxItems: 100, taxRate: 0.08 };
    const http = inject(HttpClient);
    
    const config = { ...baseConfig, ...customConfig };
    
    console.log('Creating cart with factory function using inject()');
    // TODO: Students will return actual cart service instance
    return {
      config,
      http,
      created: new Date(),
      factoryType: 'inject() factory'
    };
  };
}

/**
 * TODO: This will be implemented as part of Task 4
 * Utility for optional service injection with error handling
 */
export function injectOptionalService<T>(token: Type<T> | InjectionToken<T>): T | null {
  try {
    // TODO: Students will implement safe optional injection
    return inject(token, { optional: true });
  } catch (error) {
    console.warn('Failed to inject optional service:', error);
    return null;
  }
}

/**
 * TODO: This will be implemented as part of Task 4  
 * Utility for injection with fallback values
 */
export function injectWithFallback<T>(
  token: Type<T> | InjectionToken<T>,
  fallback: T
): T {
  // TODO: Students will implement injection with fallback
  return inject(token, { optional: true }) ?? fallback;
}

/**
 * TODO: This will be implemented as part of Task 4
 * Conditional injection based on feature flags
 */
export function injectIfFeatureEnabled<T>(
  token: Type<T> | InjectionToken<T>,
  feature: string
): T | null {
  // TODO: Students will implement feature-flag conditional injection
  const featureFlags = inject(FEATURE_FLAGS, { optional: true });
  
  if (featureFlags && isFeatureEnabled(featureFlags, feature)) {
    return inject(token, { optional: true });
  }
  
  return null;
}

/**
 * TODO: This will be implemented as part of Task 4
 * Helper function to check if a feature is enabled
 */
function isFeatureEnabled(flags: any, feature: string): boolean {
  return flags[feature] === true;
}

/**
 * TODO: This will be implemented as part of Task 4
 * Runtime injection context creation for advanced scenarios
 */
export function createInjectionContext(providers: Provider[]) {
  const injector = Injector.create({ providers });
  
  return <T>(fn: () => T): T => {
    // TODO: Students will use runInInjectionContext
    return runInInjectionContext(injector, fn);
  };
}

/**
 * TODO: This will be implemented as part of Task 5
 * Functional service composition using inject()
 */
export function createCartAnalytics() {
  // TODO: Students will implement functional service creation
  const http = inject(HttpClient);
  const config = inject(CART_CONFIG, { optional: true });
  
  return {
    trackEvent: (event: string, data: any) => {
      console.log('Tracking event:', event, data);
      // TODO: Actual implementation with http service
    },
    
    trackPageView: (page: string) => {
      console.log('Tracking page view:', page);
      // TODO: Actual implementation with http service
    },
    
    getAnalyticsConfig: () => config
  };
}

/**
 * TODO: This will be implemented as part of Task 5
 * Functional cart validator using inject()
 */
export function createCartValidator() {
  // TODO: Students will implement functional validator
  const config = inject(CART_CONFIG);
  
  return {
    validateItem: (item: any): ValidationResult => {
      const errors: string[] = [];
      
      // TODO: Students will implement validation logic
      if (item.quantity <= 0) {
        errors.push('Quantity must be greater than 0');
      }
      
      if (item.quantity > config.maxQuantityPerItem) {
        errors.push(`Quantity cannot exceed ${config.maxQuantityPerItem}`);
      }
      
      if (item.price <= 0) {
        errors.push('Price must be greater than 0');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },
    
    validateCart: (items: any[]): ValidationResult => {
      // TODO: Students will implement cart-level validation
      if (items.length > config.maxItems) {
        return {
          isValid: false,
          errors: [`Cart cannot contain more than ${config.maxItems} items`]
        };
      }
      
      const itemValidations = items.map(item => this.validateItem(item));
      const allErrors = itemValidations.flatMap(v => v.errors);
      
      return {
        isValid: allErrors.length === 0,
        errors: allErrors
      };
    }
  };
}

/**
 * TODO: This will be implemented as part of Task 5
 * Composable service factory using inject()
 */
export function createCartService(options?: CartServiceOptions) {
  // TODO: Students will implement service composition
  const storage = injectOptionalService('STORAGE_SERVICE');
  const analytics = injectOptionalService('CartAnalyticsService');
  const validator = createCartValidator();
  
  // TODO: Create cart state signal
  const cartItems: any[] = [];
  
  return {
    items: cartItems,
    
    addItem: (product: any) => {
      // TODO: Students will implement add logic with validation
      const newItem = {
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        addedAt: new Date()
      };
      
      const validation = validator.validateItem(newItem);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      cartItems.push(newItem);
      analytics?.trackEvent('item_added', { productId: product.id });
    },
    
    removeItem: (productId: string) => {
      // TODO: Students will implement remove logic
      const index = cartItems.findIndex(item => item.productId === productId);
      if (index > -1) {
        cartItems.splice(index, 1);
        analytics?.trackEvent('item_removed', { productId });
      }
    },
    
    clear: () => {
      // TODO: Students will implement clear logic
      cartItems.length = 0;
      analytics?.trackEvent('cart_cleared');
    }
  };
}

/**
 * Supporting interfaces and types
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CartServiceOptions {
  enableAnalytics?: boolean;
  enableValidation?: boolean;
  customValidators?: any[];
}

/**
 * TODO: This will be implemented as part of Task 4
 * Injection performance measurement utility
 */
export function measureInjectionPerformance<T>(injectionFn: () => T): InjectionPerformanceResult<T> {
  const startTime = performance.now();
  
  try {
    const result = injectionFn();
    const endTime = performance.now();
    
    return {
      success: true,
      result,
      duration: endTime - startTime,
      timestamp: new Date()
    };
  } catch (error) {
    const endTime = performance.now();
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: endTime - startTime,
      timestamp: new Date()
    };
  }
}

export interface InjectionPerformanceResult<T> {
  success: boolean;
  result?: T;
  error?: string;
  duration: number;
  timestamp: Date;
}

/**
 * Utility helper functions
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * TODO: This will be implemented as part of Task 4
 * Dependency graph analyzer for debugging injection chains
 */
export function analyzeDependencyGraph(rootToken: any): DependencyGraph {
  // TODO: Students will implement dependency analysis
  return {
    rootToken: rootToken.name || 'Unknown',
    dependencies: [],
    depth: 0,
    circularDependencies: [],
    totalServices: 1
  };
}

export interface DependencyGraph {
  rootToken: string;
  dependencies: string[];
  depth: number;
  circularDependencies: string[];
  totalServices: number;
}

/**
 * TODO: This will be implemented as part of Task 6
 * Testing utilities for inject() patterns
 */
export function createTestInjectionContext(mockProviders: Provider[]) {
  return createInjectionContext([
    ...mockProviders,
    // Default test providers
    { provide: CART_CONFIG, useValue: { maxItems: 10, taxRate: 0.1, enableAnalytics: false } }
  ]);
}

/**
 * TODO: This will be implemented as part of Task 6
 * Mock service factory for testing
 */
export function createMockService<T>(serviceName: string, methods: Partial<T>): T {
  const mockService = {
    _serviceName: serviceName,
    _isMock: true,
    ...methods
  };
  
  return mockService as T;
}