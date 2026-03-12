import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { slotsLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/slots', slotsLimiter,  appointmentController.getSlots); 

// 2. Outras rotas públicas
router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', appointmentController.create);
router.patch('/:id/rate', appointmentController.rate);

// --- ROTAS PRIVADAS (Acesso apenas para Administradores com Token)

router.get('/', appointmentController.list); 

router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.cancel);

export default router;