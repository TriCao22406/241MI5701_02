import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-admin';

  constructor(private router: Router) {}

  // Hàm logout để đăng xuất người dùng
  logout() {
    // Xóa token khỏi sessionStorage 
    sessionStorage.removeItem('token');

    // Chuyển hướng về trang đăng nhập
    this.router.navigate(['/login']);
  }
  
}
