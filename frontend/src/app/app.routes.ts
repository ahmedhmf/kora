import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home/homepage/homepage.component").then(
        (m) => m.HomepageComponent,
      ),
  },
  {
    path: "shop",
    loadComponent: () =>
      import("./shop/shop/shop.component").then(
        (m) => m.ShopComponent,
      ),
  },
  {
    path: "products/:handle",
    loadComponent: () =>
      import("./shop/product/product.component").then(
        (m) => m.ProductComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
