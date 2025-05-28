import { Request, Response } from 'express';
import { createCheckoutSession } from '../services/stripe/checkoutService';
import { CheckoutItem } from '../types/checkout';

export const handleCreateCheckoutSession = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerEmail, items } = req.body;
    if (!customerEmail || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing or invalid request data' });
    }
    const typedItems = items as CheckoutItem[];
    const sessionUrl = await createCheckoutSession(customerEmail, typedItems);
    return res.status(200).json({ url: sessionUrl });
  } catch (error) {
    console.error('[checkoutController] Error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
