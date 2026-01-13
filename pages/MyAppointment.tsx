import React, { useState } from 'react';
import { Search, Trash2, Calendar, AlertTriangle, Star, Send, Clock, XCircle, Info, User, CheckCircle } from 'lucide-react';
import { getAppointmentByProtocol, getAppointmentsByCpf, cancelAppointment, rateAppointment } from '../services/scheduler';
import { Appointment } from '../types';
import { isBefore, parseISO, isSameDay, startOfToday, differenceInHours } from 'date-fns';
import { Link } from 'react-router-dom';

const MyAppointment: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [foundApps, setFoundApps] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Rating State
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [activeRatingId, setActiveRatingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setFoundApps([]);
    
    setTimeout(() => {
      const value = searchValue.trim();
      if (!value) {
        setIsLoading(false);
        return;
      }

      const cleanValue = value.replace(/\D/g, '');
      
      if (cleanValue.length === 11) {
          const apps = getAppointmentsByCpf(cleanValue);
          if (apps.length > 0) {
              setFoundApps(apps);
          } else {
              setError('Nenhum agendamento encontrado para este CPF.');
          }
      } else {
          const app = getAppointmentByProtocol(value);
          if (app) {
              setFoundApps([app]);
          } else {
              setError('Protocolo não encontrado. Verifique os dados e tente novamente.');
          }
      }
      setIsLoading(false);
    }, 600);
  };

  const handleCancel = (app: Appointment) => {
    if (window.confirm('Deseja realmente cancelar este agendamento? Esta ação não pode ser revertida e o horário será liberado.')) {
        cancelAppointment(app.id);
        
        // Refresh list
        const cleanValue = searchValue.trim().replace(/\D/g, '');
        if (cleanValue.length === 11) {
            setFoundApps(getAppointmentsByCpf(cleanValue));
        } else {
            const updated = getAppointmentByProtocol(searchValue.trim());
            if (updated) setFoundApps([updated]);
        }
        alert('Agendamento cancelado com sucesso.');
    }
  };

  const handleSubmitRating = (appId: string) => {
    if (rating === 0) return;
    const updatedApp = rateAppointment(appId, rating, feedback);
    if (updatedApp) {
        setFoundApps(prev => prev.map(a => a.id === appId ? updatedApp : a));
        setActiveRatingId(null);
        setRating(0);
        setFeedback('');
        alert('Obrigado pela sua avaliação!');
    }
  };

  const canRate = (app: Appointment) => {
    if (app.status === 'cancelled') return false;
    const appDate = parseISO(app.date);
    const today = startOfToday();
    return isBefore(appDate, today) || isSameDay(appDate, today);
  };

  const isCancellationAllowed = (app: Appointment) => {
    if (app.status !== 'scheduled') return false;
    try {
        const appointmentDateTime = parseISO(`${app.date}T${app.time}`);
        const now = new Date();
        // A regra de 24h de antecedência
        return differenceInHours(appointmentDateTime, now) >= 24;
    } catch (e) {
        return false;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-ibicuitinga-skyBlue/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ibicuitinga-skyBlue/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <h2 className="text-3xl font-black text-ibicuitinga-navy mb-2 flex items-center gap-3 uppercase tracking-tighter">
            <Search className="text-ibicuitinga-royalBlue" size={32} /> Meus Agendamentos
        </h2>
        <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest">Consulte e gerencie seus protocolos</p>
        
        <form onSubmit={handleSearch} className="relative z-10 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    placeholder="Protocolo ou CPF" 
                    className="w-full bg-gray-50 text-ibicuitinga-navy font-bold rounded-2xl border-2 border-gray-100 p-5 focus:border-ibicuitinga-royalBlue outline-none transition-all shadow-inner"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className="bg-ibicuitinga-navy text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-ibicuitinga-royalBlue transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
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
            <div className="flex items-center gap-2 px-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">{foundApps.length} resultado(s) encontrado(s)</p>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {foundApps.map(app => (
                <div key={app.id} className={`bg-white rounded-[3rem] shadow-2xl border-t-8 overflow-hidden animate-scale-in transition-transform hover:scale-[1.01] ${app.status === 'cancelled' ? 'border-red-500' : 'border-ibicuitinga-lightGreen'}`}>
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                     <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-sm ${
                                        app.status === 'scheduled' ? 'bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen' :
                                        app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue'
                                    }`}>
                                        {app.status === 'scheduled' ? 'Agendado' : 
                                         app.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                                    </span>
                                    {app.status === 'scheduled' && (
                                        <span className="text-[10px] font-black text-ibicuitinga-royalBlue uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle size={12} /> Confirmado
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl font-black text-ibicuitinga-navy leading-tight tracking-tighter uppercase">{app.serviceName}</h3>
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                    <User size={16} className="text-ibicuitinga-skyBlue" />
                                    <span>{app.citizen.name}</span>
                                </div>
                            </div>
                            <div className="bg-ibicuitinga-navy/5 p-6 rounded-[2.5rem] text-center min-w-[140px] border border-white shadow-inner flex flex-col justify-center">
                                <p className="text-4xl font-black text-ibicuitinga-navy leading-none tracking-tighter">{app.time}</p>
                                <div className="h-1 w-8 bg-ibicuitinga-yellow mx-auto my-2 rounded-full"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                    <Calendar size={12} />
                                    {app.date.split('-').reverse().join('/')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-ibicuitinga-navy text-white p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 hero-pattern opacity-10 pointer-events-none"></div>
                            <div className="relative z-10 space-y-3">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-[10px] font-black text-ibicuitinga-skyBlue uppercase tracking-widest">Protocolo Oficial</span>
                                    <span className="text-xl font-black tracking-[0.2em] text-ibicuitinga-yellow">{app.protocol}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-ibicuitinga-skyBlue uppercase tracking-widest">CPF Registrado</span>
                                    <span className="font-bold text-sm">{app.citizen.cpf || 'Não informado'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Cancelamento: Regra das 24h */}
                        {app.status === 'scheduled' && (
                            <div className="pt-8 border-t border-gray-100 space-y-4">
                                {isCancellationAllowed(app) ? (
                                    <>
                                        <div className="flex items-start gap-4 bg-ibicuitinga-skyBlue/5 p-5 rounded-3xl border border-ibicuitinga-skyBlue/20">
                                            <div className="bg-ibicuitinga-royalBlue/10 p-2 rounded-xl text-ibicuitinga-royalBlue">
                                                <Info size={20} />
                                            </div>
                                            <p className="text-xs font-bold text-ibicuitinga-navy/70 leading-relaxed italic">
                                                Você pode cancelar este agendamento até 24 horas antes do horário marcado. 
                                                <span className="block text-ibicuitinga-royalBlue mt-1 font-black">O horário será imediatamente liberado para outros cidadãos.</span>
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleCancel(app)}
                                            className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all group shadow-sm active:scale-95"
                                        >
                                            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" /> Cancelar Agendamento
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-200 opacity-80">
                                            <div className="bg-gray-200 p-2 rounded-xl text-gray-500">
                                                <Clock size={20} />
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                                                O prazo para cancelamento online (24 horas de antecedência) expirou. 
                                                <span className="block mt-1">Caso não possa comparecer, sua ausência será registrada como falta.</span>
                                            </p>
                                        </div>
                                        <button 
                                            disabled
                                            className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-400 p-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] cursor-not-allowed opacity-60"
                                        >
                                            <XCircle size={20} /> Cancelamento Indisponível
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Seção de Avaliação (Para dias passados ou hoje) */}
                        {canRate(app) && (
                             <div className="pt-8 border-t border-gray-100">
                                <h4 className="font-black text-ibicuitinga-navy uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-ibicuitinga-yellow/10 rounded-xl flex items-center justify-center">
                                        <Star size={16} className="text-ibicuitinga-yellow fill-ibicuitinga-yellow" /> 
                                    </div>
                                    Avalie sua experiência
                                </h4>
                                {!app.rating && activeRatingId !== app.id ? (
                                    <button 
                                        onClick={() => setActiveRatingId(app.id)}
                                        className="w-full py-4 bg-ibicuitinga-skyBlue/5 text-ibicuitinga-royalBlue rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-ibicuitinga-skyBlue/15 transition-all active:scale-95"
                                    >
                                        Avaliar Atendimento
                                    </button>
                                ) : !app.rating ? (
                                    <div className="space-y-6 animate-fade-in bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                        <div className="flex justify-center gap-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="transition-transform hover:scale-125 focus:scale-125 outline-none"
                                                >
                                                    <Star 
                                                        size={42} 
                                                        className={`${(hoverRating || rating) >= star ? 'fill-ibicuitinga-yellow text-ibicuitinga-yellow' : 'text-gray-200'} transition-colors`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {rating > 0 && (
                                            <div className="animate-fade-in space-y-4">
                                                <textarea
                                                    placeholder="Como podemos melhorar? Deixe seu comentário aqui..."
                                                    className="w-full p-5 bg-white border-2 border-gray-100 rounded-[2rem] text-sm font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue resize-none shadow-sm"
                                                    rows={3}
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                />
                                                <div className="flex gap-3">
                                                    <button onClick={() => {setActiveRatingId(null); setRating(0);}} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Cancelar</button>
                                                    <button 
                                                        onClick={() => handleSubmitRating(app.id)}
                                                        className="flex-[2] bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-ibicuitinga-royalBlue shadow-xl transition-all active:scale-95"
                                                    >
                                                        <Send size={16} /> Enviar Avaliação
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-ibicuitinga-lightGreen/10 p-8 rounded-[2.5rem] border-2 border-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className={i < (app.rating || 0) ? 'fill-ibicuitinga-lightGreen' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <span className="font-black text-sm uppercase tracking-tight">Avaliado com sucesso</span>
                                        </div>
                                        {app.feedback && <p className="mt-4 text-ibicuitinga-navy/70 text-sm font-medium italic bg-white/50 p-4 rounded-2xl">"{app.feedback}"</p>}
                                    </div>
                                )}
                             </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}
      
      <div className="text-center pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-ibicuitinga-royalBlue font-black uppercase text-[10px] tracking-[0.2em] hover:tracking-[0.3em] transition-all opacity-60 hover:opacity-100">
            Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default MyAppointment;