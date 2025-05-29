import stripe from './stripeClient';

export const handleCheckoutCompleted = async (
  rawBody: Buffer,
  signature: string
): Promise<{ success: boolean }> => {
  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      endpointSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('[webhook.service] Session completed:', session);
      // TODO: Extract metadata and update order in database

      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error('[webhook.service] Signature verification failed:', err);
    return { success: false };
  }
};
