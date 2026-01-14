import React, { useState } from 'react';
import { Search, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyAppointments } from '../hooks/useMyAppointments';
import { AppointmentCard } from '../components/booking/AppointmentCard';

const MyAppointment: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { foundApps, error, isLoading, searchAppointments, handleCancel, handleRate } = useMyAppointments();

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAppointments(searchValue);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-ibicuitinga-skyBlue/10 relative overflow-hidden">
        <h2 className="text-3xl font-black text-ibicuitinga-navy mb-2 flex items-center gap-3 uppercase tracking-tighter">
          <Search className="text-ibicuitinga-royalBlue" size={32} /> Meus Agendamentos
        </h2>
        <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest">Consulte e gerencie seus protocolos</p>
        
        <form onSubmit={onSearchSubmit} className="relative z-10 flex flex-col sm:flex-row gap-3">
          <input 
            type="text" placeholder="Protocolo ou CPF" 
            className="flex-1 bg-gray-50 text-ibicuitinga-navy font-bold rounded-2xl border-2 border-gray-100 p-5 focus:border-ibicuitinga-royalBlue outline-none"
            value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
          />
          <button 
            type="submit" disabled={isLoading}
            className="bg-ibicuitinga-navy text-white px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-ibicuitinga-royalBlue shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Clock className="animate-spin" size={18} /> : 'Buscar'}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-5 bg-red-50 rounded-2xl flex items-center gap-4 text-red-600 font-bold text-sm border border-red-100 animate-bounce-in">
            <AlertTriangle size={24} className="shrink-0" /> {error}
          </div>
        )}
      </div>

      {foundApps.length > 0 && (
        <div className="space-y-8">
          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{foundApps.length} resultado(s) encontrado(s)</p>
          {foundApps.map(app => (
            <AppointmentCard 
              key={app.id} 
              app={app} 
              onCancel={(id) => handleCancel(id, searchValue)} 
              onRate={handleRate}
            />
          ))}
        </div>
      )}
      
      <div className="text-center pt-8">
        <Link to="/" className="text-ibicuitinga-royalBlue font-black uppercase text-[10px] tracking-widest hover:underline">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default MyAppointment;