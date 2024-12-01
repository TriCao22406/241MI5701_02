import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {
    // Kiểm tra thông tin đăng nhập (ở đây đang dùng thông tin tĩnh)
    if (this.username.trim() === 'admin' && this.password.trim() === '123456') {
      // Lưu token vào sessionStorage 
      sessionStorage.setItem('token', 'admin-token');
      // Điều hướng đến trang quản lý sản phẩm sau khi đăng nhập thành công
      console.log("Admin đăng nhập thành công!")
      this.router.navigate(['/Quan-ly-san-pham']);
    } else {
      // Thông báo lỗi nếu tên đăng nhập hoặc mật khẩu không chính xác
      console.log("Erorr")
      this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
    }
  }

  forgotPassword() {
    // Chưa xử lý 
    alert('Chức năng quên mật khẩu chưa được triển khai. Vui lòng liên hệ quản trị viên.');
  }

  register() {
    // Chuyển hướng người dùng đến trang đăng ký
    alert('Chức năng đăng ký chưa được triển khai. Vui lòng liên hệ quản trị viên.');
    this.router.navigate(['/register']);
  }

}
