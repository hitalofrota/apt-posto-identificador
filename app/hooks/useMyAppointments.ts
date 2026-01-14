import { useState } from 'react';
import { Appointment } from '../types';
import { 
  getAppointmentByProtocol, 
  getAppointmentsByCpf, 
  cancelAppointment, 
  rateAppointment 
} from '../services/scheduler';

export const useMyAppointments = () => {
  const [foundApps, setFoundApps] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchAppointments = (value: string) => {
    setError('');
    setIsLoading(true);
    setFoundApps([]);

    setTimeout(() => {
      const cleanValue = value.trim();
      if (!cleanValue) {
        setIsLoading(false);
        return;
      }

      const isCpf = cleanValue.replace(/\D/g, '').length === 11;
      
      if (isCpf) {
        const apps = getAppointmentsByCpf(cleanValue.replace(/\D/g, ''));
        apps.length > 0 ? setFoundApps(apps) : setError('Nenhum agendamento encontrado para este CPF.');
      } else {
        const app = getAppointmentByProtocol(cleanValue);
        app ? setFoundApps([app]) : setError('Protocolo não encontrado.');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleCancel = (appId: string, searchValue: string) => {
    if (window.confirm('Deseja realmente cancelar este agendamento?')) {
      cancelAppointment(appId);
      // Atualiza a lista após cancelar
      searchAppointments(searchValue);
      alert('Agendamento cancelado com sucesso.');
    }
  };

  const handleRate = (appId: string, rating: number, feedback: string) => {
    const updated = rateAppointment(appId, rating, feedback);
    if (updated) {
      setFoundApps(prev => prev.map(a => a.id === appId ? updated : a));
    }
  };

  return { foundApps, error, isLoading, searchAppointments, handleCancel, handleRate };
};