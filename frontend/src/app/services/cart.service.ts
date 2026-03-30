import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MedusaCart, MedusaCartResponse, MedusaLineItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  
  private cartSubject = new BehaviorSubject<MedusaCart | null>(null);
  cart$ = this.cartSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private readonly CART_ID_KEY = 'medusa_cart_id';
  private readonly REGION_ID = 'reg_01KMP8AF407P9M1VBGSJW3QM4A';

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'x-publishable-api-key': environment.medusaPublishableKey,
    });
  }

  constructor() {
    this.initCart();
  }

  /** Initialize cart from localStorage or create new */
  private initCart(): void {
    const cartId = localStorage.getItem(this.CART_ID_KEY);
    if (cartId) {
      this.getCart(cartId).subscribe({
        error: () => this.createCart().subscribe()
      });
    } else {
      this.createCart().subscribe();
    }
  }

  /** Create a new cart in Medusa */
  createCart(): Observable<MedusaCart> {
    return this.http.post<MedusaCartResponse>(
      `${environment.medusaBaseUrl}/store/carts`,
      { region_id: this.REGION_ID },
      { headers: this.headers }
    ).pipe(
      map(res => res.cart),
      tap(cart => {
        localStorage.setItem(this.CART_ID_KEY, cart.id);
        this.cartSubject.next(cart);
      })
    );
  }

  /** Retrieve existing cart */
  getCart(id: string): Observable<MedusaCart> {
    return this.http.get<MedusaCartResponse>(
      `${environment.medusaBaseUrl}/store/carts/${id}`,
      { headers: this.headers }
    ).pipe(
      map(res => res.cart),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  /** Add item to cart */
  addToCart(variantId: string, quantity: number = 1): void {
    const cartId = this.cartSubject.value?.id;
    if (!cartId) return;

    this.http.post<MedusaCartResponse>(
      `${environment.medusaBaseUrl}/store/carts/${cartId}/line-items`,
      { variant_id: variantId, quantity },
      { headers: this.headers }
    ).subscribe({
      next: (res) => {
        this.cartSubject.next(res.cart);
        this.open();
      }
    });
  }

  /** Update item quantity */
  updateQuantity(lineItemId: string, quantity: number): void {
     const cartId = this.cartSubject.value?.id;
     if (!cartId) return;

     this.http.post<MedusaCartResponse>(
       `${environment.medusaBaseUrl}/store/carts/${cartId}/line-items/${lineItemId}`,
       { quantity },
       { headers: this.headers }
     ).subscribe((res: any) => {
       const cart = res.cart || res.parent;
       if (cart) this.cartSubject.next(cart);
     });
  }

  /** Remove item from cart */
  removeItem(lineItemId: string): void {
    const cartId = this.cartSubject.value?.id;
    if (!cartId) return;

    this.http.delete<MedusaCartResponse>(
      `${environment.medusaBaseUrl}/store/carts/${cartId}/line-items/${lineItemId}`,
      { headers: this.headers }
    ).subscribe((res: any) => {
      const cart = res.cart || res.parent;
      if (cart) this.cartSubject.next(cart);
    });
  }

  open(): void {
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
  }

  get totalItems(): number {
    return this.cartSubject.value?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  }
}
