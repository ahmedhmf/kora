import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { MedusaProduct, MedusaProductsResponse } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'x-publishable-api-key': environment.medusaPublishableKey,
    });
  }

  /** Fetch paginated product list */
  getProducts(limit = 8, offset = 0): Observable<MedusaProduct[]> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
      .set('region_id', 'reg_01KMP8AF407P9M1VBGSJW3QM4A')
      .set('fields', '*variants.calculated_price,*variants,+variants.inventory_quantity');

    return this.http
      .get<MedusaProductsResponse>(`${environment.medusaBaseUrl}/store/products`, {
        headers: this.headers,
        params,
      })
      .pipe(map((res) => res.products));
  }

  /** Fetch a single product by its handle (slug) */
  getProductByHandle(handle: string, regionId = 'reg_01KMP8AF407P9M1VBGSJW3QM4A'): Observable<MedusaProduct> {
    const params = new HttpParams()
      .set('handle', handle)
      .set('region_id', regionId)
      .set('fields', '*variants.calculated_price,*variants,+variants.inventory_quantity');

    return this.http
      .get<MedusaProductsResponse>(`${environment.medusaBaseUrl}/store/products`, {
        headers: this.headers,
        params,
      })
      .pipe(map((res) => res.products[0]));
  }
}