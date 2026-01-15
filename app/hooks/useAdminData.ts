import { useState, useEffect, useCallback } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import {
  getAllAppointments,
  getBlockedDates,
  getBlockedSlots,
  toggleBlockDate,
  toggleBlockSlot,
  toggleBlockMonth,
  cancelAppointment,
  updateAppointment,
} from "../services/scheduler";
import { Appointment } from "../types";
interface AdminState {
  appointments: Appointment[];
  blockedDates: string[];
  blockedSlots: string[];
  isLoading: boolean;
  error: string | null;
}

export const useAdminData = (isAuthenticated: boolean) => {
  const [state, setState] = useState<AdminState>({
    appointments: [],
    blockedDates: [],
    blockedSlots: [],
    isLoading: false,
    error: null,
  });

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [apps, dates, slots] = await Promise.all([
        getAllAppointments(),
        getBlockedDates(),
        getBlockedSlots(),
      ]);

      setState((prev) => ({
        ...prev,
        appointments: apps,
        blockedDates: dates,
        blockedSlots: slots,
        isLoading: false,
      }));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Falha ao sincronizar com o servidor.",
      }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleBlockDate = async (selectedDate: string) => {
    const previousDates = [...state.blockedDates];
    
    setState(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.includes(selectedDate)
        ? prev.blockedDates.filter(d => d !== selectedDate)
        : [...prev.blockedDates, selectedDate]
    }));

    try {
      await toggleBlockDate(selectedDate);
    } catch (err) {
      setState(prev => ({ ...prev, blockedDates: previousDates }));
      alert("Erro ao alterar bloqueio da data.");
    }
  };

  const handleBlockSlot = async (selectedDate: string, time: string) => {
    const slotKey = `${selectedDate}_${time}`;
    const previousSlots = [...state.blockedSlots];

    setState(prev => ({
      ...prev,
      blockedSlots: prev.blockedSlots.includes(slotKey)
        ? prev.blockedSlots.filter(s => s !== slotKey)
        : [...prev.blockedSlots, slotKey]
    }));

    try {
      await toggleBlockSlot(selectedDate, time);
    } catch (err) {
      setState(prev => ({ ...prev, blockedSlots: previousSlots }));
      alert("Erro ao alterar bloqueio do horário.");
    }
  };

  const handleBlockMonth = async (blockManagerMonth: string, isBlocked: boolean) => {
    const actionText = isBlocked ? "LIBERAR" : "INABILITAR";
    
    if (!window.confirm(`Deseja realmente ${actionText} o mês de ${blockManagerMonth}?`)) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await toggleBlockMonth(blockManagerMonth);
      await refreshData(); // Re-sincroniza tudo após alteração em massa
    } catch (err) {
      alert("Erro ao processar bloqueio mensal.");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelAdmin = async (id: string, callback?: () => void) => {
    if (!window.confirm("Deseja realmente CANCELAR este agendamento?")) return;

    try {
      await cancelAppointment(id);
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.filter(app => app.id !== id)
      }));
      if (callback) callback();
    } catch (err) {
      alert("Erro ao cancelar agendamento.");
    }
  };

  const handleSaveEdit = async (editingApp: Appointment, callback: () => void) => {
    try {
      await updateAppointment(editingApp);
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(app => 
          app.id === editingApp.id ? editingApp : app
        )
      }));
      callback();
    } catch (err) {
      alert("Erro ao atualizar agendamento.");
    }
  };

  // --- HELPERS ---

  const checkMonthBlocked = useCallback((blockManagerMonth: string) => {
    try {
      const start = startOfMonth(parseISO(`${blockManagerMonth}-01`));
      const end = endOfMonth(start);
      const workDays = eachDayOfInterval({ start, end })
        .filter((d) => !isWeekend(d))
        .map((d) => format(d, "yyyy-MM-dd"));

      if (workDays.length === 0) return false;
      return workDays.every((d) => state.blockedDates.includes(d));
    } catch {
      return false;
    }
  }, [state.blockedDates]);

  return {
    ...state, // Espalha appointments, blockedDates, blockedSlots, isLoading, error
    refreshData,
    checkMonthBlocked,
    actions: {
      handleBlockDate,
      handleBlockSlot,
      handleBlockMonth,
      handleCancelAdmin,
      handleSaveEdit
    }
  };
};