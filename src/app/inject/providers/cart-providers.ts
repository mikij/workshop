import { inject, Injectable, makeEnvironmentProviders, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { 
  CART_CONFIG, 
  ANALYTICS_CONFIG, 
  PERSISTENCE_CONFIG,
  FEATURE_FLAGS,
  CartConfig,
  AnalyticsConfig,
  createCartConfig,
  createAnalyticsConfig,
  DEFAULT_CART_CONFIG
} from '../config/cart-config';

/**
 * Provider functions demonstrating modern Angular dependency injection patterns
 * These are used in the inject() workshop to show advanced provider creation
 */

/**
 * TODO: This will be implemented as part of Task 2
 * Demonstrates basic provider function patterns with inject()
 */
export function provideInjectCart(config?: Partial<CartConfig>) {
  return [
    // TODO: Core cart service provider
    // InjectCartService,
    
    // TODO: Configuration provider with merged config
    { 
      provide: CART_CONFIG, 
      useValue: createCartConfig(config)
    },
    
    // TODO: Analytics provider with factory function using inject()
    {
      provide: 'CartAnalyticsService',
      useFactory: () => {
        // This factory uses inject() internally
        const config = inject(CART_CONFIG);
        const http = inject(HttpClient);
        
        // TODO: Return actual analytics service instance
        console.log('Creating analytics service with config:', config);
        return new MockAnalyticsService(config, http);
      }
    },
    
    // TODO: Storage provider based on platform detection
    {
      provide: 'STORAGE_SERVICE',
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        
        if (isPlatformBrowser(platformId)) {
          return new BrowserStorageService();
        } else {
          return new ServerStorageService();
        }
      }
    }
  ];
}

/**
 * TODO: This will be implemented as part of Task 2
 * Specialized provider for cart persistence features
 */
export function provideCartPersistence() {
  return [
    {
      provide: 'CartPersistenceService',
      useFactory: () => {
        const storage = inject('STORAGE_SERVICE');
        const config = inject(PERSISTENCE_CONFIG);
        
        // TODO: Return actual persistence service
        console.log('Creating persistence service');
        return new MockPersistenceService(storage, config);
      }
    }
  ];
}

/**
 * TODO: This will be implemented as part of Task 2  
 * Analytics provider with optional configuration
 */
export function provideCartAnalytics(analyticsConfig?: AnalyticsConfig) {
  return [
    { 
      provide: ANALYTICS_CONFIG, 
      useValue: analyticsConfig || createAnalyticsConfig()
    },
    {
      provide: 'CartAnalyticsService',
      useFactory: () => {
        const config = inject(ANALYTICS_CONFIG, { optional: true });
        const http = inject(HttpClient);
        
        if (config?.enabled) {
          return new MockAnalyticsService(config, http);
        } else {
          return new NoOpAnalyticsService();
        }
      }
    }
  ];
}

/**
 * TODO: This will be implemented as part of Task 7
 * Environment-specific provider configuration
 */
export function provideCartEnvironment() {
  return makeEnvironmentProviders([
    // TODO: Core cart providers
    ...provideInjectCart(),
    
    // TODO: Feature-specific providers based on environment
    {
      provide: 'EnvironmentService',
      useFactory: () => {
        const features = inject(FEATURE_FLAGS);
        return new EnvironmentService(features);
      }
    }
  ]);
}

/**
 * TODO: This will be implemented as part of Task 7
 * Feature flag based conditional providers
 */
export function provideCartFeatures() {
  return [
    {
      provide: 'FeatureService',
      useFactory: () => {
        const flags = inject(FEATURE_FLAGS);
        
        // Conditional service creation based on feature flags
        if (flags.advancedCart) {
          return new AdvancedCartFeatureService();
        } else {
          return new BasicCartFeatureService();
        }
      }
    }
  ];
}

/**
 * TODO: These services will be implemented as part of the workshop
 * Mock implementations for demonstration purposes
 */

class MockAnalyticsService {
  constructor(private config: any, private http: HttpClient) {}
  
  trackEvent(event: string, data: any) {
    console.log('Analytics:', event, data);
  }
  
  trackPageView(page: string) {
    console.log('Page view:', page);
  }
}

class NoOpAnalyticsService {
  trackEvent(event: string, data: any) {
    // No operation
  }
  
  trackPageView(page: string) {
    // No operation  
  }
}

class BrowserStorageService {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
  
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

class ServerStorageService {
  private storage = new Map<string, string>();
  
  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }
  
  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
  
  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

class MockPersistenceService {
  constructor(private storage: any, private config: any) {}
  
  save(data: any): void {
    console.log('Saving data:', data);
  }
  
  load(): any {
    console.log('Loading data');
    return null;
  }
}

class EnvironmentService {
  constructor(private features: any) {}
  
  isFeatureEnabled(feature: string): boolean {
    return this.features[feature] || false;
  }
}

class AdvancedCartFeatureService {
  getAdvancedFeatures() {
    return ['recommendations', 'promotions', 'analytics'];
  }
}

class BasicCartFeatureService {
  getAdvancedFeatures() {
    return [];
  }
}

/**
 * TODO: Testing providers for workshop exercises
 * These demonstrate how to create providers for testing scenarios
 */
export function provideCartTesting() {
  return [
    { provide: 'STORAGE_SERVICE', useClass: MockStorageService },
    { provide: 'CartAnalyticsService', useClass: MockAnalyticsService },
    { provide: CART_CONFIG, useValue: { ...DEFAULT_CART_CONFIG, enableLogging: false } }
  ];
}

class MockStorageService {
  private data = new Map<string, string>();
  
  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }
  
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  
  removeItem(key: string): void {
    this.data.delete(key);
  }
  
  clear(): void {
    this.data.clear();
  }
}