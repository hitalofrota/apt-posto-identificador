import { PrismaClient } from '@prisma/client';
import { generateProtocol } from '../utils/mapper.js';

const prisma = new PrismaClient();

export const appointmentService = {
  async getAll() {
    return await prisma.appointment.findMany({ orderBy: { date: 'desc' } });
  },

  async getByCpf(cpf) {
    const cleanCpf = cpf.replace(/\D/g, "");
    return await prisma.appointment.findMany({
      where: { citizenCpf: cleanCpf },
      orderBy: { date: 'desc' }
    });
  },

  async create(data) {
    const { date, time, citizen } = data;
    return await prisma.appointment.create({
      data: {
        ...data,
        protocol: generateProtocol(date, time),
        citizenName: citizen.name,
        citizenPhone: citizen.phone,
        citizenEmail: citizen.email,
        citizenCpf: citizen.cpf?.replace(/\D/g, ""),
        citizenHasCpf: !!citizen.hasCpf,
        status: 'scheduled'
      }
    });
  },

  async update(id, { citizen, ...rest }) {
    return await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(citizen && {
          citizenName: citizen.name,
          citizenPhone: citizen.phone,
          citizenEmail: citizen.email,
          citizenCpf: citizen.cpf?.replace(/\D/g, "")
        })
      }
    });
  }
};