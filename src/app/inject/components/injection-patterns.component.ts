import { Component, inject, computed, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Import the files we created for the workshop
import { 
  CART_CONFIG, 
  FEATURE_FLAGS, 
  ANALYTICS_CONFIG,
  DEFAULT_CART_CONFIG,
  CartConfig,
  AnalyticsConfig 
} from '../config/cart-config';
import { 
  injectOptionalService, 
  injectWithFallback, 
  createCartAnalytics,
  measureInjectionPerformance 
} from '../utils/injection-utils';

@Component({
  selector: 'injection-patterns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="patterns-container">
      <header class="page-header">
        <h1>inject() Patterns Demonstration</h1>
        <p class="subtitle">Interactive examples of modern Angular dependency injection patterns</p>
        <nav>
          <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
        </nav>
      </header>

      <!-- Pattern 1: Basic inject() vs Constructor -->
      <section class="pattern-section">
        <h2>Pattern 1: Basic inject() vs Constructor Injection</h2>
        <div class="comparison-grid">
          <div class="pattern-card old-way">
            <h3>❌ Old Way: Constructor Injection</h3>
            <pre><code>@Component({})
export class OldComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private service: MyService
  ) {}
}</code></pre>
          </div>
          
          <div class="pattern-card new-way">
            <h3>✅ New Way: inject() Function</h3>
            <pre><code>@Component({})
export class ModernComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private service = inject(MyService);
}</code></pre>
          </div>
        </div>
        <div class="pattern-info">
          <p><strong>Benefits:</strong> Cleaner code, better tree-shaking, functional composition support</p>
          <p><strong>Services Injected:</strong> {{ basicInjectionInfo().services }}</p>
          <p><strong>Injection Time:</strong> {{ basicInjectionInfo().injectionTime }}ms</p>
        </div>
      </section>

      <!-- Pattern 2: Optional Injection -->
      <section class="pattern-section">
        <h2>Pattern 2: Optional Service Injection</h2>
        <div class="pattern-demo">
          <h3>Optional Services with Graceful Fallbacks</h3>
          <pre><code>// Optional service that may not be provided
private analytics = inject(AnalyticsService, { optional: true });
private logger = inject(Logger, { optional: true });

