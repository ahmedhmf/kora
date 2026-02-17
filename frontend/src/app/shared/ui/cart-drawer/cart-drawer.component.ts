import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart-drawer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart-drawer.component.html',
    styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
    cartService = inject(CartService);

    cart = this.cartService.cart;
    isOpen = this.cartService.isOpen;
    items = this.cartService.items;
    subtotal = this.cartService.subtotal;

    close() {
        this.cartService.toggleDrawer(false);
    }

    updateQty(id: string, qty: number) {
        this.cartService.updateQuantity(id, qty);
    }

    removeItem(id: string) {
        this.cartService.removeFromCart(id);
    }
}
