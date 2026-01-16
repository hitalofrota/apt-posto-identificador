import { Router } from 'express';
import { blockController } from '../controllers/blockController.js';

const router = Router();

router.get('/dates', blockController.getDates);
router.post('/date', blockController.toggleDate);
router.get('/slots', blockController.getSlots);
router.post('/slot', blockController.toggleSlot);
router.post('/month', blockController.toggleMonth);

export default router;