import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import blockRoutes from './src/routes/blockRoutes.js';
import { authController } from './src/controllers/authController.js';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());


app.post('/login', authController.login);

app.post('/users/signup/create', async (req, res) => {
  try {
    const { username, password, name, signupSecret } = req.body;

    if (!signupSecret || signupSecret !== process.env.SIGNUP_SECRET) {
      return res.status(403).json({ error: "Chave de cadastro inválida" });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: "Usuário já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, name }
    });

    res.status(201).json({ id: newUser.id, username: newUser.username, name: newUser.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.use('/appointments', appointmentRoutes);
app.use('/blocks', blockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Back-end persistente na porta ${PORT}`));