import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Helper para padronizar a resposta do Cidadão (Citizen)
const mapAppointment = (app) => ({
  ...app,
  citizen: {
    name: app.citizenName,
    phone: app.citizenPhone,
    email: app.citizenEmail,
    cpf: app.citizenCpf,
    hasCpf: app.citizenHasCpf
  }
});

// --- ROTAS DE AGENDAMENTO ---

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(appointments.map(mapAppointment));
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

app.get('/appointments/citizen/:cpf', async (req, res) => {
  const cleanCpf = req.params.cpf.replace(/\D/g, "");
  try {
    const appointments = await prisma.appointment.findMany({
      where: { citizenCpf: cleanCpf },
      orderBy: { date: 'desc' }
    });
    res.json(appointments.map(mapAppointment));
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos por CPF" });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const { date, time, serviceId, serviceName, citizen, customDescription } = req.body;
    
    // Protocolo mais robusto: Data + Hora + Random
    const protocol = `${date.replace(/-/g, "")}${time.replace(/:/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment = await prisma.appointment.create({
      data: {
        protocol,
        date,
        time,
        serviceId,
        serviceName,
        customDescription,
        citizenName: citizen.name,
        citizenPhone: citizen.phone,
        citizenEmail: citizen.email,
        citizenCpf: citizen.cpf?.replace(/\D/g, ""),
        citizenHasCpf: !!citizen.hasCpf,
        status: 'scheduled'
      }
    });
    res.status(201).json(mapAppointment(newAppointment));
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar agendamento" });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { citizen, ...rest } = req.body;

  try {
    const updated = await prisma.appointment.update({
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
    res.json(mapAppointment(updated));
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar agendamento" });
  }
});

app.patch('/appointments/:id/rate', async (req, res) => {
  try {
    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        rating: Number(req.body.rating),
        feedback: req.body.feedback,
        status: 'completed' 
      }
    });
    res.json(mapAppointment(updated));
  } catch (error) {
    res.status(400).json({ error: "Erro ao salvar avaliação" });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  try {
    await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao cancelar" });
  }
});

// --- ROTAS DE BLOQUEIO ---

app.get('/blocks/dates', async (req, res) => {
  const dates = await prisma.blockedDate.findMany();
  res.json(dates.map(d => d.date));
});

app.post('/blocks/date', async (req, res) => {
  const { date } = req.body;
  try {
    const existing = await prisma.blockedDate.findUnique({ where: { date } });
    if (existing) {
      await prisma.blockedDate.delete({ where: { date } });
      return res.json({ action: "unblocked" });
    }
    await prisma.blockedDate.create({ data: { date } });
    res.json({ action: "blocked" });
  } catch (e) { res.status(500).send(); }
});

app.get('/blocks/slots', async (req, res) => {
  const slots = await prisma.blockedSlot.findMany();
  res.json(slots.map(s => `${s.date}|${s.time}`));
});

app.post('/blocks/slot', async (req, res) => {
  const { date, time } = req.body;
  try {
    const existing = await prisma.blockedSlot.findUnique({
      where: { date_time: { date, time } }
    });

    if (existing) {
      await prisma.blockedSlot.delete({ where: { id: existing.id } });
      return res.json({ action: "unblocked" });
    }
    await prisma.blockedSlot.create({ data: { date, time } });
    res.json({ action: "blocked" });
  } catch (e) { res.status(500).send(); }
});

app.post('/blocks/month', async (req, res) => {
  const { month } = req.body; // Formato esperado: "YYYY-MM"
  try {
    const start = startOfMonth(parseISO(`${month}-01`));
    const end = endOfMonth(start);
    const workDays = eachDayOfInterval({ start, end })
      .filter(d => !isWeekend(d))
      .map(d => format(d, "yyyy-MM-dd"));

    const currentBlocks = await prisma.blockedDate.findMany({
      where: { date: { in: workDays } }
    });

    // Se todos os dias úteis já estão bloqueados, liberamos o mês
    if (currentBlocks.length === workDays.length) {
      await prisma.blockedDate.deleteMany({ where: { date: { in: workDays } } });
      res.json({ action: "unblocked_month" });
    } else {
      // Bloqueia todos os dias úteis (skipDuplicates evita erro se alguns já existirem)
      await prisma.blockedDate.createMany({
        data: workDays.map(d => ({ date: d })),
        skipDuplicates: true
      });
      res.json({ action: "blocked_month" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro no bloqueio mensal" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));