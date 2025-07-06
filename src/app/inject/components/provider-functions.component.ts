import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'provider-functions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="providers-container">
      <h1>Provider Functions</h1>
      <p>TODO: Implement advanced provider function patterns</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Custom provider functions</li>
          <li>Multi-provider patterns</li>
          <li>Factory providers with inject()</li>
          <li>Provider hierarchies and scoping</li>
          <li>Configuration provider patterns</li>
          <li>Feature provider composition</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .providers-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .back-btn {
      display: inline-block;
      background: #7c3aed;
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
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class ProviderFunctionsComponent {
}