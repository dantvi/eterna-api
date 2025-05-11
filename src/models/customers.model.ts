import { pool } from '../config/db';
import { Customer } from '../types/customer';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const [rows] = await pool.query('SELECT * FROM customers ORDER BY id DESC');
  return rows as Customer[];
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const [rows] = await pool.query(
    'SELECT * FROM customers WHERE id = ? LIMIT 1',
    [id]
  );
  const result = (rows as Customer[])[0];
  return result || null;
};

export const createCustomer = async (
  customer: Omit<Customer, 'id'>
): Promise<number> => {
  const { name, email, phone, address } = customer;
  const [result] = await pool.query(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email, phone, address]
  );
  return (result as any).insertId;
};

export const updateCustomer = async (
  id: number,
  customer: Partial<Omit<Customer, 'id'>>
): Promise<void> => {
  const fields = Object.entries(customer);
  if (fields.length === 0) return;
  const setClause = fields.map(([key]) => `${key} = ?`).join(', ');
  const values: (string | number | null)[] = fields.map(
    ([, value]) => value as string | number | null
  );
  values.push(id);
  await pool.query(`UPDATE customers SET ${setClause} WHERE id = ?`, values);
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM customers WHERE id = ?', [id]);
};
