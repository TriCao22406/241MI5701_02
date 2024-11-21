import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../service/order.service';
import * as bootstrap from 'bootstrap';
import { HanhchinhvnService } from '../../../service/hanhchinhvn.service';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { CartService } from '../../../service/cart.service';


@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [FormsModule, CommonModule,  ],
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'] // Corrected typo: 'styleUrl' -> 'styleUrls'
})
export class BuyComponent implements OnInit {
  products: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  userInfo: any = {}; // Object to hold user data


  selectedProvince: any = null;
  selectedDistrict: any = null;
  selectedWard: any = null;
  streetAddress: any = null; // Declare as a string


  customerInfo = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  deliveryOption = 'homeDelivery';
  paymentMethod = ''; // Default value
  notes = '';
  promotionConsent = false;
  companyInvoice = false;
  policyAgreement = false;

  emailErrorMessage: string | null = null;
  phoneErrorMessage: string | null = null;

  private emailInput: Subject<string> = new Subject<string>();
  private phoneInput: Subject<string> = new Subject<string>();


  constructor(
    private router: Router,
    private orderService: OrderService,
    private hanhChinhVNService: HanhchinhvnService,
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    const userId = sessionStorage.getItem('userId'); // Fetch userId from session storage
    if (userId) {
      this.authService.getUserInfo(userId).subscribe({
        next: (data) => {
          this.userInfo = data; // Assign fetched data to userInfo
  
          // Append userInfo to customerInfo
          this.customerInfo = {
            name: this.userInfo.name || this.customerInfo.name,
            email: this.userInfo.email || this.customerInfo.email,
            phone: this.userInfo.phone || this.customerInfo.phone,
            address: ''
          };
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        }
      });
    }
  
    this.loadProvinces();
  
    const navigationState = history.state;
    this.products = navigationState.products || [];
  }
  

