import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MedusaLineItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartService);

  get cart$() {
    return this.cartService.cart$;
  }

  get isOpen$() {
    return this.cartService.isOpen$;
  }

  close(): void {
    this.cartService.close();
  }

  updateQuantity(item: MedusaLineItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      this.removeItem(item.id);
    } else {
      this.cartService.updateQuantity(item.id, newQty);
    }
  }

  removeItem(lineItemId: string): void {
    this.cartService.removeItem(lineItemId);
  }

  formatPrice(amount: number | undefined): string {
    if (amount == null) return '$0.00';
    // Assuming USD for now, based on previous components
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}
