import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <h1>Standalone Product List</h1>
      <p>TODO: Implement standalone product list component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Standalone product catalog</li>
          <li>Advanced filtering without NgModules</li>
          <li>Lazy loading of product details</li>
          <li>Modern inject() patterns</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .back-btn {
      display: inline-block;
      background: #4f46e5;
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
export class StandaloneProductListComponent {
}