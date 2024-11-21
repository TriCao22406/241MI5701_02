import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class CartComponent implements OnInit {

  cartProducts: any[] = [];
  userId: string | null = null;
  sizes: number[] = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Danh sách các kích cỡ
  couponCode: string = ''; // Mã giảm giá
  shippingFee: number = 0; // Phí vận chuyển

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Kiểm tra trạng thái đăng nhập
    this.authService.loggedInStatus.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage khi đã đăng nhập
        this.loadCartFromBackend(); // Nếu người dùng đã đăng nhập, lấy giỏ hàng từ backend
        console.log(`User ID: ${this.userId}`)
        console.log(`Cart User ID Backend: ${this.loadCartFromBackend()}`)
      } else {
        this.loadCartFromLocalStorage();
         // Nếu không, lấy giỏ hàng từ sessionStorage
      }
    });
  }

  // Lấy giỏ hàng từ Backend
  loadCartFromBackend(): void {
    if (this.userId) {
      this.cartService.getCart(this.userId).subscribe(
        (data) => {
          console.log('Cart của UserID từ Backend',data)
          // Bây giờ bạn có thể truy cập chi tiết sản phẩm trực tiếp từ `data.products`
          this.cartProducts = data.products.map((product: any) => ({
            // Lấy thông tin từ API lên 
            itemid: product._id,
            productid: product.productId._id,
            productName: product.productId.productName,
            price: product.productId.price,
            image: product.productId.images[0],
            images: product.productId.images,
            size: product.size,
            quantity: product.quantity,
            productCode: product.productId.productCode,
            errorMessage: ''  // Set errorMessage to empty string for all products
          }));
        },
        (error) => {
          console.error('Lỗi khi lấy giỏ hàng từ Backend:', error);
        }
      );
    }
  }

  // Lấy giỏ hàng từ localStorage nếu người dùng chưa đăng nhập (lấy từ file productdetail.ts )
  loadCartFromLocalStorage(): void {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      this.cartProducts = JSON.parse(cartData);
      this.cartProducts.forEach(product => {
        product.errorMessage = '';  // Set errorMessage to empty string for each product
      });
      console.log('Cart từ local',this.cartProducts)

    } else {
      this.cartProducts = [];
    }
  }

  // Lưu giỏ hàng vào sessionStorage khi người dùng chưa đăng nhập
  saveCartToLocalStorage(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }


  // // Update số lượng sản phẩm 
  // updateQuantity(productId: string, quantity: number, size: string): void {
  //   const product = this.cartProducts.find(p => p.id === productId && p.size === size);

  //   console.log('Check san pham tang quanity', product)
  //   if (product) {
  //     const cartid: string = product.cartid
  //     if (quantity > product.quantity) {
  //       // Số lượng sản phẩm vượt quá quanity trong kho vượt quá yêu cầu
  //       console.log('Số lượng sản phẩm hiện tại: ',product.quantity, '- Vượt quá yêu cầu')
  //       product.errorMessage = 'Số lượng yêu cầu vượt quá số lượng có sẵn trong kho';
  //     } else {
  //       console.log('Số lượng sản phẩm hiện tại: ',product.quantity, "- Đủ số lượng sản phẩm!")
  //       product.quantity = quantity;
  //       console.log('Cập nhật số lượng hiện tại: ', quantity )
  //       product.errorMessage = '';
  
  //       if (!this.authService.isUserLoggedIn()) {
  //         // Lưu lại trên cart LocalStorage
  //         this.saveCartToLocalStorage();
  //       } else {
  //         // Cập nhật giỏ hàng trên backend
  //         this.cartService.updateProductQuantity({
  //           userId: this.userId!,
  //           cartid,
  //           productId,
  //           quantity,
  //           size
  //         }).subscribe(
  //           () => console.log('Đã cập nhật giỏ hàng trên backend'),
  //           (error) => {
  //             console.error('Lỗi khi cập nhật giỏ hàng trên backend:', error);
  //             if (error.status === 400) {
  //               product.errorMessage = 'Số lượng yêu cầu vượt quá số lượng có sẵn trong kho.';
  //             }
  //           }
  //         );
  //       }
  //     }
  //   }
  // }

  onSizeChange(event: Event, productId: string): void {
    const selectedSize = (event.target as HTMLSelectElement).value;
  
    // Find the product in the cart based on the productId
    const product = this.cartProducts.find(p => p.productid === productId);
  
    if (product) {
      product.size = selectedSize; // Update the product size with the selected value
  
      // Call updateQuantity with the updated product's ID, quantity, and size
      this.updateQuantity(product.productid, product.quantity, product.size);
    } else {
      console.error('Product not found.');
    }
  }
  

  // Update số lượng sản phẩm 
