import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/types';
import { ProductCardComponent } from '../../shared/ui/product-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  activeCategory = signal<string | null>(null);

  // Reactively load products based on query params
  products = toSignal(
    this.route.queryParams.pipe(
      switchMap(params => {
        const category = params['category'];
        this.activeCategory.set(category || null);

        let products$ = category
          ? this.productService.getProductsByCategory(category)
          : this.productService.getProducts();

        // Simple client-side sort for mock
        const sort = params['sort'];
        return products$.pipe(map(products => {
          const sorted = [...products];
          if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
          if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
          return sorted;
        }));
      })
    ),
    { initialValue: [] }
  );

  onSortChange(event: Event) {
    // In a real app, navigate to update query param
    // For now we just need the UI
    const select = event.target as HTMLSelectElement;
    console.log('Sort changed:', select.value);
  }
}
