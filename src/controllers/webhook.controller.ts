import { Request, Response } from 'express';
import { handleCheckoutCompleted } from '../services/stripe/webhook.service';

export const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
      res.status(400).send('Missing Stripe signature');
      return;
    }
    const result = await handleCheckoutCompleted(req.body, sig);
    if (result.success) {
      res.status(200).send('Webhook received');
    } else {
      res.status(400).send('Invalid webhook');
    }
  } catch (err) {
    console.error('[webhook.controller] Error:', err);
    res.status(500).send('Internal Server Error');
  }
};
