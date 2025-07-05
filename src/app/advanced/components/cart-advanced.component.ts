import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductResourceService } from '../services/product-resource.service';
import { AdvancedCartService } from '../services/advanced-cart.service';
import { Product } from '../../shared/models';

@Component({
  selector: 'app-cart-advanced',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-advanced.component.html',
  styleUrls: ['./cart-advanced.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartAdvancedComponent implements OnInit {
  
  // Local component state
  showFilters = signal<boolean>(false);
  showAnalytics = signal<boolean>(false);
  showHistory = signal<boolean>(false);
  bulkDiscountCategory = signal<string>('all');
  bulkDiscountPercent = signal<number>(10);
  
  // Filter controls
  searchQuery = signal<string>('');
  priceMin = signal<number>(0);
  priceMax = signal<number>(5000);

  // Inject services using modern approach
  public productService = inject(ProductResourceService);
  public cartService = inject(AdvancedCartService);
  
  constructor() {}

  ngOnInit(): void {
    console.log('Cart Advanced Component initialized');
    
    // Load initial products
    this.productService.setSearchQuery('');
    this.productService.setCategoryFilter('all');
  }

  // Product operations
  onAddToCart(product: Product, quantity: number = 1): void {
    this.cartService.addItem(product, quantity);
  }

  onRemoveFromCart(productId: string): void {
    this.cartService.removeItem(productId);
  }

  onUpdateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onDuplicateItem(productId: string): void {
    this.cartService.duplicateItem(productId);
  }

  onMoveToWishlist(productId: string): void {
    this.cartService.moveToWishlist(productId);
  }

  // Bulk operations
  onApplyBulkDiscount(): void {
    this.cartService.applyBulkDiscount(
      this.bulkDiscountCategory(), 
      this.bulkDiscountPercent()
    );
  }

  onOptimizeCart(): void {
    this.cartService.optimizeCart();
  }

  // History operations
  onUndoLastChange(): void {
    this.cartService.undoLastChange();
  }

  onRestoreFromHistory(index: number): void {
    this.cartService.restoreCartFromHistory(index);
  }

  // Filter operations
  onSearchProducts(): void {
    this.productService.setSearchQuery(this.searchQuery());
  }

  onFilterByCategory(category: string): void {
    this.productService.setCategoryFilter(category);
  }

  onFilterByPriceRange(): void {
    this.productService.setPriceRange(this.priceMin(), this.priceMax());
  }

  onSortProducts(sortBy: 'name' | 'price' | 'rating', order: 'asc' | 'desc'): void {
    this.productService.setSorting(sortBy, order);
  }

  onResetFilters(): void {
    this.productService.resetFilters();
    this.searchQuery.set('');
    this.priceMin.set(0);
    this.priceMax.set(5000);
  }

  // Pagination
  onPageChange(page: number): void {
    this.productService.setCurrentPage(page);
  }

  onItemsPerPageChange(count: number): void {
    this.productService.setItemsPerPage(count);
  }

  // Product selection
  onSelectProduct(productId: string): void {
    this.productService.selectProduct(productId);
  }

  onClearProductSelection(): void {
    this.productService.clearProductSelection();
  }

  // Export/Import
  onExportCart(): void {
    const cartData = this.cartService.exportCart();
    const blob = new Blob([cartData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cart-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  onImportCart(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = this.cartService.importCart(content);
        
        if (success) {
          console.log('Cart imported successfully');
        } else {
          console.error('Failed to import cart');
        }
      };
      reader.readAsText(file);
    }
  }

  // Sync operations
  onTriggerSync(): void {
    this.cartService.triggerSync();
  }

  onResetSession(): void {
    this.cartService.resetSession();
  }

  // UI controls
  toggleFilters(): void {
    this.showFilters.update(show => !show);
  }

  toggleAnalytics(): void {
    this.showAnalytics.update(show => !show);
  }

  toggleHistory(): void {
    this.showHistory.update(show => !show);
  }

  // Utility methods
  getAvailableCategories(): string[] {
    return ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];
  }

  getItemsPerPageOptions(): number[] {
    return [6, 12, 24, 48];
  }

  getSortOptions(): { label: string; sortBy: 'name' | 'price' | 'rating'; order: 'asc' | 'desc' }[] {
    return [
      { label: 'Name A-Z', sortBy: 'name', order: 'asc' },
      { label: 'Name Z-A', sortBy: 'name', order: 'desc' },
      { label: 'Price Low-High', sortBy: 'price', order: 'asc' },
      { label: 'Price High-Low', sortBy: 'price', order: 'desc' },
      { label: 'Rating High-Low', sortBy: 'rating', order: 'desc' },
      { label: 'Rating Low-High', sortBy: 'rating', order: 'asc' }
    ];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  trackByProductId(index: number, item: any): string {
    return item.productId || item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Pagination helpers
  getTotalPages(): number {
    const filters = this.productService.getCurrentFilters();
    const totalItems = 100; // This would come from the API in real implementation
    return Math.ceil(totalItems / filters.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.productService.getCurrentFilters().page;
    const pages: number[] = [];
    
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  calculateHistoryTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}