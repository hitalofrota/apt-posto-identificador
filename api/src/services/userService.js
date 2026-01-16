import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

export const userService = {
  async authenticate({ username, password }) {
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      token,
      user: { name: user.name, username: user.username }
    };
  },

  async createAdminInitial() {
    const exists = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'Administrador Central'
        }
      });
      console.log("✅ Usuário admin inicial criado!");
    }
  }
};