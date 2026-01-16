import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// --- ROTAS PÚBLICAS
router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', appointmentController.create);
router.patch('/:id/rate', appointmentController.rate);

// --- ROTAS PRIVADAS
router.get('/', authMiddleware, appointmentController.list);
router.put('/:id', authMiddleware, appointmentController.update);
router.delete('/:id', authMiddleware, appointmentController.cancel);

export default router;