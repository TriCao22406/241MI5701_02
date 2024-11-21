import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-otp.component.html',
  styleUrl: './login-otp.component.css'
})
export class LoginOtpComponent {
  
  otpCode: string[] = ['', '', '', '', '', ''];
  userInfo: any = {}; // Thông tin người dùng lưu tạm thời sau khi gửi OTP

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Lấy thông tin người dùng từ localStorage hoặc sessionStorage để tiếp tục đăng ký
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      this.userInfo = JSON.parse(userInfoString);
    } else {
      // Nếu không có thông tin người dùng, điều hướng về trang đăng ký
      this.router.navigate(['/signup']);
    }
  }

  // Hàm để di chuyển tới ô tiếp theo
  moveToNext(event: any, index: number) {
    const input = event.target;
    const nextInput = this.otpInputs.toArray()[index + 1];
    const prevInput = this.otpInputs.toArray()[index - 1];

    // Nếu người dùng nhập vào và ô tiếp theo tồn tại
    if (input.value && nextInput) {
      nextInput.nativeElement.focus();
    }

    // Nếu người dùng nhấn phím Backspace và ô trước đó tồn tại
    if (event.inputType === 'deleteContentBackward' && prevInput) {
      prevInput.nativeElement.focus();
    }
  }
  
  // Kiểm tra xem tất cả các ô OTP đã được điền hay chưa
  isOtpFilled(): boolean {
    return this.otpCode.every(code => code !== '');
  }


  // Hàm để tự động chuyển sang ô tiếp theo khi người dùng nhập
  autoMove(index: number) {
    if (this.otpCode[index] && index < this.otpCode.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }



// Hàm xác thực OTP
verifyOtp() {
  const otp = this.otpCode.join('');
  this.authService.verifyOtp(this.userInfo.email, otp)
    .subscribe(
      (response: any) => {
        if (response.success) {
          // Nếu OTP hợp lệ, tiếp tục lưu thông tin người dùng vào cơ sở dữ liệu
          this.createUser();
          // Điều hướng đến trang Home
          this.router.navigate(['/Home']);
        } else {
          this.snackBar.open('Mã OTP không hợp lệ hoặc đã hết hạn', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      },
      (error) => {
        this.snackBar.open('Xác thực OTP thất bại, vui lòng thử lại', 'Đóng', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    );
}

  // Hàm lưu thông tin người dùng vào cơ sở dữ liệu
  createUser() {
    this.authService.registerUser(this.userInfo)
      .subscribe(
        (response: any) => {
          // Lưu token vào sessionStorage và cập nhật trạng thái đăng nhập
          this.authService.setToken(response.token, response.userId);

          this.snackBar.open('Đăng ký thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          // Điều hướng đến trang Home sau khi đăng ký thành công
          this.router.navigate(['/home']);
        },
        (error) => {
          this.snackBar.open('Đăng ký thất bại: ' + error, 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
  }

  // Hàm gửi lại OTP
  resendOtp() {
    // Logic gửi lại OTP
    this.authService.sendOtp(this.userInfo.email)
      .subscribe(
        (response: any) => {
          this.snackBar.open('OTP đã được gửi lại thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        (error) => {
          this.snackBar.open('Không thể gửi lại OTP, vui lòng thử lại', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      );
  }

  // Hàm nhận OTP qua điện thoại
  getOtpViaPhone() {
    console.log('Nhận mã OTP qua điện thoại');
    // Thêm logic nhận OTP qua điện thoại ở đây
  }

}
