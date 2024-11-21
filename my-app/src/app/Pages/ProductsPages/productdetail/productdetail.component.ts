import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth.service';
import { GuideBracelet, GuideNecklace, GuideRing } from '../../../../assets/data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CeilPipe } from '../../../pipe/ceil.pipe';
import { addToFavoritesLocalStorage } from '../../../../utils/product';

// Định nghĩa interface Product để mô tả cấu trúc của đối tượng sản phẩm
export interface Product {
  _id: string;
  images: string[];
  productName: string;
  material: string;
  price: number;
  productType: string;
  materialfilter: string;
  productCollection: string;
  productDetails: string;
  productCode: string;
  description: string;
  priceUSD: string;
  discount: number;
  sizes: { size: string; quantity: number }[];
}

interface ProductData {
  productId: string;
  productName: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  sizes: any[];
  productCode: string;
  cartid?: string; // Định nghĩa thêm cartid
}

// khai báo enum cho productType
enum ProductType {
  Nhan = 'Nhẫn',
  Vongtay = 'Vòng tay',
  VongCo = 'Vòng cổ',
}

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CeilPipe],
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css'],
})
export class ProductdetailComponent implements OnInit {
  // Biến product dùng để lưu trữ thông tin sản phẩm hiện tại
  product: Product | null = null;

  // Mảng lưu trữ các chi tiết sản phẩm sau khi tách từ chuỗi productDetails
  productDetailsList: string[] = [];

  // Thêm biến để lưu trữ thông báo lỗi khi chưa chọn kích cỡ
  sizeError: string = '';

  // Biến để quản lý số lượng và kích thước được chọn
  quantity: number = 1;
  selectedSize: string = '';
  selectedImageIndex: number = 0; // Index của hình ảnh đang được hiển thị

  // Biến đề quản lý cách đo size
  currentGuide: any;

  // Inject ActivatedRoute để lấy thông tin từ URL và ProductService để gọi API lấy thông tin sản phẩm
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  // Hàm ngOnInit được gọi khi component khởi tạo
  ngOnInit(): void {
    // Lấy 'productCode' từ tham số route để xác định sản phẩm cần hiển thị
    const productCode = this.route.snapshot.paramMap.get('productCode');

    // Kiểm tra nếu 'productCode' tồn tại thì gọi ProductService để lấy thông tin sản phẩm
    if (productCode) {
      this.productService.getProductByCode(productCode).subscribe((data) => {
        this.product = data; // Gán dữ liệu sản phẩm vào biến 'product'
        console.log(this.product); // Ghi ra console để kiểm tra thông tin sản phẩm

        // Nếu productDetails có giá trị, tách chuỗi thành mảng các chi tiết
        if (this.product && this.product.productDetails) {
          this.productDetailsList = this.product.productDetails
            .split(/\r?\n/) // Tách chuỗi dựa trên ký tự xuống dòng (hỗ trợ cả Windows và Unix)
            .map((detail) => detail.trim().replace(/^\.\s*/, '')) // Loại bỏ dấu chấm và khoảng trắng ở đầu mỗi dòng
            .filter(
              (detail) =>
                detail !== '' &&
                !detail.toLowerCase().includes('product number')
            ); // Lọc bỏ các chi tiết trống và những dòng có chứa 'Product number'
        }
      });
    }
  }

  // Hàm giảm giá
  getDiscountedPrice(product: any): number {
    return product.price / (1 - product.discount / 100);
  }

