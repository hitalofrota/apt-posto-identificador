import { blockService } from '../services/blockService.js';

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
      const slots = await blockService.getSlots();
      res.json(slots);
    } catch (e) {
      res.status(500).json([]);
    }
  },

  async toggleSlot(req, res) {
    const { date, time } = req.body;
    try {
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