import { Component, OnInit,  ViewChild } from '@angular/core';
import { ProductService } from '../service/products.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Product {
  _id: string;
  productName: string;
  productType: string;
  material: string;
  price: number;
  discount: number;
  productCode: string;
  sizes: { size: number; quantity: number }[];
  productNameEnglish?: string;
  productDetails?: string;
  productDetailsEnglish?: string;
  description?: string;
  productCollection?: string;
  images?: string[];
  materialFilter?: string;
  priceUSD?: string;
  totalQuantity: number; 
}

@Component({
  selector: 'app-qlsanpham',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qlsanpham.component.html',
  styleUrl: './qlsanpham.component.css'
})



export class QlsanphamComponent implements OnInit{

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  // productToEdit: Product | null = null;
  sortDirection: { [key: string]: boolean } = {
    price: true,
    inventory: true
  };

  constructor(private productService: ProductService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data.map(product => {
          const totalQuantity = product.sizes.reduce((acc, size) => acc + (size.quantity || 0), 0);
          return {
            ...product,
            totalQuantity: totalQuantity
          };
        });
        this.filteredProducts = [...this.products];
      },
      error => {
        console.error('Failed to load products', error);
      }
    );
  }

  onDetail(product: Product): void {
    this.selectedProduct = product; // Lưu sản phẩm đã chọn
  }

  closeDetail(): void {
    this.selectedProduct = null; // Đóng sản phẩm chi tiết
  }

  // Hàm sắp xếp sản phẩm theo giá hoặc tồn kho
  sortProducts(criteria: string): void {
    // Đảo ngược hướng sắp xếp
    this.sortDirection[criteria] = !this.sortDirection[criteria];

    if (criteria === 'price') {
      // Sắp xếp theo giá tăng dần hoặc giảm dần dựa vào `sortDirection`
      this.filteredProducts.sort((a, b) => 
        this.sortDirection[criteria] ? a.price - b.price : b.price - a.price
      );
    } else if (criteria === 'inventory') {
      // Sắp xếp theo tồn kho tăng dần hoặc giảm dần dựa vào `sortDirection`
      this.filteredProducts.sort((a, b) => 
        this.sortDirection[criteria] ? a.totalQuantity - b.totalQuantity : b.totalQuantity - a.totalQuantity
      );
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    this.filteredProducts = this.products.filter(product =>
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Hàm để chỉnh sửa thông tin sản phẩm
  onEditProduct(product?: Product): void {
    alert("Tính năng chưa được cập nhật")
  }

  // Hàm để lưu chỉnh sửa sản phẩm
  saveEditedProduct(): void {
    alert("Tính năng chưa được cập nhật")
    }


  onAddProduct(): void {
    // Chuyển hướng đến trang thêm sản phẩm
    this.router.navigate(['/Quan-ly-san-pham/Them-san-pham']);
  }
  



}
