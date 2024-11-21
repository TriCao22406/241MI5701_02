import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';
import { RatingComponent } from '../rating/rating.component';
import { forkJoin, Observable } from 'rxjs';
import { ProductService } from '../../../service/product.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

interface Product {
  productName: string;
  // Define other fields if needed
}

@Component({
  selector: 'app-buy-history',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, AccountSidebarComponent, RatingComponent, OrderDetailComponent],
  templateUrl: './buy-history.component.html',
  styleUrls: ['./buy-history.component.css'],
  animations: [
    trigger('slideTransition', [
      // Animation for the selected order sliding in
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('buyHistoryTransition', [
      // Animation for buy history sliding back in
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})


export class BuyHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  selectedOrderDetail: any = null;
  uniqueProducts: any[] = []; // Variable to store unique products

  constructor(
    private orderService: OrderService,
    private productService: ProductService) { }

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

  openRating(order: any): void {
    if (order.status === 'Đã hoàn thành') {
      this.selectedOrder = order;
      this.selectedOrderDetail = null;
      this.computeUniqueProducts(); // Compute unique products for the selected order
    } else {
      alert("This order is not eligible for rating.");
    }
  }

  openDetail(order: any): void {
    this.selectedOrderDetail = order;
  }

  closeRating(): void {
    this.selectedOrder = null;
  }

  closeDetail(): void {
    this.selectedOrderDetail = null;
  }

  onBackToBuyHistory(): void {
    this.selectedOrder = null;
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

  // Method to compute unique products
  computeUniqueProducts(): void {
    if (this.selectedOrder && this.selectedOrder.orderDetail) {
      const seen = new Set();
      this.uniqueProducts = this.selectedOrder.orderDetail.filter((product: any) => {
        const productCode = product.productId.productCode;
        if (seen.has(productCode)) {
          return false;
        }
        seen.add(productCode);
        return true;
      });
    } else {
      this.uniqueProducts = [];
    }
  }
}
