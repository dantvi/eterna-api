import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
  getByStripeSessionId,
} from '../controllers/orders.controller';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/confirmation/session/:sessionId', getByStripeSessionId);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