  getTotal(): number {
    return this.products.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  submitOrder(formValues: any) {
    // Validation
    if (formValues.invalid) {
      alert('Vui lòng điền đầy đủ thông tin người mua.');
      return;
    }
  
    if (this.emailErrorMessage || this.phoneErrorMessage) {
      const toast = new bootstrap.Toast(document.getElementById('FormUncompleteToast')!);
      toast.show();
      return;
    }
  
    if (!this.customerInfo.name || !this.customerInfo.email || !this.customerInfo.phone) {
      const toast = new bootstrap.Toast(document.getElementById('FormUncompleteToast')!);
      toast.show();
      return;
    }
  
    if (
      this.deliveryOption === 'homeDelivery' &&
      (!this.selectedProvince || !this.selectedDistrict || !this.selectedWard || !this.streetAddress)
    ) {
      alert('Vui lòng điền đầy đủ địa chỉ nhận hàng.');
      return;
    }
  
    if (!this.paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }
  
    if (!this.policyAgreement) {
      const toast = new bootstrap.Toast(document.getElementById('policyAgreementToast')!);
      toast.show();
      return;
    }
  
    // Populate customer info
    this.customerInfo.name = formValues.fullName;
    this.customerInfo.email = formValues.email;
    this.customerInfo.phone = formValues.phone;
  
    this.customerInfo.address =
      formValues.deliveryOption === 'homeDelivery'
        ? this.combineAddress()
        : 'Nhận tại cửa hàng: 669 Quốc lộ 1, Khu phố 3, Linh Xuân, Thủ Đức, TP. Hồ Chí Minh';
  
    console.log(this.customerInfo.address);
  
    // Prepare order
    const order = {
      customerInfo: this.customerInfo,
      userId: this.authService.isUserLoggedIn() ? sessionStorage.getItem('userId') : null,
      orderDetail: this.products.map((product) => ({
        productId: product._id || product.productId || product.productid,
        size: product.size,
        quantity: product.quantity,
      })),
      status: 'Chờ xác nhận',
      total: this.getTotal(),
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      policyAgreed: this.policyAgreement,
      promotionConsent: this.promotionConsent,
      companyInvoice: this.companyInvoice,
      timer: this.generateTimestamps(),
    };
  
    console.log(order);
  
    // Save order
    this.orderService.saveOrder(order).subscribe(
      (response) => {
        if (response.orderId) {
          // Show toast with order ID
          const orderIdElement = document.getElementById('orderIdDisplay')!;
          orderIdElement.textContent = `Mã vận đơn của bạn là: ${response.orderId}`;
  
          const toastElement = document.getElementById('FormCompleteToast')!;
          const toast = new bootstrap.Toast(toastElement, { autohide: false });
          toast.show();
  
          // Delete cart only if the user is logged in
          if (this.authService.isUserLoggedIn()) {
            const userId = sessionStorage.getItem('userId');
            this.cartService.deleteCart(userId!).subscribe(
              () => {
                console.log('Cart deleted successfully.');
              },
              (error) => {
                console.error('Error deleting cart:', error);
              }
            );
          }
  
          // Handle navigation
          const navigateButton = document.getElementById('navigateButton')!;
          navigateButton.addEventListener('click', () => {
            toast.hide(); // Optionally hide the toast
            const route = this.authService.isUserLoggedIn()
              ? '/My-Account/Buy-History'
              : '/Products';
            this.router.navigate([route]);
          });
        } else {
          console.error('Order ID not found in response:', response);
        }
      },
      (error) => {
        console.error('Error saving order:', error);
        alert('Failed to save order. Please try again.');
      }
    );
  }
  

  generateTimestamps() {
    const orderTime = new Date();
    return {
      orderTime: orderTime.toISOString(),
      Timestamp1: new Date(orderTime.getTime() + 30 * 60 * 1000).toISOString(),
      Timestamp2: new Date(orderTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      Timestamp3: new Date(orderTime.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      Timestamp4: null, // This will be set when the order is confirmed as "completed"
      expectedDate: new Date(orderTime.getTime() + 2.5 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  

  loadProvinces(): void {
    this.hanhChinhVNService.getProvinces().subscribe((data) => {
      this.provinces = Object.values(data);
    });
  }

  onProvinceChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast the event target to HTMLSelectElement
    const provinceCode = target.value; // Access the value property
    this.selectedProvince = this.provinces.find((p) => p.code === provinceCode);
    this.hanhChinhVNService.getDistricts(provinceCode).subscribe((data) => {
      this.districts = Object.values(data);
      this.wards = []; // Reset wards
      this.selectedDistrict = null;
      this.selectedWard = null;
    });
  }
  
  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast the event target to HTMLSelectElement
    const districtCode = target.value; // Access the value property
    this.selectedDistrict = this.districts.find((d) => d.code === districtCode);
    this.hanhChinhVNService.getWards(districtCode).subscribe((data) => {
      this.wards = Object.values(data);
      this.selectedWard = null;
    });
  }
  
  onWardChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast the event target to HTMLSelectElement
    const wardCode = target.value; // Access the value property
    this.selectedWard = this.wards.find((w) => w.code === wardCode);
  }
  

  combineAddress(): string {
    const parts = [
      this.streetAddress,
      this.selectedWard?.name_with_type,
      this.selectedDistrict?.name_with_type,
      this.selectedProvince?.name_with_type,
    ].filter((part) => part); // Remove undefined or null parts

    return parts.join(', ');
  }

  onPaymentMethodChange() {
    if (this.paymentMethod) {
      console.log('Payment method selected:', this.paymentMethod);
      // Perform any additional actions based on the selected method
    }
  }


  validateEmail(email: any): void {
    if (!email.valid && (email.touched || email.dirty)) {
      if (email.errors?.['required']) {
        this.emailErrorMessage = 'Vui lòng nhập địa chỉ email.';
      } else if (email.errors?.['email']) {
        this.emailErrorMessage = 'Định dạng email không hợp lệ.';
      } else {
        this.emailErrorMessage = null;
      }
    } else {
      this.emailErrorMessage = null;
    }
  }

  // Validate phone number using the Vietnamese phone pattern
  validatePhone(phone: any): void {
    if (!phone.valid && (phone.touched || phone.dirty)) {
      if (phone.errors?.['required']) {
        this.phoneErrorMessage = 'Vui lòng nhập số điện thoại.';
      } else if (phone.errors?.['pattern']) {
        this.phoneErrorMessage = 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số).';
      } else {
        this.phoneErrorMessage = null;
      }
    } else {
      this.phoneErrorMessage = null;
    }
  }


}
