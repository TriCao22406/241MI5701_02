import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  @Input() isPage: boolean = true;

  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Thuộc tính để lưu thông báo lỗi

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.email && this.password) {
      this.authService.loginUser(this.email, this.password).subscribe({
        next: (response) => {
          if (response && response.token) {
            // Đăng nhập thành công, lưu token
            this.authService.setToken(response.token, response.userId);
            console.log('Đăng nhập thành công!', response);
            // Điều hướng tới trang sản phẩm hoặc trang chính
            this.router.navigate(['/Home']);
          } else {
            this.errorMessage =
              'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập.'; // Hiển thị lỗi
          }
        },
        error: (error) => {
          console.error('Đăng nhập thất bại', error);
          this.errorMessage =
            'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập.'; // Hiển thị lỗi
        },
      });
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin đăng nhập.'; // Hiển thị lỗi nếu thông tin không đầy đủ
    }

  }  

}
