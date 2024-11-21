import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderURL = "http://localhost:3000/orders"

  constructor(private http: HttpClient) { }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.orderURL}/order/${orderId}`)
      .pipe(
        retry(1), // Retry the request once if it fails
        catchError(this.handleError) // Handle errors if any
      );
  }

  getOrders(userId: string): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Get the token from sessionStorage
    const headers = {
      'Authorization': `Bearer ${token}` // Attach the token to the request headers
    };

    // Make the GET request with the token in the headers
    return this.http.get<any>(`${this.orderURL}/${userId}`, { headers })
      .pipe(
        retry(1), // Retry the request once if it fails
        catchError(this.handleError) // Handle errors if any
      );
  }



  saveOrder(order: any): Observable<any> {
    return this.http.post(this.orderURL, order);
  }


  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
