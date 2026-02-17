import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Product } from '../models/types';
import { MedusaService } from './medusa.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private medusaService = inject(MedusaService);

    getProducts(): Observable<Product[]> {
        return from(this.medusaService.client.store.product.list()).pipe(
            map((response: any) => response.products.map((p: any) => this.mapMedusaProduct(p)))
        );
    }

    getProductByHandle(handle: string): Observable<Product | undefined> {
        // In v2, filtering by handle list is more precise than 'q'
        return from(this.medusaService.client.store.product.list({ handle: [handle] })).pipe(
            map((response: any) => {
                const product = response.products[0];
                return product ? this.mapMedusaProduct(product) : undefined;
            })
        );
    }

    getProductsByCategory(category: string): Observable<Product[]> {
        return from(this.medusaService.client.store.product.list({ category_id: [category] })).pipe(
            map((response: any) => response.products.map((p: any) => this.mapMedusaProduct(p)))
        );
    }

    private mapMedusaProduct(p: any): Product {
        // Medusa v2 response structure mapping
        const firstVariant = p.variants?.[0];
        const firstPrice = firstVariant?.calculated_price || firstVariant?.prices?.[0];

        return {
            id: p.id,
            handle: p.handle,
            title: p.title,
            description: p.description || '',
            price: (firstPrice?.amount / 100) || 0,
            currency: (firstPrice?.currency_code?.toUpperCase()) || 'EUR',
            thumbnail: p.thumbnail || '',
            images: p.images?.map((img: any) => img.url) || [],
            category: p.categories?.[0]?.handle || 'football',
            tags: p.tags?.map((t: any) => t.value) || [],
            status: p.status === 'published' ? 'published' : 'draft',
            options: p.options?.map((o: any) => ({
                id: o.id,
                title: o.title,
                values: o.values?.map((v: any) => v.value) || []
            })) || [],
            variants: p.variants?.map((v: any) => {
                const vPrice = v.calculated_price || v.prices?.[0];
                return {
                    id: v.id,
                    title: v.title,
                    sku: v.sku || '',
                    price: (vPrice?.amount / 100) || 0,
                    options: v.options?.reduce((acc: any, o: any) => {
                        acc[o.title] = o.value; // In v2, options might have titles directly
                        return acc;
                    }, {}) || {},
                    inventory_quantity: v.inventory_quantity || 0
                };
            }) || []
        };
    }
}

