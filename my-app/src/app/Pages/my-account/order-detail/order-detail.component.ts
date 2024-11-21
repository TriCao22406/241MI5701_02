import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CeilPipe } from '../../../pipe/ceil.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CeilPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  @Input() selectedOrder: any; // Ensure this is declared
  @Output() openRating = new EventEmitter<any>(); // Event emitter to notify parent when "Đánh giá" is clicked

  ngOnInit(): void {
    console.log('Order Details:', this.selectedOrder); // Debugging
  }

  onRateClick() {
    this.openRating.emit(this.selectedOrder);  // Emit selected order
  }

  statuses: string[] = [
    'chờ xác nhân',
    'Đang chuẩn bị hàng',
    'Đang giao hàng',
    'Giao hàng thành công',
    'Đã hoàn thành'
];

statusOrderIndex(status: string): number {
    return this.statuses.indexOf(status);
}


}
