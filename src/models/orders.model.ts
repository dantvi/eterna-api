import { db } from '../config/firestore';
import { Order, OrderItem } from '../types/order';
import admin from 'firebase-admin';

export const createOrder = async (
  order: Omit<Order, 'id' | 'created_at'>,
  items: Omit<OrderItem, 'id'>[]
): Promise<string> => {
  const batch = db.batch();

  const orderRef = db.collection('orders').doc();
  batch.set(orderRef, {
    customer_id: order.customer_id,
    total_price: order.total_price,
    status: order.status,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  items.forEach((item) => {
    const itemRef = orderRef.collection('items').doc();
    batch.set(itemRef, {
      product_id: item.product_id,
      quantity: item.quantity,
    });
  });

  await batch.commit();
  return orderRef.id;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const snapshot = await db
    .collection('orders')
    .orderBy('created_at', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
};

export const getOrderById = async (
  id: string
): Promise<{ order: Order; items: OrderItem[] } | null> => {
  const orderDoc = await db.collection('orders').doc(id).get();
  if (!orderDoc.exists) return null;

  const order = { id: orderDoc.id, ...orderDoc.data() } as Order;

  const itemsSnapshot = await db
    .collection('orders')
    .doc(id)
    .collection('items')
    .get();
  const items = itemsSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as OrderItem)
  );

  return { order, items };
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const snapshot = await db
    .collection('orders')
    .where('customer_id', '==', customerId)
    .orderBy('created_at', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrder = async (
  id: string,
  data: Partial<Omit<Order, 'id' | 'created_at'>>
): Promise<void> => {
  await db.collection('orders').doc(id).update(data);
};

export const deleteOrder = async (id: string): Promise<void> => {
  const batch = db.batch();
  const orderRef = db.collection('orders').doc(id);

  const itemsSnapshot = await orderRef.collection('items').get();
  itemsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(orderRef);

  await batch.commit();
};
