import { Request, Response } from 'express';
import {
  createOrder as createOrderModel,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
} from '../models/orders.model';
import { OrderItem } from '../types/order';

export const create = async (req: Request, res: Response): Promise<void> => {
  const { customer_id, total_price, status, items } = req.body;
  if (!customer_id || !total_price || !status || !Array.isArray(items)) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  try {
    const orderId = await createOrderModel(
      { customer_id, total_price, status },
      items as Omit<OrderItem, 'id'>[]
    );
    const orderData = await getOrderById(orderId);
    res.status(201).json(orderData);
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const order = await getOrderById(id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  res.json(order);
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const customerId = req.query.customerId;
  if (customerId) {
    const orders = await getOrdersByCustomer(parseInt(customerId as string));
    res.json(orders);
  } else {
    const orders = await getAllOrders();
    res.json(orders);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const order = await getOrderById(id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  await updateOrder(id, req.body);
  const updated = await getOrderById(id);
  res.json(updated);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const order = await getOrderById(id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  await deleteOrder(id);
  res.status(204).send();
};
