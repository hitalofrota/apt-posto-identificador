import { appointmentService } from '../services/appointmentService.js';
import { mapAppointment } from '../utils/mapper.js';

export const appointmentController = {
  async getSlots(req, res) {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).json({ error: "Data é obrigatória" });
      const slots = await appointmentService.getAvailableSlots(date);
      res.json(slots);
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
    }
  },

  async list(req, res) {
    try {
      const apps = await appointmentService.getAll();
      res.json(apps.map(mapAppointment));
    } catch (e) {
      res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  },

  async listByCpf(req, res) {
    try {
      const apps = await appointmentService.getByCpf(req.params.cpf);
      res.json(apps.map(mapAppointment));
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar agendamentos por CPF" });
    }
  },

  async create(req, res) {
    try {
      const newApp = await appointmentService.create(req.body);
      res.status(201).json(mapAppointment(newApp));
    } catch (e) {
      if (e.message === "LIMITE_VIZINHO_ATINGIDO") {
        return res.status(400).json({ 
          error: "Limite atingido. Máximo de 2 agendamentos de vizinhos por dia." 
        });
      }
      if (e.message === "CEP_INVALIDO") return res.status(400).json({ error: "CEP inválido." });
      res.status(400).json({ error: "Erro ao criar agendamento." });
    }
  },

  async update(req, res) {
    try {
      const updated = await appointmentService.update(req.params.id, req.body);
      res.json(mapAppointment(updated));
    } catch (e) {
      res.status(400).json({ error: "Erro ao atualizar agendamento" });
    }
  },

  async rate(req, res) {
    try {
      const { rating, feedback } = req.body;
      const updated = await appointmentService.update(req.params.id, {
        rating: Number(rating), feedback, status: 'completed'
      });
      res.json(mapAppointment(updated));
    } catch (e) {
      res.status(400).json({ error: "Erro ao salvar avaliação" });
    }
  },

  async cancel(req, res) {
    try {
      await appointmentService.update(req.params.id, { status: 'cancelled' });
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Erro ao cancelar agendamento" });
    }
  }
};