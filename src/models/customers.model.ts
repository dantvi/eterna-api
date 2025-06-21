import { db } from '../config/firestore';
import { Customer } from '../types/customer';
import admin from 'firebase-admin';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const snapshot = await db
    .collection('customers')
    .orderBy('created_at', 'desc')
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Customer)
  );
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const doc = await db.collection('customers').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Customer;
};

export const createCustomer = async (
  customer: Omit<Customer, 'id'>
): Promise<string> => {
  const docRef = await db.collection('customers').add({
    ...customer,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

export const updateCustomer = async (
  id: string,
  customer: Partial<Omit<Customer, 'id'>>
): Promise<void> => {
  await db.collection('customers').doc(id).update(customer);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await db.collection('customers').doc(id).delete();
};
