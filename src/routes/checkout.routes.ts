import express from 'express';
import { handleCreateCheckoutSession } from '../controllers/checkout.controller';

const router = express.Router();

router.post('/create-checkout-session', handleCreateCheckoutSession);

export default router;
