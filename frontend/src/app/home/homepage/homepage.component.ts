import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { FeaturedComponent } from "../featured/featured.component";
import { BestSellersComponent } from "../best-sellers/best-sellers.component";
import { MissionComponent } from "../mission/mission.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HeroComponent, FeaturedComponent, BestSellersComponent, MissionComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
