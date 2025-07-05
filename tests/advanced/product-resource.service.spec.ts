import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductResourceService } from '../../src/app/advanced/services/product-resource.service';
import { Product } from '../../src/app/shared/models';

describe('ProductResourceService', () => {
  let service: ProductResourceService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      price: 2499.99,
      category: 'electronics',
      description: 'Apple MacBook Pro',
      image: '/macbook.jpg',
      inStock: true,
      rating: 4.8,
      tags: ['apple', 'laptop']
    },
    {
      id: '2',
      name: 'iPhone 15',
      price: 999.99,
      category: 'electronics',
      description: 'Latest iPhone',
      image: '/iphone.jpg',
      inStock: true,
      rating: 4.7,
      tags: ['apple', 'phone']
    },
    {
      id: '3',
      name: 'Nike Shoes',
      price: 149.99,
      category: 'clothing',
      description: 'Running shoes',
      image: '/nike.jpg',
      inStock: true,
      rating: 4.5,
      tags: ['nike', 'shoes']
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductResourceService]
    });
    
    service = TestBed.inject(ProductResourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products with default filters', async () => {
    // Trigger the resource loading
    const productsResource = service.productsResource;
    
    // Expect HTTP request
    const req = httpMock.expectOne('/assets/data/products.json');
    expect(req.request.method).toBe('GET');
    
    // Respond with mock data
    req.flush(mockProducts);
    
    // Wait for the resource to resolve
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = productsResource.value();
    expect(result).toBeTruthy();
    expect(result!.products.length).toBe(3);
    expect(result!.loading).toBe(false);
    expect(result!.error).toBe(null);
  });

  it('should filter products by search query', async () => {
    service.setSearchQuery('MacBook');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(1);
    expect(result!.products[0].name).toBe('MacBook Pro');
  });

  it('should filter products by category', async () => {
    service.setCategoryFilter('electronics');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(2);
    expect(result!.products.every(p => p.category === 'electronics')).toBe(true);
  });

  it('should filter products by price range', async () => {
    service.setPriceRange(100, 1000);
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(2); // iPhone and Nike Shoes
    expect(result!.products.every(p => p.price >= 100 && p.price <= 1000)).toBe(true);
  });

  it('should sort products by price ascending', async () => {
    service.setSorting('price', 'asc');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    const prices = result!.products.map(p => p.price);
    expect(prices).toEqual([149.99, 999.99, 2499.99]);
  });

  it('should sort products by price descending', async () => {
    service.setSorting('price', 'desc');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    const prices = result!.products.map(p => p.price);
    expect(prices).toEqual([2499.99, 999.99, 149.99]);
  });

  it('should sort products by name', async () => {
    service.setSorting('name', 'asc');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    const names = result!.products.map(p => p.name);
    expect(names).toEqual(['iPhone 15', 'MacBook Pro', 'Nike Shoes']);
  });

  it('should sort products by rating', async () => {
    service.setSorting('rating', 'desc');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    const ratings = result!.products.map(p => p.rating);
    expect(ratings).toEqual([4.8, 4.7, 4.5]);
  });

  it('should handle pagination', async () => {
    service.setItemsPerPage(2);
    service.setCurrentPage(1);
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(2);
  });

  it('should handle second page pagination', async () => {
    service.setItemsPerPage(2);
    service.setCurrentPage(2);
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(1); // Last item on page 2
  });

  it('should load selected product', async () => {
    service.selectProduct('1');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const selectedProduct = service.selectedProductResource.value();
    expect(selectedProduct).toBeTruthy();
    expect(selectedProduct!.id).toBe('1');
    expect(selectedProduct!.name).toBe('MacBook Pro');
  });

  it('should return null for non-existent product', async () => {
    service.selectProduct('999');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const selectedProduct = service.selectedProductResource.value();
    expect(selectedProduct).toBe(null);
  });

  it('should load recommendations based on selected product', async () => {
    service.selectProduct('1'); // MacBook (electronics)
    
    // Two requests: one for selected product, one for recommendations
    const req1 = httpMock.expectOne('/assets/data/products.json');
    req1.flush(mockProducts);
    
    const req2 = httpMock.expectOne('/assets/data/products.json');
    req2.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const recommendations = service.recommendationsResource.value();
    expect(recommendations).toBeTruthy();
    expect(recommendations!.length).toBeGreaterThan(0);
    // Should not include the selected product itself
    expect(recommendations!.find(p => p.id === '1')).toBeFalsy();
  });

  it('should load recommendations based on category', async () => {
    service.setCategoryFilter('electronics');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const recommendations = service.recommendationsResource.value();
    expect(recommendations).toBeTruthy();
    expect(recommendations!.length).toBeLessThanOrEqual(5); // Top 5 by rating
  });

  it('should combine multiple filters', async () => {
    service.setSearchQuery('iPhone');
    service.setCategoryFilter('electronics');
    service.setPriceRange(500, 1500);
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(1);
    expect(result!.products[0].name).toBe('iPhone 15');
  });

  it('should reset filters', async () => {
    service.setSearchQuery('test');
    service.setCategoryFilter('electronics');
    service.setPriceRange(100, 200);
    
    service.resetFilters();
    
    const filters = service.getCurrentFilters();
    expect(filters.search).toBe('');
    expect(filters.category).toBe('all');
    expect(filters.priceRange.min).toBe(0);
    expect(filters.priceRange.max).toBe(5000);
    expect(filters.page).toBe(1);
  });

  it('should handle HTTP errors gracefully', async () => {
    const req = httpMock.expectOne('/assets/data/products.json');
    req.error(new ErrorEvent('Network error'));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result).toBeTruthy();
    expect(result!.products).toEqual([]);
    expect(result!.loading).toBe(false);
    expect(result!.error).toBe('Failed to load products');
  });

  it('should clear product selection', async () => {
    service.selectProduct('1');
    service.clearProductSelection();
    
    // Should not make HTTP request when clearing selection
    httpMock.expectNone('/assets/data/products.json');
    
    const selectedProduct = service.selectedProductResource.value();
    expect(selectedProduct).toBe(null);
  });

  it('should get current filters', () => {
    service.setSearchQuery('test');
    service.setCategoryFilter('electronics');
    service.setCurrentPage(2);
    service.setItemsPerPage(24);
    
    const filters = service.getCurrentFilters();
    expect(filters.search).toBe('test');
    expect(filters.category).toBe('electronics');
    expect(filters.page).toBe(2);
    expect(filters.itemsPerPage).toBe(24);
  });

  it('should reset page when changing filters', () => {
    service.setCurrentPage(3);
    service.setSearchQuery('new search');
    
    const filters = service.getCurrentFilters();
    expect(filters.page).toBe(1); // Should reset to page 1
  });

  it('should handle search by tags', async () => {
    service.setSearchQuery('apple');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(2); // MacBook and iPhone both have 'apple' tag
  });

  it('should handle case-insensitive search', async () => {
    service.setSearchQuery('MACBOOK');
    
    const req = httpMock.expectOne('/assets/data/products.json');
    req.flush(mockProducts);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = service.productsResource.value();
    expect(result!.products.length).toBe(1);
    expect(result!.products[0].name).toBe('MacBook Pro');
  });
});