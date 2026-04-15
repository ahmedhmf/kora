import { Component, inject, OnInit } from "@angular/core";
import { MedusaProduct } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { RouterLink, ActivatedRoute } from "@angular/router";

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

@Component({
  selector: "app-shop",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./shop.component.html",
  styleUrl: "./shop.component.scss",
})
export class ShopComponent implements OnInit {
   private productService = inject(ProductService);
   private route = inject(ActivatedRoute);
 
  // ── Data ──────────────────────────────────────────────
  allProducts: MedusaProduct[] = [];
  displayedProducts: MedusaProduct[] = [];
  _filteredCache: MedusaProduct[] = [];  // public so template can read .length
  loading = true;
  loadingMore = false;
  error: string | null = null;
 
  // ── Dynamic filter options (built from product data) ──
  /** 'ALL GEAR' + every unique product_type found in the catalogue */
  categories: string[] = ['ALL GEAR'];
  /** Every unique size value found across all variant option sets */
  availableSizes: string[] = [];
 
  // ── Selected filter state ─────────────────────────────
  selectedCategory = 'ALL GEAR';
  selectedSizes = new Set<string>();
  minPriceFilter = 0;   // lower bound chosen by slider
  maxPriceFilter = 500; // upper bound chosen by slider
  absoluteMaxPrice = 500; // computed from actual product prices
 
  // ── Pagination ────────────────────────────────────────
  pageSize = 8;
  offset = 0;
  hasMore = false;
 
  // ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.productService.getProducts(100, 0).subscribe({
      next: (products) => {
        this.allProducts = products;
        this.buildFilterOptions(products);

        // Handle initial category filter from query params
        const categoryParam = this.route.snapshot.queryParamMap.get('category');
        if (categoryParam) {
          const found = this.categories.find(c => c.toUpperCase() === categoryParam.toUpperCase());
          if (found) {
            this.selectedCategory = found;
          }
        }

        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });
  }
 
  // ── Build filter options from real data ───────────────
  private buildFilterOptions(products: MedusaProduct[]): void {
    // Categories: use product_type if available, otherwise collection title
    const catSet = new Set<string>();
    for (const p of products) {
      const cat = this.getRawCategory(p);
      if (cat) catSet.add(cat.toUpperCase());
    }
    this.categories = ['ALL GEAR', ...Array.from(catSet).sort()];
 
    // Sizes: scan every variant's options for size-like option titles
    const sizeSet = new Set<string>();
    for (const p of products) {
      for (const v of p.variants ?? []) {
        for (const opt of v.options ?? []) {
          const title = opt.option?.title?.toLowerCase() ?? '';
          if (title === 'size' || title === 'sizes') {
            sizeSet.add(opt.value.toUpperCase());
          }
        }
      }
    }
    // Sort sizes by canonical order; unknown sizes go to the end alphabetically
    this.availableSizes = Array.from(sizeSet).sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a);
      const bi = SIZE_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
 
    // Price ceiling: highest price across all products
    let max = 0;
    for (const p of products) {
      const price = this.getRawPrice(p);
      if (price > max) max = price;
    }
    // Round up to nearest 50 for a clean slider
    this.absoluteMaxPrice = max > 0 ? Math.ceil(max / 50) * 50 : 500;
    this.maxPriceFilter = this.absoluteMaxPrice;
    this.minPriceFilter = 0;
  }
 
  // ── Core filter logic ─────────────────────────────────
  applyFilters(): void {
    let filtered = [...this.allProducts];
 
    // 1. Category filter
    if (this.selectedCategory !== 'ALL GEAR') {
      filtered = filtered.filter((p) => {
        const cat = this.getRawCategory(p)?.toUpperCase() ?? '';
        return cat === this.selectedCategory;
      });
    }
 
    // 2. Size filter — product must have at least one variant matching ALL selected sizes THAT IS IN STOCK
    if (this.selectedSizes.size > 0) {
      filtered = filtered.filter((p) =>
        [...this.selectedSizes].every((size) =>
          (p.variants ?? []).some((v) =>
            !this.isVariantOutOfStock(v) &&
            (v.options ?? []).some(
              (opt) =>
                (opt.option?.title?.toLowerCase() === 'size' ||
                  opt.option?.title?.toLowerCase() === 'sizes') &&
                opt.value.toUpperCase() === size
            )
          )
        )
      );
    }
 
    // 3. Price filter — compare against raw numeric price
    filtered = filtered.filter((p) => {
      const price = this.getRawPrice(p);
      // Products with no price data (0) are always shown
      if (price === 0) return true;
      return price >= this.minPriceFilter && price <= this.maxPriceFilter;
    });
 
    this._filteredCache = filtered;
    this.offset = this.pageSize;
    this.hasMore = filtered.length > this.pageSize;
    this.displayedProducts = filtered.slice(0, this.pageSize);
  }
 
  loadMore(): void {
    this.loadingMore = true;
    setTimeout(() => {
      const next = this._filteredCache.slice(this.offset, this.offset + this.pageSize);
      this.displayedProducts = [...this.displayedProducts, ...next];
      this.offset += this.pageSize;
      this.hasMore = this.offset < this._filteredCache.length;
      this.loadingMore = false;
    }, 400);
  }
 
  // ── Filter toggle handlers ────────────────────────────
  clearFilters(): void {
    this.selectedCategory = 'ALL GEAR';
    this.selectedSizes.clear();
    this.minPriceFilter = 0;
    this.maxPriceFilter = this.absoluteMaxPrice;
    this.applyFilters();
  }
 
  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }
 
  toggleSize(size: string): void {
    this.selectedSizes.has(size)
      ? this.selectedSizes.delete(size)
      : this.selectedSizes.add(size);
    this.applyFilters();
  }
 
  onMinPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.minPriceFilter = Math.min(val, this.maxPriceFilter);
    this.applyFilters();
  }

  onMaxPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.maxPriceFilter = Math.max(val, this.minPriceFilter);
    this.applyFilters();
  }
 
  // ── Raw data helpers ──────────────────────────────────
  /**
   * Returns the raw price in full currency units (e.g. dollars, not cents).
   * Medusa v2 calculated_price amounts are in the smallest currency unit.
   */
  private getRawPrice(p: MedusaProduct): number {
    const amount = p.variants?.[0]?.calculated_price?.calculated_amount;
    if (amount == null) return 0;
    // Medusa v2 calculated_amount is in the smallest currency unit (e.g. cents)
    return amount;
  }
 
  /**
   * Best available category label for a product.
   * Priority: product_type → collection title → null
   */
  private getRawCategory(p: MedusaProduct): string | null {
    // product_type is available on MedusaProduct if you add it to the fields param
    const meta = (p as any).type?.value as string | undefined;
    if (meta) return meta;
    return p.collection?.title ?? null;
  }
 
  // ── Display helpers ───────────────────────────────────
  getImage(p: MedusaProduct): string {
    return p.thumbnail ?? p.images?.[0]?.url ?? 'assets/placeholder.png';
  }
 
  getDisplayPrice(p: MedusaProduct): string {
    const v = p.variants?.[0];
    const amount = v?.calculated_price?.calculated_amount;
    const currency = v?.calculated_price?.currency_code?.toUpperCase() ?? 'USD';
    if (amount == null) return '—';
    // Convert cents to full currency units
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }
 
  getSubtitle(p: MedusaProduct): string {
    return this.getRawCategory(p)?.toUpperCase() ?? 'KORA / PERFORMANCE';
  }
 
  getBadge(p: MedusaProduct): { label: string; type: 'elite' | 'new' | 'sold' } | null {
    const tags = p.tags?.map((t) => t.value.toLowerCase()) ?? [];
    if (tags.includes('elite')) return { label: 'ELITE', type: 'elite' };
    if (tags.includes('new') || tags.includes('new-arrival')) return { label: 'NEW ARRIVAL', type: 'new' };
    if (this.isSoldOut(p)) return { label: 'SOLD OUT', type: 'sold' };
    return null;
  }
 
  isVariantOutOfStock(v: any): boolean {
    if (!v) return true;
    // If inventory isn't managed, it's always in stock
    if (v.manage_inventory === false) return false;
    // If backorder is allowed, it's considered in stock
    if (v.allow_backorder === true) return false;
    // Normal check: if quantity is missing (null/undefined) or 0, it's sold out
    return (v.inventory_quantity ?? 0) <= 0;
  }

  isSoldOut(p: MedusaProduct): boolean {
    if (!p.variants || p.variants.length === 0) return true;
    return p.variants.every(v => this.isVariantOutOfStock(v));
  }
 
  isCategorySelected(cat: string): boolean {
    return this.selectedCategory === cat;
  }
 
  isSizeSelected(size: string): boolean {
    return this.selectedSizes.has(size);
  }
 
  get skeletons(): number[] {
    return Array.from({ length: 8 }, (_, i) => i);
  }
 
  get priceRangeLabel(): string {
    return `$${this.minPriceFilter} — $${this.maxPriceFilter}`;
  }
}