import { PrismaClient } from '@prisma/client';
import { generateProtocol, mapAppointment } from '../utils/mapper.js';

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
    const apps = await prisma.appointment.findMany({ 
      orderBy: { date: 'desc' } 
    });
    return apps.map(mapAppointment);
  },

  async getByCpf(cpf) {
    const cleanCpf = cpf.replace(/\D/g, "");
    const apps = await prisma.appointment.findMany({
      where: { citizenCpf: cleanCpf },
      orderBy: { date: 'desc' }
    });
    return apps.map(mapAppointment);
  },

  async create(data) {
    const { 
      date, time, citizenName, citizenPhone, citizenEmail, 
      citizenCpf, citizenHasCpf, citizenCep, serviceId, serviceName, ...rest 
    } = data;

    const sanitizedDate = date?.trim().substring(0, 10);
    const sanitizedTime = time?.trim().substring(0, 5);

    const cleanCep = citizenCep?.replace(/\D/g, "");
    if (!cleanCep || cleanCep.length !== 8) {
      throw new Error("CEP_INVALIDO");
    }

    const cleanCpf = citizenCpf?.replace(/\D/g, "");
    const cleanPhone = citizenPhone?.replace(/\D/g, "");

    if (!isLocalCity(cleanCep)) {
      const activeAppointmentsCount = await prisma.appointment.count({
        where: {
          date: sanitizedDate, 
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

    const newAppointment = await prisma.appointment.create({
      data: {
        ...rest,
        serviceId: String(serviceId),
        serviceName,
        date: sanitizedDate,
        time: sanitizedTime,
        protocol: generateProtocol(sanitizedDate, sanitizedTime),
        citizenName,
        citizenPhone: cleanPhone,
        citizenEmail: citizenEmail || null,
        citizenCpf: cleanCpf || null,
        citizenHasCpf: !!citizenHasCpf,
        citizenCep: cleanCep,
        status: 'scheduled'
      }
    });

    return mapAppointment(newAppointment);
  },

  async update(id, data) {
    const { date, time, citizenName, citizenPhone, citizenEmail, citizenCpf, citizenCep, ...rest } = data;
    
    const sanitizedDate = date ? date.trim().substring(0, 10) : undefined;
    const sanitizedTime = time ? time.trim().substring(0, 5) : undefined;

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(sanitizedDate && { date: sanitizedDate }),
        ...(sanitizedTime && { time: sanitizedTime }),
        ...(citizenName && { citizenName }),
        ...(citizenPhone && { citizenPhone: citizenPhone.replace(/\D/g, "") }),
        ...(citizenEmail && { citizenEmail }),
        ...(citizenCpf && { citizenCpf: citizenCpf.replace(/\D/g, "") }),
        ...(citizenCep && { citizenCep: citizenCep.replace(/\D/g, "") })
      }
    });

    return mapAppointment(updatedAppointment);
  }
};