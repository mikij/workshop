import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Shopping Cart Workshop';
  
  levels = [
    { 
      path: '/basic', 
      name: 'Basic Level', 
      description: 'RxJS Implementation',
      difficulty: 'Beginner',
      topics: ['BehaviorSubject', 'Observables', 'Operators']
    },
    { 
      path: '/intermediate', 
      name: 'Intermediate Level', 
      description: 'Signals + Computed',
      difficulty: 'Intermediate',
      topics: ['Signals', 'Computed', 'Effects', 'State Management']
    },
    { 
      path: '/advanced', 
      name: 'Advanced Level', 
      description: 'Resource API + Advanced Patterns',
      difficulty: 'Advanced',
      topics: ['Resource API', 'Advanced Signals', 'Performance', 'Analytics']
    },
    { 
      path: '/control-flow', 
      name: 'Control Flow', 
      description: 'Modern Template Syntax',
      difficulty: 'Intermediate',
      topics: ['@if', '@for', '@switch', '@defer']
    },
    { 
      path: '/standalone', 
      name: 'Standalone', 
      description: 'Module-Free Architecture',
      difficulty: 'Intermediate',
      topics: ['Standalone Components', 'Lazy Loading', 'Migration']
    },
    { 
      path: '/inject', 
      name: 'Modern DI', 
      description: 'inject() Patterns',
      difficulty: 'Advanced',
      topics: ['inject()', 'Provider Functions', 'Testing', 'Composition']
    },
    { 
      path: '/signal-forms', 
      name: 'Signal Forms', 
      description: 'Experimental Signal-Based Forms',
      difficulty: 'Advanced',
      topics: ['form()', 'Custom Controls', 'Validation', 'submit()']
    }
  ];
}
