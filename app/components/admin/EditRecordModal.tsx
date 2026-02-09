import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Clock } from 'lucide-react';
import { Appointment } from '../../types';
import api from '../../services/api';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onRefresh: () => void;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onRefresh 
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceName: '',
    date: '',
    time: ''
  });

  // Sincroniza os dados iniciais separando data e hora limpa
  useEffect(() => {
    if (appointment && isOpen) {
      const pureTime = appointment.time.includes('|') 
        ? appointment.time.split('|')[1] 
        : appointment.time;

      setFormData({
        name: appointment.citizen.name,
        phone: appointment.citizen.phone || '',
        serviceName: appointment.serviceName,
        date: appointment.date,
        time: pureTime
      });
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date || !formData.serviceName || !isOpen) return;

      setLoadingSlots(true);
      try {
        const response = await api.get('/blocks/slots', {
          params: { date: formData.date, serviceName: formData.serviceName }
        });

        const slotsData = response.data.slots || response.data;
        let slots: string[] = Array.isArray(slotsData) ? slotsData : [];

        slots = slots.map(s => s.includes('|') ? s.split('|')[1] : s);

        const originalTime = appointment?.time.includes('|') 
          ? appointment.time.split('|')[1] 
          : appointment?.time;

        if (formData.date === appointment?.date && originalTime && !slots.includes(originalTime)) {
          slots.push(originalTime);
        }

        setAvailableSlots(slots.sort());
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.date, formData.serviceName, isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSave = async () => {
    if (!formData.time) return alert("Selecione um horário disponível.");
    setLoading(true);
    try {
      await api.put(`/appointments/${appointment.id}`, {
        date: formData.date,
        time: formData.time,
        serviceName: formData.serviceName,
        citizenName: formData.name,
        citizenPhone: formData.phone
      });
      alert("Alterações salvas com sucesso!");
      onRefresh();
      onClose();
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ibicuitinga-navy/60 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-zoom-in border border-gray-100">
        <div className="p-10 relative">
          <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-ibicuitinga-navy transition-colors"><X size={24} strokeWidth={3} /></button>
          
          <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-none">Alterar Registro</h2>
          <p className="text-sm font-black text-ibicuitinga-royalBlue mt-2 uppercase tracking-widest">{appointment.protocol}</p>

          <div className="mt-10 space-y-5">
            {/* Nome e Telefone continuam aqui */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Nome</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Telefone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Serviço</label>
                  <select value={formData.serviceName} onChange={(e) => setFormData({...formData, serviceName: e.target.value, time: ''})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none appearance-none">
                    <option value="Alistamento Militar">Alistamento Militar</option>
                    <option value="CIN">CIN</option>
                    <option value="CDI">CDI</option>
                    <option value="Outros Serviços">Outros Serviços</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* CAMPO DATA SEPARADO */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Data</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value, time: ''})} 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none" 
                />
              </div>

              {/* CAMPO HORÁRIO SEPARADO (SELECT) */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Horário</label>
                <div className="relative">
                  <select 
                    value={formData.time} 
                    disabled={loadingSlots || !formData.date}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">{loadingSlots ? 'Buscando...' : 'Selecione'}</option>
                    {availableSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={loading || loadingSlots || !formData.time} className="w-full bg-ibicuitinga-navy text-white p-5 rounded-2xl font-black uppercase text-xs mt-10 hover:bg-ibicuitinga-royalBlue disabled:opacity-50 shadow-xl">
            {loading ? <Loader2 className="animate-spin inline mr-2" /> : <Save className="inline mr-2" size={20} />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};