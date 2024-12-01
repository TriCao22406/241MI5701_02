import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private orderUrl = 'http://localhost:3000/orders'

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.orderUrl);
  }
  
}
