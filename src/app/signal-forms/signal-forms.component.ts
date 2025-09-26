import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './components/product-form.component';
import { CheckoutFormComponent } from './components/checkout-form.component';
import { UserProfileFormComponent } from './components/user-profile-form.component';
import { ReviewFormComponent } from './components/review-form.component';

@Component({
  selector: 'app-signal-forms',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    CheckoutFormComponent,
    UserProfileFormComponent,
    ReviewFormComponent
  ],
  template: `
    <div class="signal-forms-workshop">
      <header class="workshop-header">
        <h1>🔥 Signal Forms Workshop</h1>
        <p class="lead">Master Angular Signal Forms with practical shopping cart scenarios</p>
        <div class="badge-container">
          <span class="badge experimental">EXPERIMENTAL</span>
          <span class="badge angular">ANGULAR 21+</span>
        </div>
      </header>

      <nav class="forms-nav">
        <button 
          *ngFor="let tab of tabs" 
          [class.active]="activeTab() === tab.id"
          (click)="setActiveTab(tab.id)"
          class="nav-button">
          <span class="badge" [class]="tab.badgeClass">{{ tab.badge }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <main class="workshop-content">
        @switch (activeTab()) {
          @case ('product') { 
            <app-product-form></app-product-form>
          }
          @case ('checkout') { 
            <app-checkout-form></app-checkout-form>
          }
          @case ('profile') { 
            <app-user-profile-form></app-user-profile-form>
          }
          @case ('custom') { 
            <app-review-form></app-review-form>
          }
        }
      </main>

      <footer class="workshop-footer">
        <p>
          📚 <strong>Learning Path:</strong> 
          Progress through each task to master Signal Forms concepts
        </p>
        <div class="progress-indicators">
          <div class="progress-item" [class.completed]="false">
            <span class="number">1</span>
            <span>Product Form</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">2</span>
            <span>Checkout Flow</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">3</span>
            <span>User Profile</span>
          </div>
          <div class="progress-item" [class.completed]="false">
            <span class="number">4</span>
            <span>Custom Controls</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .signal-forms-workshop {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .workshop-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }

    .workshop-header h1 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .lead {
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
      opacity: 0.9;
    }

    .badge-container {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge.experimental {
      background: #ff6b6b;
      color: white;
    }

    .badge.angular {
      background: #dd0031;
      color: white;
    }

    .badge.basic {
      background: #28a745;
      color: white;
    }

    .badge.intermediate {
      background: #ffc107;
      color: #212529;
    }

    .badge.advanced {
      background: #dc3545;
      color: white;
    }

    .forms-nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .nav-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      border: 2px solid #e9ecef;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .nav-button:hover {
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    }

    .nav-button.active {
      border-color: #007bff;
      background: #f8f9ff;
      color: #007bff;
    }

    .task-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .task-section h2 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .task-section p {
      margin: 0 0 2rem 0;
      color: #6c757d;
    }

    .placeholder {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      color: #856404;
    }

    .placeholder p {
      margin: 0.5rem 0;
    }

    .workshop-footer {
      text-align: center;
      margin-top: 3rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .progress-indicators {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .progress-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }

    .progress-item.completed {
      opacity: 1;
    }

    .progress-item .number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .progress-item.completed .number {
      background: #28a745;
      color: white;
    }

    .progress-item span:last-child {
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .signal-forms-workshop {
        padding: 1rem;
      }
      
      .workshop-header {
        padding: 1.5rem;
      }
      
      .workshop-header h1 {
        font-size: 2rem;
      }
      
      .forms-nav {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SignalFormsComponent {
  activeTab = signal<string>('product');

  tabs = [
    {
      id: 'product',
      label: 'Product Form',
      badge: 'BASIC',
      badgeClass: 'basic'
    },
    {
      id: 'checkout',
      label: 'Checkout Flow',
      badge: 'INTER',
      badgeClass: 'intermediate'
    },
    {
      id: 'profile',
      label: 'User Profile',
      badge: 'INTER',
      badgeClass: 'intermediate'
    },
    {
      id: 'custom',
      label: 'Custom Controls',
      badge: 'ADV',
      badgeClass: 'advanced'
    }
  ];

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }
}