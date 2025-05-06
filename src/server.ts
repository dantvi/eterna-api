import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
