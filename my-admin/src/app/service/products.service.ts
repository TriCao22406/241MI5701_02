import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private jsonUrl = 'http://localhost:3000/products';
  private collectionUrl = 'http://localhost:3000/collections';
  private blogUrl = 'assets/data/blog.json';
  private productUrl = 'http://localhost:3000/products';
  

  constructor(private http: HttpClient) {}

  addProduct(product: any): Observable<any> {
    return this.http.post(this.productUrl, product);
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }


  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/Products/${id}`);  
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/Products/code/${code}`);  
  }

  getCollection(): Observable<any[]> {
    return this.http.get<any[]>(this.collectionUrl);
  }

}
