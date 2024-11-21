import { Injectable } from '@angular/core';
import {
  catchError,
  Observable,
  retry,
  throwError,
  BehaviorSubject,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // User API
  userAPI: string = 'http://localhost:3000/users';

  constructor(private _http: HttpClient) {}

  // Kiểm tra email có tồn tại hay không
  checkEmail(email: string): Observable<any> {
    return this._http.post<any>(`${this.userAPI}/signup/check-email`, { email })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Kiểm tra số điện thoại có tồn tại hay không (giả sử API có đường dẫn tương tự)
  checkPhone(phone: string): Observable<any> {
    return this._http.post<any>(`${this.userAPI}/signup/check-phone`, { phone })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Đăng ký người dùng mới
  registerUser(userData: any): Observable<any> {
    return this._http.post<any>(`${this.userAPI}/signup`, userData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  //Check OTP 
  sendOtp(email: string) {
    return this._http.post('http://localhost:3000/otp/send-otp', { email });
  }

  verifyOtp(email: string, otp: string) {
    return this._http.post('http://localhost:3000/otp/verify-otp', { email, otp });
  }

  // BehaviorSubject để quản lý trạng thái đăng nhập
  private loggedIn = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  loggedInStatus = this.loggedIn.asObservable();

  // Post API để kiểm tra đăng nhập
  loginUser(email: string, password: string): Observable<any> {
    const body = { "email": email, "password": password };
    console.log(body)
    return this._http.post<any>(`${this.userAPI}/login`, body)
      .pipe(
        retry(1), // Thử lại một lần nếu có lỗi xảy ra
        catchError(this.handleError) // Xử lý lỗi
      );
  }

  // Sử dụng sessionStorage để lưu token thay vì localStorage
  setToken(token: string, userId: string): void {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userId', userId);
    this.loggedIn.next(true); 

    console.log('Da loginnnn');
  }

  // Kiểm tra trạng thái đăng nhập
  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('authToken') !== null;
  }

  // Xóa token khi người dùng đăng xuất
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    this.loggedIn.next(false); // Cập nhật trạng thái đăng xuất
    console.log('Da dang xuat');
  }

  // Lấy thông tin người dùng từ server
  getUserInfo(userId: string): Observable<any> {
    const token = sessionStorage.getItem('authToken');  // Get token from session storage
    const headers = {
      'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
    };

    return this._http.get<any>(`${this.userAPI}/${userId}`, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }



  
  // change password
  changePassword(payload: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }) {
    return this._http.post<any>(`${this.userAPI}/changepsw`, payload);
  }

  // Hàm xử lý lỗi
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Lỗi phía server
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('authToken'); // Get token from storage
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}