import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../service/products.service';

@Component({
  selector: 'app-themsanpham',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './themsanpham.component.html',
  styleUrls: ['./themsanpham.component.css']
})
export class ThemsanphamComponent implements OnInit{
  
  // Khai báo các biến để dùng với form
  productName: string = '';
  productType: string = '';
  material: string = '';
  price: number | null = null;
  discount: number | null = null;
  productCode: string = '';
  productDetails: string = '';
  description: string = '';
  productCollection: string = '';
  sizes: { size: number | null; quantity: number | null }[] = [];
  images: string[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

  }

  // Hàm để thêm sản phẩm mới
  addProduct(): void {
    if (this.productName && this.productType && this.material && this.price !== null && this.discount !== null && this.productCode) {
      const newProduct = {
        productName: this.productName,
        productType: this.productType,
        material: this.material,
        price: this.price,
        discount: this.discount,
        productCode: this.productCode,
        productDetails: this.productDetails,
        description: this.description,
        productCollection: this.productCollection,
        sizes: this.sizes,
        images: this.images
      };

      // Gửi sản phẩm tới API qua ProductService
      this.productService.addProduct(newProduct).subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          alert('Sản phẩm đã được thêm thành công!');
          // Reset form sau khi thêm sản phẩm thành công
          this.resetForm();
        },
        (error) => {
          console.error('Failed to add product:', error);
          alert('Không thể thêm sản phẩm. Vui lòng thử lại!');
        }
      );
    } else {
      console.error('Vui lòng điền đủ thông tin trước khi thêm sản phẩm!');
      alert('Vui lòng điền đủ thông tin trước khi thêm sản phẩm!');
    }
  }

  // Hàm để reset form về trạng thái ban đầu
  resetForm(): void {
    this.productName = '';
    this.productType = '';
    this.material = '';
    this.price = null;
    this.discount = null;
    this.productCode = '';
    this.productDetails = '';
    this.description = '';
    this.productCollection = '';
    this.sizes = [];
    this.images = [];
  }

  // Hàm để thêm kích thước sản phẩm mới
  addSize(): void {
    this.sizes.push({ size: null, quantity: null });
  }

  // Hàm để xóa kích thước sản phẩm
  removeSize(index: number): void {
    if (index > -1) {
      this.sizes.splice(index, 1);
    }
  }

  // Hàm để thêm hình ảnh sản phẩm mới
  addImage(): void {
    this.images.push('');
  }

  // Hàm để xóa hình ảnh sản phẩm
  removeImage(index: number): void {
    if (index > -1) {
      this.images.splice(index, 1);
    }
  }
}