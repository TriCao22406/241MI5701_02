import { Component } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-order.component.html',
  styleUrl: './search-order.component.css'
})
export class SearchOrderComponent {
  orders: any[] = [];
  uniqueProducts: any[] = []; // Variable to store unique products

  constructor(
    private orderService: OrderService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId'); // Fetch userId from session storage

    if (userId) {
      this.orderService.getOrders(userId).subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (err) => {
          console.error('Error reading file:', err);
        },
      });
    } 
  }

  searchOrder(orderId: string): void {
    if (!orderId) {
      console.error('Order ID is required.');
      return;
    }
  
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        // Check if the order is already in the list
        const isOrderExists = this.orders.some((existingOrder) => existingOrder._id === order._id);
  
        if (!isOrderExists) {
          // Append the order to the orders list
          this.orders.push(order);
        } else {
          console.warn('Order is already in the list.');
        }
      },
      error: (err) => {
        console.error('Error fetching order by ID:', err);
      },
    });
  }
  


  getCombinedOrderDetails(orderDetails: any[]): any[] {
    const detailMap = new Map();

    orderDetails.forEach((detail: any) => {
      const productCode = detail.productId.productCode;

      if (detailMap.has(productCode)) {
        detailMap.get(productCode).quantity += detail.quantity;
      } else {
        // Clone the object to avoid modifying the original array
        detailMap.set(productCode, { ...detail });
      }
    });

    // Convert the map values back to an array
    return Array.from(detailMap.values());
  }
}
