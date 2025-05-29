import stripe from './stripeClient';
import { CheckoutItem } from '../../types/checkout';

export const createCheckoutSession = async (
  customerEmail: string,
  items: CheckoutItem[]
): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    if (!session.url) {
      throw new Error('Stripe session did not return a URL');
    }
    return session.url;
  } catch (err) {
    console.error('[checkoutService] Failed to create session:', err);
    throw new Error('Could not create Stripe Checkout session');
  }
};
