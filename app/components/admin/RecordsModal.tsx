import React, { useState, useEffect } from 'react';
import { X, Pencil, Ban, Loader2 } from 'lucide-react';
import { Appointment } from '../../types';
import api from '../../services/api';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  title: string;
  onRefresh: () => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({ 
  isOpen, 
  onClose, 
  appointments: initialAppointments, 
  title,
  onRefresh 
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  // Estado local para refletir a mudança instantaneamente
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(initialAppointments);

  // Sincroniza o estado local sempre que a lista externa mudar ou o modal abrir
  useEffect(() => {
    setLocalAppointments(initialAppointments);
  }, [initialAppointments, isOpen]);

  if (!isOpen) return null;

  const handleCancel = async (id: string) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;
    
    setLoadingId(id);
    
    try {
      const response = await api.delete(`/appointments/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        // ATUALIZAÇÃO LOCAL INSTANTÂNEA:
        setLocalAppointments(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status: 'cancelled' } : app
          )
        );

        alert("Agendamento cancelado com sucesso!");
        
        // Avisa o componente pai para se atualizar em segundo plano
        try {
          onRefresh();
        } catch (e) {
          console.error("Erro no refresh do pai", e);
        }
      }
    } catch (error: any) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao processar cancelamento.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ibicuitinga-navy/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        
        <div className="p-8 border-b-4 border-ibicuitinga-yellow flex justify-between items-center bg-white text-left">
          <div>
            <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tight">{title}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {localAppointments.length} REGISTROS ENCONTRADOS
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 border border-gray-100 shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-gray-50/50">
          {localAppointments.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between transition-all text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-ibicuitinga-navy text-white text-[9px] font-black px-2 py-1 rounded-md uppercase">
                    {app.protocol}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                    app.status === 'completed' ? 'bg-blue-100 text-blue-600' : 
                    app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {app.status === 'completed' ? 'Concluído' : 
                     app.status === 'cancelled' ? 'Cancelado' : 'Ativo'}
                  </span>
                </div>
                
                <h4 className="text-xl font-black text-ibicuitinga-navy capitalize">{app.citizen.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  {app.serviceName} • {new Date(app.date).toLocaleDateString('pt-BR')} ÀS {app.time}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="p-3 bg-ibicuitinga-skyBlue/10 text-ibicuitinga-royalBlue rounded-full hover:bg-ibicuitinga-royalBlue hover:text-white transition-all">
                  <Pencil size={18} />
                </button>
                
                <button 
                  onClick={() => handleCancel(app.id)}
                  disabled={loadingId === app.id || app.status === 'cancelled'}
                  className={`p-3 rounded-full transition-all shadow-sm ${
                    app.status === 'cancelled' 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  {loadingId === app.id ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};