import { appointmentService } from '../services/appointmentService.js';
import { mapAppointment } from '../utils/mapper.js';

export const appointmentController = {
  async list(req, res) {
    try {
      const apps = await appointmentService.getAll();
      res.json(apps.map(mapAppointment));
    } catch (e) {
      res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  },

  async create(req, res) {
    try {
      const newApp = await appointmentService.create(req.body);
      res.status(201).json(mapAppointment(newApp));
    } catch (e) {
      res.status(400).json({ error: "Erro ao criar agendamento" });
    }
  },

  async cancel(req, res) {
    try {
      await appointmentService.update(req.params.id, { status: 'cancelled' });
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Erro ao cancelar" });
    }
  }
};