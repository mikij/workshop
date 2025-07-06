import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface RenderingStats {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
}

@Component({
  selector: 'performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="performance-container">
      <header class="performance-header">
        <h1>Performance Monitor</h1>
        <p>Real-time template performance tracking for &#64;defer optimization</p>
      </header>

      <div class="monitor-grid">
        <!-- Real-time Metrics -->
        <section class="metrics-section">
          <h2>Real-time Metrics</h2>
          
          <!-- TODO: This section will show @defer benefits -->
          @if (performanceMetrics().length > 0) {
            <div class="metrics-grid">
              @for (metric of performanceMetrics(); track metric.name) {
                <div class="metric-card" [class]="'status-' + metric.status">
                  <h3>{{ metric.name }}</h3>
                  <div class="metric-value">
                    <span class="value">{{ metric.value }}</span>
                    <span class="unit">{{ metric.unit }}</span>
                  </div>
                  <p class="metric-description">{{ metric.description }}</p>
                  
                  @switch (metric.status) {
                    @case ('good') {
                      <div class="status-indicator good">✓ Good</div>
                    }
                    @case ('warning') {
                      <div class="status-indicator warning">⚠ Warning</div>  
                    }
                    @case ('critical') {
                      <div class="status-indicator critical">⚠ Critical</div>
                    }
                  }
                </div>
              }
            </div>
          } @else {
            <div class="no-metrics">
              <p>No performance data available</p>
              <button (click)="startMonitoring()">Start Monitoring</button>
            </div>
          }
        </section>

        <!-- Rendering Statistics -->
        <section class="rendering-section">
          <h2>Rendering Statistics</h2>
          
          <div class="rendering-stats">
            <div class="stat-item">
              <label>Total Renders:</label>
              <span>{{ renderingStats().renderCount }}</span>
            </div>
            
            <div class="stat-item">
              <label>Average Render Time:</label>
              <span>{{ renderingStats().averageRenderTime | number:'1.2-2' }}ms</span>
            </div>
            
            <div class="stat-item">
              <label>Last Render:</label>
              <span>{{ renderingStats().lastRenderTime | number:'1.2-2' }}ms</span>
            </div>
            
            <div class="stat-item">
              <label>Total Time:</label>
              <span>{{ renderingStats().totalRenderTime | number:'1.2-2' }}ms</span>
            </div>
          </div>
        </section>

        <!-- @defer Simulation -->
        <section class="defer-section">
          <h2>&#64;defer Performance Simulation</h2>
          
          <div class="defer-controls">
            <button (click)="simulateHeavyComponent()" [disabled]="isSimulating()">
              {{ isSimulating() ? 'Simulating...' : 'Simulate Heavy Component' }}
            </button>
            
            <button (click)="simulateDeferredLoad()">
              Simulate &#64;defer Load
            </button>
            
            <button (click)="clearSimulation()">
              Clear Results
            </button>
          </div>

          @if (simulationResults().length > 0) {
            <div class="simulation-results">
              <h3>Simulation Results</h3>
              
              @for (result of simulationResults(); track result.timestamp) {
                <div class="simulation-item">
                  <div class="simulation-header">
                    <strong>{{ result.type }}</strong>
                    <span class="timestamp">{{ result.timestamp | date:'HH:mm:ss' }}</span>
                  </div>
                  
                  <div class="simulation-metrics">
                    <span>Load Time: {{ result.loadTime }}ms</span>
                    <span>Memory: {{ result.memoryUsage }}MB</span>
                    <span class="status" [class]="result.deferred ? 'deferred' : 'immediate'">
                      {{ result.deferred ? 'Deferred' : 'Immediate' }}
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <!-- Performance Tips -->
        <section class="tips-section">
          <h2>&#64;defer Optimization Tips</h2>
          
          <div class="tips-grid">
            <div class="tip-card">
              <h3>Viewport Trigger</h3>
              <p>Use &#64;defer (on viewport) for content below the fold</p>
              <pre><code>&#64;defer (on viewport) {{ '{' }}
  &lt;heavy-component /&gt;
{{ '}' }}</code></pre>
            </div>
            
            <div class="tip-card">
              <h3>Interaction Trigger</h3>
              <p>Use &#64;defer (on interaction) for user-activated content</p>
              <pre><code>&#64;defer (on interaction) {{ '{' }}
  &lt;modal-content /&gt;
{{ '}' }}</code></pre>
            </div>
            
            <div class="tip-card">
              <h3>Timer Trigger</h3>
              <p>Use &#64;defer (on timer) for delayed non-critical content</p>
              <pre><code>&#64;defer (on timer(2s)) {{ '{' }}
  &lt;analytics-widget /&gt;
{{ '}' }}</code></pre>
            </div>
            
            <div class="tip-card">
              <h3>Idle Trigger</h3>
              <p>Use &#64;defer (on idle) for background tasks</p>
              <pre><code>&#64;defer (on idle) {{ '{' }}
  &lt;background-sync /&gt;
{{ '}' }}</code></pre>
            </div>
          </div>
        </section>
      </div>

      <!-- Performance Chart placeholder -->
      <section class="chart-section">
        <h2>Performance Trends</h2>
        
        <!-- TODO: This could be deferred with @defer (on viewport) -->
        <div class="chart-placeholder">
          <p>📊 Performance chart would be rendered here</p>
          <p>This component could be deferred until user scrolls to view</p>
          
          <div class="mock-chart">
            @for (dataPoint of mockChartData(); track dataPoint.time) {
              <div class="chart-bar" [style.height.%]="dataPoint.value">
                <span class="bar-value">{{ dataPoint.value }}ms</span>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./performance-monitor.component.css']
})
export class PerformanceMonitorComponent {
  // Performance tracking state
  private startTime = performance.now();
  private renderTimes: number[] = [];
  
  // Signals for reactive state
  performanceMetrics = signal<PerformanceMetric[]>([]);
  isMonitoring = signal(false);
  isSimulating = signal(false);
  simulationResults = signal<Array<{
    type: string;
    loadTime: number;
    memoryUsage: number;
    deferred: boolean;
    timestamp: Date;
  }>>([]);
  
  // Computed rendering statistics
  renderingStats = computed<RenderingStats>(() => {
    const times = this.renderTimes;
    const count = times.length;
    const total = times.reduce((sum, time) => sum + time, 0);
    const average = count > 0 ? total / count : 0;
    const last = count > 0 ? times[times.length - 1] : 0;
    
    return {
      renderCount: count,
      averageRenderTime: average,
      lastRenderTime: last,
      totalRenderTime: total
    };
  });
  
  // Mock chart data
  mockChartData = signal([
    { time: Date.now() - 5000, value: 45 },
    { time: Date.now() - 4000, value: 32 },
    { time: Date.now() - 3000, value: 28 },
    { time: Date.now() - 2000, value: 15 },
    { time: Date.now() - 1000, value: 12 },
    { time: Date.now(), value: 8 }
  ]);

  constructor() {
    this.setupPerformanceTracking();
    this.updateMetrics();
  }

  startMonitoring() {
    this.isMonitoring.set(true);
    this.startPerformanceCollection();
  }

  simulateHeavyComponent() {
    this.isSimulating.set(true);
    const startTime = performance.now();
    
    // Simulate heavy computation
    setTimeout(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.simulationResults.update(results => [...results, {
        type: 'Heavy Component (Immediate)',
        loadTime: Math.round(loadTime),
        memoryUsage: Math.round(Math.random() * 50 + 10),
        deferred: false,
        timestamp: new Date()
      }]);
      
      this.isSimulating.set(false);
    }, Math.random() * 500 + 200); // Random delay 200-700ms
  }

  simulateDeferredLoad() {
    const startTime = performance.now();
    
    // Simulate deferred loading (much faster)
    setTimeout(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.simulationResults.update(results => [...results, {
        type: 'Heavy Component (@defer)',
        loadTime: Math.round(loadTime),
        memoryUsage: Math.round(Math.random() * 20 + 5),
        deferred: true,
        timestamp: new Date()
      }]);
    }, Math.random() * 100 + 50); // Faster load 50-150ms
  }

  clearSimulation() {
    this.simulationResults.set([]);
  }

  private setupPerformanceTracking() {
    // Track render times
    effect(() => {
      const start = performance.now();
      
      // Simulate render work
      this.performanceMetrics();
      this.renderingStats();
      
      const end = performance.now();
      const renderTime = end - start;
      
      this.renderTimes.push(renderTime);
      
      // Keep only last 50 measurements
      if (this.renderTimes.length > 50) {
        this.renderTimes = this.renderTimes.slice(-50);
      }
    });
  }

  private startPerformanceCollection() {
    this.updateMetrics();
    
    // Update metrics every 2 seconds
    setInterval(() => {
      if (this.isMonitoring()) {
        this.updateMetrics();
        this.updateChartData();
      }
    }, 2000);
  }

  private updateMetrics() {
    const now = performance.now();
    const memoryUsage = this.estimateMemoryUsage();
    const renderingPerf = this.renderingStats();
    
    const metrics: PerformanceMetric[] = [
      {
        name: 'Render Time',
        value: Math.round(renderingPerf.lastRenderTime),
        unit: 'ms',
        status: renderingPerf.lastRenderTime < 16 ? 'good' : 
                renderingPerf.lastRenderTime < 33 ? 'warning' : 'critical',
        description: 'Time to render template changes'
      },
      {
        name: 'Memory Usage',
        value: Math.round(memoryUsage),
        unit: 'MB',
        status: memoryUsage < 50 ? 'good' : 
                memoryUsage < 100 ? 'warning' : 'critical',
        description: 'Estimated component memory usage'
      },
      {
        name: 'FPS Equivalent',
        value: Math.round(1000 / Math.max(renderingPerf.averageRenderTime, 1)),
        unit: 'fps',
        status: renderingPerf.averageRenderTime < 16 ? 'good' : 
                renderingPerf.averageRenderTime < 33 ? 'warning' : 'critical',
        description: 'Theoretical frames per second'
      },
      {
        name: 'Bundle Impact',
        value: Math.round((now - this.startTime) / 100),
        unit: 'KB',
        status: 'good',
        description: 'Estimated bundle size impact'
      }
    ];
    
    this.performanceMetrics.set(metrics);
  }

  private updateChartData() {
    const newDataPoint = {
      time: Date.now(),
      value: Math.round(this.renderingStats().lastRenderTime * 100) / 100
    };
    
    this.mockChartData.update(data => [
      ...data.slice(-5), // Keep last 5 points
      newDataPoint
    ]);
  }

  private estimateMemoryUsage(): number {
    // Rough estimation based on component complexity
    const baseUsage = 10;
    const metricsUsage = this.performanceMetrics().length * 2;
    const simulationUsage = this.simulationResults().length * 1;
    
    return baseUsage + metricsUsage + simulationUsage + Math.random() * 10;
  }
}