export interface Order {
  id: number;
  customer_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}
