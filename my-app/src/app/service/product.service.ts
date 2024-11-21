import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private jsonUrl = 'assets/data/products_final_1.json';
  private jsonUrl = 'http://localhost:3000/products';
  private collectionUrl = 'http://localhost:3000/collections';
  private favoriteUrl = 'http://localhost:3000/wishlists';
  private blogUrl = 'assets/data/blog.json';
  

  constructor(private http: HttpClient) {}

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

  getBlogData(): Observable<any> {
    return this.http.get<any>(this.blogUrl);
  }

  // mục yêu thích
  getAllProductFavorite(id: string): Observable<any> {
    return this.http.get<any>(`${this.favoriteUrl}/${id}`);
  }
  addFavoriteProduct(payload: {
    userId: string;
    productId: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.favoriteUrl}/add`, payload);
  }
  removefavoriteProduct(payload: {
    userId: string;
    productId: string;
  }): Observable<any> {
    return this.http.delete<any>(`${this.favoriteUrl}/remove`, {
      body: payload,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
