import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'testing-patterns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="testing-container">
      <h1>Testing with inject()</h1>
      <p>TODO: Implement comprehensive testing patterns for inject() services</p>
      
      <nav>
        <a routerLink="/inject" class="back-btn">← Back to inject() Cart</a>
      </nav>
      
      <div class="coming-soon">
        <h2>Coming Soon</h2>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Testing services with inject()</li>
          <li>Mocking injected dependencies</li>
          <li>TestBed configuration for inject() services</li>
          <li>Integration testing patterns</li>
          <li>Provider override strategies</li>
          <li>Spy setup for inject() dependencies</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .testing-container {
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
export class TestingPatternsComponent {
}