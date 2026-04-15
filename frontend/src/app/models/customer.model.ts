export interface MedusaAddress {
  id?: string;
  customer_id?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  has_account?: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  addresses?: MedusaAddress[];
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
  items?: any[];
  shipping_address?: MedusaAddress;
}

export interface MedusaAuthResponse {
  token: string;
}

export interface MedusaCustomerResponse {
  customer: MedusaCustomer;
}

export interface MedusaOrdersResponse {
  orders: MedusaOrder[];
}
