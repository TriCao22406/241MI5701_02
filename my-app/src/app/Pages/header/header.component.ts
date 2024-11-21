import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Lắng nghe sự thay đổi trạng thái đăng nhập từ AuthService
    this.authService.loggedInStatus.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  onLogout(): void {
    this.authService.logout(); // Đăng xuất và cập nhật trạng thái đăng nhập
    window.location.reload();  // Reload lại trang sau khi đăng xuất
  }

   // Phương thức điều hướng tới trang giỏ hàng
   goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToDiscountedProducts() {
    this.router.navigate(["/Sales-Off"], {
      queryParams: {
        discount: true
      }
    });
  }

}
