import { computed } from '@angular/core';
import { signalStoreFeature, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { AnalyticsEvent, UserBehavior, PerformanceMetrics, AnalyticsState, AnalyticsReport } from './types';

/**
 * Custom Store Feature: Analytics
 * 
 * This feature provides event tracking, performance metrics, and user behavior analysis.
 * Includes session management, conversion tracking, and performance monitoring.
 * 
 * Usage:
 * ```typescript
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withAnalytics({ enablePerformanceTracking: true }),
 *   withMethods((store) => ({
 *     onUserAction: () => store.trackCustom('user_action', { data })
 *   }))
 * );
 * ```
 */
export function withAnalytics(config: { enablePerformanceTracking?: boolean } = {}) {
  const { enablePerformanceTracking = false } = config;
  
  const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return signalStoreFeature(
    // Feature state
    withState<AnalyticsState>({
      events: [],
      currentSession: {
        sessionId: generateSessionId(),
        userId: null,
        startTime: new Date(),
        endTime: undefined,
        events: [],
        pageViews: []
      },
      performanceMetrics: {
        renderTime: 0,
        computationTime: 0,
        memoryUsage: 0,
        eventProcessingTime: 0
      },
      isEnabled: true,
      userId: null
    }),

    // Feature computed signals
    withComputed((store) => ({
      // Get total number of events
      totalEvents: computed(() => store.events().length),

      // Get current session duration
      sessionDuration: computed(() => {
        const session = store.currentSession();
        const endTime = session.endTime || new Date();
        return endTime.getTime() - session.startTime.getTime();
      }),

      // Get events by type
      eventsByType: computed(() => {
        const events = store.events();
        const grouped: Record<string, number> = {};
        
        events.forEach(event => {
          grouped[event.type] = (grouped[event.type] || 0) + 1;
        });
        
        return Object.entries(grouped)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);
      }),

      // Get recent events (last 10)
      recentEvents: computed(() => 
        store.events().slice(-10).reverse()
      ),

      // Get session events
      sessionEvents: computed(() => 
        store.events().filter(event => 
          event.sessionId === store.currentSession().sessionId
        )
      ),

      // Check if analytics is working
      isAnalyticsActive: computed(() => 
        store.isEnabled() && store.events().length > 0
      ),

      // Get performance summary
      performanceSummary: computed(() => {
        const metrics = store.performanceMetrics();
        return {
          ...metrics,
          averageEventProcessingTime: store.events().length > 0 
            ? metrics.eventProcessingTime / store.events().length 
            : 0
        };
      }),

      // Get page views for current session
      currentSessionPageViews: computed(() => store.currentSession().pageViews),

      // Get user journey (page views in order)
      userJourney: computed(() => {
        const pageViews = store.currentSession().pageViews;
        return pageViews.map((page, index) => ({
          step: index + 1,
          page,
          timestamp: store.events().find(e => 
            e.type === 'page_view' && e.data['page'] === page
          )?.timestamp
        }));
      })
    })),

    // Feature methods
    withMethods((store) => ({
      // Track a custom event
      trackCustom: (eventType: string, data: Record<string, any> = {}) => {
        if (!store.isEnabled()) return;

        const startTime = performance.now();
        
        const event: AnalyticsEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: eventType,
          timestamp: new Date(),
          userId: store.userId() || undefined,
          sessionId: store.currentSession().sessionId,
          data
        };

        patchState(store, {
          events: [...store.events(), event],
          currentSession: {
            ...store.currentSession(),
            events: [...store.currentSession().events, event]
          }
        });

        // Update performance metrics if enabled
        if (enablePerformanceTracking) {
          const processingTime = performance.now() - startTime;
          patchState(store, {
            performanceMetrics: {
              ...store.performanceMetrics(),
              eventProcessingTime: store.performanceMetrics().eventProcessingTime + processingTime
            }
          });
        }
      },

      // Track page view
      trackPageView: (page: string) => {
        const session = store.currentSession();
        
        // Update session page views
        if (!session.pageViews.includes(page)) {
          patchState(store, {
            currentSession: {
              ...session,
              pageViews: [...session.pageViews, page]
            }
          });
        }

        // Track as event
        store.trackCustom('page_view', { page });
      },

      // Track cart events
      trackCartAdd: (productId: string, price: number, quantity: number) => {
        store.trackCustom('cart_add', {
          productId,
          price,
          quantity,
          value: price * quantity
        });
      },

      trackCartRemove: (productId: string, price: number, quantity: number) => {
        store.trackCustom('cart_remove', {
          productId,
          price,
          quantity,
          value: price * quantity
        });
      },

      trackPurchase: (orderId: string, totalAmount: number, items: any[]) => {
        store.trackCustom('purchase', {
          orderId,
          totalAmount,
          itemCount: items.length,
          items: items.map(item => ({
            productId: item.productId || item.id,
            price: item.price,
            quantity: item.quantity
          }))
        });
      },

      // Track search
      trackSearch: (query: string, resultCount: number) => {
        store.trackCustom('search', {
          query,
          resultCount,
          hasResults: resultCount > 0
        });
      },

      // Set user ID
      setUserId: (userId: string) => {
        patchState(store, {
          userId,
          currentSession: {
            ...store.currentSession(),
            userId
          }
        });
      },

      // Start new session
      startNewSession: () => {
        // End current session
        patchState(store, {
          currentSession: {
            ...store.currentSession(),
            endTime: new Date()
          }
        });

        // Start new session
        const newSession: UserBehavior = {
          sessionId: generateSessionId(),
          userId: store.userId() || undefined,
          startTime: new Date(),
          events: [],
          pageViews: []
        };

        patchState(store, {
          currentSession: newSession
        });

        // Track session start without calling trackCustom to avoid circular dependency
        const event: AnalyticsEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'session_start',
          timestamp: new Date(),
          userId: store.userId() || undefined,
          sessionId: newSession.sessionId,
          data: { previousSessionDuration: store.sessionDuration() }
        };

        patchState(store, {
          events: [...store.events(), event]
        });
      },

      // End current session
      endSession: () => {
        // Track session end without calling trackCustom to avoid circular dependency
        const event: AnalyticsEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'session_end',
          timestamp: new Date(),
          userId: store.userId() || undefined,
          sessionId: store.currentSession().sessionId,
          data: {
            sessionDuration: store.sessionDuration(),
            eventCount: store.sessionEvents().length,
            pageViewCount: store.currentSession().pageViews.length
          }
        };

        patchState(store, {
          events: [...store.events(), event],
          currentSession: {
            ...store.currentSession(),
            endTime: new Date()
          }
        });
      },

      // Enable/disable analytics
      toggleAnalytics: (enabled: boolean) => {
        patchState(store, { isEnabled: enabled });
        
        if (enabled) {
          // Track analytics enabled without calling trackCustom
          const event: AnalyticsEvent = {
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'analytics_enabled',
            timestamp: new Date(),
            userId: store.userId() || undefined,
            sessionId: store.currentSession().sessionId,
            data: {}
          };

          patchState(store, {
            events: [...store.events(), event]
          });
        }
      },

      // Clear all events (for privacy/GDPR compliance)
      clearEvents: () => {
        patchState(store, {
          events: [],
          currentSession: {
            ...store.currentSession(),
            events: []
          }
        });
      },

      // Update performance metrics
      updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => {
        if (enablePerformanceTracking) {
          patchState(store, {
            performanceMetrics: {
              ...store.performanceMetrics(),
              ...metrics
            }
          });
        }
      },

      // Generate analytics report
      generateReport: (): AnalyticsReport => {
        const events = store.events();
        const session = store.currentSession();
        const eventList = events.length > 0 ? events : [];
        
        // Calculate conversion funnel
        const addToCartEvents = eventList.filter(e => e.type === 'cart_add').length;
        const purchaseEvents = eventList.filter(e => e.type === 'purchase').length;
        const conversionRate = addToCartEvents > 0 ? purchaseEvents / addToCartEvents : 0;

        // Calculate bounce rate (sessions with only 1 page view)
        const bounceRate = session.pageViews.length <= 1 ? 1 : 0;

        // Get top events
        const topEvents = store.eventsByType().slice(0, 5);

        // Calculate user flow completion rates
        const userFlow = [
          { step: 'page_view', completionRate: 1 },
          { step: 'cart_add', completionRate: addToCartEvents / Math.max(eventList.length, 1) },
          { step: 'purchase', completionRate: conversionRate }
        ];

        // Calculate performance stats
        const purchaseAmounts = eventList
          .filter(e => e.type === 'purchase')
          .map(e => e.data['totalAmount'] || 0);
        
        const averageOrderValue = purchaseAmounts.length > 0
          ? purchaseAmounts.reduce((sum, amount) => sum + amount, 0) / purchaseAmounts.length
          : 0;

        return {
          totalEvents: eventList.length,
          sessionDuration: store.sessionDuration(),
          conversionRate,
          bounceRate,
          topEvents,
          userFlow,
          performanceStats: {
            averageRenderTime: store.performanceMetrics().renderTime,
            averageComputationTime: store.performanceMetrics().computationTime,
            averageOrderValue
          }
        };
      }
    }))
  );
}

// Export types for external use
export type { AnalyticsEvent, UserBehavior, PerformanceMetrics, AnalyticsState, AnalyticsReport };