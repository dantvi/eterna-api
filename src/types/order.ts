import { Timestamp } from 'firebase-admin/firestore';

export interface Order {
  id: string;
  customer_id: string;
  total_price: number;
  status:
    | 'pending'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  created_at?: Timestamp;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
}
