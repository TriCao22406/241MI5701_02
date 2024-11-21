import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountSidebar, AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';
import { voucher } from '../../../../assets/data';
@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    AccountSidebarComponent,
    CommonModule,
    FormsModule,
    AccountSidebarComponent,
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.css',
})
export class VoucherComponent {
  //Khai báo biến chứa thông tin voucher
  voucher: any = voucher;
  AccountSidebar: any = AccountSidebar;
  keyword: string = '';

  constructor(private router: Router) {}

  handleBuyNow() {
    this.router.navigate(['/Sales-Off'], { queryParams: { discount: 'true' } });
}

  handleSearch() {
    this.voucher = voucher.filter(
      (item) =>
        item.voucherId.toLowerCase().includes(this.keyword.toLowerCase()) ||
        item.discountDescription
          .toLowerCase()
          .includes(this.keyword.toLowerCase())
    );
  }
}