updateQuantity(productId: string, quantity: number, size: string): void {
  const product = this.cartProducts.find(p => p.productid === productId && p.size === size);

  if (product) {
    const itemid: string = product.itemid;

    if (quantity <= 0) {
      product.errorMessage = 'Số lượng phải lớn hơn 0.';
      return;
    }

    if (quantity !== product.quantity) {
      if (!this.authService.isUserLoggedIn()) {
        // Lưu lại trên cart LocalStorage nếu chưa đăng nhập
        console.log('Số lượng sản phẩm còn lại', product.availableQuantity)
        if (quantity > product.availableQuantity) {
          product.errorMessage = 'Sản phẩm trong kho đã hết. Vui lòng chọn số lượng ít hơn.';
          product.quantity = product.availableQuantity; // Cập nhật lại số lượng về tối đa có sẵn
        } else {
          product.quantity = quantity;
          product.size = size;
          product.errorMessage = 'Đã cập nhật số lượng sản phẩm thành công'; // Xóa thông báo lỗi khi cập nhật thành công
          this.saveCartToLocalStorage();
        }
      } else {
        // Cập nhật giỏ hàng trên backend nếu đã đăng nhập
        this.cartService.updateProductQuantity({
          userId: this.userId!,
          itemid,
          productId,
          quantity,
          size
        }).subscribe(
          () => {
            console.log('Đã cập nhật giỏ hàng trên backend');
            product.quantity = quantity;
            product.size = size;
            product.errorMessage = 'Đã cập nhật số lượng sản phẩm thành công'; // Xóa thông báo lỗi khi cập nhật thành công
          },
          (error) => {
            console.error('Lỗi khi cập nhật giỏ hàng trên backend:', error);
            if (error.status === 400 && error.error?.message === 'Số lượng yêu cầu vượt quá số lượng có sẵn trong kho') {
              product.errorMessage = 'Sản phẩm trong kho đã hết. Vui lòng chọn số lượng ít hơn.';
              product.quantity = error.error.currentQuantity; // Cập nhật lại số lượng về tối đa có sẵn
            } else if (error.status === 404) {
              product.errorMessage = 'Sản phẩm không tồn tại trong giỏ hàng.';
            }
          }

        );
      }
      console.log(product.errorMessage)
    }
  }
}





  // // Xóa sản phẩm khỏi giỏ hàng
  // removeProduct(productId: string, size: string): void {
  //   this.cartProducts = this.cartProducts.filter(p => !(p.id === productId && p.size === size));
  //   if (!this.authService.isUserLoggedIn()) {
  //     this.saveCartToLocalStorage(); // Lưu vào sessionStorage nếu chưa đăng nhập
  //   } else {
  //     // Gọi API để xóa sản phẩm nếu đã đăng nhập
  //     this.cartService.removeFromCart(this.userId!, productId, size).subscribe(
  //       () => console.log('Đã xóa sản phẩm khỏi giỏ hàng trên backend'),
  //       (error) => console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng trên backend:', error)
  //     );
  //   }
  // }

// Xóa sản phẩm khỏi giỏ hàng
removeProduct(productId: string, size: string): void {
  const product = this.cartProducts.find(p => p.productid === productId && p.size === size);
  
  if (product) {
    const itemid: string = product.itemid; 
    console.log('CartItemID', itemid);
    
    if (!this.authService.isUserLoggedIn()) {
      // Nếu chưa đăng nhập, xóa sản phẩm khỏi giỏ hàng cục bộ và lưu lại vào sessionStorage
      this.cartProducts = this.cartProducts.filter(p => !(p.productid === productId && p.size === size));
      this.saveCartToLocalStorage();
    } else {
      // Nếu đã đăng nhập, gọi API để xóa sản phẩm khỏi backend
      if (itemid) {
        this.cartService.removeFromCart(this.userId!, itemid).subscribe(
          () => {
            console.log('Đã xóa sản phẩm khỏi giỏ hàng trên backend');
            // Xóa sản phẩm khỏi danh sách `cartProducts` trên frontend sau khi xóa thành công
            this.cartProducts = this.cartProducts.filter(p => !(p.productid === productId && p.size === size));
          },
          (error) => console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng trên backend:', error)
        );
      }
    }
  }
}



  // Tính tổng giá trị giỏ hàng
  calculateTotal(): number {
    return this.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  // Áp dụng mã giảm giá
  applyCoupon(): void {
    console.log('Applying coupon:', this.couponCode);
    // Thực hiện logic áp dụng mã giảm giá tại đây
  }

  // Tiến hành thanh toán
  checkout(): void {
    // Check if the user is logged in
    // if (!this.authService.isUserLoggedIn()) {
    //   // alert('Vui lòng đăng nhập để thực hiện thanh toán.');
    //   // return; // Stop the checkout process if the user is not logged in
    // }
  
    // Check if there are products in the cart
    if (this.cartProducts.length === 0) {
      alert('Giỏ hàng của bạn hiện đang trống!');
      return; // Stop the checkout process if the cart is empty
    }
  
    // Prepare the product data to send to the checkout page
    const productsWithDetails = this.cartProducts.map(product => ({
      ...product, // Spread the product properties
      quantity: product.quantity, // Add quantity
      size: product.size, // Add size
    }));
  
    // Optionally, include coupon details and shipping fee in the state
    const totalAmount = this.calculateTotal(); // Total amount with shipping fee and discounts applied
    const checkoutData = {
      products: productsWithDetails,
      couponCode: this.couponCode,
      totalAmount: totalAmount,
      shippingFee: this.shippingFee,
    };
  
    // Log for debugging
    console.log('Proceeding to checkout with data:', productsWithDetails);
  
    // Navigate to the checkout page, passing the prepared data
    this.router.navigate(['/Buy'], {
      state: {
        products: productsWithDetails,
      } // Passing the cart data, coupon code, and total
    });
  
    // Optional: Clear the cart after proceeding to checkout (if needed)
    // This step can be optional, depending on your business logic
    // this.cartProducts = []; // Clear the cart
    // this.saveCartToLocalStorage(); // Save an empty cart to localStorage
  }
  


}

