import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';

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
  provideInjectCart,
  provideCartAnalytics,
  provideCartPersistence,
  provideCartEnvironment,
  provideCartFeatures,
  provideCartTesting
} from '../providers/cart-providers';
import { 
  createInjectionContext,
  createCartAnalytics,
  createCartValidator 
} from '../utils/injection-utils';

@Component({
  selector: 'provider-functions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="providers-container">
      <header class="page-header">
        <h1>Provider Functions</h1>
        <p class="subtitle">Advanced provider patterns and dependency injection strategies</p>
        <nav>
          <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
        </nav>
      </header>

      <!-- Provider Pattern 1: Basic Provider Functions -->
      <section class="provider-section">
        <h2>Pattern 1: Basic Provider Functions</h2>
        <div class="provider-demo">
          <h3>provideInjectCart() - Core Cart Providers</h3>
          <pre><code>export function provideInjectCart(config?: Partial<CartConfig>) {
  return [
    InjectCartService,
    { provide: CART_CONFIG, useValue: createCartConfig(config) },
    {
      provide: 'CartAnalyticsService',
      useFactory: () => {
        const config = inject(CART_CONFIG);
        const http = inject(HttpClient);
        return new CartAnalyticsService(config, http);
      }
    }
  ];
}</code></pre>
          
          <div class="provider-status">
            <h4>Provider Status:</h4>
            <div class="status-grid">
              @for (provider of basicProviderInfo(); track provider.name) {
                <div class="status-item" [class.active]="provider.active">
                  <span class="provider-name">{{ provider.name }}</span>
                  <span class="provider-status">{{ provider.status }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="testBasicProviders()">
              Test Basic Providers
            </button>
            
            @if (basicProviderResult()) {
              <div class="result-panel">
                <h4>Provider Test Results:</h4>
                <pre>{{ basicProviderResult() }}</pre>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Provider Pattern 2: Factory Providers with inject() -->
      <section class="provider-section">
        <h2>Pattern 2: Factory Providers using inject()</h2>
        <div class="provider-demo">
          <h3>Factory Functions with Internal inject() Calls</h3>
          <pre><code>// Factory provider that uses inject() internally
{
  provide: 'CartAnalyticsService',
  useFactory: () => {
    const config = inject(CART_CONFIG);  // inject() inside factory
    const http = inject(HttpClient);
    return new CartAnalyticsService(config, http);
  }
}</code></pre>
          
          <div class="factory-display">
            <h4>Factory Provider Results:</h4>
            <div class="factory-grid">
              @for (factory of factoryProviderInfo(); track factory.name) {
                <div class="factory-item">
                  <span class="factory-name">{{ factory.name }}</span>
                  <span class="factory-dependencies">Dependencies: {{ factory.dependencies }}</span>
                  <span class="factory-result">{{ factory.result }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="testFactoryProviders()">
              Test Factory Providers
            </button>
          </div>
        </div>
      </section>

      <!-- Provider Pattern 3: Multi-Provider Patterns -->
      <section class="provider-section">
        <h2>Pattern 3: Multi-Provider and Environment Providers</h2>
        <div class="provider-demo">
          <h3>Environment-Specific Provider Configuration</h3>
          <pre><code>export function provideCartEnvironment() {
  return makeEnvironmentProviders([
    // Core providers
    ...provideInjectCart(),
    
    // Environment-specific providers
    {
      provide: 'EnvironmentService',
      useFactory: () => {
        const features = inject(FEATURE_FLAGS);
        return new EnvironmentService(features);
      }
    }
  ]);
}</code></pre>
          
          <div class="environment-display">
            <h4>Environment Configuration:</h4>
            <div class="env-grid">
              @for (env of environmentInfo(); track env.key) {
                <div class="env-item">
                  <span class="env-key">{{ env.key }}</span>
                  <span class="env-value">{{ env.value }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-secondary" (click)="testEnvironmentProviders()">
              Test Environment Providers
            </button>
          </div>
        </div>
      </section>

      <!-- Provider Pattern 4: Conditional Providers -->
      <section class="provider-section">
        <h2>Pattern 4: Conditional Provider Creation</h2>
        <div class="provider-demo">
          <h3>Feature Flag Based Provider Selection</h3>
          <pre><code>export function provideCartFeatures() {
  return [
    {
      provide: 'FeatureService',
      useFactory: () => {
        const flags = inject(FEATURE_FLAGS);
        
        if (flags.advancedCart) {
          return new AdvancedCartFeatureService();
        } else {
          return new BasicCartFeatureService();
        }
      }
    }
  ];
}</code></pre>
          
          <div class="conditional-display">
            <h4>Conditional Provider Status:</h4>
            <div class="conditional-grid">
              @for (condition of conditionalProviderInfo(); track condition.feature) {
                <div class="conditional-item" [class.enabled]="condition.enabled">
                  <span class="feature-name">{{ condition.feature }}</span>
                  <span class="provider-type">{{ condition.providerType }}</span>
                  <span class="enabled-status">{{ condition.enabled ? '✅ Enabled' : '❌ Disabled' }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="testConditionalProviders()">
              Test Conditional Providers
            </button>
          </div>
        </div>
      </section>

      <!-- Provider Pattern 5: Runtime Context Creation -->
      <section class="provider-section">
        <h2>Pattern 5: Runtime Injection Context</h2>
        <div class="provider-demo">
          <h3>Creating Custom Injection Contexts</h3>
          <pre><code>// Create custom injection context
const context = createInjectionContext([
  { provide: CART_CONFIG, useValue: customConfig },
  { provide: 'Logger', useClass: CustomLogger }
]);

// Run function in injection context
const result = context(() => {
  const config = inject(CART_CONFIG);
  const logger = inject('Logger');
  return new CustomService(config, logger);
});</code></pre>
          
          <div class="context-display">
            <h4>Runtime Context Examples:</h4>
            <div class="context-grid">
              @for (context of runtimeContextInfo(); track context.name) {
                <div class="context-item">
                  <h5>{{ context.name }}</h5>
                  <p>Providers: {{ context.providers }}</p>
                  <p>Status: {{ context.status }}</p>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="testRuntimeContexts()">
              Test Runtime Contexts
            </button>
            
            @if (runtimeContextResult()) {
              <div class="result-panel">
                <h4>Runtime Context Results:</h4>
                <pre>{{ runtimeContextResult() }}</pre>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Provider Pattern 6: Testing Providers -->
      <section class="provider-section">
        <h2>Pattern 6: Testing Provider Patterns</h2>
        <div class="provider-demo">
          <h3>Mock Providers for Testing</h3>
          <pre><code>export function provideCartTesting() {
  return [
    { provide: 'STORAGE_SERVICE', useClass: MockStorageService },
    { provide: 'CartAnalyticsService', useClass: MockAnalyticsService },
    { provide: CART_CONFIG, useValue: TEST_CONFIG }
  ];
}</code></pre>
          
          <div class="testing-display">
            <h4>Testing Provider Setup:</h4>
            <div class="testing-grid">
              @for (test of testingProviderInfo(); track test.service) {
                <div class="testing-item">
                  <span class="service-name">{{ test.service }}</span>
                  <span class="mock-type">{{ test.mockType }}</span>
                  <span class="test-status">{{ test.status }}</span>
                </div>
              }
            </div>
            
            <button class="btn btn-primary" (click)="testMockProviders()">
              Test Mock Providers
            </button>
          </div>
        </div>
      </section>

      <!-- Provider Hierarchy Visualization -->
      <section class="provider-section">
        <h2>Provider Hierarchy Visualization</h2>
        <div class="hierarchy-demo">
          <h3>Provider Resolution Order</h3>
          <div class="hierarchy-chart">
            <div class="hierarchy-level root">
              <h4>Root Injector</h4>
              <div class="providers">
                @for (provider of providerHierarchy().root; track provider) {
                  <span class="provider-tag root-provider">{{ provider }}</span>
                }
              </div>
            </div>
            
            <div class="hierarchy-level platform">
              <h4>Platform Injector</h4>
              <div class="providers">
                @for (provider of providerHierarchy().platform; track provider) {
                  <span class="provider-tag platform-provider">{{ provider }}</span>
                }
              </div>
            </div>
            
            <div class="hierarchy-level component">
              <h4>Component Injector</h4>
              <div class="providers">
                @for (provider of providerHierarchy().component; track provider) {
                  <span class="provider-tag component-provider">{{ provider }}</span>
                }
              </div>
            </div>
          </div>
          
          <button class="btn btn-secondary" (click)="analyzeProviderHierarchy()">
            Analyze Current Hierarchy
          </button>
        </div>
      </section>

      <!-- Performance Comparison -->
      <section class="provider-section">
        <h2>Provider Performance Comparison</h2>
        <div class="performance-demo">
          <h3>Provider Pattern Performance Metrics</h3>
          <div class="performance-grid">
            @for (metric of performanceMetrics(); track metric.pattern) {
              <div class="performance-item">
                <h4>{{ metric.pattern }}</h4>
                <div class="metric-details">
                  <span class="metric-time">{{ metric.time }}ms</span>
                  <span class="metric-memory">{{ metric.memory }}KB</span>
                  <span class="metric-efficiency" [class]="metric.efficiency">{{ metric.efficiency }}</span>
                </div>
              </div>
            }
          </div>
          
          <button class="btn btn-primary" (click)="measureProviderPerformance()">
            Measure Performance
          </button>
        </div>
      </section>

      <!-- Summary -->
      <section class="summary-section">
        <h2>Provider Function Benefits</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>🏗️ Composition</h3>
            <p>Compose complex provider configurations</p>
          </div>
          <div class="benefit-card">
            <h3>⚙️ Configuration</h3>
            <p>Flexible environment-specific setup</p>
          </div>
          <div class="benefit-card">
            <h3>🧪 Testing</h3>
            <p>Easy mock provider creation</p>
          </div>
          <div class="benefit-card">
            <h3>🔧 Reusability</h3>
            <p>Share provider configurations across apps</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .providers-container {
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
      background: #7c3aed;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
    }
    
    .provider-section {
      margin-bottom: 3rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 2rem;
    }
    
    .provider-demo, .hierarchy-demo, .performance-demo {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 1.5rem;
    }
    
    .status-grid, .factory-grid, .env-grid, .conditional-grid, .testing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .status-item, .factory-item, .env-item, .conditional-item, .testing-item {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 4px;
      border: 1px solid #d1d5db;
    }
    
    .status-item.active, .conditional-item.enabled {
      background: #d1fae5;
      border-color: #10b981;
    }
    
    .provider-status, .factory-display, .environment-display, .conditional-display, .testing-display, .context-display {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 6px;
    }
    
    .context-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .context-item {
      padding: 1rem;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
    }
    
    .hierarchy-chart {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .hierarchy-level {
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
    }
    
    .hierarchy-level.root {
      background: #fef2f2;
      border: 2px solid #ef4444;
    }
    
    .hierarchy-level.platform {
      background: #f0f9ff;
      border: 2px solid #0ea5e9;
    }
    
    .hierarchy-level.component {
      background: #f0fdf4;
      border: 2px solid #10b981;
    }
    
    .providers {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 0.5rem;
    }
    
    .provider-tag {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .root-provider {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .platform-provider {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .component-provider {
      background: #dcfce7;
      color: #16a34a;
    }
    
    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .performance-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem;
      text-align: center;
    }
    
    .metric-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .metric-time {
      color: #059669;
      font-weight: bold;
    }
    
    .metric-memory {
      color: #dc2626;
      font-weight: bold;
    }
    
    .metric-efficiency.excellent {
      color: #10b981;
      font-weight: bold;
    }
    
    .metric-efficiency.good {
      color: #f59e0b;
      font-weight: bold;
    }
    
    .metric-efficiency.poor {
      color: #ef4444;
      font-weight: bold;
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
    
    @media (max-width: 768px) {
      .status-grid, .factory-grid, .env-grid, .conditional-grid, .testing-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProviderFunctionsComponent {
  // Demonstrate provider function usage
  private http = inject(HttpClient);
  private config = inject(CART_CONFIG, { optional: true }) ?? DEFAULT_CART_CONFIG;
  
  // Component state
  basicProviderResult = signal<string | null>(null);
  runtimeContextResult = signal<string | null>(null);
  
  // Provider information
  basicProviderInfo = computed(() => [
    { name: 'InjectCartService', status: 'Available', active: true },
    { name: 'CART_CONFIG', status: 'Configured', active: true },
    { name: 'CartAnalyticsService', status: 'Factory Created', active: true },
    { name: 'STORAGE_SERVICE', status: 'Platform Specific', active: true }
  ]);
  
  factoryProviderInfo = computed(() => [
    {
      name: 'CartAnalyticsService',
      dependencies: 'CART_CONFIG, HttpClient',
      result: 'Factory instance created'
    },
    {
      name: 'StorageService',
      dependencies: 'PLATFORM_ID',
      result: 'Platform-specific service'
    },
    {
      name: 'EnvironmentService',
      dependencies: 'FEATURE_FLAGS',
      result: 'Environment-configured service'
    }
  ]);
  
  environmentInfo = computed(() => [
    { key: 'Platform', value: 'Browser' },
    { key: 'Environment', value: 'Development' },
    { key: 'Features Enabled', value: '3 of 5' },
    { key: 'Provider Count', value: '8' }
  ]);
  
  conditionalProviderInfo = computed(() => [
    { feature: 'Advanced Cart', providerType: 'AdvancedCartService', enabled: true },
    { feature: 'Recommendations', providerType: 'RecommendationService', enabled: true },
    { feature: 'Promotions', providerType: 'PromotionService', enabled: false },
    { feature: 'Social Sharing', providerType: 'SocialService', enabled: false }
  ]);
  
  runtimeContextInfo = computed(() => [
    {
      name: 'Testing Context',
      providers: 'MockServices, TestConfig',
      status: 'Ready'
    },
    {
      name: 'Custom Feature Context',
      providers: 'FeatureServices, CustomConfig',
      status: 'Active'
    },
    {
      name: 'Development Context',
      providers: 'DevServices, DebugConfig',
      status: 'Available'
    }
  ]);
  
  testingProviderInfo = computed(() => [
    { service: 'StorageService', mockType: 'MockStorageService', status: 'Active' },
    { service: 'AnalyticsService', mockType: 'MockAnalyticsService', status: 'Active' },
    { service: 'ConfigService', mockType: 'TestConfigService', status: 'Active' },
    { service: 'Logger', mockType: 'MockLogger', status: 'Active' }
  ]);
  
  providerHierarchy = computed(() => ({
    root: ['HttpClient', 'PLATFORM_ID', 'APP_CONFIG'],
    platform: ['CART_CONFIG', 'FEATURE_FLAGS', 'ANALYTICS_CONFIG'],
    component: ['InjectCartService', 'CustomServices', 'LocalProviders']
  }));
  
  performanceMetrics = computed(() => [
    { pattern: 'Basic Provider', time: 0.2, memory: 12, efficiency: 'excellent' },
    { pattern: 'Factory Provider', time: 0.8, memory: 28, efficiency: 'good' },
    { pattern: 'Multi Provider', time: 1.2, memory: 45, efficiency: 'good' },
    { pattern: 'Environment Provider', time: 2.1, memory: 67, efficiency: 'poor' }
  ]);
  
  // Interactive methods
  testBasicProviders() {
    const providers = provideInjectCart({ maxItems: 50, enableAnalytics: true });
    const result = {
      providersCount: providers.length,
      configOverride: 'maxItems: 50, enableAnalytics: true',
      factoryServices: providers.filter(p => typeof p === 'object' && 'useFactory' in p).length,
      timestamp: new Date().toISOString()
    };
    
    this.basicProviderResult.set(JSON.stringify(result, null, 2));
  }
  
  testFactoryProviders() {
    console.log('Testing factory providers with inject() patterns');
    
    // Simulate factory provider creation
    const mockFactory = () => {
      console.log('Factory function called with inject() dependencies');
      return { created: true, dependencies: ['CART_CONFIG', 'HttpClient'] };
    };
    
    const result = mockFactory();
    console.log('Factory result:', result);
  }
  
  testEnvironmentProviders() {
    console.log('Testing environment-specific providers');
    
    const envProviders = provideCartEnvironment();
    console.log('Environment providers created:', envProviders);
  }
  
  testConditionalProviders() {
    console.log('Testing conditional provider creation');
    
    const conditionalProviders = provideCartFeatures();
    console.log('Conditional providers:', conditionalProviders);
  }
  
  testRuntimeContexts() {
    console.log('Testing runtime injection contexts');
    
    try {
      // Create a test injection context
      const testContext = createInjectionContext([
        { provide: CART_CONFIG, useValue: { maxItems: 20, taxRate: 0.05 } },
        { provide: 'TestService', useValue: { test: true } }
      ]);
      
      // Use the context
      const result = testContext(() => {
        return {
          config: 'injected successfully',
          timestamp: new Date().toISOString(),
          contextType: 'runtime'
        };
      });
      
      this.runtimeContextResult.set(JSON.stringify(result, null, 2));
    } catch (error) {
      this.runtimeContextResult.set(`Error: ${error}`);
    }
  }
  
  testMockProviders() {
    console.log('Testing mock provider setup');
    
    const mockProviders = provideCartTesting();
    console.log('Mock providers created:', mockProviders);
  }
  
  analyzeProviderHierarchy() {
    console.log('Analyzing current provider hierarchy');
    
    const hierarchy = this.providerHierarchy();
    console.log('Provider hierarchy:', hierarchy);
  }
  
  measureProviderPerformance() {
    console.log('Measuring provider performance');
    
    const metrics = this.performanceMetrics();
    console.log('Performance metrics:', metrics);
    
    // Simulate performance measurement
    metrics.forEach(metric => {
      console.log(`${metric.pattern}: ${metric.time}ms, ${metric.memory}KB, ${metric.efficiency}`);
    });
  }
}