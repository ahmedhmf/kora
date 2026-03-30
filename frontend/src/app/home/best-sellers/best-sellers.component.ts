import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MedusaProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.scss'
})
export class BestSellersComponent {
  @ViewChild('scrollTrack') scrollTrack!: ElementRef<HTMLDivElement>;
 
  private productService = inject(ProductService);
 
  products: MedusaProduct[] = [];
  loading = true;
  error: string | null = null;
 
  ngOnInit(): void {
    this.productService.getProducts(8).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.error = 'Could not load products. Please try again later.';
        this.loading = false;
      },
    });
  }
 
  /** Display price from the first variant. Medusa v2 returns amounts in cents. */
  getPrice(product: MedusaProduct): string {
    const variant = product.variants?.[0];
    const amount = variant?.calculated_price?.calculated_amount;
    const currency = variant?.calculated_price?.currency_code?.toUpperCase() ?? 'USD';
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
  }
 
  /** Best available image — thumbnail → first image → local placeholder. */
  getImage(product: MedusaProduct): string {
    return product.thumbnail ?? product.images?.[0]?.url ?? 'assets/placeholder.png';
  }
 
  /** Collection title as product subtitle. */
  getSubtitle(product: MedusaProduct): string {
    return product.collection?.title ?? 'KORA / Performance';
  }
 
  scroll(direction: 'left' | 'right'): void {
    const el = this.scrollTrack.nativeElement;
    el.scrollBy({ left: direction === 'right' ? 440 : -440, behavior: 'smooth' });
  }
}
