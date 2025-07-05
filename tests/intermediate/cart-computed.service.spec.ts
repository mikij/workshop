import { TestBed } from '@angular/core/testing';
import { CartComputedService } from '../../src/app/intermediate/services/cart-computed.service';
import { Product } from '../../src/app/shared/models';

describe('CartComputedService', () => {
  let service: CartComputedService;

  const mockProduct: Product = {
    id: '1',
    name: 'Electronics Product',
    price: 299.99,
    category: 'electronics',
    description: 'A test electronics product',
    image: '/electronics.jpg',
    inStock: true,
    rating: 4.5,
    discount: 15,
    tags: ['electronics', 'tech']
  };

  const mockProduct2: Product = {
    id: '2',
    name: 'Clothing Product',
    price: 79.99,
    category: 'clothing',
    description: 'A test clothing product',
    image: '/clothing.jpg',
    inStock: true,
    rating: 4.2,
    discount: 5,
    tags: ['clothing', 'fashion']
  };

  const mockProduct3: Product = {
    id: '3',
    name: 'Expensive Product',
    price: 1299.99,
    category: 'electronics',
    description: 'An expensive product',
    image: '/expensive.jpg',
    inStock: true,
    rating: 4.8,
    tags: ['premium', 'luxury']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartComputedService]
    });
    service = TestBed.inject(CartComputedService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.cartItems()).toEqual([]);
  });

  it('should add item to cart using signals', () => {
    service.addItem(mockProduct);
    
    const items = service.cartItems();
    expect(items.length).toBe(1);
    expect(items[0].productId).toBe('1');
    expect(items[0].quantity).toBe(1);
  });

  it('should compute cart summary correctly', () => {
    service.addItem(mockProduct); // $299.99 with 15% discount
    service.addItem(mockProduct2); // $79.99 with 5% discount
    
    const summary = service.cartSummary();
    expect(summary.totalItems).toBe(2);
    expect(summary.totalPrice).toBe(379.98);
    
    // Discounts: 15% of $299.99 + 5% of $79.99
    const expectedDiscount = (299.99 * 0.15) + (79.99 * 0.05);
    expect(summary.totalDiscount).toBeCloseTo(expectedDiscount, 2);
  });

  it('should apply progressive tax calculation', () => {
    // Add expensive item to trigger higher tax rate
    service.addItem(mockProduct3);
    
    const summary = service.cartSummary();
    const subtotal = 1299.99;
    const expectedTax = subtotal * 0.12; // 12% for items over $1000
    
    expect(summary.tax).toBeCloseTo(expectedTax, 2);
  });

  it('should filter items by category', () => {
    service.addItem(mockProduct); // electronics
    service.addItem(mockProduct2); // clothing
    service.setCategory('electronics');
    
    const filteredItems = service.filteredItems();
    expect(filteredItems.length).toBe(1);
    expect(filteredItems[0].category).toBe('electronics');
  });

  it('should filter items by search query', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.setSearchQuery('electronics');
    
    const filteredItems = service.filteredItems();
    expect(filteredItems.length).toBe(1);
    expect(filteredItems[0].name).toContain('Electronics');
  });

  it('should sort items by price', () => {
    service.addItem(mockProduct); // $299.99
    service.addItem(mockProduct2); // $79.99
    service.setSortOrder('asc');
    
    const sortedItems = service.filteredItems();
    expect(sortedItems[0].price * sortedItems[0].quantity).toBeLessThan(
      sortedItems[1].price * sortedItems[1].quantity
    );
  });

  it('should sort items by price descending', () => {
    service.addItem(mockProduct); // $299.99
    service.addItem(mockProduct2); // $79.99
    service.setSortOrder('desc');
    
    const sortedItems = service.filteredItems();
    expect(sortedItems[0].price * sortedItems[0].quantity).toBeGreaterThan(
      sortedItems[1].price * sortedItems[1].quantity
    );
  });

  it('should compute category statistics', () => {
    service.addItem(mockProduct); // electronics
    service.addItem(mockProduct2); // clothing
    service.updateQuantity('1', 2); // 2 electronics items
    
    const stats = service.categoryStats();
    expect(stats.length).toBe(2);
    
    const electronicsStats = stats.find(s => s.category === 'electronics');
    expect(electronicsStats?.itemCount).toBe(2);
    expect(electronicsStats?.totalValue).toBeCloseTo(599.98, 2);
  });

  it('should compute discount information', () => {
    service.addItem(mockProduct); // 15% discount
    service.addItem(mockProduct2); // 5% discount
    
    const discountInfo = service.discountInfo();
    expect(discountInfo.hasDiscounts).toBe(true);
    expect(discountInfo.discountedItemsCount).toBe(2);
    expect(discountInfo.averageDiscount).toBe(10); // (15 + 5) / 2
  });

  it('should compute shipping information', () => {
    service.addItem(mockProduct3); // $1299.99 - should get free shipping
    
    const shippingInfo = service.shippingInfo();
    expect(shippingInfo.isFreeShipping).toBe(true);
    expect(shippingInfo.shippingCost).toBe(0);
    expect(shippingInfo.estimatedDelivery).toBe('2-3 days');
  });

  it('should compute shipping information for orders under threshold', () => {
    service.addItem(mockProduct2); // $79.99 - should not get free shipping
    
    const shippingInfo = service.shippingInfo();
    expect(shippingInfo.isFreeShipping).toBe(false);
    expect(shippingInfo.shippingCost).toBe(15);
    expect(shippingInfo.amountForFreeShipping).toBeCloseTo(420.01, 2);
  });

  it('should compute recommendations', () => {
    service.addItem(mockProduct); // electronics
    service.addItem(mockProduct2); // clothing
    
    const recommendations = service.recommendations();
    expect(recommendations.frequentCategories).toContain('electronics');
    expect(recommendations.frequentCategories).toContain('clothing');
    expect(recommendations.totalUniqueItems).toBe(2);
  });

  it('should update quantity with bulk discount', () => {
    service.addItem(mockProduct);
    service.updateQuantity('1', 5); // More than 3 items
    
    const items = service.cartItems();
    // Should automatically apply bulk discount (15% minimum)
    expect(items[0].quantity).toBe(5);
  });

  it('should clear cart', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.clearCart();
    
    expect(service.cartItems()).toEqual([]);
  });

  it('should persist cart to localStorage', () => {
    service.addItem(mockProduct);
    
    const savedItems = localStorage.getItem('cart-items-computed');
    expect(savedItems).toBeTruthy();
    
    const parsedItems = JSON.parse(savedItems!);
    expect(parsedItems.length).toBe(1);
  });

  it('should load cart from localStorage', () => {
    const testItems = [{
      id: 'test-id',
      productId: '1',
      name: 'Test Product',
      price: 99.99,
      quantity: 2,
      image: '/test.jpg',
      category: 'test'
    }];
    
    localStorage.setItem('cart-items-computed', JSON.stringify(testItems));
    
    // Create new service to test loading
    const newService = new CartComputedService();
    expect(newService.cartItems().length).toBe(1);
  });

  it('should handle complex filtering scenarios', () => {
    service.addItem(mockProduct); // electronics, $299.99
    service.addItem(mockProduct2); // clothing, $79.99
    service.addItem(mockProduct3); // electronics, $1299.99
    
    // Filter by category and search
    service.setCategory('electronics');
    service.setSearchQuery('expensive');
    
    const filtered = service.filteredItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].productId).toBe('3');
  });

  it('should reset filters correctly', () => {
    service.setCategory('electronics');
    service.setSearchQuery('test');
    
    service.setCategory('all');
    service.setSearchQuery('');
    
    expect(service.currentCategory()).toBe('all');
    expect(service.currentSearch()).toBe('');
  });

  it('should generate unique item IDs', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    
    const items = service.cartItems();
    expect(items[0].id).toBeTruthy();
    expect(items[1].id).toBeTruthy();
    expect(items[0].id).not.toBe(items[1].id);
  });

  it('should handle edge cases in category stats', () => {
    // Empty cart
    expect(service.categoryStats()).toEqual([]);
    
    // Single item
    service.addItem(mockProduct);
    const stats = service.categoryStats();
    expect(stats.length).toBe(1);
    expect(stats[0].category).toBe('electronics');
  });

  it('should handle edge cases in discount info', () => {
    // No discounts
    const productNoDiscount: Product = { ...mockProduct2, discount: undefined };
    service.addItem(productNoDiscount);
    
    const discountInfo = service.discountInfo();
    expect(discountInfo.hasDiscounts).toBe(false);
    expect(discountInfo.discountedItemsCount).toBe(0);
    expect(discountInfo.averageDiscount).toBe(0);
  });
});