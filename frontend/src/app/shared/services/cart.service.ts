import { Injectable, computed, signal, inject } from '@angular/core';
import { from, tap } from 'rxjs';
import { Cart, CartItem, Product, ProductVariant } from '../models/types';
import { MedusaService } from './medusa.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private medusaService = inject(MedusaService);
    private readonly CART_ID_KEY = 'medusa_cart_id';

    // Signal to hold the current cart state
    private cartState = signal<Cart>({
        id: '',
        items: [],
        subtotal: 0,
        currency: 'EUR'
    });

    // Signal for drawer visibility
    private isDrawerOpen = signal(false);

    // Public readonly signals for components to consume
    readonly cart = this.cartState.asReadonly();
    readonly isOpen = this.isDrawerOpen.asReadonly();
    readonly items = computed(() => this.cart().items);
    readonly count = computed(() => this.cart().items.reduce((acc, item) => acc + item.quantity, 0));
    readonly subtotal = computed(() => this.cart().subtotal);

    constructor() {
        this.initializeCart();
    }

    toggleDrawer(open?: boolean) {
        this.isDrawerOpen.update(val => open !== undefined ? open : !val);
    }

    private async initializeCart() {
        // Fetch available regions first
        let regions: any[] = [];
        try {
            const response = await this.medusaService.client.store.region.list();
            regions = response.regions;
        } catch (error) {
            console.error('Failed to fetch regions', error);
        }

        const defaultRegionId = regions.length > 0 ? regions[0].id : undefined;
        const savedCartId = localStorage.getItem(this.CART_ID_KEY);

        if (savedCartId) {
            try {
                const { cart } = await this.medusaService.client.store.cart.retrieve(savedCartId);

                // CRITICAL: In Medusa v2, a cart must have a region for pricing to work.
                // If the retrieved cart is missing a region (e.g., from an older session), we should create a new one.
                if (cart && cart.region_id) {
                    this.updateCartState(cart);
                    return;
                }

                console.warn('Retrieved cart is missing a region ID, creating a new one.');
            } catch (error) {
                console.error('Failed to retrieve cart', error);
            }
        }

        // Create a new cart with the default region
        try {
            const { cart } = await this.medusaService.client.store.cart.create({
                region_id: defaultRegionId
            });
            localStorage.setItem(this.CART_ID_KEY, cart.id);
            this.updateCartState(cart);
        } catch (error) {
            console.error('Failed to create cart with region', error);
        }
    }

    addToCart(product: Product, variant: ProductVariant, quantity: number = 1) {
        from(this.medusaService.client.store.cart.createLineItem(this.cart().id, {
            variant_id: variant.id,
            quantity
        })).subscribe(({ cart }) => {
            this.updateCartState(cart);
            this.toggleDrawer(true);
        });
    }

    removeFromCart(lineItemId: string) {
        from(this.medusaService.client.store.cart.deleteLineItem(this.cart().id, lineItemId))
            .subscribe((response: any) => {
                // In Medusa v2, deleteLineItem returns the cart in the 'parent' property
                const updatedCart = response.parent || response.cart;
                if (updatedCart) {
                    this.updateCartState(updatedCart);
                }
            });
    }

    updateQuantity(lineItemId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(lineItemId);
            return;
        }

        from(this.medusaService.client.store.cart.updateLineItem(this.cart().id, lineItemId, {
            quantity
        })).subscribe(({ cart }) => {
            this.updateCartState(cart);
        });
    }

    private updateCartState(medusaCart: any) {
        if (!medusaCart) {
            console.error('updateCartState called with null or undefined cart');
            return;
        }

        this.cartState.set({
            id: medusaCart.id,
            currency: medusaCart.currency_code?.toUpperCase() || 'EUR',
            subtotal: (medusaCart.subtotal / 100) || 0,
            items: medusaCart.items?.map((item: any) => ({
                id: item.id,
                variant_id: item.variant_id,
                product_id: item.variant?.product_id,
                title: item.title,
                thumbnail: item.thumbnail,
                quantity: item.quantity,
                unit_price: (item.unit_price / 100) || 0,
                variant_title: item.variant?.title
            })) || []
        });
    }
}
