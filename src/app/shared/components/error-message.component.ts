import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container" [ngClass]="['error-' + type, { 'error-dismissible': dismissible }]">
      <div class="error-content">
        <div class="error-icon">
          <ng-container [ngSwitch]="type">
            <span *ngSwitchCase="'warning'" class="icon">⚠️</span>
            <span *ngSwitchCase="'info'" class="icon">ℹ️</span>
            <span *ngSwitchCase="'success'" class="icon">✅</span>
            <span *ngSwitchDefault class="icon">❌</span>
          </ng-container>
        </div>
        
        <div class="error-message">
          <h4 *ngIf="title" class="error-title">{{ title }}</h4>
          <p class="error-text">{{ message }}</p>
          
          <div *ngIf="details && showDetails" class="error-details">
            <p><strong>Details:</strong></p>
            <pre>{{ details }}</pre>
          </div>
          
          <div *ngIf="showActions" class="error-actions">
            <button 
              *ngIf="retryable" 
              class="btn btn-primary btn-small"
              (click)="onRetry()"
              [disabled]="retrying"
            >
              {{ retrying ? 'Retrying...' : 'Retry' }}
            </button>
            
            <button 
              *ngIf="details && !showDetails" 
              class="btn btn-outline btn-small"
              (click)="toggleDetails()"
            >
              Show Details
            </button>
            
            <button 
              *ngIf="details && showDetails" 
              class="btn btn-outline btn-small"
              (click)="toggleDetails()"
            >
              Hide Details
            </button>
            
            <button 
              *ngIf="dismissible" 
              class="btn btn-outline btn-small"
              (click)="onDismiss()"
            >
              Dismiss
            </button>
          </div>
        </div>
        
        <button 
          *ngIf="dismissible && !showActions" 
          class="error-close"
          (click)="onDismiss()"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  @Input() type: 'error' | 'warning' | 'info' | 'success' = 'error';
  @Input() title?: string;
  @Input() message!: string;
  @Input() details?: string;
  @Input() retryable = false;
  @Input() dismissible = true;
  @Input() showActions = true;
  @Input() retrying = false;
  
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  showDetails = false;

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}