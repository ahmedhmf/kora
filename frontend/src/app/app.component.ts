import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeroComponent } from "./home/hero/hero.component";
import { FeaturedComponent } from "./home/featured/featured.component";
import { BestSellersComponent } from "./home/best-sellers/best-sellers.component";
import { MissionComponent } from "./home/mission/mission.component";
import { FooterComponent } from "./home/footer/footer.component";
import { NavbarComponent } from './home/navbar/navbar.component';
import { CartComponent } from './shop/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeroComponent, FeaturedComponent, BestSellersComponent, MissionComponent, FooterComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'website';
}
