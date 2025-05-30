import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.routes';
import customersRouter from './routes/customers.routes';
import ordersRouter from './routes/orders.routes';
import checkoutRoutes from './routes/checkout.routes';
import stripeRoutes from './routes/stripe.routes';
import webhookRoutes from './routes/webhook.routes';
import { checkDbConnection } from './config/db';
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await checkDbConnection();

    const app = express();

    app.use(
      '/api/stripe/webhook',
      bodyParser.raw({ type: 'application/json' }),
      webhookRoutes
    );

    // === Middleware ===
    app.use(
      cors({
        origin: process.env.CLIENT_URL || '*',
        credentials: true,
      })
    );
    app.use(express.json());

    // === API Routes ===
    app.use('/api/products', productsRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/orders', ordersRouter);
    app.use('/api/checkout', checkoutRoutes);
    app.use('/api/stripe', stripeRoutes);

    // === Health check ===
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Stripe webhook listening at /api/stripe/webhook');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
