import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'injection-patterns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="patterns-container">
      <h1>Injection Patterns Demo</h1>
      <p>TODO: Implement comprehensive inject() patterns demonstration</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Optional injection with fallbacks</li>
          <li>Conditional injection based on environment</li>
          <li>Factory function patterns</li>
          <li>Configuration token injection</li>
          <li>Service composition patterns</li>
          <li>runInInjectionContext usage</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .patterns-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    .back-btn {
      display: inline-block;
      background: #8b5cf6;
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
export class InjectionPatternsComponent {
}