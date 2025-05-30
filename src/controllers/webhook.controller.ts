import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { db } from '../config/db';

export const stripeWebhookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  if (!sig) {
    console.error('[Webhook] Missing Stripe-Signature header');
    res.status(400).send('Webhook Error: No signature');
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    const stripeSessionId = session.id;

    if (orderId) {
      try {
        await db.query(
          `UPDATE orders SET payment_status = 'Paid', order_status = 'Received', payment_id = ? WHERE id = ?`,
          [stripeSessionId, orderId]
        );
        console.log(`[Webhook] Order ${orderId} updated as paid`);
        // TODO: await updateProductStockForOrder(Number(orderId));
      } catch (err) {
        console.error('[Webhook] DB update failed:', err);
      }
    } else {
      console.error('[Webhook] No orderId in session metadata');
    }
  }

  res.status(200).send('Webhook received');
};
