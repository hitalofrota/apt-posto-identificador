import React, { useState, useEffect } from 'react';
import { X, Save, Ban, Loader2 } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceName: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (appointment && isOpen) {
      setFormData({
        name: appointment.citizen.name,
        phone: appointment.citizen.phone || '',
        serviceName: appointment.serviceName,
        date: appointment.date,
        time: appointment.time
      });
    }
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        date: formData.date,
        time: formData.time,
        serviceName: formData.serviceName,
        citizenName: formData.name,
        citizenPhone: formData.phone
      };

      const response = await api.put(`/appointments/${appointment.id}`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        alert("Alterações salvas com sucesso!");
        onRefresh(); // Sincroniza o front-end com o banco
        onClose();   // Fecha o formulário de edição
      }
    } catch (error: any) {
      console.error("Erro ao atualizar:", error.response?.data || error.message);
      // Fallback: se houver erro de parse mas salvou no banco
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ibicuitinga-navy/60 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in border border-gray-100">
        
        <div className="p-10 relative">
          <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-ibicuitinga-navy transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
          
          <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-none text-left">Alterar Registro</h2>
          <p className="text-sm font-black text-ibicuitinga-royalBlue mt-2 uppercase tracking-widest">{appointment.protocol}</p>

          <div className="mt-10 space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Nome do Cidadão</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Telefone</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Serviço</label>
                <select 
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy focus:border-ibicuitinga-royalBlue outline-none appearance-none"
                >
                  <option value="Alistamento Militar">Alistamento Militar</option>
                  <option value="1ª e 2ª via da Carteira de Identidade Nacional">CIN</option>
                  <option value="1ª e 2ª via do Certificado de Dispensa de Incorporação">CDI</option>
                  <option value="Outros Serviços">Outros Serviços</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Data</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Horário</label>
                <input 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-ibicuitinga-navy text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-ibicuitinga-royalBlue transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Salvar Alterações
            </button>
            
            <button 
              onClick={onClose}
              className="w-full text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] pt-4 hover:text-ibicuitinga-navy transition-all"
            >
              Voltar sem salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};