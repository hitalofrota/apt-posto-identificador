import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

//aqui que é adicionado o ratelimit
router.get('/slots', appointmentController.getSlots);

router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', appointmentController.create);
router.patch('/:id/rate', appointmentController.rate);

// --- ROTAS PRIVADAS (Acesso apenas para Administradores com Token)

router.get('/', authMiddleware, appointmentController.list);
router.put('/:id', authMiddleware, appointmentController.update);
router.delete('/:id', authMiddleware, appointmentController.cancel);

export default router;
