import { pool } from '../config/db';
import { Order, OrderItem } from '../types/order';

export const createOrder = async (
  order: Omit<Order, 'id' | 'created_at'>,
  items: Omit<OrderItem, 'id'>[]
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_id, total_price, status, created_at) VALUES (?, ?, ?, NOW())',
      [order.customer_id, order.total_price, order.status]
    );
    const orderId = (orderResult as any).insertId;
    const itemInserts = items.map((item) =>
      conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.product_id, item.quantity]
      )
    );
    await Promise.all(itemInserts);
    await conn.commit();
    return orderId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  const [rows] = await pool.query(
    'SELECT * FROM orders ORDER BY created_at DESC'
  );
  return rows as Order[];
};

export const getOrderById = async (
  id: number
): Promise<{ order: Order; items: OrderItem[] } | null> => {
  const [orderRows] = await pool.query(
    'SELECT * FROM orders WHERE id = ? LIMIT 1',
    [id]
  );
  const order = (orderRows as Order[])[0];
  if (!order) return null;
  const [itemRows] = await pool.query(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
    [id]
  );
  return {
    order,
    items: itemRows as OrderItem[],
  };
};

export const getOrdersByCustomer = async (
  customerId: number
): Promise<Order[]> => {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
    [customerId]
  );
  return rows as Order[];
};

export const updateOrder = async (
  id: number,
  data: Partial<Omit<Order, 'id' | 'created_at'>>
): Promise<void> => {
  const fields = Object.entries(data);
  if (fields.length === 0) return;
  const setClause = fields.map(([key]) => `${key} = ?`).join(', ');
  const values: (string | number | null)[] = fields.map(
    ([, value]) => value as string | number | null
  );
  values.push(id);
  await pool.query(`UPDATE orders SET ${setClause} WHERE id = ?`, values);
};

export const deleteOrder = async (id: number): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    await conn.query('DELETE FROM orders WHERE id = ?', [id]);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
