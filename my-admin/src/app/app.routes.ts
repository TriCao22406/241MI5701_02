import { Routes } from '@angular/router';
import { QlsanphamComponent } from './qlsanpham/qlsanpham.component';
import { QlytaikhoanComponent } from './qlytaikhoan/qlytaikhoan.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './service/auth.guard'; 
import { ThemsanphamComponent } from './themsanpham/themsanpham.component';
import { QlydonhangComponent } from './qlydonhang/qlydonhang.component';

export const routes: Routes = [
    { path: '', redirectTo: '/Login', pathMatch: 'full' }, // Đường dẫn mặc định
    { path: 'Login', component: LoginComponent }, // Trang đăng nhập
    { 
        path: 'Quan-ly-san-pham', 
        component: QlsanphamComponent, 
        canActivate: [authGuard] // Bảo vệ trang bằng AuthGuard
    },
    { 
        path: 'Quan-ly-tai-khoan', 
        component: QlytaikhoanComponent, 
        canActivate: [authGuard] // Bảo vệ trang bằng AuthGuard
    },
    { 
        path: 'Quan-ly-don-hang', 
        component: QlydonhangComponent, 
        canActivate: [authGuard] // Bảo vệ trang bằng AuthGuard
    },
    { 
        path: 'Quan-ly-san-pham/Them-san-pham', 
        component: ThemsanphamComponent, 
        canActivate: [authGuard] // Bảo vệ trang bằng AuthGuard
    },
    { path: '**', redirectTo: '/Login' } // Xử lý các đường dẫn không hợp lệ
];

