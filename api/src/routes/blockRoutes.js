import { Router } from 'express';
import { blockController } from '../controllers/blockController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/dates', authMiddleware, blockController.getDates);
router.post('/date', authMiddleware, blockController.toggleDate);
router.get('/slots', authMiddleware, blockController.getSlots);
router.post('/slot', authMiddleware, blockController.toggleSlot);
router.post('/month', authMiddleware, blockController.toggleMonth);

export default router;
