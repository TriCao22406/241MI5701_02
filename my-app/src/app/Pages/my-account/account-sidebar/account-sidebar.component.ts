import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum AccountSidebar {
  AccountInfo = 1,
  HistoryOrder = 2,
  Voucher = 3,
  ChangePassword = 4,
}

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.css',
})
export class AccountSidebarComponent {
  @Input() active: number = 0;

  AccountSidebar: any = AccountSidebar;
}
