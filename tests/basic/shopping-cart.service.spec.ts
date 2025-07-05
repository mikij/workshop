import { TestBed } from '@angular/core/testing';
import { ShoppingCartRxjsService } from '../../src/app/basic/services/shopping-cart-rxjs.service';
import { Product } from '../../src/app/shared/models';

describe('ShoppingCartRxjsService', () => {
  let service: ShoppingCartRxjsService;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    category: 'test',
    description: 'A test product',
    image: '/test-image.jpg',
    inStock: true,
    rating: 4.5,
    discount: 10,
    tags: ['test', 'product']
  };

  const mockProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    category: 'test',
    description: 'Another test product',
    image: '/test-image2.jpg',
    inStock: true,
    rating: 4.7,
    tags: ['test', 'product2']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoppingCartRxjsService]
    });
    service = TestBed.inject(ShoppingCartRxjsService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', (done) => {
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should add item to cart', (done) => {
    service.addItem(mockProduct);
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe('1');
      expect(items[0].name).toBe('Test Product');
      expect(items[0].price).toBe(99.99);
      expect(items[0].quantity).toBe(1);
      done();
    });
  });

  it('should increase quantity when adding existing item', (done) => {
    service.addItem(mockProduct);
    service.addItem(mockProduct);
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
      done();
    });
  });

  it('should add multiple different items', (done) => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(2);
      expect(items.find(item => item.productId === '1')).toBeTruthy();
      expect(items.find(item => item.productId === '2')).toBeTruthy();
      done();
    });
  });

  it('should remove item from cart', (done) => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.removeItem('1');
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe('2');
      done();
    });
  });

  it('should update item quantity', (done) => {
    service.addItem(mockProduct);
    service.updateQuantity('1', 5);
    
    service.items$.subscribe(items => {
      expect(items[0].quantity).toBe(5);
      done();
    });
  });

  it('should remove item when quantity is set to 0', (done) => {
    service.addItem(mockProduct);
    service.updateQuantity('1', 0);
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should clear all items from cart', (done) => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    service.clearCart();
    
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should calculate correct cart summary', (done) => {
    service.addItem(mockProduct); // $99.99 with 10% discount
    service.addItem(mockProduct2); // $149.99 no discount
    
    service.getCartSummary().subscribe(summary => {
      expect(summary.totalItems).toBe(2);
      expect(summary.totalPrice).toBe(249.98);
      expect(summary.totalDiscount).toBeCloseTo(9.999, 2); // 10% of $99.99
      expect(summary.tax).toBeCloseTo(19.199, 2); // 8% of ($249.98 - $9.999)
      expect(summary.finalPrice).toBeCloseTo(259.179, 2);
      done();
    });
  });

  it('should calculate total items correctly', (done) => {
    service.addItem(mockProduct);
    service.updateQuantity('1', 3);
    service.addItem(mockProduct2);
    
    service.getTotalItems().subscribe(total => {
      expect(total).toBe(4); // 3 + 1
      done();
    });
  });

  it('should save cart to localStorage', () => {
    service.addItem(mockProduct);
    
    const savedItems = localStorage.getItem('cart-items');
    expect(savedItems).toBeTruthy();
    
    const parsedItems = JSON.parse(savedItems!);
    expect(parsedItems.length).toBe(1);
    expect(parsedItems[0].productId).toBe('1');
  });

  it('should load cart from localStorage', () => {
    const testItems = [{
      id: 'test-id',
      productId: '1',
      name: 'Test Product',
      price: 99.99,
      quantity: 2,
      image: '/test-image.jpg',
      category: 'test'
    }];
    
    localStorage.setItem('cart-items', JSON.stringify(testItems));
    
    // Create new service instance to test loading
    const newService = new ShoppingCartRxjsService();
    
    newService.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe('1');
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('cart-items', 'invalid-json');
    
    // Should not throw error
    expect(() => {
      const newService = new ShoppingCartRxjsService();
    }).not.toThrow();
  });

  it('should handle missing localStorage gracefully', () => {
    // Mock localStorage as undefined
    const originalLocalStorage = (global as any).localStorage;
    (global as any).localStorage = undefined;
    
    expect(() => {
      const newService = new ShoppingCartRxjsService();
    }).not.toThrow();
    
    // Restore localStorage
    (global as any).localStorage = originalLocalStorage;
  });

  it('should generate unique IDs for cart items', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct2);
    
    service.items$.subscribe(items => {
      expect(items[0].id).toBeTruthy();
      expect(items[1].id).toBeTruthy();
      expect(items[0].id).not.toBe(items[1].id);
    });
  });

  it('should maintain discount information', (done) => {
    service.addItem(mockProduct);
    
    service.items$.subscribe(items => {
      expect(items[0].discount).toBe(10);
      done();
    });
  });

  it('should calculate cart summary with no discount items', (done) => {
    const noDiscountProduct: Product = {
      ...mockProduct2,
      discount: undefined
    };
    
    service.addItem(noDiscountProduct);
    
    service.getCartSummary().subscribe(summary => {
      expect(summary.totalDiscount).toBe(0);
      expect(summary.tax).toBeCloseTo(11.999, 2); // 8% of $149.99
      expect(summary.finalPrice).toBeCloseTo(161.989, 2);
      done();
    });
  });
});