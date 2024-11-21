import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productData: { userId: string, productId: string, quantity: number, size: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, productData);
  }

  // Lấy giỏ hàng của người dùng
  getCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateProductQuantity(productData: { userId: string, itemid:string , productId: string, quantity: number, size: string }): Observable<any> {
    console.log(productData)
    return this.http.put<any>(`${this.baseUrl}/updateQuantity`, productData);
  }


  // Cập nhật kích cỡ sản phẩm trong giỏ hàng
  updateProductSize(productData: { userId: string, productId: string, oldSize: string, newSize: string }): Observable<any> {
    console.log('Sản phẩm update', productData)
    return this.http.put<any>(`${this.baseUrl}/updateSize`, productData);
  }
  
  // // Xóa sản phẩm khỏi giỏ hàng
  // removeFromCart(userId: string, productId: string, size: string): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/remove`, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     body: { userId, productId, size }
  //   });
  // }
  // Thêm hàm xóa sản phẩm khỏi giỏ hàng
  removeFromCart(userId: string, itemid: string): Observable<any> {
  // Gọi API DELETE, truyền `userId` và `cartid` trong body
  const payload = {
    "userId": userId,
    "itemId": itemid
  };
  console.log(payload)
  return this.http.delete<any>(`${this.baseUrl}/remove`, { body: payload });
  }


  deleteCart(userId: string): Observable<void> {  
    const token = sessionStorage.getItem('authToken');  // Get token from session storage
    const headers = {
      'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
    };
    return this.http.delete<void>(`${this.baseUrl}/removeCart/${userId}`, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Lỗi phía server
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
  



}



