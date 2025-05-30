import express from 'express';
import bodyParser from 'body-parser';
import { stripeWebhookHandler } from '../controllers/webhook.controller';

const router = express.Router();

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

export default router;
