import { computed } from '@angular/core';
import { signalStoreFeature, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { TaxConfig, TaxState, TaxCalculationResult, CalculationItem } from './types';

/**
 * Custom Store Feature: Tax Calculator
 * 
 * This feature provides reusable tax calculation logic for e-commerce stores.
 * It supports progressive tax rates, luxury tax, and category exemptions.
 * 
 * Usage:
 * ```typescript
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withTaxCalculator(),
 *   withComputed((store) => ({
 *     cartTotal: computed(() => store.calculateTax(...))
 *   }))
 * );
 * ```
 */
export function withTaxCalculator(config?: Partial<TaxConfig>) {
  const defaultConfig: TaxConfig = {
    standardRate: 0.08, // 8%
    luxuryRate: 0.15,   // 15% for luxury items
    luxuryThreshold: 1000, // Items over $1000 are luxury
    progressiveRates: [
      { threshold: 0, rate: 0.08 },      // 8% for first tier
      { threshold: 500, rate: 0.10 },    // 10% for $500+
      { threshold: 1000, rate: 0.12 }    // 12% for $1000+
    ],
    exemptCategories: ['books'], // Books are tax-exempt in many places
    ...config
  };

  return signalStoreFeature(
    // Feature state
    withState<TaxState>({
      taxConfig: defaultConfig,
      appliedTaxRate: defaultConfig.standardRate,
      taxBreakdown: {
        standardTax: 0,
        luxuryTax: 0,
        effectiveRate: defaultConfig.standardRate
      }
    }),

    // Feature computed signals
    withComputed((store) => ({
      // Get current tax configuration
      currentTaxConfig: computed(() => store.taxConfig()),
      
      // Get current effective tax rate
      effectiveTaxRate: computed(() => store.taxBreakdown().effectiveRate),
      
      // Check if luxury tax is enabled
      isLuxuryTaxEnabled: computed(() => store.taxConfig().luxuryRate > 0),
      
      // Get exempt categories
      exemptCategories: computed(() => store.taxConfig().exemptCategories)
    })),

    // Feature methods
    withMethods((store) => ({
      // Update tax configuration
      updateTaxConfig: (newConfig: Partial<TaxConfig>) => {
        patchState(store, {
          taxConfig: { ...store.taxConfig(), ...newConfig }
        });
      },

      // Calculate tax for items
      calculateTax: (totalAmount: number, items: CalculationItem[] = []): TaxCalculationResult => {
        const config = store.taxConfig();
        let standardTax = 0;
        let luxuryTax = 0;
        const breakdown: { category: string; rate: number; amount: number; }[] = [];

        // If no items provided, use simple calculation
        if (items.length === 0) {
          const rate = getProgressiveRate(totalAmount, config.progressiveRates);
          standardTax = totalAmount * rate;
          
          return {
            subtotal: totalAmount,
            standardTax,
            luxuryTax: 0,
            totalTax: standardTax,
            effectiveRate: rate,
            breakdown: [{ category: 'general', rate, amount: standardTax }]
          };
        }

        // Calculate tax per item/category
        for (const item of items) {
          const itemTotal = item.price * item.quantity;
          
          // Skip exempt categories
          if (config.exemptCategories.includes(item.category)) {
            breakdown.push({ category: item.category, rate: 0, amount: 0 });
            continue;
          }

          // Check if luxury item
          if (item.price >= config.luxuryThreshold) {
            const luxuryTaxAmount = itemTotal * config.luxuryRate;
            luxuryTax += luxuryTaxAmount;
            breakdown.push({ 
              category: item.category, 
              rate: config.luxuryRate, 
              amount: luxuryTaxAmount 
            });
          } else {
            // Use progressive rate based on item total
            const rate = getProgressiveRate(itemTotal, config.progressiveRates);
            const taxAmount = itemTotal * rate;
            standardTax += taxAmount;
            breakdown.push({ 
              category: item.category, 
              rate, 
              amount: taxAmount 
            });
          }
        }

        const totalTax = standardTax + luxuryTax;
        const effectiveRate = totalAmount > 0 ? totalTax / totalAmount : 0;

        // Update store state with calculated breakdown
        patchState(store, {
          taxBreakdown: {
            standardTax,
            luxuryTax,
            effectiveRate
          },
          appliedTaxRate: effectiveRate
        });

        return {
          subtotal: totalAmount,
          standardTax,
          luxuryTax,
          totalTax,
          effectiveRate,
          breakdown
        };
      },

      // Set luxury tax rate
      setLuxuryTaxRate: (rate: number) => {
        patchState(store, {
          taxConfig: { 
            ...store.taxConfig(), 
            luxuryRate: Math.max(0, Math.min(1, rate)) // Clamp between 0-100%
          }
        });
      },

      // Set luxury threshold
      setLuxuryThreshold: (threshold: number) => {
        patchState(store, {
          taxConfig: { 
            ...store.taxConfig(), 
            luxuryThreshold: Math.max(0, threshold)
          }
        });
      },

      // Add exempt category
      addExemptCategory: (category: string) => {
        const config = store.taxConfig();
        if (!config.exemptCategories.includes(category)) {
          patchState(store, {
            taxConfig: {
              ...config,
              exemptCategories: [...config.exemptCategories, category]
            }
          });
        }
      },

      // Remove exempt category
      removeExemptCategory: (category: string) => {
        patchState(store, {
          taxConfig: {
            ...store.taxConfig(),
            exemptCategories: store.taxConfig().exemptCategories.filter(c => c !== category)
          }
        });
      },

      // Reset to default configuration
      resetTaxConfig: () => {
        patchState(store, {
          taxConfig: defaultConfig,
          appliedTaxRate: defaultConfig.standardRate,
          taxBreakdown: {
            standardTax: 0,
            luxuryTax: 0,
            effectiveRate: defaultConfig.standardRate
          }
        });
      }
    }))
  );
}

// Helper function to determine progressive tax rate
function getProgressiveRate(amount: number, progressiveRates: { threshold: number; rate: number; }[]): number {
  // Sort rates by threshold (descending) to find the highest applicable rate
  const sortedRates = [...progressiveRates].sort((a, b) => b.threshold - a.threshold);
  
  for (const { threshold, rate } of sortedRates) {
    if (amount >= threshold) {
      return rate;
    }
  }
  
  // Fallback to the lowest threshold rate
  return progressiveRates[0]?.rate || 0;
}

// Export types for external use
export type { TaxConfig, TaxState, TaxCalculationResult };