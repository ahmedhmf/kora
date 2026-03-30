export interface MedusaCart {
  id: string;
  region_id?: string;
  currency_code: string;
  items?: MedusaLineItem[];
  subtotal?: number;
  total?: number;
  shipping_total?: number;
  tax_total?: number;
}

export interface MedusaLineItem {
  id: string;
  cart_id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total?: number;
  metadata?: Record<string, any>;
}

export interface MedusaCartResponse {
  cart: MedusaCart;
}

export interface MedusaDeleteLineItemResponse {
  id: string;
  object: 'line-item';
  deleted: boolean;
  parent: MedusaCart;
}
