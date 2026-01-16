import { userService } from '../services/userService.js';

export const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await userService.authenticate({ username, password });

      if (!result) {
        return res.status(401).json({ error: "Usuário ou senha inválidos" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
};