import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
  categories = [
    {
      title: 'Kora Balls',
      category: 'ball',
      cta: 'Explore Engineering',
      imageAlt: 'Kora performance basketballs in a technical minimalist setting',
      image: '../../assets/products/foot-ball2.webp',
    },
    {
      title: 'Kora Apparel',
      category: 'tshirt',
      cta: 'View Range',
      imageAlt: 'Athlete wearing Kora performance compression apparel in action',
      image: '../../assets/products/tshirt1.jpeg',
    },
  ];
}
