import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', ItemController.create);
router.get('/', ItemController.findAll);
router.put('/:id', ItemController.update);
router.delete('/:id', ItemController.delete);

export default router;
