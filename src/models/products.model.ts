import { pool } from '../config/db';
import { Product } from '../types/product';

export const getAllProducts = async (): Promise<Product[]> => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  return rows as Product[];
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const result = (rows as Product[])[0];
  return result || null;
};

export const createProduct = async (
  product: Omit<Product, 'id'>
): Promise<number> => {
  const { name, description, price, image_url, stock, category_id } = product;
  const [result] = await pool.query(
    `INSERT INTO products
     (name, description, price, image_url, stock, category_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, image_url, stock, category_id]
  );
  return (result as any).insertId;
};

export const updateProduct = async (
  id: number,
  product: Partial<Omit<Product, 'id'>>
): Promise<void> => {
  const fields = Object.entries(product);
  if (fields.length === 0) return;
  const setClause = fields.map(([key]) => `${key} = ?`).join(', ');
  const values = fields.map(([, value]) => value);
  values.push(id);
  await pool.query(`UPDATE products SET ${setClause} WHERE id = ?`, values);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
};
