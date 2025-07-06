import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="checkout-container">
      <h1>Standalone Checkout</h1>
      <p>TODO: Implement standalone checkout component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Multi-step checkout without NgModules</li>
          <li>Form handling with standalone components</li>
          <li>Payment processing integration</li>
          <li>Order confirmation flow</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .back-btn {
      display: inline-block;
      background: #10b981;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin: 1rem;
    }
    
    .coming-soon {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 2rem;
      margin-top: 2rem;
    }
    
    .coming-soon ul {
      text-align: left;
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class StandaloneCheckoutComponent {
}