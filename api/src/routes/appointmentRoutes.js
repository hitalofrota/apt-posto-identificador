import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';

const router = Router();

router.get('/', appointmentController.list);
router.get('/citizen/:cpf', appointmentController.listByCpf);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.patch('/:id/rate', appointmentController.rate);
router.delete('/:id', appointmentController.cancel);

export default router;