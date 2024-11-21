import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product.service';
import { Product } from '../productdetail/productdetail.component';
import { LoginPageComponent } from '../../Login_Signup/login-page/login-page.component';

import { Router } from '@angular/router';
@Component({
  selector: 'app-favorite-product',
  standalone: true,
  imports: [CommonModule, LoginPageComponent],
  templateUrl: './favorite-product.component.html',
  styleUrl: './favorite-product.component.scss',
})
export class FavoriteProductComponent implements OnInit {
  [x: string]: any;
  userId: string | null = null;
  favoriteProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập
    this.authService.loggedInStatus.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage khi đã đăng nhập
        this.loadCartFromBackend(); // Nếu người dùng đã đăng nhập, lấy giỏ hàng từ backend
      } else {
        this.loadCartFromLocalStorage();
        // Nếu không, lấy giỏ hàng từ localStorage
      }
    });
  }

  // Lấy giỏ hàng từ Backend
  async loadCartFromBackend(): Promise<void> {
    if (this.userId) {
      this.productService.getAllProductFavorite(this.userId).subscribe(
        (data) => {
          console.log(data);
          this.favoriteProducts = data.products;
        },
        (error) => {
          this.favoriteProducts = [];
          console.error('Lỗi khi lấy mục yêu thích từ Backend:', error);
        }
      );
    }
  }

  // Lấy giỏ hàng từ localStorage nếu người dùng chưa đăng nhập (lấy từ file productdetail.ts )
  loadCartFromLocalStorage(): void {
    const favoriteData = localStorage.getItem('favorite');
    if (favoriteData) {
      this.favoriteProducts = JSON.parse(favoriteData);
    } else {
      this.favoriteProducts = [];
    }
  }
  goToProductDetail(productCode: string) {
    this.router.navigate(['/Products', productCode]);
  }

  handleDeleteFavorite(product: Product): void {
    this.favoriteProducts = this.favoriteProducts.filter(
      (item) => item._id !== product._id
    );
    if (this.userId) {
      // Xử lý với API
      this.productService
        .removefavoriteProduct({ userId: this.userId, productId: product._id })
        .subscribe(
          () => console.log('Đã xóa sản phẩm khỏi mục yêu thích backend'),
          (error) =>
            console.error(
              'Lỗi khi xóa sản phẩm khỏi mục yêu thích trên backend:',
              error
            )
        );
    } else {
      localStorage.setItem('favorite', JSON.stringify(this.favoriteProducts));
    }
  }
}
