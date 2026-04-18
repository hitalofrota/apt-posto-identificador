import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { slotsLimiter } from '../middlewares/rateLimiter.js';
import { verifyRecaptcha } from '../middlewares/recaptcha.js';

const router = Router();

router.get('/slots', slotsLimiter, appointmentController.getSlots);

router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', verifyRecaptcha, appointmentController.create);
router.patch('/:id/rate', appointmentController.rate);

// --- ROTAS PRIVADAS (Acesso apenas para Administradores com Token)

router.get('/', authMiddleware, appointmentController.list);
router.put('/:id', authMiddleware, appointmentController.update);
router.delete('/:id', authMiddleware, appointmentController.cancel);

export default router;
