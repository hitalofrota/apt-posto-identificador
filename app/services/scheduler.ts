import { addMinutes, format, parse, isFriday, isWeekend, isBefore, parseISO } from "date-fns";
import { appointmentsApi, blocksApi } from "./api";
import { Appointment, TimeSlot } from "../types";
import {
  MORNING_START,
  MORNING_END,
  AFTERNOON_START,
  AFTERNOON_END,
  SLOT_DURATION_MINUTES,
} from "../constants";

export { appointmentsApi, blocksApi };

export const getAllAppointments = appointmentsApi.getAll;
export const getAppointmentsByCpf = appointmentsApi.getByCpf;
export const createAppointment = appointmentsApi.create;
export const updateAppointment = appointmentsApi.update;
export const cancelAppointment = appointmentsApi.cancel;
export const rateAppointment = appointmentsApi.rate;

export const getBlockedDates = blocksApi.getDates;
export const getBlockedSlots = blocksApi.getSlots;
export const toggleBlockDate = blocksApi.toggleDate;
export const toggleBlockSlot = blocksApi.toggleSlot;
export const toggleBlockMonth = blocksApi.toggleMonth;

export const getDailySlots = (dateStr: string): string[] => {
  const date = parseISO(dateStr);
  if (!dateStr || isNaN(date.getTime()) || isWeekend(date)) return [];

  const generate = (start: string, end: string) => {
    const slots: string[] = [];
    const ref = new Date(2000, 0, 1);
    let curr = parse(start, "HH:mm", ref);
    const stop = parse(end, "HH:mm", ref);
    while (isBefore(curr, stop)) {
      slots.push(format(curr, "HH:mm"));
      curr = addMinutes(curr, SLOT_DURATION_MINUTES);
    }
    return slots;
  };

  return [
    ...generate(MORNING_START, MORNING_END),
    ...(isFriday(date) ? [] : generate(AFTERNOON_START, AFTERNOON_END))
  ];
};

export const getSlotsForDate = async (dateStr: string): Promise<TimeSlot[]> => {
  const allPossibleSlots = getDailySlots(dateStr);
  
  const [appointments, blockedDates, blockedSlots] = await Promise.all([
    appointmentsApi.getAll(), 
    blocksApi.getDates(),
    blocksApi.getSlots()
  ]);

  const activeDayApps = new Set(
    appointments
      .filter(a => a.date === dateStr && a.status !== "cancelled")
      .map(a => a.time)
  );

  const isDateBlocked = blockedDates.includes(dateStr);
  const blockedSlotsSet = new Set(blockedSlots);

  return allPossibleSlots.map(time => ({
    time,
    available: !isDateBlocked && 
               !activeDayApps.has(time) && 
               !blockedSlotsSet.has(`${dateStr}|${time}`)
  }));
};

export const generateWhatsAppLink = (appointment: Appointment) => {
  if (!appointment?.citizen) return "#";
  const dateFmt = appointment.date.split('-').reverse().join('/');
  const msg = `Olá ${appointment.citizen.name}, seu agendamento está confirmado para dia *${dateFmt}* às *${appointment.time}*. Protocolo: ${appointment.protocol}.`;
  return `https://wa.me/55${appointment.citizen.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
};

export const hasActiveAppointmentOnDay = async (cpf: string, dateStr: string): Promise<boolean> => {
  try {
    const apps = await appointmentsApi.getByCpf(cpf);
    return apps.some(a => a.date === dateStr && a.status === "scheduled");
  } catch {
    return false;
  }
};