import { Component, OnInit } from '@angular/core';
import {
  AccountSidebar,
  AccountSidebarComponent,
} from '../account-sidebar/account-sidebar.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [AccountSidebarComponent, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  AccountSidebar: any = AccountSidebar;
  userId: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordError: string = '';

  error: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  } = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId') as string;
  }

  handleChangePassword(FormChangPassword: NgForm) {
    if (FormChangPassword.invalid) {
      this.error = {
        currentPassword: this.currentPassword ? '' : 'Vui lòng nhập mật khẩu',
        newPassword: this.newPassword ? '' : 'Vui lòng nhập mật khẩu',
        confirmNewPassword: this.confirmNewPassword
          ? ''
          : 'Vui lòng nhập mật khẩu',
      };
    } else {
      if (this.newPassword.length < 6) {
        this.passwordError = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.error = {
          ...this.error,
          confirmNewPassword: 'Vui lòng nhập đúng mật khẩu mới',
        };
      } else {
        this.authService
          .changePassword({
            userId: this.userId,
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          })
          .subscribe({
            next: (response) => {
              this.snackBar.open('Đổi mật khẩu thành công', 'Đóng', {
                duration: 3000,
              });
              this.currentPassword = '';
              this.confirmNewPassword = '';
              this.newPassword = '';
              this.error = {
                confirmNewPassword: '',
                newPassword: '',
                currentPassword: '',
              };
            },
            error: (error) => {
              if (error.error.status === 409) {
                this.error = {
                  ...this.error,
                  currentPassword:
                    'Nhập khẩu hiện tại không đúng, vui lòng nhập lại',
                };
              }
            },
          });
      }
    }
  }
  handleChangeCurrentPassword() {
    this.error.currentPassword = '';
  }
  handleChangeNewPassword() {
    this.error.newPassword = '';
  }
  handleChangeConfirmNewPassword() {
    this.error.confirmNewPassword = '';
  }
}