  // Các hàm quản lý số lượng, thêm vào giỏ hàng, yêu thích, mua ngay, v.v.
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    // Kiểm tra số lượng còn lại của kích cỡ được chọn và không cho phép tăng nếu đạt số lượng tối đa
    const maxQuantity = this.getSelectedSizeQuantity();
    if (this.quantity < maxQuantity) {
      this.quantity++;
    }
  }

  getSelectedSizeQuantity(): number {
    if (this.product && this.selectedSize) {
      const selectedSizeObject = this.product.sizes.find(
        (size) => size.size === this.selectedSize
      );
      return selectedSizeObject ? selectedSizeObject.quantity : 0;
    }
    return 0;
  }

  // addToCart(): void {
  //   if (!this.selectedSize) {
  //     this.sizeError = 'Vui lòng chọn size phù hợp';
  //   } else if (this.product && this.selectedSize && this.getSelectedSizeQuantity() > 0) {
  //     this.sizeError = ''; // Xóa thông báo lỗi nếu đã chọn kích cỡ
  //     console.log(`Thêm sản phẩm vào giỏ: ${this.product.productName}, Số lượng: ${this.quantity}, Kích cỡ: ${this.selectedSize}`);
  //     // Logic thêm sản phẩm vào giỏ hàng
  //   } else {
  //     console.error('Sản phẩm không tồn tại hoặc kích cỡ đã hết hàng!');
  //   }
  // }

  addToCart(): void {
    if (!this.selectedSize) {
      this.sizeError = 'Vui lòng chọn size phù hợp';
      this.snackBar.open('Vui lòng chọn size phù hợp', 'Đóng', {
        duration: 3000,
      });
    } else if (
      this.product &&
      this.selectedSize &&
      this.getSelectedSizeQuantity() > 0
    ) {
      this.sizeError = '';
      // Lưu lại thông tin từ productdetail
      const productData: ProductData = {
        productId: this.product._id,
        productName: this.product.productName,
        price: this.product.price,
        size: this.selectedSize,
        quantity: this.quantity,
        image: this.product.images[0],
        sizes: this.product.sizes,
        productCode: this.product.productCode,
      };

      if (this.authService.isUserLoggedIn()) {
        // Người dùng đã đăng nhập
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const cartData = {

            userId: userId,
            ...productData,
          };

          this.cartService.addToCart(cartData).subscribe({
            next: (response) => {
              console.log('Thêm vào giỏ hàng thành công:', response);
              this.snackBar.open('Sản phẩm đã được thêm vào giỏ hàng', 'Đóng', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error('Thêm vào giỏ hàng thất bại:', error);
              this.snackBar.open(
                'Thêm vào giỏ hàng thất bại, vui lòng thử lại',
                'Đóng',
                {
                  duration: 3000,
                }
              );
            },
          });
        } else {
          console.error('Lỗi: Không tìm thấy userId');
          this.snackBar.open('Lỗi: Không tìm thấy người dùng', 'Đóng', {
            duration: 3000,
          });
        }
      } else {
        // Người dùng chưa đăng nhập, lưu vào localStorage
        let cart = sessionStorage.getItem('cart');
        let cartProducts: any[] = cart ? JSON.parse(cart) : [];

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa, nếu có thì cập nhật số lượng
        const existingProductIndex = cartProducts.findIndex(
          (p) =>
            p.productId === productData.productId && p.size === productData.size
        );
        if (existingProductIndex > -1) {
          cartProducts[existingProductIndex].quantity += productData.quantity;
        } else {
          // Thêm cartid cho sản phẩm mới
          productData.cartid = this.generateCartId();
          cartProducts.push(productData);
        }

        sessionStorage.setItem('cart', JSON.stringify(cartProducts));
        console.log('Sản phẩm đã được thêm vào giỏ hàng trong localStorage.', productData);
        this.snackBar.open('Sản phẩm đã được thêm vào giỏ hàng', 'Đóng', {
          duration: 3000,
        });
      }
    } else {
      console.error('Sản phẩm không tồn tại hoặc kích cỡ đã hết hàng!');
      this.snackBar.open(
        'Sản phẩm không tồn tại hoặc kích cỡ đã hết hàng!',
        'Đóng',
        {
          duration: 3000,
        }
      );
    }
  }

  // Hàm tạo cartid
  generateCartId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  


  addToFavorites(): void {
    if (this.product) {
      if (this.authService.isUserLoggedIn()) {
        // Người dùng đã đăng nhập
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const favoriteData = {
            userId: userId,
            productId: this.product._id,
          };
          this.productService.addFavoriteProduct(favoriteData).subscribe({
            next: (response) => {
              console.log('Thêm vào mục yêu thích thành công:', response);
              this.snackBar.open(
                'Sản phẩm đã được thêm vào mục yêu thích',
                'Đóng',
                {
                  duration: 3000,
                }
              );
            },
            error: (error) => {
              console.error('Thêm vào mục yêu thích thất bại:', error);
              this.snackBar.open(error.error.message, 'Đóng', {
                duration: 3000,
              });
            },
          });
        } else {
          console.error('Lỗi: Không tìm thấy userId');
        }
        //Người dùng chưa đăng nhập
      } else {
        addToFavoritesLocalStorage(this.product);
        this.snackBar.open('Đã thêm vào mục yêu thích', 'Đóng', {
          duration: 3000,
        });
      }
    } else {
      console.error('Sản phẩm không tồn tại!');
    }
  }

  buyNow(): void {
    if (!this.selectedSize) {
      this.sizeError = 'Vui lòng chọn size phù hợp';
    } else if (this.product && this.selectedSize && this.getSelectedSizeQuantity() > 0) {
      this.sizeError = ''; // Clear error message
  
      // Add quantity and size directly to the product
      const productWithDetails = {
        ...this.product, // Spread the original product properties
        quantity: this.quantity, // Add quantity
        size: this.selectedSize, // Add size
        image: this.product.images[0] // Add the first image or null as a fallback
      };
  
      console.log(
        `Mua ngay sản phẩm: ${productWithDetails.productName}, Số lượng: ${productWithDetails.quantity}, Kích cỡ: ${productWithDetails.size}`
      );
  
      // Navigate with the updated product
      this.router.navigate(['/Buy'], {
        state: {
          products: [productWithDetails],
        },
      });
      console.log('Products being sent:', [productWithDetails]);
    } else {
      console.error('Sản phẩm không tồn tại hoặc kích cỡ đã hết hàng!');
    }
  }
  

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  previousImage(): void {
    if (this.product) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.product.images.length) %
        this.product.images.length;
    }
  }

  nextImage(): void {
    if (this.product) {
      this.selectedImageIndex =
        (this.selectedImageIndex + 1) % this.product.images.length;
    }
  }
  //Hàm show cách đo size
  showGuideSize(productType: string): void {
    switch (productType) {
      case ProductType.Nhan:
        this.currentGuide = GuideRing;
        break;
      case ProductType.Vongtay:
        this.currentGuide = GuideBracelet;
        break;
      case ProductType.VongCo:
        this.currentGuide = GuideNecklace;
        break;
      default:
        break;
    }
  }

  goToCollection(collectionName: string): void {
    console.log('Navigating to collection:', collectionName);
    this.router.navigate(['/Collections', collectionName], {
      queryParams: { collections: collectionName },
    });
  }

  replaceSpacesWithHyphen(value: string): string {
    return value.replace(/\s+/g, '-');
  }
}
