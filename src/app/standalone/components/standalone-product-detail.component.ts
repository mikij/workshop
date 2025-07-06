import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'standalone-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail-container">
      <h1>Standalone Product Detail</h1>
      <p>TODO: Implement standalone product detail component</p>
      
      <nav>
        <a routerLink="/standalone" class="back-btn">← Back to Cart</a>
        <a routerLink="/standalone/products" class="back-btn">← Back to Products</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Route parameter handling without NgModules</li>
          <li>Product detail display</li>
          <li>Add to cart from detail view</li>
          <li>Related products recommendations</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .back-btn {
      display: inline-block;
      background: #6366f1;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin: 0.5rem;
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
export class StandaloneProductDetailComponent {
}