import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/ui/product-card.component';
import { ProductService } from '../../shared/services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterLink, ProductCardComponent],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {
    productService = inject(ProductService);
    featuredProducts = toSignal(this.productService.getProducts().pipe(map(p => p.slice(0, 4))), { initialValue: [] });
}
