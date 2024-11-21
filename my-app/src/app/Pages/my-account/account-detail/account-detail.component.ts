import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css'
})
export class AccountDetailComponent {

  userInfo: any = {}; // Object to hold user data

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId'); // Fetch userId from session storage
    if (userId) {
      this.authService.getUserInfo(userId).subscribe({
        next: (data) => {
          this.userInfo = data; // Assign fetched data to userInfo
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        }
      });
    }
  }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectedGender: string = '';

  onGenderChange() {
    console.log(`Selected Gender: ${this.selectedGender}`);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size <= 1048576 && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      this.selectedFile = file;

      // Display preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG or JPEG image under 1MB.');
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.uploadImage();
    }
    this.saveUserInfo();
  }

  saveUserInfo(): void {
    // console.log('User info saved:', this.user);
  }

  uploadImage(): void {
    console.log('File uploaded:', this.selectedFile);
  }
}
