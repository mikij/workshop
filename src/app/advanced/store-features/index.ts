/**
 * Custom Store Features for @ngrx/signals
 * 
 * This module exports reusable store features that demonstrate the power
 * of @ngrx/signals composition and extensibility using signalStoreFeature.
 * 
 * Features included:
 * - withTaxCalculator: Progressive tax calculation with luxury tax support
 * - withDiscounts: Comprehensive discount and coupon management
 * - withPersistence: Automatic localStorage/sessionStorage with versioning
 * - withAnalytics: Event tracking, performance metrics, and user behavior analysis
 * 
 * Usage Example:
 * ```typescript
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withEntities<MyEntity>(),
 *   withTaxCalculator(),
 *   withDiscounts(),
 *   withPersistence({ key: 'my-store', version: 1 }),
 *   withAnalytics({ enablePerformanceTracking: true }),
 *   withComputed((store) => ({
 *     // Your computed properties
 *   })),
 *   withMethods((store) => ({
 *     // Your methods
 *   }))
 * );
 * ```
 */

// Export all custom features
export { withTaxCalculator } from './with-tax-calculator';
export type { 
  TaxConfig, 
  TaxState, 
  TaxCalculationResult 
} from './with-tax-calculator';

export { withDiscounts } from './with-discounts';
export type { 
  Discount, 
  Coupon, 
  DiscountState, 
  DiscountCalculationResult 
} from './with-discounts';

export { withPersistence } from './with-persistence';
export type { 
  PersistenceConfig, 
  PersistenceState, 
  PersistenceStats 
} from './with-persistence';

export { withAnalytics } from './with-analytics';
export type { 
  AnalyticsEvent, 
  UserBehavior, 
  PerformanceMetrics, 
  AnalyticsState, 
  AnalyticsReport 
} from './with-analytics';

// Export shared types
export type { CalculationItem } from './types';

/**
 * Note: Utility composition functions are commented out to avoid circular dependencies
 * in this demonstration. In a real application, these would be in separate files
 * or the features would be imported differently.
 */

/**
 * Feature testing utilities
 */
export function createTestStore(features: any[] = []) {
  // This would be used in tests to create stores with specific feature combinations
  return features;
}

/**
 * Feature validation utilities
 */
export function validateFeatureCompatibility(features: string[]): boolean {
  // Basic validation - could be expanded with more sophisticated checks
  const hasConflictingFeatures = features.includes('withTaxCalculator') && 
                                  features.includes('withNoTaxCalculator');
  
  return !hasConflictingFeatures;
}

/**
 * Feature documentation and examples
 */
export const FEATURE_EXAMPLES = {
  taxCalculator: {
    name: 'Tax Calculator',
    description: 'Progressive tax calculation with luxury tax support',
    usage: 'withTaxCalculator()',
    configOptions: ['standardRate', 'luxuryRate', 'luxuryThreshold', 'exemptCategories']
  },
  discounts: {
    name: 'Discounts',
    description: 'Comprehensive discount and promotion management',
    usage: 'withDiscounts()',
    features: ['bulk discounts', 'category discounts', 'coupon codes', 'stacking rules']
  },
  persistence: {
    name: 'Persistence',
    description: 'Automatic state persistence with versioning',
    usage: 'withPersistence({ key: "store-key", version: 1 })',
    features: ['auto-save', 'versioning', 'migrations', 'selective persistence']
  },
  analytics: {
    name: 'Analytics',
    description: 'Event tracking and performance metrics',
    usage: 'withAnalytics({ enablePerformanceTracking: true })',
    features: ['event tracking', 'session management', 'performance monitoring', 'user behavior analysis']
  }
};

/**
 * Performance monitoring for features
 */
export function withFeaturePerformanceMonitoring() {
  // This could be used to monitor the performance impact of different features
  return {
    measureFeatureImpact: (featureName: string, operation: () => void) => {
      const start = performance.now();
      operation();
      const end = performance.now();
      console.log(`Feature ${featureName} took ${end - start} milliseconds`);
    }
  };
}