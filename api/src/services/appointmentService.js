import { PrismaClient } from '@prisma/client';
import { generateProtocol } from '../utils/mapper.js';

const prisma = new PrismaClient();

export const appointmentService = {
  async getAll() {
    return await prisma.appointment.findMany({ 
      orderBy: { date: 'desc' } 
    });
  },

  async getByCpf(cpf) {
    const cleanCpf = cpf.replace(/\D/g, "");
    return await prisma.appointment.findMany({
      where: { citizenCpf: cleanCpf },
      orderBy: { date: 'desc' }
    });
  },

  async create(data) {
    const { 
      date, 
      time, 
      citizenName, 
      citizenPhone, 
      citizenEmail, 
      citizenCpf, 
      citizenHasCpf,
      serviceId,
      serviceName,
      ...rest 
    } = data;

    return await prisma.appointment.create({
      data: {
        ...rest,
        serviceId: String(serviceId),
        serviceName,
        date,
        time,
        protocol: generateProtocol(date, time),
        citizenName,
        citizenPhone,
        citizenEmail: citizenEmail || null,
        citizenCpf: citizenCpf?.replace(/\D/g, ""),
        citizenHasCpf: !!citizenHasCpf,
        status: 'scheduled'
      }
    });
  },

  async update(id, data) {
    const { 
      citizenName, 
      citizenPhone, 
      citizenEmail, 
      citizenCpf, 
      ...rest 
    } = data;

    return await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(citizenName && { citizenName }),
        ...(citizenPhone && { citizenPhone }),
        ...(citizenEmail && { citizenEmail }),
        ...(citizenCpf && { citizenCpf: citizenCpf.replace(/\D/g, "") })
      }
    });
  }
};