import { PrismaClient } from '@prisma/client';
import { generateProtocol, mapAppointment } from '../utils/mapper.js';
import { toZonedTime, format } from 'date-fns-tz';

const prisma = new PrismaClient();
const TIMEZONE = 'America/Sao_Paulo';

const syncAppointmentStatuses = async () => {
  const agoraBrasilia = toZonedTime(new Date(), TIMEZONE);
  const dataHoje = format(agoraBrasilia, 'yyyy-MM-dd');
  const horaHoje = format(agoraBrasilia, 'HH:mm');

  await prisma.appointment.updateMany({
    where: {
      status: 'scheduled',
      OR: [
        { date: { lt: dataHoje } },
        { 
          AND: [
            { date: dataHoje },
            { time: { lt: horaHoje } }
          ]
        }
      ]
    },
    data: { status: 'completed' }
  });
};

const isLocalCity = (cep) => {
  if (!cep) return false;
  const cleanCep = cep.replace(/\D/g, "");
  const numCep = parseInt(cleanCep);
  return numCep >= 62955000 && numCep <= 62959999;
};

export const appointmentService = {
  // NOVO MÉTODO SEGURO: Retorna apenas booleanos de disponibilidade
  async getAvailableSlots(date) {
    await syncAppointmentStatuses();

    // Busca apenas os horários, sem dados de cidadãos
    const appointments = await prisma.appointment.findMany({
      where: { date, status: 'scheduled' },
      select: { time: true }
    });

    const blocks = await prisma.blockedSlot.findMany({
      where: { date },
      select: { time: true }
    });

    const blockedDates = await prisma.blockedDate.findUnique({
      where: { date }
    });

    const occupiedTimes = [
      ...appointments.map(a => a.time),
      ...blocks.map(b => b.time)
    ];

    const allSlots = [
      '08:00', '08:20', '08:40', '09:00', '09:20', '09:40',
      '10:00', '10:20', '10:40', '14:10', '14:30', '14:50', '15:10'
    ];

    return allSlots.map(time => ({
      time,
      available: !blockedDates && !occupiedTimes.includes(time)
    }));
  },

  async getAll() {
    await syncAppointmentStatuses();
    const apps = await prisma.appointment.findMany({ orderBy: { date: 'desc' } });
    return apps.map(app => mapAppointment(app));
  },

  async getByCpf(cpf) {
    await syncAppointmentStatuses();
    const cleanCpf = cpf.replace(/\D/g, "");
    const apps = await prisma.appointment.findMany({
      where: { citizenCpf: cleanCpf },
      orderBy: { date: 'desc' }
    });
    return apps.map(app => mapAppointment(app));
  },

  async create(data) {
    const { 
      date, time, citizenName, citizenPhone, citizenEmail, 
      citizenCpf, citizenHasCpf, citizenCep, serviceId, serviceName, ...rest 
    } = data;

    const sanitizedDate = date?.trim().substring(0, 10);
    const sanitizedTime = time?.trim().substring(0, 5);
    const agoraBrasilia = toZonedTime(new Date(), TIMEZONE);
    const agendamentoDesejado = new Date(`${sanitizedDate}T${sanitizedTime}:00`);

    if (agendamentoDesejado < agoraBrasilia) throw new Error("DATA_PASSADA");

    const cleanCep = citizenCep?.replace(/\D/g, "");
    if (!cleanCep || cleanCep.length !== 8) throw new Error("CEP_INVALIDO");

    const cleanCpf = citizenCpf?.replace(/\D/g, "");
    const cleanPhone = citizenPhone?.replace(/\D/g, "");

    if (!isLocalCity(cleanCep)) {
      const activeCount = await prisma.appointment.count({
        where: { date: sanitizedDate, status: 'scheduled', NOT: { citizenCep: { startsWith: '6295' } } }
      });
      if (activeCount >= 2) throw new Error("LIMITE_VIZINHO_ATINGIDO");
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
    const { date, time, ...rest } = data;
    const updateData = { ...rest };
    if (date) updateData.date = date.trim().substring(0, 10);
    if (time) updateData.time = time.trim().substring(0, 5);
    const updated = await prisma.appointment.update({ where: { id }, data: updateData });
    return mapAppointment(updated);
  }
};