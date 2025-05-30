import { Request, Response } from 'express';
import { stripe } from '../config/stripe';

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItems, orderId } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || !orderId) {
      res.status(400).json({ error: 'Missing cartItems or orderId' });
      return;
    }

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/checkout`,
      metadata: {
        orderId: String(orderId),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('[StripeController] Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
