export interface Product {
    id: string;
    handle: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    thumbnail: string;
    category: 'handball' | 'football';
    tags: string[];
    options: ProductOption[];
    variants: ProductVariant[];
    status: 'published' | 'draft';
}

export interface ProductOption {
    id: string;
    title: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    title: string;
    sku: string;
    price: number;
    options: Record<string, string>; // e.g., { "Size": "Size 5", "Color": "Red" }
    inventory_quantity: number;
}

export interface CartItem {
    id: string; // Line item ID
    variant_id: string;
    product_id: string;
    title: string;
    thumbnail: string;
    quantity: number;
    unit_price: number;
    variant_title: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    currency: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}
