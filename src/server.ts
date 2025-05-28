import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.routes';
import customersRouter from './routes/customers.routes';
import ordersRouter from './routes/orders.routes';
import checkoutRoutes from './routes/checkoutRoutes';
import { checkDbConnection } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await checkDbConnection();

    const app = express();

    // Middleware
    app.use(
      cors({
        origin: process.env.CLIENT_URL || '*',
        credentials: true,
      })
    );
    app.use(express.json());

    // Routes
    app.use('/api/products', productsRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/orders', ordersRouter);
    app.use('/api/checkout', checkoutRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
