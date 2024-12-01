import { Component, OnInit } from '@angular/core';
import { UsersService } from '../service/users.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Thêm FormsModule
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef

@Component({
  selector: 'app-qlytaikhoan',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Thêm FormsModule vào đây
  templateUrl: './qlytaikhoan.component.html',
  styleUrl: './qlytaikhoan.component.css'
})
export class QlytaikhoanComponent implements OnInit{

  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  deleteMessage: string = '';  // Thêm biến để lưu thông báo xóa
  selectedUser: any = null;  // Lưu thông tin người dùng đang chỉnh sửa

  constructor(
    private userService: UsersService, 
    private router: Router,
    private cdr: ChangeDetectorRef  
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
      this.filteredUsers = data;  
    });
  }

  // Tìm kiếm người dùng bằng Email, Số điện thoại, hoặc Tên
  onSearch(): void {
    if (this.searchQuery) {
      this.filteredUsers = this.users.filter(user => 
        (user.phone && user.phone.toLowerCase().includes(this.searchQuery.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    } else {
      this.filteredUsers = [...this.users];
    }

    this.cdr.detectChanges();
  }



  // Xóa người dùng
  deleteUser(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(user => user._id !== id);
        this.filteredUsers = this.filteredUsers.filter(user => user._id !== id);

        // Hiển thị thông báo xóa thành công
        this.deleteMessage = 'Xóa thành công!';
        
        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
          this.deleteMessage = '';
        }, 3000);
      });
    }
  }

// Chỉnh sửa người dùng
editUser(user: any): void {
  console.log(user)
  this.selectedUser = { ...user }; // Tạo bản sao thông tin người dùng để chỉnh sửa
}

// Hủy chỉnh sửa
cancelEdit(): void {
  this.selectedUser = null; // Hủy bỏ việc chỉnh sửa
}

saveUser(): void {
  if (this.selectedUser) {
    this.userService.updateUser(this.selectedUser._id, this.selectedUser).subscribe(
      () => {
        const index = this.users.findIndex(user => user._id === this.selectedUser._id);
        if (index > -1) {
          this.users[index] = { ...this.selectedUser };
          this.filteredUsers[index] = { ...this.selectedUser };
        }
        // Đặt lại `selectedUser` và hiển thị thông báo
        this.selectedUser = null;
        alert('Cập nhật thông tin người dùng thành công!');
      },
      (error) => {
        // Xử lý khi API trả về lỗi
        if (error.status === 400 && error.error && error.error.message) {
          // Nếu lỗi là "Số điện thoại đã được sử dụng bởi người dùng khác."
          if (error.error.message.includes('Số điện thoại đã được sử dụng bởi người dùng khác')) {
            alert('Số điện thoại đã được đăng ký bởi người dùng khác.');
          } else {
            alert('Đã xảy ra lỗi: ' + error.error.message);
          }
        } else {
          alert('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
        }
      }
    );
  }
}


}
