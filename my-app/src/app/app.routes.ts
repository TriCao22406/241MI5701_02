import { AboutUsComponent } from './Pages/CSKH/about-us/about-us.component';
import { ExchangeReturnPolicyComponent } from './Pages/CSKH/Policies/exchange-return-policy/exchange-return-policy.component';
import { GeneralPolicyComponent } from './Pages/CSKH/Policies/general-policy/general-policy.component';
import { PrivacyPolicyComponent } from './Pages/CSKH/Policies/privacy-policy/privacy-policy.component';
import { ProductsComponent } from './Pages/ProductsPages/products/products.component';
import { ForgotPSWComponent } from './Pages/Login_Signup/forgot-psw/forgot-psw.component';
import { LoginPageComponent } from './Pages/Login_Signup/login-page/login-page.component';
import { SignupPageComponent } from './Pages/Login_Signup/signup-page/signup-page.component';
import { CartComponent } from './Pages/ProductsPages/cart/cart.component';
import { ProductdetailComponent } from './Pages/ProductsPages/productdetail/productdetail.component';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './Pages/ProductsPages/collection/collection.component';
import { CollectionDetailComponent } from './Pages/ProductsPages/collection-detail/collection-detail.component';
import { ChangePasswordComponent } from './Pages/my-account/change-password/change-password.component';
import { BuyHistoryComponent } from './Pages/my-account/buy-history/buy-history.component';
import { MyAccountComponent } from './Pages/my-account/my-account.component';
import { SaleComponent } from './Pages/ProductsPages/sale/sale.component';
import { AccountDetailComponent } from './Pages/my-account/account-detail/account-detail.component';
import { LoginOtpComponent } from './Pages/Login_Signup/login-otp/login-otp.component';
import { HomepageComponent } from './Pages/homepage/homepage.component';
import { OrderDetailComponent } from './Pages/my-account/order-detail/order-detail.component';
import { BuyComponent } from './Pages/ProductsPages/buy/buy.component';
import { FavoriteProductComponent } from './Pages/ProductsPages/favorite-product/favorite-product.component';
import { BlogDetailComponent } from './Pages/CSKH/blog-detail/blog-detail.component';
import { NgModule } from '@angular/core';

import { SearchOrderComponent } from './Pages/search-order/search-order.component';
import { BlogComponent } from './Pages/CSKH/blog/blog.component';
import { VoucherComponent } from './Pages/my-account/voucher/voucher.component';




export const routes: Routes = [
    {path: '', redirectTo:'/Home', pathMatch:'full'},
    {path: 'Home', component: HomepageComponent},
    {path: 'Forgot', component: ForgotPSWComponent},
    {path: 'Login', component: LoginPageComponent},
    {path: 'SignUp', component: SignupPageComponent},
    {path: 'Collections', component: CollectionComponent},
    {path: 'Collections/:collectionName', component: CollectionDetailComponent},
    {path: 'Products', component: ProductsComponent},
    {path: 'Products/:productCode', component: ProductdetailComponent},
    {path: 'Sales-Off', component: SaleComponent},
    {path: 'About-Us', component: AboutUsComponent},
    {path: 'Cart', component: CartComponent},
    {path: 'OptVertify', component: LoginOtpComponent },
    {path: 'Detail', component: OrderDetailComponent },
    {path: 'Buy', component: BuyComponent },
    {path: 'Favorite', component: FavoriteProductComponent },
    {path: 'Search-Order', component: SearchOrderComponent },
    {path: 'My-Account', component: MyAccountComponent,
        children: [
          {path: '', redirectTo: 'Profile', pathMatch: 'full' },  
          {path: 'Buy-History', component: BuyHistoryComponent },
          {path: 'ChangePassword', component: ChangePasswordComponent },
          {path: 'Profile', component: AccountDetailComponent },
          {path: 'ChangePassword', component: ChangePasswordComponent },
          {path: 'Voucher', component: VoucherComponent },
        ]
    },

    {path: 'Blog', component: BlogComponent},
    {path: 'Blog/:id', component: BlogDetailComponent},
    
    {path: 'Policy', 
        children: [
            {path: 'Exchange-Return', component: ExchangeReturnPolicyComponent},
            {path: 'General', component: GeneralPolicyComponent},
            {path: 'Privacy', component: PrivacyPolicyComponent},
        ]
    },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

