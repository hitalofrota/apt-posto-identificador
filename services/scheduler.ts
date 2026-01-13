import { Appointment, Service, TimeSlot } from "../types";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../constants";
import {
  addMinutes,
  format,
  parse,
  isFriday,
  isWeekend,
  isBefore,
  startOfToday,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

const STORAGE_KEY = "jsm_appointments_v1";
const BLOCKED_DATES_KEY = "jsm_blocked_dates_v1";
const BLOCKED_SLOTS_KEY = "jsm_blocked_slots_v1"; // New key for specific time slots

// Helper to generate time strings
const generateTimeSlotsForRange = (
  startStr: string,
  endStr: string
): string[] => {
  const slots: string[] = [];
  let current = parse(startStr, "HH:mm", new Date());
  const end = parse(endStr, "HH:mm", new Date());

  while (isBefore(current, end)) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, SLOT_DURATION_MINUTES);
  }
  return slots;
};

export const getDailySlots = (dateStr: string): string[] => {
  const date = parseISO(dateStr);
  if (isWeekend(date)) return [];

  const morningSlots = generateTimeSlotsForRange(MORNING_START, MORNING_END);
  let afternoonSlots: string[] = [];

  // Friday has no afternoon shift
  if (!isFriday(date)) {
    afternoonSlots = generateTimeSlotsForRange(AFTERNOON_START, AFTERNOON_END);
  }

  return [...morningSlots, ...afternoonSlots];
};

// Mock Database Interactions
const getAppointments = (): Appointment[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveAppointments = (apps: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
};

export const getBlockedDates = (): string[] => {
  const saved = localStorage.getItem(BLOCKED_DATES_KEY);
  return saved ? JSON.parse(saved) : [];
};

// New: Get Blocked Slots (Format: "YYYY-MM-DD|HH:mm")
export const getBlockedSlots = (): string[] => {
  const saved = localStorage.getItem(BLOCKED_SLOTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const toggleBlockDate = (dateStr: string) => {
  const blocked = getBlockedDates();
  if (blocked.includes(dateStr)) {
    localStorage.setItem(
      BLOCKED_DATES_KEY,
      JSON.stringify(blocked.filter((d) => d !== dateStr))
    );
  } else {
    localStorage.setItem(
      BLOCKED_DATES_KEY,
      JSON.stringify([...blocked, dateStr])
    );
  }
};

// Updated: Block all days in month (Mass disable)
export const toggleBlockMonth = (monthStr: string) => {
  // monthStr expected as YYYY-MM
  const start = startOfMonth(parseISO(`${monthStr}-01`));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end }).map((d) =>
    format(d, "yyyy-MM-dd")
  );

  let blocked = getBlockedDates();

  // As per request "inabilite todos os dias", we ensure all days are in the blocked list
  const newBlocks = days.filter((d) => !blocked.includes(d));
  if (newBlocks.length > 0) {
    blocked = [...blocked, ...newBlocks];
  } else {
    // If all were already blocked, we toggle (unblock) to allow management
    blocked = blocked.filter((d) => !days.includes(d));
  }

  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(blocked));
};

// New: Block/Unblock specific slot
export const toggleBlockSlot = (dateStr: string, time: string) => {
  const key = `${dateStr}|${time}`;
  const blocked = getBlockedSlots();
  if (blocked.includes(key)) {
    localStorage.setItem(
      BLOCKED_SLOTS_KEY,
      JSON.stringify(blocked.filter((s) => s !== key))
    );
  } else {
    localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify([...blocked, key]));
  }
};

export const getSlotsForDate = (dateStr: string): TimeSlot[] => {
  const allPossibleSlots = getDailySlots(dateStr);
  const appointments = getAppointments().filter(
    (a) => a.date === dateStr && a.status !== "cancelled"
  );
  const blockedDates = getBlockedDates();
  const blockedSlots = getBlockedSlots();

  // If entire date is blocked
  if (blockedDates.includes(dateStr)) {
    return allPossibleSlots.map((time) => ({ time, available: false }));
  }

  return allPossibleSlots.map((time) => {
    const isSlotBlocked = blockedSlots.includes(`${dateStr}|${time}`);
    const isTaken = appointments.find((a) => a.time === time);

    return {
      time,
      available: !isTaken && !isSlotBlocked,
    };
  });
};

// Check if CPF already has an active appointment on the given date
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

// Safe ID Generator
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

// New: Update existing appointment
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

export const getAppointmentByProtocol = (
  protocol: string
): Appointment | undefined => {
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

export const rateAppointment = (
  id: string,
  rating: number,
  feedback: string
) => {
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
  const message = `Olá ${appointment.citizen.name}, seu agendamento na JSM Ibicuitinga para *${appointment.serviceName}* está confirmado para dia *${format(parseISO(appointment.date), "dd/MM/yyyy")}* às *${appointment.time}*. Protocolo: ${appointment.protocol}.`;
  return `https://wa.me/55${appointment.citizen.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
};
