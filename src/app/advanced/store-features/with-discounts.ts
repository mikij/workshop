import { computed } from '@angular/core';
import { signalStoreFeature, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Discount, Coupon, DiscountState, DiscountCalculationResult, CalculationItem } from './types';

/**
 * Custom Store Feature: Discounts
 * 
 * This feature provides comprehensive discount and promotion management.
 * Supports multiple discount types, coupons, and stacking rules.
 * 
 * Usage:
 * ```typescript
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withDiscounts(),
 *   withComputed((store) => ({
 *     totalWithDiscounts: computed(() => store.calculateDiscounts(...))
 *   }))
 * );
 * ```
 */
export function withDiscounts() {
  const defaultDiscounts: Discount[] = [
    {
      id: 'bulk-10',
      name: 'Bulk Discount 10%',
      type: 'bulk',
      value: 0.10,
      minQuantity: 5,
      stackable: false,
      active: true
    },
    {
      id: 'bulk-15',
      name: 'Bulk Discount 15%',
      type: 'bulk',
      value: 0.15,
      minQuantity: 10,
      stackable: false,
      active: true
    },
    {
      id: 'electronics-5',
      name: 'Electronics 5% Off',
      type: 'category',
      value: 0.05,
      category: 'electronics',
      stackable: true,
      active: true
    },
    {
      id: 'clothing-10',
      name: 'Clothing 10% Off',
      type: 'category',
      value: 0.10,
      category: 'clothing',
      stackable: true,
      active: true
    }
  ];

  const defaultCoupons: Coupon[] = [
    {
      code: 'SAVE20',
      discountId: 'save20-fixed',
      usageCount: 0,
      usageLimit: 100
    },
    {
      code: 'WELCOME10',
      discountId: 'welcome10-percent',
      usageCount: 0,
      usageLimit: 50
    }
  ];

  return signalStoreFeature(
    // Feature state
    withState<DiscountState>({
      discounts: [
        ...defaultDiscounts,
        {
          id: 'save20-fixed',
          name: '$20 Off',
          type: 'fixed',
          value: 20,
          stackable: false,
          active: true
        },
        {
          id: 'welcome10-percent',
          name: 'Welcome 10% Off',
          type: 'percentage',
          value: 0.10,
          stackable: true,
          active: true
        }
      ],
      coupons: defaultCoupons,
      appliedDiscounts: [],
      appliedCoupons: []
    }),

    // Feature computed signals
    withComputed((store) => ({
      // Get all active discounts
      activeDiscounts: computed(() => 
        store.discounts().filter(d => d.active)
      ),
      
      // Get all valid coupons (not expired, under usage limit)
      validCoupons: computed(() => 
        store.coupons().filter(c => {
          const discount = store.discounts().find(d => d.id === c.discountId);
          const isValid = discount?.active && 
                         (!c.usageLimit || c.usageCount < c.usageLimit) &&
                         (!c.expiresAt || new Date() < c.expiresAt);
          return isValid;
        })
      ),

      // Get currently applied discounts with details
      appliedDiscountDetails: computed(() => 
        store.appliedDiscounts().map(id => 
          store.discounts().find(d => d.id === id)
        ).filter(Boolean) as Discount[]
      ),

      // Get currently applied coupons with details
      appliedCouponDetails: computed(() => 
        store.appliedCoupons().map(code => 
          store.coupons().find(c => c.code === code)
        ).filter(Boolean) as Coupon[]
      ),

      // Check if any discounts are applied
      hasDiscounts: computed(() => 
        store.appliedDiscounts().length > 0 || store.appliedCoupons().length > 0
      ),

      // Get bulk discounts available based on quantity
      availableBulkDiscounts: computed(() => 
        store.activeDiscounts().filter(d => d.type === 'bulk')
      ),

      // Get category discounts
      categoryDiscounts: computed(() => 
        store.activeDiscounts().filter(d => d.type === 'category')
      )
    })),

    // Feature methods
    withMethods((store) => ({
      // Add a new discount
      addDiscount: (discount: Discount) => {
        patchState(store, {
          discounts: [...store.discounts(), discount]
        });
      },

      // Remove a discount
      removeDiscount: (discountId: string) => {
        patchState(store, {
          discounts: store.discounts().filter(d => d.id !== discountId),
          appliedDiscounts: store.appliedDiscounts().filter(id => id !== discountId)
        });
      },

      // Toggle discount active status
      toggleDiscount: (discountId: string) => {
        patchState(store, {
          discounts: store.discounts().map(d => 
            d.id === discountId ? { ...d, active: !d.active } : d
          )
        });
      },

      // Apply coupon code
      applyCoupon: (couponCode: string): boolean => {
        const coupon = store.coupons().find(c => c.code === couponCode.toUpperCase());
        
        if (!coupon) {
          return false; // Coupon not found
        }

        // Check if coupon is valid
        const discount = store.discounts().find(d => d.id === coupon.discountId);
        if (!discount?.active) {
          return false; // Associated discount is not active
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return false; // Usage limit exceeded
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
          return false; // Coupon expired
        }

        if (store.appliedCoupons().includes(couponCode.toUpperCase())) {
          return false; // Coupon already applied
        }

        // Apply the coupon
        patchState(store, {
          appliedCoupons: [...store.appliedCoupons(), couponCode.toUpperCase()],
          appliedDiscounts: [...store.appliedDiscounts(), coupon.discountId],
          coupons: store.coupons().map(c => 
            c.code === couponCode.toUpperCase() 
              ? { ...c, usageCount: c.usageCount + 1 }
              : c
          )
        });

        return true;
      },

      // Remove coupon
      removeCoupon: (couponCode: string) => {
        const coupon = store.coupons().find(c => c.code === couponCode);
        if (!coupon) return;

        patchState(store, {
          appliedCoupons: store.appliedCoupons().filter(code => code !== couponCode),
          appliedDiscounts: store.appliedDiscounts().filter(id => id !== coupon.discountId),
          coupons: store.coupons().map(c => 
            c.code === couponCode 
              ? { ...c, usageCount: Math.max(0, c.usageCount - 1) }
              : c
          )
        });
      },

      // Calculate discounts for items
      calculateDiscounts: (items: CalculationItem[], totalAmount: number): DiscountCalculationResult => {
        const activeDiscounts = store.appliedDiscountDetails();
        let totalDiscount = 0;
        const breakdown: { discountId: string; name: string; amount: number; type: string; }[] = [];

        // Separate stackable and non-stackable discounts
        const stackableDiscounts = activeDiscounts.filter(d => d.stackable);
        const nonStackableDiscounts = activeDiscounts.filter(d => !d.stackable);

        // Find best non-stackable discount
        let bestNonStackable: Discount | null = null;
        let bestNonStackableAmount = 0;

        for (const discount of nonStackableDiscounts) {
          const amount = calculateSingleDiscount(discount, items, totalAmount);
          if (amount > bestNonStackableAmount) {
            bestNonStackable = discount;
            bestNonStackableAmount = amount;
          }
        }

        // Apply best non-stackable discount
        if (bestNonStackable && bestNonStackableAmount > 0) {
          totalDiscount += bestNonStackableAmount;
          breakdown.push({
            discountId: bestNonStackable.id,
            name: bestNonStackable.name,
            amount: bestNonStackableAmount,
            type: bestNonStackable.type
          });
        }

        // Apply all stackable discounts
        for (const discount of stackableDiscounts) {
          const amount = calculateSingleDiscount(discount, items, totalAmount);
          if (amount > 0) {
            totalDiscount += amount;
            breakdown.push({
              discountId: discount.id,
              name: discount.name,
              amount,
              type: discount.type
            });
          }
        }

        return {
          discountAmount: Math.min(totalDiscount, totalAmount), // Don't exceed total amount
          appliedDiscounts: breakdown.map(b => b.discountId),
          breakdown
        };
      },

      // Auto-apply best discounts
      autoApplyBestDiscounts: (items: CalculationItem[], totalAmount: number) => {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const newAppliedDiscounts: string[] = [];
        const activeDiscounts = store.discounts().filter(d => d.active);

        // Auto-apply bulk discounts
        const eligibleBulkDiscounts = activeDiscounts
          .filter((d: Discount) => d.type === 'bulk' && totalQuantity >= (d.minQuantity || 0))
          .sort((a, b) => (b.value || 0) - (a.value || 0)); // Sort by value desc

        if (eligibleBulkDiscounts.length > 0) {
          newAppliedDiscounts.push(eligibleBulkDiscounts[0].id);
        }

        // Auto-apply category discounts for items in cart
        const categoriesInCart = [...new Set(items.map(item => item.category))];
        for (const category of categoriesInCart) {
          const categoryDiscount = activeDiscounts
            .find((d: Discount) => d.type === 'category' && d.category === category);
          
          if (categoryDiscount) {
            newAppliedDiscounts.push(categoryDiscount.id);
          }
        }

        patchState(store, {
          appliedDiscounts: [...new Set(newAppliedDiscounts)] // Remove duplicates
        });
      },

      // Clear all applied discounts
      clearDiscounts: () => {
        patchState(store, {
          appliedDiscounts: [],
          appliedCoupons: []
        });
      },

      // Get discount info for analytics
      getDiscountInfo: () => {
        const appliedDiscounts = store.appliedDiscountDetails();
        const hasDiscounts = appliedDiscounts.length > 0;
        
        return {
          hasDiscounts,
          discountedItemsCount: appliedDiscounts.length,
          totalSavings: 0, // This would be calculated based on actual cart
          averageDiscount: hasDiscounts 
            ? appliedDiscounts.reduce((sum, d) => sum + (d.value || 0), 0) / appliedDiscounts.length 
            : 0,
          bulkDiscountApplied: appliedDiscounts.some(d => d.type === 'bulk')
        };
      }
    }))
  );
}

// Helper function to calculate discount amount for a single discount
function calculateSingleDiscount(discount: Discount, items: CalculationItem[], totalAmount: number): number {
  switch (discount.type) {
    case 'percentage':
      return totalAmount * (discount.value || 0);
    
    case 'fixed':
      return Math.min(discount.value || 0, totalAmount);
    
    case 'bulk': {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQuantity >= (discount.minQuantity || 0)) {
        return totalAmount * (discount.value || 0);
      }
      return 0;
    }
    
    case 'category': {
      const categoryItems = items.filter(item => item.category === discount.category);
      const categoryTotal = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return categoryTotal * (discount.value || 0);
    }
    
    default:
      return 0;
  }
}

// Export types for external use
export type { Discount, Coupon, DiscountState, DiscountCalculationResult };