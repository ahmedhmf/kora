export type MedusaImage = {
    id: string;
    url: string;
  }
  
  export type MedusaProductVariant = {
    id: string;
    title: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
    inventory_quantity?: number;
    manage_inventory?: boolean;
    allow_backorder?: boolean;
    options: any[];
  }
  
  export type MedusaProduct ={
    id: string;
    title: string;
    handle: string;
    description: string | null;
    subtitle: string | null;
    thumbnail: string | null;
    images: MedusaImage[];
    variants: MedusaProductVariant[];
    collection?: {
      id: string;
      title: string;
    };
    tags?: { id: string; value: string }[];
    metadata?: Record<string, unknown>;
  }
  
  export type MedusaProductsResponse = {
    products: MedusaProduct[];
    count: number;
    offset: number;
    limit: number;
  }

  export type MedusaProductResponse = {
    product: MedusaProduct;
  }