import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MedusaProduct, MedusaProductVariant } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private location = inject(Location);
  private cartService = inject(CartService);

  product: MedusaProduct | null = null;
  selectedVariant: MedusaProductVariant | null = null;
  selectedImageIndex = 0;
  addedToBag = false;
  loading = true;
  error: string | null = null;

  /** Hardcoded spec cards — driven by product.metadata in production */
  specs = [
    {
      icon: 'speed',
      title: 'KINETIC DRAG REDUCTION',
      description:
        'Advanced micro-dimple architecture reduces air resistance by 14%, ensuring unparalleled flight stability at high velocities.',
    },
    {
      icon: 'grid_view',
      title: 'STRUCTURAL HEX-CORE',
      description:
        'Proprietary internal bladder constructed from reinforced latex for maximum pressure retention and shape consistency over 1000+ impact cycles.',
    },
    {
      icon: 'water_drop',
      title: 'ZERO-ABSORPTION BOND',
      description:
        'Seamless thermal bonding prevents moisture uptake, maintaining ball weight and tactical responsiveness in extreme wet conditions.',
    },
  ];

  ngOnInit(): void {
    const handle = this.route.snapshot.paramMap.get('handle');
    if (!handle) {
      this.error = 'Product not found.';
      this.loading = false;
      return;
    }

    this.productService.getProductByHandle(handle).subscribe({
      next: (product) => {
        if (!product) {
          this.error = 'Product not found.';
        } else {
          this.product = product;
          this.selectedVariant = product.variants?.find(v => !this.isVariantOutOfStock(v)) || (product.variants?.[0] ?? null);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
      },
    });
  }

  get allImages(): string[] {
    if (!this.product) return [];
    const imgs = this.product.images?.map((i) => i.url) ?? [];
    if (imgs.length === 0 && this.product.thumbnail) return [this.product.thumbnail];
    return imgs;
  }

  get currentImage(): string {
    return this.allImages[this.selectedImageIndex] ?? 'assets/placeholder.png';
  }

  selectVariant(variant: MedusaProductVariant): void {
    this.selectedVariant = variant;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getPrice(variant: MedusaProductVariant | null): string {
    const amount = variant?.calculated_price?.calculated_amount;
    const currency = variant?.calculated_price?.currency_code?.toUpperCase() ?? 'USD';
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  addToBag(): void {
    if (!this.selectedVariant) return;
    this.cartService.addToCart(this.selectedVariant.id, 1);
    this.addedToBag = true;
    setTimeout(() => (this.addedToBag = false), 2500);
  }

  isVariantOutOfStock(variant: MedusaProductVariant | null): boolean {
    if (!variant) return true;
    if (variant.manage_inventory === false) return false;
    if (variant.allow_backorder === true) return false;
    // Normal check: if quantity is missing (null/undefined) or 0, it's out of stock
    return (variant.inventory_quantity ?? 0) <= 0;
  }

  isProductOutOfStock(): boolean {
    if (!this.product?.variants || this.product.variants.length === 0) return true;
    return this.product.variants.every(v => this.isVariantOutOfStock(v));
  }

  subscribeToBackInStock(email: string): void {
    if (!email || !this.selectedVariant) return;
    // Log for now, integrate with notification service/Medusa plugin in production
    console.log(`Subscribed ${email} for back-in-stock: ${this.product?.title} - ${this.selectedVariant.title}`);
    alert(`We will notify ${email} when ${this.product?.title} ${this.selectedVariant.title} is back in stock!`);
  }

  goBack(): void {
    this.location.back();
  }
}
