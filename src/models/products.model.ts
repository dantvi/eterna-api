import { db } from '../config/firestore';
import { Product } from '../types/product';
import admin from 'firebase-admin';

export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await db
    .collection('products')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const doc = await db.collection('products').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Omit<Product, 'id'>) };
};

export const createProduct = async (
  product: Omit<Product, 'id'>
): Promise<string> => {
  const docRef = await db.collection('products').add({
    ...product,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id'>>
): Promise<void> => {
  await db.collection('products').doc(id).update(product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await db.collection('products').doc(id).delete();
};
