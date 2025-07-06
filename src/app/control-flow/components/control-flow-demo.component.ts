import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DemoItem {
  id: string;
  name: string;
  type: 'feature' | 'bug' | 'improvement';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

@Component({
  selector: 'control-flow-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <h1>Control Flow Demo - &#64;if, &#64;for, &#64;switch Examples</h1>
      
      <!-- Example 1: @if with else -->
      <section class="demo-section">
        <h2>&#64;if Examples</h2>
        
        <!-- TODO: Convert to @if syntax -->
        <div class="example">
          <h3>Current (old syntax):</h3>
          <div *ngIf="userLoggedIn(); else loginPrompt">
            Welcome back, {{ username() }}!
          </div>
          <ng-template #loginPrompt>
            <button (click)="login()">Please log in</button>
          </ng-template>
        </div>
        
        <div class="example">
          <h3>TODO: Convert to new &#64;if syntax:</h3>
          <pre><code>&#64;if (userLoggedIn()) {{ '{' }}
  &lt;div&gt;Welcome back, {{ '{{' }} username() {{ '}}' }}!&lt;/div&gt;
{{ '}' }} &#64;else {{ '{' }}
  &lt;button (click)="login()"&gt;Please log in&lt;/button&gt;
{{ '}' }}</code></pre>
        </div>
        
        <div class="controls">
          <button (click)="toggleLogin()">
            {{ userLoggedIn() ? 'Logout' : 'Login' }}
          </button>
        </div>
      </section>

      <!-- Example 2: @for with tracking -->
      <section class="demo-section">
        <h2>&#64;for Examples</h2>
        
        <div class="example">
          <h3>Current (old syntax):</h3>
          <div *ngFor="let item of demoItems(); trackBy: trackByItemId; let i = index" 
               class="item">
            <span>{{ i + 1 }}. {{ item.name }}</span>
            <span [class]="'status-' + item.type">{{ item.type }}</span>
          </div>
        </div>
        
        <div class="example">
          <h3>TODO: Convert to &#64;for syntax:</h3>
          <pre><code>&#64;for (item of demoItems(); track item.id; let i = $index) {{ '{' }}
  &lt;div class="item"&gt;
    &lt;span&gt;{{ '{{' }} i + 1 {{ '}}' }}. {{ '{{' }} item.name {{ '}}' }}&lt;/span&gt;
    &lt;span [class]="'status-' + item.type"&gt;{{ '{{' }} item.type {{ '}}' }}&lt;/span&gt;
  &lt;/div&gt;
{{ '}' }} &#64;empty {{ '{' }}
  &lt;div&gt;No items to display&lt;/div&gt;
{{ '}' }}</code></pre>
        </div>
        
        <div class="controls">
          <button (click)="addDemoItem()">Add Item</button>
          <button (click)="clearItems()">Clear All</button>
        </div>
      </section>

      <!-- Example 3: @switch -->
      <section class="demo-section">
        <h2>&#64;switch Examples</h2>
        
        <div class="example">
          <h3>Current (old syntax):</h3>
          <div [ngSwitch]="selectedViewMode()">
            <div *ngSwitchCase="'list'">
              <h4>List View</h4>
              <ul>
                <li *ngFor="let item of demoItems()">{{ item.name }}</li>
              </ul>
            </div>
            
            <div *ngSwitchCase="'grid'">
              <h4>Grid View</h4>
              <div class="grid">
                <div *ngFor="let item of demoItems()" class="grid-item">
                  {{ item.name }}
                </div>
              </div>
            </div>
            
            <div *ngSwitchCase="'table'">
              <h4>Table View</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of demoItems()">
                    <td>{{ item.name }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.priority }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div *ngSwitchDefault>
              <h4>Unknown view mode</h4>
            </div>
          </div>
        </div>
        
        <div class="example">
          <h3>TODO: Convert to &#64;switch syntax:</h3>
          <pre><code>&#64;switch (selectedViewMode()) {{ '{' }}
  &#64;case ('list') {{ '{' }}
    &lt;h4&gt;List View&lt;/h4&gt;
    &#64;for (item of demoItems(); track item.id) {{ '{' }}
      &lt;li&gt;{{ '{{' }} item.name {{ '}}' }}&lt;/li&gt;
    {{ '}' }}
  {{ '}' }}
  &#64;case ('grid') {{ '{' }}
    &lt;h4&gt;Grid View&lt;/h4&gt;
    &#64;for (item of demoItems(); track item.id) {{ '{' }}
      &lt;div class="grid-item"&gt;{{ '{{' }} item.name {{ '}}' }}&lt;/div&gt;
    {{ '}' }}
  {{ '}' }}
  &#64;default {{ '{' }}
    &lt;h4&gt;Unknown view mode&lt;/h4&gt;
  {{ '}' }}
{{ '}' }}</code></pre>
        </div>
        
        <div class="controls">
          <button 
            *ngFor="let mode of viewModes()" 
            [class.active]="selectedViewMode() === mode"
            (click)="setViewMode(mode)">
            {{ mode | titlecase }}
          </button>
        </div>
      </section>

      <!-- Example 4: @defer placeholder -->
      <section class="demo-section">
        <h2>&#64;defer Examples (Coming Soon)</h2>
        
        <div class="example">
          <h3>TODO: Implement &#64;defer patterns:</h3>
          <pre><code>&#64;defer (on viewport) {{ '{' }}
  &lt;heavy-component /&gt;
{{ '}' }} &#64;loading {{ '{' }}
  &lt;div&gt;Loading...&lt;/div&gt;
{{ '}' }} &#64;error {{ '{' }}
  &lt;div&gt;Failed to load&lt;/div&gt;
{{ '}' }} &#64;placeholder {{ '{' }}
  &lt;div&gt;Content will load when in view&lt;/div&gt;
{{ '}' }}</code></pre>
        </div>
        
        <div class="defer-demo">
          <p>Heavy component simulation will load here with &#64;defer</p>
          <button (click)="triggerHeavyLoad()">Simulate Heavy Load</button>
        </div>
      </section>

      <!-- Performance comparison -->
      <section class="demo-section">
        <h2>Performance Comparison</h2>
        
        <div class="performance-stats">
          <h3>Template Performance Metrics</h3>
          <div class="metrics">
            <div class="metric">
              <label>Render Count:</label>
              <span>{{ renderCount() }}</span>
            </div>
            <div class="metric">
              <label>Items Count:</label>
              <span>{{ demoItems().length }}</span>
            </div>
            <div class="metric">
              <label>Last Render Time:</label>
              <span>{{ lastRenderTime() }}ms</span>
            </div>
          </div>
          
          <button (click)="measurePerformance()">Measure Performance</button>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./control-flow-demo.component.css']
})
export class ControlFlowDemoComponent {
  // Demo state
  userLoggedIn = signal(false);
  username = signal('Developer');
  selectedViewMode = signal<'list' | 'grid' | 'table'>('list');
  demoItems = signal<DemoItem[]>([
    { id: '1', name: 'Implement &#64;if syntax', type: 'feature', priority: 'high', completed: false },
    { id: '2', name: 'Convert &#64;for loops', type: 'improvement', priority: 'medium', completed: false },
    { id: '3', name: 'Fix &#64;switch cases', type: 'bug', priority: 'low', completed: false }
  ]);
  
  // Performance tracking
  renderCount = signal(0);
  lastRenderTime = signal(0);
  
  // Available view modes
  viewModes = signal<Array<'list' | 'grid' | 'table'>>(['list', 'grid', 'table']);
  
  // Computed values
  completedItems = computed(() => 
    this.demoItems().filter(item => item.completed)
  );
  
  incompleteItems = computed(() => 
    this.demoItems().filter(item => !item.completed)
  );

  constructor() {
    this.updateRenderMetrics();
  }

  // Event handlers
  toggleLogin() {
    this.userLoggedIn.update(logged => !logged);
    this.updateRenderMetrics();
  }
  
  login() {
    this.userLoggedIn.set(true);
    this.updateRenderMetrics();
  }

  setViewMode(mode: 'list' | 'grid' | 'table') {
    this.selectedViewMode.set(mode);
    this.updateRenderMetrics();
  }

  addDemoItem() {
    const newItem: DemoItem = {
      id: Date.now().toString(),
      name: `Demo Item ${this.demoItems().length + 1}`,
      type: ['feature', 'bug', 'improvement'][Math.floor(Math.random() * 3)] as any,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      completed: false
    };
    
    this.demoItems.update(items => [...items, newItem]);
    this.updateRenderMetrics();
  }

  clearItems() {
    this.demoItems.set([]);
    this.updateRenderMetrics();
  }

  triggerHeavyLoad() {
    console.log('Heavy load triggered - &#64;defer would handle this efficiently');
    this.updateRenderMetrics();
  }

  measurePerformance() {
    const start = performance.now();
    
    // Simulate heavy operations
    for (let i = 0; i < 1000; i++) {
      this.demoItems();
      this.completedItems();
    }
    
    const end = performance.now();
    this.lastRenderTime.set(Math.round(end - start));
    this.updateRenderMetrics();
  }

  // Track by function for old ngFor
  trackByItemId(index: number, item: DemoItem): string {
    return item.id;
  }

  private updateRenderMetrics() {
    this.renderCount.update(count => count + 1);
  }
}