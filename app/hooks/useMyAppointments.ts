import { useState, useCallback } from 'react';
import { Appointment } from '../types';
import { 
  getAppointmentsByCpf, 
  cancelAppointment, 
  rateAppointment,
  getAllAppointments 
} from '../services/scheduler';

interface MyAppointmentsState {
  foundApps: Appointment[];
  error: string;
  isLoading: boolean;
  isActionLoading: boolean;
}

export const useMyAppointments = () => {
  const [state, setState] = useState<MyAppointmentsState>({
    foundApps: [],
    error: '',
    isLoading: false,
    isActionLoading: false,
  });

  const searchAppointments = useCallback(async (value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;

    setState(prev => ({ ...prev, isLoading: true, error: '', foundApps: [] }));

    try {
      const isCpf = cleanValue.replace(/\D/g, '').length === 11;
      let results: Appointment[] = [];

      if (isCpf) {
        results = await getAppointmentsByCpf(cleanValue);
        if (results.length === 0) {
          setState(prev => ({ ...prev, error: 'Nenhum agendamento encontrado para este CPF.', isLoading: false }));
          return;
        }
      } else {
        const allApps = await getAllAppointments();
        const app = allApps.find(a => a.protocol === cleanValue);
        if (!app) {
          setState(prev => ({ ...prev, error: 'Protocolo não encontrado.', isLoading: false }));
          return;
        }
        results = [app];
      }

      setState(prev => ({ ...prev, foundApps: results, isLoading: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: "Erro ao conectar com o servidor. Tente novamente.", 
        isLoading: false 
      }));
    }
  }, []);

  const handleCancel = async (appId: string, searchValue: string) => {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) return;

    setState(prev => ({ ...prev, isActionLoading: true }));
    try {
      await cancelAppointment(appId);
      await searchAppointments(searchValue);
    } catch (err) {
      alert('Erro ao cancelar agendamento. Tente novamente.');
      setState(prev => ({ ...prev, isActionLoading: false }));
    }
  };

  const handleRate = async (appId: string, rating: number, feedback: string) => {
    setState(prev => ({ ...prev, isActionLoading: true }));
    try {
      const updated = await rateAppointment(appId, rating, feedback);
      setState(prev => ({
        ...prev,
        isActionLoading: false,
        foundApps: prev.foundApps.map(a => (a.id === appId ? updated : a)),
      }));
    } catch (err) {
      alert('Erro ao enviar avaliação.');
      setState(prev => ({ ...prev, isActionLoading: false }));
    }
  };

  return { 
    ...state,
    searchAppointments, 
    handleCancel, 
    handleRate 
  };
};