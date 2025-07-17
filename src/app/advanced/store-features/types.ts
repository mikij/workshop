/**
 * Shared types for custom store features
 */

// Common item type for calculations
export interface CalculationItem {
  price: number;
  quantity: number;
  category: string;
}

// Tax calculation types
export interface TaxConfig {
  standardRate: number;
  luxuryRate: number;
  luxuryThreshold: number;
  progressiveRates: {
    threshold: number;
    rate: number;
  }[];
  exemptCategories: string[];
}

export interface TaxState {
  taxConfig: TaxConfig;
  appliedTaxRate: number;
  taxBreakdown: {
    standardTax: number;
    luxuryTax: number;
    effectiveRate: number;
  };
}

export interface TaxCalculationResult {
  subtotal: number;
  standardTax: number;
  luxuryTax: number;
  totalTax: number;
  effectiveRate: number;
  breakdown: {
    category: string;
    rate: number;
    amount: number;
  }[];
}

// Discount types
export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bulk' | 'category';
  value: number;
  minQuantity?: number;
  category?: string;
  stackable: boolean;
  active: boolean;
}

export interface Coupon {
  code: string;
  discountId: string;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
}

export interface DiscountState {
  discounts: Discount[];
  coupons: Coupon[];
  appliedDiscounts: string[];
  appliedCoupons: string[];
}

export interface DiscountCalculationResult {
  discountAmount: number;
  appliedDiscounts: string[];
  breakdown: {
    discountId: string;
    name: string;
    amount: number;
    type: string;
  }[];
}

// Persistence types
export interface PersistenceConfig {
  key: string;
  storage: 'localStorage' | 'sessionStorage';
  debounceMs: number;
  version: number;
  include?: string[];
  exclude?: string[];
  migrations?: Record<number, (state: any) => any>;
}

export interface PersistenceState {
  lastSaved: Date | null;
  version: number;
  persistenceStats: {
    saveCount: number;
    loadCount: number;
    errorCount: number;
    storageSize: number;
  };
}

export interface PersistenceStats {
  saveCount: number;
  loadCount: number;
  errorCount: number;
  storageSize: number;
  lastSaved: Date | null;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  type: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
}

export interface UserBehavior {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  events: AnalyticsEvent[];
  pageViews: string[];
}

export interface PerformanceMetrics {
  renderTime: number;
  computationTime: number;
  memoryUsage: number;
  eventProcessingTime: number;
}

export interface AnalyticsState {
  events: AnalyticsEvent[];
  currentSession: UserBehavior;
  performanceMetrics: PerformanceMetrics;
  isEnabled: boolean;
  userId: string | null;
}

export interface AnalyticsReport {
  totalEvents: number;
  sessionDuration: number;
  conversionRate: number;
  bounceRate: number;
  topEvents: { type: string; count: number }[];
  userFlow: { step: string; completionRate: number }[];
  performanceStats: {
    averageRenderTime: number;
    averageComputationTime: number;
    averageOrderValue: number;
  };
}