import { Component } from '@angular/core';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [AccountSidebarComponent, RouterOutlet],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

}
