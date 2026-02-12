import React, { useState, useEffect } from 'react';
import { X, Pencil, Ban, Loader2 } from 'lucide-react';
import { Appointment } from '../../types';
import api from '../../services/api';
import { EditRecordModal } from './EditRecordModal';
import { displayDate } from "../../utils/dateUtils";

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  title: string;
  onRefresh: () => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({ 
  isOpen, onClose, appointments: initialAppointments, title, onRefresh 
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
    if (app.status !== 'scheduled') return;
    setSelectedToEdit(app);
    setIsEditOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;
    setLoadingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      setLocalAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app)
      );
      onRefresh();
    } catch (error) {
      alert("Erro ao realizar operação.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ibicuitinga-navy/40 backdrop-blur-sm text-left">
        <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="p-8 border-b-4 border-ibicuitinga-yellow flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase">{title}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase">{localAppointments.length} REGISTROS</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full border border-gray-100"><X size={20} /></button>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-gray-50/50">
            {localAppointments.map((app) => {
              const isActionDisabled = app.status !== 'scheduled';

              return (
                <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between group">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-ibicuitinga-navy text-white text-[9px] font-black px-2 py-1 rounded-md">{app.protocol}</span>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                        app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                        app.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {app.status === 'cancelled' ? 'Cancelado' : app.status === 'completed' ? 'Concluído' : 'Agendado'}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-ibicuitinga-navy capitalize">{app.citizen.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{app.serviceName} • {displayDate(app.date)} ÀS {app.time}</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleOpenEdit(app)}
                      disabled={isActionDisabled}
                      className={`p-3 rounded-full transition-all ${isActionDisabled ? 'bg-gray-100 text-gray-300 opacity-50' : 'bg-ibicuitinga-skyBlue/10 text-ibicuitinga-royalBlue hover:bg-ibicuitinga-royalBlue hover:text-white'}`}
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleCancel(app.id)}
                      disabled={loadingId === app.id || isActionDisabled}
                      className={`p-3 rounded-full transition-all ${isActionDisabled ? 'bg-gray-100 text-gray-300 opacity-50' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      {loadingId === app.id ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EditRecordModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} appointment={selectedToEdit} onRefresh={onRefresh} />
    </>
  );
};