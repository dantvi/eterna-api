import { Request, Response } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../models/customers.model';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const customers = await getAllCustomers();
  res.json(customers);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const customer = await getCustomerById(id);
  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(customer);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, address } = req.body;
  if (!name || !email || !phone || !address) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  const newCustomerId = await createCustomer({ name, email, phone, address });
  const newCustomer = await getCustomerById(newCustomerId);
  res.status(201).json(newCustomer);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const existing = await getCustomerById(id);
  if (!existing) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  await updateCustomer(id, req.body);
  const updated = await getCustomerById(id);
  res.json(updated);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const customer = await getCustomerById(id);
  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  await deleteCustomer(id);
  res.status(204).send();
};
