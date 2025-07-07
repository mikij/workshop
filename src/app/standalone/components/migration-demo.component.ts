import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MigrationStep {
  title: string;
  description: string;
  before: string;
  after: string;
  benefits: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

@Component({
  selector: 'migration-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="migration-container">
      <header class="migration-header">
        <h1>NgModule to Standalone Migration</h1>
        <p>Step-by-step guide to migrate from NgModules to standalone components</p>

        <nav class="back-nav">
          <a routerLink="/standalone" class="back-btn">← Back to Standalone Cart</a>
        </nav>
      </header>

      <div class="migration-overview">
        <h2>Migration Strategy</h2>
        <div class="strategy-grid">
          <div class="strategy-card">
            <h3>🍃 Bottom-Up Approach</h3>
            <p>Start with leaf components (no dependencies) and work your way up</p>
          </div>
          <div class="strategy-card">
            <h3>🔄 Incremental Migration</h3>
            <p>Migrate one component at a time while maintaining functionality</p>
          </div>
          <div class="strategy-card">
            <h3>🧪 Test at Each Step</h3>
            <p>Ensure each conversion works before proceeding to the next</p>
          </div>
          <div class="strategy-card">
            <h3>🚀 Progressive Enhancement</h3>
            <p>Add modern patterns (inject(), new control flow) during migration</p>
          </div>
        </div>
      </div>

      <div class="migration-steps">
        <h2>Migration Steps</h2>

        <!-- TODO: Convert to @for -->
        <div *ngFor="let step of migrationSteps(); let i = index" class="step-card">
          <div class="step-header">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-info">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-status" [class]="'status-' + step.status">
              {{ step.status | titlecase }}
            </div>
          </div>

          <div class="step-content">
            <div class="code-comparison">
              <div class="code-before">
                <h4>Before (NgModule)</h4>
                <pre><code>{{ step.before }}</code></pre>
              </div>

              <div class="migration-arrow">→</div>

              <div class="code-after">
                <h4>After (Standalone)</h4>
                <pre><code>{{ step.after }}</code></pre>
              </div>
            </div>

            <!-- TODO: Convert to @if -->
            <div *ngIf="step.benefits.length > 0" class="step-benefits">
              <h4>Benefits:</h4>
              <ul>
                <!-- TODO: Convert to @for -->
                <li *ngFor="let benefit of step.benefits">{{ benefit }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="migration-tools">
        <h2>Migration Tools & Automation</h2>

        <div class="tools-grid">
          <div class="tool-card">
            <h3>🛠 Angular CLI Schematics</h3>
            <p>Automated migration tools (coming in future Angular versions)</p>
            <pre><code>ng generate &#64;angular/core:standalone</code></pre>
          </div>

          <div class="tool-card">
            <h3>📊 Dependency Analyzer</h3>
            <p>Analyze component dependencies before migration</p>
            <button (click)="analyzeDependencies()" class="analyze-btn">
              Analyze Dependencies
            </button>
          </div>

          <div class="tool-card">
            <h3>✅ Migration Validator</h3>
            <p>Validate migration results and catch issues</p>
            <button (click)="validateMigration()" class="validate-btn">
              Validate Migration
            </button>
          </div>

          <div class="tool-card">
            <h3>📈 Performance Metrics</h3>
            <p>Compare before/after performance metrics</p>
            <button (click)="showMetrics()" class="metrics-btn">
              Show Metrics
            </button>
          </div>
        </div>
      </div>

      <!-- TODO: Convert to @if -->
      <div *ngIf="showAnalysis()" class="analysis-results">
        <h2>Dependency Analysis Results</h2>
        <div class="analysis-content">
          <div class="analysis-item">
            <h3>Components Ready for Migration</h3>
            <ul>
              <li>SimpleButtonComponent (no dependencies)</li>
              <li>IconComponent (no dependencies)</li>
              <li>LoadingSpinnerComponent (CommonModule only)</li>
            </ul>
          </div>

          <div class="analysis-item">
            <h3>Components Requiring Preparation</h3>
            <ul>
              <li>ComplexFormComponent (depends on SimpleButtonComponent)</li>
              <li>DataTableComponent (depends on multiple shared components)</li>
            </ul>
          </div>

          <div class="analysis-item">
            <h3>Potential Issues</h3>
            <ul>
              <li>Circular dependencies between FeatureAComponent and FeatureBComponent</li>
              <li>Shared services need provider configuration review</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="migration-checklist">
        <h2>Migration Checklist</h2>

        <div class="checklist-section">
          <h3>Pre-Migration</h3>
          <div class="checklist-items">
            <!-- TODO: Convert to @for -->
            <label *ngFor="let item of preMigrationChecklist()" class="checklist-item">
              <input type="checkbox" [checked]="item.completed" (change)="toggleChecklistItem('pre', item.id)">
              <span>{{ item.text }}</span>
            </label>
          </div>
        </div>

        <div class="checklist-section">
          <h3>During Migration</h3>
          <div class="checklist-items">
            <!-- TODO: Convert to @for -->
            <label *ngFor="let item of duringMigrationChecklist()" class="checklist-item">
              <input type="checkbox" [checked]="item.completed" (change)="toggleChecklistItem('during', item.id)">
              <span>{{ item.text }}</span>
            </label>
          </div>
        </div>

        <div class="checklist-section">
          <h3>Post-Migration</h3>
          <div class="checklist-items">
            <!-- TODO: Convert to @for -->
            <label *ngFor="let item of postMigrationChecklist()" class="checklist-item">
              <input type="checkbox" [checked]="item.completed" (change)="toggleChecklistItem('post', item.id)">
              <span>{{ item.text }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="best-practices">
        <h2>Best Practices & Tips</h2>

        <div class="practices-grid">
          <div class="practice-card">
            <h3>🎯 Start Small</h3>
            <p>Begin with simple, leaf components that have minimal dependencies</p>
          </div>

          <div class="practice-card">
            <h3>🔍 Document Dependencies</h3>
            <p>Create a dependency map before starting migration</p>
          </div>

          <div class="practice-card">
            <h3>🧪 Test Thoroughly</h3>
            <p>Run full test suite after each component conversion</p>
          </div>

          <div class="practice-card">
            <h3>📦 Bundle Analysis</h3>
            <p>Monitor bundle size changes throughout migration</p>
          </div>

          <div class="practice-card">
            <h3>🚀 Modern Patterns</h3>
            <p>Use migration as opportunity to adopt inject() and new control flow</p>
          </div>

          <div class="practice-card">
            <h3>👥 Team Coordination</h3>
            <p>Coordinate with team to avoid merge conflicts</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./migration-demo.component.css']
})
export class MigrationDemoComponent {
  showAnalysis = signal(false);

  migrationSteps = signal<MigrationStep[]>([
    {
      title: 'Convert Leaf Components',
      description: 'Start with components that have no dependencies on other components',
      before: `@Component({
  selector: 'simple-button',
  template: '<button><ng-content></ng-content></button>'
})
export class SimpleButtonComponent {}

@NgModule({
  declarations: [SimpleButtonComponent],
  imports: [CommonModule],
  exports: [SimpleButtonComponent]
})
export class SharedModule {}`,
      after: `@Component({
  selector: 'simple-button',
  standalone: true,
  imports: [CommonModule],
  template: '<button><ng-content></ng-content></button>'
})
export class SimpleButtonComponent {}`,
      benefits: [
        'No NgModule boilerplate needed',
        'Direct imports are clearer',
        'Better tree-shaking potential'
      ],
      status: 'completed'
    },
    {
      title: 'Update Parent Components',
      description: 'Convert components that depend on newly standalone components',
      before: `@Component({
  selector: 'complex-form',
  template: \`
    <form>
      <input type="text">
      <simple-button>Submit</simple-button>
    </form>
  \`
})
export class ComplexFormComponent {}`,
      after: `@Component({
  selector: 'complex-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SimpleButtonComponent  // Direct import
  ],
  template: \`
    <form>
      <input type="text">
      <simple-button>Submit</simple-button>
    </form>
  \`
})
export class ComplexFormComponent {}`,
      benefits: [
        'Explicit dependencies',
        'Better IDE support',
        'Easier testing setup'
      ],
      status: 'in-progress'
    },
    {
      title: 'Update Routes',
      description: 'Convert from module-based to component-based lazy loading',
      before: `const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module')
      .then(m => m.FeatureModule)
  }
];`,
      after: `const routes: Routes = [
  {
    path: 'feature',
    loadComponent: () => import('./feature/feature.component')
      .then(m => m.FeatureComponent)
  }
];`,
      benefits: [
        'Smaller initial bundles',
        'More granular lazy loading',
        'Simpler route configuration'
      ],
      status: 'pending'
    },
    {
      title: 'Remove NgModules',
      description: 'Clean up unused NgModules and update application bootstrap',
      before: `@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FeatureModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule);`,
      after: `bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Custom providers
  ]
});`,
      benefits: [
        'Simpler application setup',
        'Better provider organization',
        'Modern Angular architecture'
      ],
      status: 'pending'
    }
  ]);

  preMigrationChecklist = signal([
    { id: 'inventory', text: 'Create component inventory and dependency map', completed: false },
    { id: 'tests', text: 'Ensure all components have unit tests', completed: false },
    { id: 'documentation', text: 'Document current module structure', completed: false },
    { id: 'backup', text: 'Create backup branch', completed: false }
  ]);

  duringMigrationChecklist = signal([
    { id: 'leaf-first', text: 'Start with leaf components (no dependencies)', completed: false },
    { id: 'test-each', text: 'Test each component after conversion', completed: false },
    { id: 'update-imports', text: 'Update imports in parent components', completed: false },
    { id: 'clean-modules', text: 'Remove converted components from NgModule declarations', completed: false }
  ]);

  postMigrationChecklist = signal([
    { id: 'full-tests', text: 'Run complete test suite', completed: false },
    { id: 'bundle-analysis', text: 'Analyze bundle size changes', completed: false },
    { id: 'performance', text: 'Measure performance improvements', completed: false },
    { id: 'cleanup', text: 'Remove unused NgModules', completed: false }
  ]);

  analyzeDependencies() {
    this.showAnalysis.set(true);
    console.log('Analyzing component dependencies...');
  }

  validateMigration() {
    console.log('Validating migration results...');
    // Simulate validation
    setTimeout(() => {
      alert('Migration validation completed successfully!');
    }, 1000);
  }

  showMetrics() {
    console.log('Generating performance metrics...');
    // Simulate metrics generation
    const metrics = {
      bundleSize: { before: '2.1MB', after: '1.8MB', improvement: '14%' },
      loadTime: { before: '3.2s', after: '2.7s', improvement: '16%' },
      memoryUsage: { before: '45MB', after: '38MB', improvement: '16%' }
    };

    alert(`Performance Improvements:
Bundle Size: ${metrics.bundleSize.before} → ${metrics.bundleSize.after} (${metrics.bundleSize.improvement} improvement)
Load Time: ${metrics.loadTime.before} → ${metrics.loadTime.after} (${metrics.loadTime.improvement} improvement)
Memory Usage: ${metrics.memoryUsage.before} → ${metrics.memoryUsage.after} (${metrics.memoryUsage.improvement} improvement)`);
  }

  toggleChecklistItem(section: 'pre' | 'during' | 'post', itemId: string) {
    const checklistMap = {
      'pre': this.preMigrationChecklist,
      'during': this.duringMigrationChecklist,
      'post': this.postMigrationChecklist
    };

    const checklist = checklistMap[section];
    checklist.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  }
}
