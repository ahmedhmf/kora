import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MedusaCustomer, MedusaAuthResponse, MedusaCustomerResponse } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  // Storage keys
  private readonly TOKEN_KEY = 'medusa_token';
  
  // Signal for current user state
  currentUser = signal<MedusaCustomer | null>(null);
  loading = signal<boolean>(false);

  private get headers(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers: any = {
      'x-publishable-api-key': environment.medusaPublishableKey,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  constructor() {
    this.loadUser();
  }

  /** Fetch current user on app initialization */
  private loadUser() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return;

    this.loading.set(true);
    this.http.get<MedusaCustomerResponse>(`${environment.medusaBaseUrl}/store/customers/me`, { headers: this.headers })
      .pipe(
        tap(res => this.currentUser.set(res.customer)),
        catchError(() => {
          this.logout();
          return of(null);
        }),
        tap(() => this.loading.set(false))
      ).subscribe();
  }

  /** Login user */
  login(email: string, password: string): Observable<any> {
    return this.http.post<MedusaAuthResponse>(`${environment.medusaBaseUrl}/auth/customer/emailpass`, {
      email,
      password
    }, { headers: this.headers }).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          this.loadUser();
        }
      })
    );
  }

  /** Register user - Medusa v2 two-step flow */
  register(data: any): Observable<any> {
    // Step 1: Create Authentication Identity
    return this.http.post<any>(`${environment.medusaBaseUrl}/auth/customer/emailpass/register`, {
      email: data.email,
      password: data.password
    }, { headers: this.headers }).pipe(
      switchMap(res => {
        const registrationToken = res.token;
        const authHeaders = new HttpHeaders({
          'x-publishable-api-key': environment.medusaPublishableKey,
          'Authorization': `Bearer ${registrationToken}`
        });

        // Step 2: Create Customer record linked to the auth identity
        return this.http.post<MedusaCustomerResponse>(`${environment.medusaBaseUrl}/store/customers`, {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        }, { headers: authHeaders });
      })
    );
  }

  /** Logout user */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
  }

  /** Get orders for current user */
  getOrders(): Observable<any[]> {
    return this.http.get<any>(`${environment.medusaBaseUrl}/store/customers/me/orders`, { 
      headers: this.headers 
    }).pipe(map(res => res.orders));
  }

  /** Update customer profile details */
  updateCustomer(data: any): Observable<MedusaCustomerResponse> {
    return this.http.post<MedusaCustomerResponse>(`${environment.medusaBaseUrl}/store/customers/me`, data, {
      headers: this.headers
    }).pipe(
      tap(res => this.currentUser.set(res.customer))
    );
  }

  /** Change customer password */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${environment.medusaBaseUrl}/auth/customer/emailpass/update`, {
      old_password: oldPassword,
      new_password: newPassword
    }, { headers: this.headers });
  }
}
