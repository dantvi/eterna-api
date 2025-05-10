import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../models/products.model';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const products = await getAllProducts();
  res.json(products);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const product = await getProductById(id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, image_url, stock, category_id } = req.body;
  if (
    !name ||
    !description ||
    price == null ||
    !image_url ||
    stock == null ||
    category_id == null
  ) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  const newProductId = await createProduct({
    name,
    description,
    price,
    image_url,
    stock,
    category_id,
  });
  const newProduct = await getProductById(newProductId);
  res.status(201).json(newProduct);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const product = await getProductById(id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  await updateProduct(id, req.body);
  const updatedProduct = await getProductById(id);
  res.json(updatedProduct);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const product = await getProductById(id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  await deleteProduct(id);
  res.status(204).send();
};
