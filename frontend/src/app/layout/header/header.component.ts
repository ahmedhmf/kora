import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { LogoComponent } from '../../shared/ui/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private cartService = inject(CartService);
  cartCount = this.cartService.count;
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  categories = [
    { name: 'Football', path: '/shop', queryParams: { category: 'football' } },
    { name: 'Handball', path: '/shop', queryParams: { category: 'handball' } },
    { name: 'Technology', path: '/technology' },
    { name: 'Story', path: '/story' },
  ];

  toggleCart() {
    this.cartService.toggleDrawer();
  }
}
