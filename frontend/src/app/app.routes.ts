import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
            { path: 'shop', loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent) },
            { path: 'product/:handle', loadComponent: () => import('./features/shop/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
            { path: 'cart', loadComponent: () => import('./features/shop/cart/cart.component').then(m => m.CartComponent) },
            { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
            { path: 'account', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
        ]
    },
    { path: 'survey', loadComponent: () => import('./features/survey/survey.component').then(m => m.SurveyComponent) },
];
