import { InjectionToken } from '@angular/core';

/**
 * Configuration interfaces for the inject() module
 * These demonstrate configuration injection patterns with inject()
 */

export interface CartConfig {
  maxItems: number;
  maxQuantityPerItem: number;
  taxRate: number;
  currency: string;
  enableAnalytics: boolean;
  enableLogging: boolean;
  autoSave: boolean;
  storagePrefix: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  endpoint: string;
  apiKey?: string;
  trackingId?: string;
  sampleRate: number;
}

export interface PersistenceConfig {
  enabled: boolean;
  storageType: 'localStorage' | 'sessionStorage' | 'indexedDB';
  autoSaveDelay: number;
  compressionEnabled: boolean;
}

export interface FeatureFlags {
  advancedCart: boolean;
  recommendations: boolean;
  promotions: boolean;
  socialSharing: boolean;
  guestCheckout: boolean;
}

/**
 * Injection tokens for configuration objects
 * These are used with inject() to provide configuration
 */
export const CART_CONFIG = new InjectionToken<CartConfig>('CART_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_CART_CONFIG
});

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('ANALYTICS_CONFIG');

export const PERSISTENCE_CONFIG = new InjectionToken<PersistenceConfig>('PERSISTENCE_CONFIG', {
  providedIn: 'root', 
  factory: () => DEFAULT_PERSISTENCE_CONFIG
});

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS', {
  providedIn: 'root',
  factory: () => DEFAULT_FEATURE_FLAGS
});

/**
 * Default configuration values
 * These provide fallbacks when configuration injection is optional
 */
export const DEFAULT_CART_CONFIG: CartConfig = {
  maxItems: 100,
  maxQuantityPerItem: 10,
  taxRate: 0.08,
  currency: 'USD',
  enableAnalytics: true,
  enableLogging: true,
  autoSave: true,
  storagePrefix: 'inject-cart'
};

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: false,
  endpoint: '/api/analytics',
  sampleRate: 1.0
};

export const DEFAULT_PERSISTENCE_CONFIG: PersistenceConfig = {
  enabled: true,
  storageType: 'localStorage',
  autoSaveDelay: 1000,
  compressionEnabled: false
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  advancedCart: true,
  recommendations: true,
  promotions: false,
  socialSharing: false,
  guestCheckout: true
};

/**
 * Environment-specific configurations
 * These demonstrate conditional configuration injection
 */
export const DEVELOPMENT_CONFIG: Partial<CartConfig> = {
  enableLogging: true,
  enableAnalytics: false,
  maxItems: 50
};

export const PRODUCTION_CONFIG: Partial<CartConfig> = {
  enableLogging: false,
  enableAnalytics: true,
  maxItems: 200
};

export const TEST_CONFIG: Partial<CartConfig> = {
  enableLogging: false,
  enableAnalytics: false,
  autoSave: false,
  maxItems: 10
};

/**
 * Helper function to create merged configuration
 * Used in provider functions with inject()
 */
export function createCartConfig(overrides?: Partial<CartConfig>): CartConfig {
  return { ...DEFAULT_CART_CONFIG, ...overrides };
}

export function createAnalyticsConfig(overrides?: Partial<AnalyticsConfig>): AnalyticsConfig {
  return { ...DEFAULT_ANALYTICS_CONFIG, ...overrides };
}

/**
 * Configuration validation functions
 * These can be injected as utility services
 */
export interface ConfigValidator {
  validateCartConfig(config: CartConfig): boolean;
  validateAnalyticsConfig(config: AnalyticsConfig): boolean;
  getValidationErrors(config: any): string[];
}

export class DefaultConfigValidator implements ConfigValidator {
  validateCartConfig(config: CartConfig): boolean {
    return config.maxItems > 0 && 
           config.maxQuantityPerItem > 0 && 
           config.taxRate >= 0 && 
           config.taxRate <= 1;
  }

  validateAnalyticsConfig(config: AnalyticsConfig): boolean {
    return config.sampleRate >= 0 && 
           config.sampleRate <= 1 &&
           (!config.enabled || !!config.endpoint);
  }

  getValidationErrors(config: any): string[] {
    const errors: string[] = [];
    
    if (config.maxItems <= 0) {
      errors.push('maxItems must be greater than 0');
    }
    
    if (config.taxRate < 0 || config.taxRate > 1) {
      errors.push('taxRate must be between 0 and 1');
    }
    
    return errors;
  }
}

/**
 * Token for configuration validator service
 * Demonstrates service injection patterns
 */
export const CONFIG_VALIDATOR = new InjectionToken<ConfigValidator>('CONFIG_VALIDATOR', {
  providedIn: 'root',
  factory: () => new DefaultConfigValidator()
});