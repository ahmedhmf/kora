import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product, ProductVariant } from '../../../shared/models/types';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = toSignal<Product | undefined>(
    this.route.paramMap.pipe(
      switchMap(params => {
        const handle = params.get('handle');
        return handle ? this.productService.getProductByHandle(handle) : of(undefined);
      }),
      tap(p => {
        if (p) {
          this.activeImage.set(p.thumbnail);
          // Auto select first options if simple
          if (p.variants.length === 1) {
            this.selectedOptions.set(p.variants[0].options);
          }
        }
      })
    )
  );

  activeImage = signal<string>('');
  quantity = signal(1);
  selectedOptions = signal<Record<string, string>>({});

  currentVariant = signal<ProductVariant | undefined>(undefined); // Would derive this in a real app properly

  isOptionSelected(key: string, value: string): boolean {
    return this.selectedOptions()[key] === value;
  }

  selectOption(key: string, value: string) {
    this.selectedOptions.update(opts => ({ ...opts, [key]: value }));
    this.updateCurrentVariant();
  }

  updateCurrentVariant() {
    const p = this.product();
    if (!p) return;

    const match = p.variants.find(v => {
      return Object.entries(v.options).every(([key, val]) => this.selectedOptions()[key] === val);
    });

    this.currentVariant.set(match);
  }

  incrementQty() { this.quantity.update(q => q + 1); }
  decrementQty() { this.quantity.update(q => Math.max(1, q - 1)); }

  addToCart() {
    const p = this.product();
    const v = this.currentVariant();
    if (p && v) {
      this.cartService.addToCart(p, v, this.quantity());
    }
  }
}
