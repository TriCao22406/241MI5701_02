import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, AccountSidebarComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() productCode!: string; // Use @Input to accept productCode
  @Output() backToBuyHistory: EventEmitter<void> = new EventEmitter<void>();

  product: any = {};
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.productCode) {
      this.productService.getProductByCode(this.productCode).subscribe(data => {
        this.product = data;
      });
    }

  }

  rateProduct(star: number): void {
    this.rating = star;
  }

  setRating(star: number): void {
    this.rating = star;
  }
  
  goBack(): void {
    // Implement navigation back
  }

  submitReview(): void {
    // Implement review submission logic
  }

  
  onGoBack(): void {
    this.backToBuyHistory.emit(); // Emit the event
  }
}
