import { Appointment, Service, TimeSlot } from "../types";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../constants.ts";
import {
  addMinutes,
  format,
  parse,
  isFriday,
  isWeekend,
  isBefore,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

const STORAGE_KEY = "jsm_appointments_v1";
const BLOCKED_DATES_KEY = "jsm_blocked_dates_v1";
const BLOCKED_SLOTS_KEY = "jsm_blocked_slots_v1";

// Helper robusto para gerar strings de horários
const generateTimeSlotsForRange = (
  startStr: string,
  endStr: string
): string[] => {
  const slots: string[] = [];
  // Usamos uma data base fixa para evitar problemas de fuso horário/mudança de dia
  const referenceDate = new Date(2000, 0, 1); 
  
  try {
    let current = parse(startStr, "HH:mm", referenceDate);
    const end = parse(endStr, "HH:mm", referenceDate);

    // Trava de segurança para evitar loop infinito caso SLOT_DURATION_MINUTES seja 0 ou inválido
    let safetyCounter = 0;

    while (isBefore(current, end) && safetyCounter < 100) {
      slots.push(format(current, "HH:mm"));
      current = addMinutes(current, SLOT_DURATION_MINUTES);
      safetyCounter++;
    }
  } catch (error) {
    console.error("Erro ao processar intervalo de horas:", error);
  }
  
  return slots;
};

export const getDailySlots = (dateStr: string): string[] => {
  if (!dateStr) return [];

  try {
    const date = parseISO(dateStr);
    
    // Verifica se a data convertida é válida
    if (isNaN(date.getTime())) return [];
    
    if (isWeekend(date)) return [];

    const morningSlots = generateTimeSlotsForRange(MORNING_START, MORNING_END);
    let afternoonSlots: string[] = [];

    // Sextas-feiras não possuem expediente à tarde conforme regra de negócio
    if (!isFriday(date)) {
      afternoonSlots = generateTimeSlotsForRange(AFTERNOON_START, AFTERNOON_END);
    }

    return [...morningSlots, ...afternoonSlots];
  } catch (error) {
    console.error("Erro ao gerar slots diários:", error);
    return [];
  }
};

// --- Interações com o LocalStorage (Simulando Banco de Dados) ---

const getAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveAppointments = (apps: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
};

export const getBlockedDates = (): string[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(BLOCKED_DATES_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const getBlockedSlots = (): string[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(BLOCKED_SLOTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const toggleBlockDate = (dateStr: string) => {
  const blocked = getBlockedDates();
  const newBlocked = blocked.includes(dateStr)
    ? blocked.filter((d) => d !== dateStr)
    : [...blocked, dateStr];
  
  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(newBlocked));
};

export const toggleBlockMonth = (monthStr: string) => {
  const start = startOfMonth(parseISO(`${monthStr}-01`));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end }).map((d) =>
    format(d, "yyyy-MM-dd")
  );

  let blocked = getBlockedDates();
  const newBlocks = days.filter((d) => !blocked.includes(d));
  
  const finalBlocked = newBlocks.length > 0 
    ? [...blocked, ...newBlocks]
    : blocked.filter((d) => !days.includes(d));

  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(finalBlocked));
};

export const toggleBlockSlot = (dateStr: string, time: string) => {
  const key = `${dateStr}|${time}`;
  const blocked = getBlockedSlots();
  const newBlocked = blocked.includes(key)
    ? blocked.filter((s) => s !== key)
    : [...blocked, key];
    
  localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(newBlocked));
};

export const getSlotsForDate = (dateStr: string): TimeSlot[] => {
  const allPossibleSlots = getDailySlots(dateStr);
  const appointments = getAppointments().filter(
    (a) => a.date === dateStr && a.status !== "cancelled"
  );
  const blockedDates = getBlockedDates();
  const blockedSlots = getBlockedSlots();

  if (blockedDates.includes(dateStr)) {
    return allPossibleSlots.map((time) => ({ time, available: false }));
  }

  return allPossibleSlots.map((time) => {
    const isSlotBlocked = blockedSlots.includes(`${dateStr}|${time}`);
    const isTaken = appointments.some((a) => a.time === time);

    return {
      time,
      available: !isTaken && !isSlotBlocked,
    };
  });
};

export const hasActiveAppointmentOnDay = (
  cpf: string,
  dateStr: string
): boolean => {
  const cleanCpf = cpf.replace(/\D/g, "");
  if (!cleanCpf) return false;

  const appointments = getAppointments();
  return appointments.some(
    (a) =>
      a.citizen.cpf?.replace(/\D/g, "") === cleanCpf &&
      a.date === dateStr &&
      a.status === "scheduled"
  );
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const createAppointment = (
  data: Omit<Appointment, "id" | "protocol" | "createdAt" | "status">
): Appointment => {
  const appointments = getAppointments();
  const datePart = data.date.replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const protocol = `${datePart}-${randomPart}`;

  const newAppointment: Appointment = {
    ...data,
    id: generateId(),
    protocol,
    createdAt: new Date().toISOString(),
    status: "scheduled",
  };

  appointments.push(newAppointment);
  saveAppointments(appointments);
  return newAppointment;
};

export const updateAppointment = (appointment: Appointment): boolean => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === appointment.id);

  if (index !== -1) {
    appointments[index] = appointment;
    saveAppointments(appointments);
    return true;
  }
  return false;
};

export const getAppointmentByProtocol = (protocol: string): Appointment | undefined => {
  return getAppointments().find((a) => a.protocol === protocol);
};

export const getAppointmentsByCpf = (cpf: string): Appointment[] => {
  const cleanCpf = cpf.replace(/\D/g, "");
  return getAppointments().filter(
    (a) => a.citizen.cpf?.replace(/\D/g, "") === cleanCpf
  );
};

export const cancelAppointment = (id: string) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index].status = "cancelled";
    saveAppointments(appointments);
  }
};

export const rateAppointment = (id: string, rating: number, feedback: string) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index].rating = rating;
    appointments[index].feedback = feedback;
    if (appointments[index].status === "scheduled") {
      appointments[index].status = "completed";
    }
    saveAppointments(appointments);
    return appointments[index];
  }
  return null;
};

export const getAllAppointments = (): Appointment[] => {
  return getAppointments().sort(
    (a, b) =>
      new Date(b.date + "T" + b.time).getTime() -
      new Date(a.date + "T" + a.time).getTime()
  );
};

export const generateWhatsAppLink = (appointment: Appointment) => {
  const dateFormatted = appointment.date.split('-').reverse().join('/');
  const message = `Olá ${appointment.citizen.name}, seu agendamento na JSM Ibicuitinga para *${appointment.serviceName}* está confirmado para dia *${dateFormatted}* às *${appointment.time}*. Protocolo: ${appointment.protocol}.`;
  return `https://wa.me/55${appointment.citizen.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
};