// Use with null checks
if (this.analytics) {
  this.analytics.trackEvent('user_action');
}</code></pre>
          
          <div class="demo-results">
            <p><strong>Analytics Service:</strong> {{ optionalInjectionInfo().analyticsAvailable ? '✅ Available' : '❌ Not Available' }}</p>
            <p><strong>Logger Service:</strong> {{ optionalInjectionInfo().loggerAvailable ? '✅ Available' : '❌ Not Available' }}</p>
            <p><strong>Fallback Strategy:</strong> {{ optionalInjectionInfo().fallbackStrategy }}</p>
            
            <button class="btn btn-primary" (click)="testOptionalServices()">
              Test Optional Services
            </button>
            
            @if (optionalServiceResult()) {
              <div class="result-panel">
                <h4>Test Results:</h4>
                <ul>
                  @for (result of optionalServiceResult(); track result.service) {
                    <li>{{ result.service }}: {{ result.status }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Pattern 3: Configuration Injection -->
      <section class="pattern-section">
        <h2>Pattern 3: Configuration Token Injection</h2>
        <div class="pattern-demo">
          <h3>Inject Configuration with Fallbacks</h3>
          <pre><code>// Configuration injection with fallback
private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CONFIG;

// Use configuration
const maxItems = this.config.maxItems;
const taxRate = this.config.taxRate;</code></pre>
          
          <div class="config-display">
            <h4>Current Configuration:</h4>
            <div class="config-grid">
              @for (item of Object.entries(configInfo()); track item[0]) {
                <div class="config-item">
                  <span class="config-key">{{ item[0] }}:</span>
                  <span class="config-value">{{ item[1] }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-secondary" (click)="updateConfiguration()">
              Update Configuration
            </button>
          </div>
        </div>
      </section>

      <!-- Pattern 4: Platform-Specific Injection -->
      <section class="pattern-section">
        <h2>Pattern 4: Platform-Specific Injection</h2>
        <div class="pattern-demo">
          <h3>Different Services for Browser vs Server</h3>
          <pre><code>// Platform-specific injection for SSR
private storage = isPlatformBrowser(inject(PLATFORM_ID))
  ? inject(BrowserStorageService)
  : inject(ServerStorageService);</code></pre>
          
          <div class="platform-info">
            <p><strong>Current Platform:</strong> {{ platformInfo().platform }}</p>
            <p><strong>Storage Service:</strong> {{ platformInfo().storageService }}</p>
            <p><strong>Browser Features Available:</strong> {{ platformInfo().browserFeatures ? '✅ Yes' : '❌ No' }}</p>
            
            <button class="btn btn-primary" (click)="testPlatformServices()">
              Test Platform-Specific Services
            </button>
            
            @if (platformTestResult()) {
              <div class="result-panel">
                <h4>Platform Test Results:</h4>
                <pre>{{ platformTestResult() }}</pre>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Pattern 5: Conditional Injection -->
      <section class="pattern-section">
        <h2>Pattern 5: Conditional Injection with Feature Flags</h2>
        <div class="pattern-demo">
          <h3>Inject Services Based on Feature Flags</h3>
          <pre><code>// Conditional injection based on feature flags
private advancedFeatures = inject(FEATURE_FLAGS)?.advancedCart
  ? inject(AdvancedCartService, { optional: true })
  : null;</code></pre>
          
          <div class="feature-flags-display">
            <h4>Feature Flags Status:</h4>
            <div class="flags-grid">
              @for (flag of Object.entries(featureFlags()); track flag[0]) {
                <div class="flag-item" [class.enabled]="flag[1]">
                  <span class="flag-name">{{ flag[0] }}:</span>
                  <span class="flag-status">{{ flag[1] ? '✅ Enabled' : '❌ Disabled' }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="toggleFeatureFlag('advancedCart')">
              Toggle Advanced Cart
            </button>
          </div>
        </div>
      </section>

      <!-- Pattern 6: Performance Measurement -->
      <section class="pattern-section">
        <h2>Pattern 6: Injection Performance Monitoring</h2>
        <div class="pattern-demo">
          <h3>Measure inject() Performance</h3>
          <pre><code>// Measure injection performance
const result = measureInjectionPerformance(() => {
  return inject(ExpensiveService);
});</code></pre>
          
          <div class="performance-display">
            <button class="btn btn-primary" (click)="measurePerformance()">
              Measure All Injections
            </button>
            
            @if (performanceResults()) {
              <div class="performance-results">
                <h4>Performance Metrics:</h4>
                @for (result of performanceResults(); track result.pattern) {
                  <div class="performance-item">
                    <span class="pattern-name">{{ result.pattern }}:</span>
                    <span class="timing">{{ result.duration }}ms</span>
                    <span class="status" [class.success]="result.success">
                      {{ result.success ? '✅' : '❌' }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Summary -->
      <section class="summary-section">
        <h2>inject() Function Benefits Summary</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>🎯 Cleaner Code</h3>
            <p>No constructor boilerplate, field-based organization</p>
          </div>
          <div class="benefit-card">
            <h3>🔧 Better Flexibility</h3>
            <p>Optional injection, conditional dependencies</p>
          </div>
          <div class="benefit-card">
            <h3>🚀 Performance</h3>
            <p>Better tree-shaking, smaller bundles</p>
          </div>
          <div class="benefit-card">
            <h3>🧪 Testing</h3>
            <p>Easier mocking, better test isolation</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .patterns-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .back-btn {
      display: inline-block;
      background: #8b5cf6;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
    }
    
    .pattern-section {
      margin-bottom: 3rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 2rem;
    }
    
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .pattern-card {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 1rem;
    }
    
    .old-way {
      border-left: 4px solid #ef4444;
    }
    
    .new-way {
      border-left: 4px solid #10b981;
    }
    
    .pattern-info {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 1rem;
    }
    
    .pattern-demo {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 1.5rem;
    }
    
    .config-grid, .flags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .config-item, .flag-item, .performance-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #f3f4f6;
      border-radius: 4px;
    }
    
    .flag-item.enabled {
      background: #d1fae5;
    }
    
    .demo-results, .config-display, .platform-info, .feature-flags-display, .performance-display {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 6px;
    }
    
    .result-panel {
      margin-top: 1rem;
      padding: 1rem;
      background: #e0f2fe;
      border: 1px solid #0ea5e9;
      border-radius: 6px;
    }
    
    .btn {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin: 0.5rem 0.5rem 0.5rem 0;
    }
    
    .btn:hover {
      background: #4f46e5;
    }
    
    .btn-secondary {
      background: #6b7280;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .benefit-card {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 1.5rem;
      text-align: center;
    }
    
    .summary-section {
      background: #f0f9ff;
      border: 2px solid #0ea5e9;
      border-radius: 8px;
      padding: 2rem;
    }
    
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
    
    .performance-results {
      margin-top: 1rem;
    }
    
    .timing {
      font-weight: bold;
      color: #059669;
    }
    
    .status.success {
      color: #10b981;
    }
    
    @media (max-width: 768px) {
      .comparison-grid {
        grid-template-columns: 1fr;
      }
      
      .config-grid, .flags-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InjectionPatternsComponent {
  // Demonstrate different inject() patterns
  
  // Pattern 1: Basic injection
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  // Pattern 2: Optional injection
  private analytics = injectOptionalService('AnalyticsService');
  private logger = injectOptionalService('Logger');
  
  // Pattern 3: Configuration injection with fallback
  private config = injectWithFallback(CART_CONFIG, DEFAULT_CART_CONFIG);
  
  // Pattern 4: Platform-specific injection
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Pattern 5: Feature flags
  private flags = injectWithFallback(FEATURE_FLAGS, {
    advancedCart: true,
    recommendations: true,
    promotions: false,
    socialSharing: false,
    guestCheckout: true
  });
  
  // Component state
  optionalServiceResult = signal<any[] | null>(null);
  platformTestResult = signal<string | null>(null);
  performanceResults = signal<any[] | null>(null);
  
  // Computed values for display
  basicInjectionInfo = computed(() => ({
    services: 'HttpClient, PLATFORM_ID',
    injectionTime: Math.round(Math.random() * 10) // Simulated
  }));
  
  optionalInjectionInfo = computed(() => ({
    analyticsAvailable: !!this.analytics,
    loggerAvailable: !!this.logger,
    fallbackStrategy: 'Graceful degradation with null checks'
  }));
  
  configInfo = computed(() => ({
    maxItems: this.config.maxItems,
    taxRate: this.config.taxRate,
    currency: this.config.currency,
    enableAnalytics: this.config.enableAnalytics,
    enableLogging: this.config.enableLogging
  }));
  
  platformInfo = computed(() => ({
    platform: this.isBrowser ? 'Browser' : 'Server',
    storageService: this.isBrowser ? 'LocalStorageService' : 'MemoryStorageService',
    browserFeatures: this.isBrowser
  }));
  
  featureFlags = computed(() => this.flags);
  
  // Interactive methods
  testOptionalServices() {
    const results = [
      {
        service: 'AnalyticsService',
        status: this.analytics ? 'Successfully injected' : 'Not available, using fallback'
      },
      {
        service: 'Logger',
        status: this.logger ? 'Successfully injected' : 'Using console.log fallback'
      }
    ];
    
    this.optionalServiceResult.set(results);
    
    // Simulate using the services
    if (this.analytics) {
      console.log('Analytics: trackEvent called');
    } else {
      console.log('Analytics: fallback tracking');
    }
  }
  
  updateConfiguration() {
    // Simulate configuration update
    console.log('Configuration updated (simulation)');
    console.log('Current config:', this.config);
  }
  
  testPlatformServices() {
    const result = this.isBrowser 
      ? 'Browser platform detected: localStorage available, DOM APIs accessible'
      : 'Server platform detected: using memory storage, no DOM APIs';
    
    this.platformTestResult.set(result);
  }
  
  toggleFeatureFlag(flag: string) {
    // Simulate feature flag toggle
    console.log(`Toggling feature flag: ${flag}`);
    // Note: In real app, this would update the actual feature flag service
  }
  
  measurePerformance() {
    const patterns = [
      'Basic HttpClient injection',
      'Optional service injection',
      'Configuration injection',
      'Platform-specific injection',
      'Feature flag injection'
    ];
    
    const results = patterns.map(pattern => {
      const start = performance.now();
      
      // Simulate injection work
      const mockInjection = () => {
        return { pattern, injected: true };
      };
      
      try {
        mockInjection();
        const end = performance.now();
        
        return {
          pattern,
          duration: Number((end - start).toFixed(3)),
          success: true
        };
      } catch (error) {
        const end = performance.now();
        
        return {
          pattern,
          duration: Number((end - start).toFixed(3)),
          success: false
        };
      }
    });
    
    this.performanceResults.set(results);
  }
}