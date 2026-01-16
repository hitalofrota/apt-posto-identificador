import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';

const router = Router();

// Rota: GET /appointments
router.get('/', appointmentController.list);

// Rota: GET /appointments/citizen/:cpf
router.get('/citizen/:cpf', appointmentController.listByCpf);

// Rota: POST /appointments
router.post('/', appointmentController.create);

// Rota: PUT /appointments/:id
router.put('/:id', appointmentController.update);

// Rota: PATCH /appointments/:id/rate
router.patch('/:id/rate', appointmentController.rate);

// Rota: DELETE /appointments/:id
router.delete('/:id', appointmentController.cancel);

export default router;