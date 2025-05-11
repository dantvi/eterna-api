import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/orders.controller';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
