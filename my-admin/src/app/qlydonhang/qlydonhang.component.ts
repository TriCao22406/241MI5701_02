import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../service/orders.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-qlydonhang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qlydonhang.component.html',
  styleUrl: './qlydonhang.component.css'
})
export class QlydonhangComponent implements OnInit{
  orders: any[] = [];

  constructor(
    private orderService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((data: any[]) => {
      this.orders = data;
      console.log(this.orders)
    })

  }

  calculateTotalQuantity(orderDetails: any[]): number {
    return orderDetails.reduce((total, detail) => total + detail.quantity, 0);
  }
}
