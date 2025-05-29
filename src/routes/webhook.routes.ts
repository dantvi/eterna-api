import express from 'express';
import { stripeWebhook } from '../controllers/webhook.controller';

const router = express.Router();

router.post('/stripe', stripeWebhook);

export default router;
