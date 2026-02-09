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

  useEffect(() => {
    if (appointment && isOpen) {
      const currentTime = appointment.time.includes('|') 
        ? appointment.time.split('|')[1] 
        : appointment.time;

      setFormData({
        name: appointment.citizen.name,
        phone: appointment.citizen.phone || '',
        serviceName: appointment.serviceName,
        date: appointment.date,
        time: currentTime
      });
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date || !formData.serviceName || !isOpen) return;

      setLoadingSlots(true);
      try {
        // A API deve idealmente retornar apenas slots que NÃO possuem agendamento
        const response = await api.get('/blocks/slots', {
          params: { 
            date: formData.date, 
            serviceName: formData.serviceName 
          }
        });

        const slotsData = response.data.slots || response.data;
        let slots: string[] = Array.isArray(slotsData) ? slotsData : [];

        // 1. Limpa as strings para ter apenas HH:mm
        slots = slots.map(s => s.includes('|') ? s.split('|')[1] : s);

        // 2. LÓGICA DE SEGURANÇA: 
        // Se o admin estiver editando o PRÓPRIO agendamento na mesma data, 
        // o horário atual dele deve ser permitido, mas os de outros não.
        const originalTime = appointment?.time.includes('|') 
          ? appointment.time.split('|')[1] 
          : appointment?.time;

        if (formData.date === appointment?.date && originalTime) {
          if (!slots.includes(originalTime)) {
            slots.push(originalTime);
          }
        }

        // 3. Ordenação crescente e remoção de duplicatas
        const uniqueSortedSlots = Array.from(new Set(slots)).sort((a, b) => a.localeCompare(b));

        setAvailableSlots(uniqueSortedSlots);
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
    if (!formData.time) return alert("Selecione um horário disponível!");

    setLoading(true);
    try {
      // O Backend deve validar novamente se o slot está ocupado antes de salvar o PUT
      await api.put(`/appointments/${appointment.id}`, {
        date: formData.date,
        time: formData.time,
        serviceName: formData.serviceName,
        citizenName: formData.name,
        citizenPhone: formData.phone
      });
      
      alert("Registro atualizado com sucesso!");
      onRefresh();
      onClose();
    } catch (error: any) {
      // Se o backend retornar erro de horário ocupado (ex: 400 ou 409), exibe o alerta
      const errorMsg = error.response?.data?.message || "Erro ao atualizar registro.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ibicuitinga-navy/60 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-zoom-in border border-gray-100">
        <div className="p-10 relative">
          <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-ibicuitinga-navy transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
          
          <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-none">Alterar Registro</h2>
          <p className="text-sm font-black text-ibicuitinga-royalBlue mt-2 uppercase tracking-widest">{appointment.protocol}</p>

          <div className="mt-10 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Nome do Cidadão</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Telefone</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Serviço</label>
                <select 
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value, time: ''})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none appearance-none cursor-pointer"
                >
                  <option value="Alistamento Militar">Alistamento Militar</option>
                  <option value="1ª e 2ª via da Carteira de Identidade Nacional">CIN</option>
                  <option value="1ª e 2ª via do Certificado de Dispensa de Incorporação">CDI</option>
                  <option value="Outros Serviços">Outros Serviços</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Data</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value, time: ''})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Horário</label>
                <div className="relative">
                  <select 
                    value={formData.time}
                    disabled={loadingSlots || !formData.date}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none appearance-none transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">{loadingSlots ? 'Carregando...' : 'Selecione'}</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))
                    ) : (
                      !loadingSlots && <option disabled>Lotado ou Sem Vagas</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    {loadingSlots ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button 
              onClick={handleSave}
              disabled={loading || loadingSlots || !formData.time}
              className="w-full bg-ibicuitinga-navy text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-ibicuitinga-royalBlue transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Salvar Alterações
            </button>
            <button onClick={onClose} className="w-full text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] pt-4 hover:text-ibicuitinga-navy transition-all">
              Voltar sem salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};