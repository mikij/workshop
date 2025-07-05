import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [ngSwitch]="type">
      
      <!-- Product Card Skeleton -->
      <div *ngSwitchCase="'product-card'" class="skeleton product-card-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-subtitle"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
          <div class="skeleton-footer">
            <div class="skeleton-line skeleton-price"></div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      </div>

      <!-- Cart Item Skeleton -->
      <div *ngSwitchCase="'cart-item'" class="skeleton cart-item-skeleton">
        <div class="skeleton-image small"></div>
        <div class="skeleton-item-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-subtitle"></div>
          <div class="skeleton-line skeleton-price"></div>
        </div>
        <div class="skeleton-controls">
          <div class="skeleton-button small"></div>
          <div class="skeleton-button small"></div>
        </div>
      </div>

      <!-- Text Lines Skeleton -->
      <div *ngSwitchCase="'text'" class="skeleton text-skeleton">
        <div 
          *ngFor="let line of getLines()" 
          class="skeleton-line"
          [style.width.%]="line.width"
        ></div>
      </div>

      <!-- Grid Skeleton -->
      <div *ngSwitchCase="'grid'" class="skeleton-grid">
        <div 
          *ngFor="let item of getGridItems()" 
          class="skeleton grid-item-skeleton"
        >
          <div class="skeleton-image"></div>
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-subtitle"></div>
        </div>
      </div>

      <!-- List Skeleton -->
      <div *ngSwitchCase="'list'" class="skeleton-list">
        <div 
          *ngFor="let item of getListItems()" 
          class="skeleton list-item-skeleton"
        >
          <div class="skeleton-avatar"></div>
          <div class="skeleton-list-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-text"></div>
          </div>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div *ngSwitchCase="'table'" class="skeleton-table">
        <div class="skeleton-table-header">
          <div 
            *ngFor="let col of getTableColumns()" 
            class="skeleton-line skeleton-header"
          ></div>
        </div>
        <div 
          *ngFor="let row of getTableRows()" 
          class="skeleton-table-row"
        >
          <div 
            *ngFor="let col of getTableColumns()" 
            class="skeleton-line skeleton-cell"
          ></div>
        </div>
      </div>

      <!-- Default Skeleton -->
      <div *ngSwitchDefault class="skeleton default-skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </div>
  `,
  styleUrls: ['./loading-skeleton.component.css']
})
export class LoadingSkeletonComponent {
  @Input() type: 'product-card' | 'cart-item' | 'text' | 'grid' | 'list' | 'table' | 'default' = 'default';
  @Input() lines = 3;
  @Input() gridItems = 6;
  @Input() listItems = 5;
  @Input() tableRows = 5;
  @Input() tableColumns = 4;
  @Input() animated = true;

  getLines(): { width: number }[] {
    const lines = [];
    for (let i = 0; i < this.lines; i++) {
      // Vary line widths to look more natural
      const width = i === this.lines - 1 ? 60 + Math.random() * 30 : 80 + Math.random() * 20;
      lines.push({ width });
    }
    return lines;
  }

  getGridItems(): number[] {
    return Array(this.gridItems).fill(0);
  }

  getListItems(): number[] {
    return Array(this.listItems).fill(0);
  }

  getTableRows(): number[] {
    return Array(this.tableRows).fill(0);
  }

  getTableColumns(): number[] {
    return Array(this.tableColumns).fill(0);
  }
}