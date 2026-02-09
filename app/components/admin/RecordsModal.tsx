import React, { useState, useEffect } from 'react';
import { X, Pencil, Ban, Loader2 } from 'lucide-react';
import { Appointment } from '../../types';
import api from '../../services/api';
import { EditRecordModal } from './EditRecordModal';

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedToEdit, setSelectedToEdit] = useState<Appointment | null>(null);
  
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(initialAppointments);

  useEffect(() => {
    setLocalAppointments(initialAppointments);
  }, [initialAppointments]);

  if (!isOpen) return null;

  const handleOpenEdit = (app: Appointment) => {
    if (app.status === 'cancelled' || app.status === 'completed') return;
    
    setSelectedToEdit(app);
    setIsEditOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;
    
    setLoadingId(id);
    try {
      const response = await api.delete(`/appointments/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        setLocalAppointments(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status: 'cancelled' } : app
          )
        );
        
        alert("Agendamento cancelado com sucesso!");
        onRefresh();
      }
    } catch (error: any) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao realizar operação.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ibicuitinga-navy/40 backdrop-blur-sm animate-fade-in text-left">
        <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
          
          <div className="p-8 border-b-4 border-ibicuitinga-yellow flex justify-between items-center bg-white">
            <div>
              <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tight">{title}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                {localAppointments.length} REGISTROS ENCONTRADOS
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 border border-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-gray-50/50">
            {localAppointments.length > 0 ? (
              localAppointments.map((app) => {
                const isActionDisabled = app.status === 'cancelled' || app.status === 'completed';

                return (
                  <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-ibicuitinga-royalBlue/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-ibicuitinga-navy text-white text-[9px] font-black px-2 py-1 rounded-md uppercase">
                          {app.protocol}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                          app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                          app.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {app.status === 'cancelled' ? 'Cancelado' : 
                           app.status === 'completed' ? 'Concluído' : 'Ativo'}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-black text-ibicuitinga-navy capitalize">
                        {app.citizen.name}
                      </h4>
                      
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {/* Correção de Fuso Horário: Split para evitar o bug do dia anterior */}
                        {app.serviceName} • {app.date.split('-').reverse().join('/')} ÀS {app.time}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {/* Botão Editar com trava visual e lógica */}
                      <button 
                        onClick={() => handleOpenEdit(app)}
                        disabled={isActionDisabled}
                        title={isActionDisabled ? "Não é possível editar registros finalizados" : "Editar"}
                        className={`p-3 rounded-full transition-all shadow-sm active:scale-95 ${
                          isActionDisabled
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                          : 'bg-ibicuitinga-skyBlue/10 text-ibicuitinga-royalBlue hover:bg-ibicuitinga-royalBlue hover:text-white'
                        }`}
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {/* Botão Cancelar com trava visual e lógica */}
                      <button 
                        onClick={() => handleCancel(app.id)}
                        disabled={loadingId === app.id || isActionDisabled}
                        title={isActionDisabled ? "Registro já finalizado ou cancelado" : "Cancelar"}
                        className={`p-3 rounded-full transition-all shadow-sm flex items-center justify-center active:scale-95 ${
                          isActionDisabled 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                          : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        {loadingId === app.id ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">
                Nenhum registro encontrado.
              </div>
            )}
          </div>
        </div>
      </div>

      <EditRecordModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        appointment={selectedToEdit} 
        onRefresh={onRefresh} 
      />
    </>
  );
};