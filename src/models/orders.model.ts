import { db } from '../config/firestore';
import { Order, OrderItem } from '../types/order';
import admin from 'firebase-admin';

export const createOrder = async (
  order: Omit<Order, 'id' | 'createdAt'>,
  items: Omit<OrderItem, 'id'>[]
): Promise<string> => {
  const batch = db.batch();

  const orderRef = db.collection('orders').doc();
  batch.set(orderRef, {
    customer_id: order.customer_id,
    total_price: order.total_price,
    status: order.status,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, 'id'>),
  }));
};

export const getOrderById = async (
  id: string
): Promise<{ order: Order; items: OrderItem[] } | null> => {
  const orderDoc = await db.collection('orders').doc(id).get();
  if (!orderDoc.exists) return null;

  const order = { id: orderDoc.id, ...(orderDoc.data() as Omit<Order, 'id'>) };

  const itemsSnapshot = await db
    .collection('orders')
    .doc(id)
    .collection('items')
    .get();
  const items = itemsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<OrderItem, 'id'>),
  }));

  return { order, items };
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const snapshot = await db
    .collection('orders')
    .where('customer_id', '==', customerId)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, 'id'>),
  }));
};

export const updateOrder = async (
  id: string,
  data: Partial<Omit<Order, 'id' | 'createdAt'>>
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
