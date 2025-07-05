import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs';
import { of } from 'rxjs';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private http = inject(HttpClient);
  
  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.http.get<Product[]>('api/products').pipe(
      map(products => products || []),
      catchError(error => {
        console.error('Failed to load products:', error);
        return of([]);
      })
    ).subscribe(products => {
      this.productsSubject.next(products);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => 
        products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      )
    );
  }
}