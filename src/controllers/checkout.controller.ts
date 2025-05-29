import { Request, Response } from 'express';
import { createCheckoutSession } from '../services/stripe/checkout.service';
import { CheckoutItem } from '../types/checkout';

export const handleCreateCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerEmail, items } = req.body;
    if (!customerEmail || !items || !Array.isArray(items)) {
      res.status(400).json({ error: 'Missing or invalid request data' });
      return;
    }
    const typedItems = items as CheckoutItem[];
    const sessionUrl = await createCheckoutSession(customerEmail, typedItems);
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    console.error('[checkoutController] Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
