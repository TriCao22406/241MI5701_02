import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent implements OnInit{

  years: number[] = [];
  months: number[] = [];
  days: number[] = [];

  email: string = '';
  phone: string = '';
  name: string = '';
  year: string = '';
  month: string = '';
  day: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;

  emailError: string = '';
  phoneError: string = '';
  passwordError: string = '';


  private emailInput: Subject<string> = new Subject<string>();
  private phoneInput: Subject<string> = new Subject<string>();

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router
  ) {}

  ngOnInit() {
    this.initializeYears();
    this.initializeMonths();
    this.initializeDays();

  // Kiểm tra tính hợp lệ của email sau khi người dùng dừng nhập
  this.emailInput.pipe(
    debounceTime(500), // Set time
    distinctUntilChanged(), // Kiểm tra chỉ khi giá trị thay đổi
    switchMap((email) => this.authService.checkEmail(email)) // Gọi API để kiểm tra email
  ).subscribe(
    (response: any) => {
      this.emailError = ''; // Không có lỗi
    },
    (error) => {
      this.emailError = 'Email đã được đăng ký'; // Thông báo lỗi nếu email đã tồn tại
    }
  );

  // Kiểm tra tính hợp lệ của số điện thoại sau khi người dùng dừng nhập
  this.phoneInput.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((phone) => this.authService.checkPhone(phone)) // Gọi API để kiểm tra số điện thoại
  ).subscribe(
    (response: any) => {
      this.phoneError = ''; // Không có lỗi
    },
    (error) => {
      this.phoneError = 'Số điện thoại đã được đăng ký'; // Thông báo lỗi nếu số điện thoại đã tồn tại
    }
  );


  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  initializeMonths() {
    for (let month = 1; month <= 12; month++) {
      this.months.push(month);
    }
  }

  initializeDays() {
    for (let day = 1; day <= 31; day++) {
      this.days.push(day);
    }
  }

  onPasswordChange() {
    if (this.password.trim() === '') {
      this.emailError = 'Mật khâủ không được bỏ trống';
    }
    else if (!this.validatePassword(this.password)) {
      this.passwordError = 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm cả chữ cái và số.';
    } else {
      this.passwordError = ''; // Không có lỗi mật khẩu
    }
  }

  onEmailChange() {
    if (this.email.trim() === '') {
      this.emailError = 'Địa chỉ email không được bỏ trống';
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Định dạng email không hợp lệ';
    } else {
      this.emailError = '';
      this.emailInput.next(this.email);
    }
  }


  onPhoneChange() {
    this.phoneInput.next(this.phone);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password);
  }



  onSubmit() {
    // Check điều kiện 
    if (!this.termsAccepted) {
      this.snackBar.open('Bạn phải đồng ý với các điều khoản và điều kiện', 'Đóng', {
        duration: 1000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Mật khẩu và Xác thực mật khẩu không trùng khớp', 'Đóng', {
        duration: 1000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.password.length < 6 || !/\d/.test(this.password) || !/[a-zA-Z]/.test(this.password)) {
      this.snackBar.open('Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm cả chữ cái và số.', 'Đóng', {
        duration: 1000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.emailError || this.phoneError) {
      this.snackBar.open('Email hoặc số điện thoại của bạn không hợp lệ. Vui lòng kiểm tra lại.', 'Đóng', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const dob = `${this.day}/${this.month}/${this.year}`;

    const userData = {
      email: this.email,
      phone: this.phone,
      name: this.name,
      dob: dob,
      password: this.password,
      confirmPassword: this.confirmPassword,
      termsAccepted: this.termsAccepted
    };

    // Gửi OTP và lưu thông tin người dùng tạm thời
    this.sendOtp(userData);

    // // Gọi AuthService để đăng ký người dùng
    // this.authService.registerUser(userData)
    //   .pipe(
    //     catchError((error) => {
    //       this.snackBar.open('Đăng ký thất bại: ' + error, 'Đóng', {
    //         duration: 3000,
    //         panelClass: ['snackbar-error']
    //       });
    //       return throwError(() => new Error('Something went wrong!'));
    //     })
    //   )
    //   .subscribe(
    //     (response: any) => {
    //       this.snackBar.open('Đăng ký thành công!', 'Đóng', {
    //         duration: 3000,
    //         panelClass: ['snackbar-success']
    //       });
    //       console.log(response);

    //       // Điều hướng đến trang OTP sau khi đăng ký thành công
    //       this.router.navigate(['/OptVertify']);
          
    //     },
    //     (error) => {
    //       console.error('Đăng ký thất bại:', error);
    //     }
    //   );

    
  }

  sendOtp(userData: any) {
    this.authService.sendOtp(userData.email)
      .subscribe(
        (response: any) => {
          // Lưu thông tin người dùng vào localStorage để sử dụng ở trang OTP
          localStorage.setItem('userInfo', JSON.stringify(userData));
          console.log('Thông tin người dùng', localStorage)

          this.snackBar.open('OTP đã được gửi thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });

          // Điều hướng đến trang OTP
          this.router.navigate(['/OptVertify']);
        },
        (error) => {
          this.snackBar.open('Gửi OTP thất bại, vui lòng thử lại', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
  }



}
