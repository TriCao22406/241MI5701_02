import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  
  // Kiểm tra token trong sessionStorage
  const token = sessionStorage.getItem('token');

  if (token) {
    // Nếu có token, cho phép truy cập
    return true;
  } else {
    // Nếu không có token và đang cố truy cập trang khác ngoài /login, chuyển hướng đến /login
    if (state.url !== '/login') {
      router.navigate(['/login']);
    }
    return false;
  }
};
