import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

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
      import("./shop/shop/shop.component").then((m) => m.ShopComponent),
  },
  {
    path: "products/:handle",
    loadComponent: () =>
      import("./shop/product/product.component").then((m) => m.ProductComponent),
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./auth/auth.component").then((m) => m.AuthComponent),
  },
  {
    path: "login",
    redirectTo: "auth",
    pathMatch: "full",
  },
  {
    path: "register",
    redirectTo: "auth",
    pathMatch: "full",
  },
  {
    path: "profile",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./auth/profile/profile.component").then((m) => m.ProfileComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
