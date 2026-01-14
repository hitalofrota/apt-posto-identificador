import { useState, useEffect } from "react";
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

export const useAdminData = (isAuthenticated: boolean) => {
  // --- Estados de Dados ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);

  // --- Função de Atualização (Facilitará a troca por fetch/axios no futuro) ---
  const refreshData = () => {
    setAppointments(getAllAppointments());
    setBlockedDates(getBlockedDates());
    setBlockedSlots(getBlockedSlots());
  };

  // Atualiza os dados sempre que o status de autenticação mudar
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // --- Handlers de Ação ---
  
  const handleBlockDate = (selectedDate: string) => {
    toggleBlockDate(selectedDate);
    refreshData();
  };

  const handleBlockSlot = (selectedDate: string, time: string) => {
    toggleBlockSlot(selectedDate, time);
    refreshData();
  };

  const handleBlockMonth = (blockManagerMonth: string, isBlocked: boolean) => {
    const action = isBlocked ? "LIBERAR" : "INABILITAR";
    if (
      window.confirm(
        `Tem certeza que deseja ${action} todos os dias e horários úteis de ${blockManagerMonth}?`
      )
    ) {
      toggleBlockMonth(blockManagerMonth);
      refreshData();
    }
  };

  const handleCancelAdmin = (id: string, callback?: () => void) => {
    if (
      window.confirm(
        "Deseja realmente CANCELAR este agendamento? Esta ação é irreversível e anula o protocolo."
      )
    ) {
      cancelAppointment(id);
      refreshData();
      if (callback) callback();
    }
  };

  const handleSaveEdit = (editingApp: Appointment, callback: () => void) => {
    updateAppointment(editingApp);
    refreshData();
    alert("Agendamento atualizado com sucesso!");
    callback();
  };

  // --- Helper de Lógica de Negócio ---
  const checkMonthBlocked = (blockManagerMonth: string) => {
    try {
      const start = startOfMonth(parseISO(`${blockManagerMonth}-01`));
      const end = endOfMonth(start);
      const workDays = eachDayOfInterval({ start, end })
        .filter((d) => !isWeekend(d))
        .map((d) => format(d, "yyyy-MM-dd"));

      if (workDays.length === 0) return false;
      return workDays.every((d) => blockedDates.includes(d));
    } catch (e) {
      return false;
    }
  };

  return {
    // Dados
    appointments,
    blockedDates,
    blockedSlots,
    // Funções de controle
    refreshData,
    checkMonthBlocked,
    // Handlers de interface
    actions: {
      handleBlockDate,
      handleBlockSlot,
      handleBlockMonth,
      handleCancelAdmin,
      handleSaveEdit
    }
  };
};