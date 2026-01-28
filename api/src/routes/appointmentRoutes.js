import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// --- ROTAS PÚBLICAS
router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', appointmentController.create);
router.patch('/:id/rate', appointmentController.rate);
router.get('/', appointmentController.list);

// --- ROTAS PRIVADAS
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.cancel);

export default router;