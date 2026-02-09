import { blockService } from '../services/blockService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const blockController = {
  async getDates(req, res) {
    try {
      const dates = await blockService.getDates();
      res.json(dates);
    } catch (e) {
      res.status(500).json([]);
    }
  },

  async toggleDate(req, res) {
    try {
      const result = await blockService.toggleDate(req.body.date);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Erro ao processar bloqueio de data" });
    }
  },

  async getSlots(req, res) {
    try {
      // Recebe a data e o serviço via query params
      const { date, serviceName } = req.query;

      // 1. Pega a lista total de horários configurados
      const allSlots = await blockService.getSlots();

      // Se não houver data, retorna todos (fallback)
      if (!date) return res.json(allSlots);

      // 2. Procura agendamentos já existentes que NÃO estejam cancelados
      const occupiedAppointments = await prisma.appointment.findMany({
        where: {
          date: date,
          ...(serviceName && serviceName !== 'all' ? { serviceName } : {}),
          status: { not: 'cancelled' }
        },
        select: { time: true }
      });

      // 3. Extrai apenas as strings de horário (ex: "09:00")
      const occupiedTimes = occupiedAppointments.map(app => 
        app.time.includes('|') ? app.time.split('|')[1] : app.time
      );

      // 4. Filtra os horários disponíveis (remove os ocupados)
      const availableSlots = allSlots.filter(slot => {
        const slotTime = slot.includes('|') ? slot.split('|')[1] : slot;
        return !occupiedTimes.includes(slotTime);
      });

      res.json(availableSlots);
    } catch (e) {
      console.error("Erro no getSlots:", e);
      res.status(500).json([]);
    }
  },

  async toggleSlot(req, res) {
    const { date, time } = req.body;
    try {
      if (!date || !time) {
        return res.status(400).json({ error: "Data e horário são obrigatórios" });
      }
      const result = await blockService.toggleSlot(date, time);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Erro ao processar bloqueio de horário" });
    }
  },

  async toggleMonth(req, res) {
    try {
      const result = await blockService.toggleMonth(req.body.month);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Erro no bloqueio mensal" });
    }
  }
};