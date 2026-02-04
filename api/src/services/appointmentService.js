import { PrismaClient } from '@prisma/client';
import { generateProtocol } from '../utils/mapper.js';

const prisma = new PrismaClient();

// Função auxiliar para verificar se o CEP pertence a Ibicuitinga (62955-000 a 62959-999)
const isLocalCity = (cep) => {
  if (!cep) return false;
  const cleanCep = cep.replace(/\D/g, "");
  const numCep = parseInt(cleanCep);
  return numCep >= 62955000 && numCep <= 62959999;
};

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
      date, time, citizenName, citizenPhone, citizenEmail, 
      citizenCpf, citizenHasCpf, citizenCep, serviceId, serviceName, ...rest 
    } = data;

    const cleanCep = citizenCep?.replace(/\D/g, "");
    if (!cleanCep || cleanCep.length !== 8) {
      throw new Error("CEP_INVALIDO");
    }

    const cleanCpf = citizenCpf?.replace(/\D/g, "");
    const cleanPhone = citizenPhone?.replace(/\D/g, "");

    if (!isLocalCity(cleanCep)) {
      const activeAppointmentsCount = await prisma.appointment.count({
        where: {
          date: date, 
          status: 'scheduled',
          NOT: {
            citizenCep: {
              startsWith: '6295',
            }
          }
        }
      });

      if (activeAppointmentsCount >= 2) { 
        throw new Error("LIMITE_VIZINHO_ATINGIDO");
      }
    }

    return await prisma.appointment.create({
      data: {
        ...rest,
        serviceId: String(serviceId),
        serviceName,
        date,
        time,
        protocol: generateProtocol(date, time),
        citizenName,
        citizenPhone: cleanPhone,
        citizenEmail: citizenEmail || null,
        citizenCpf: cleanCpf || null,
        citizenHasCpf: !!citizenHasCpf,
        citizenCep: cleanCep,
        status: 'scheduled'
      }
    });
  },

  async update(id, data) {
    const { citizenName, citizenPhone, citizenEmail, citizenCpf, citizenCep, ...rest } = data;
    return await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(citizenName && { citizenName }),
        ...(citizenPhone && { citizenPhone: citizenPhone.replace(/\D/g, "") }),
        ...(citizenEmail && { citizenEmail }),
        ...(citizenCpf && { citizenCpf: citizenCpf.replace(/\D/g, "") }),
        ...(citizenCep && { citizenCep: citizenCep.replace(/\D/g, "") })
      }
    });
  }
};