import React, { useState } from 'react';
import { Appointment } from '../../types';
import { Trash2, Calendar, Star, Send, Clock, CheckCircle, Info, User, XCircle } from 'lucide-react';
import { format, parseISO, isBefore, isSameDay, startOfToday, differenceInHours } from 'date-fns';

interface Props {
  app: Appointment;
  onCancel: (id: string) => void;
  onRate: (id: string, rating: number, feedback: string) => void;
}

export const AppointmentCard: React.FC<Props> = ({ app, onCancel, onRate }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const canRate = app.status !== 'cancelled' && (isBefore(parseISO(app.date), startOfToday()) || isSameDay(parseISO(app.date), startOfToday()));
  
  const isCancellationAllowed = () => {
    if (app.status !== 'scheduled') return false;
    const appointmentDateTime = parseISO(`${app.date}T${app.time}`);
    return differenceInHours(appointmentDateTime, new Date()) >= 48;
  };

  return (
    <div className={`bg-white rounded-[3rem] shadow-2xl border-t-8 overflow-hidden animate-scale-in transition-all hover:scale-[1.01] ${
      app.status === 'cancelled' ? 'border-red-500' : 
      app.status === 'scheduled' ? 'border-ibicuitinga-lightGreen' : 
      'border-ibicuitinga-royalBlue'
    }`}>
      <div className="p-8 md:p-10 flex flex-col h-full">
        {/* Topo do Card: Informações Principais */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-6 mb-8">
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <span className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                app.status === 'scheduled' ? 'bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen' : 
                app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                'bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue'
              }`}>
                {app.status === 'scheduled' ? (
                  <><Clock size={12} /> Agendado</>
                ) : app.status === 'cancelled' ? (
                  <><XCircle size={12} /> Cancelado</>
                ) : (
                  <><CheckCircle size={12} /> Concluído</>
                )}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase leading-tight">
              {app.serviceName}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-500 font-bold">
              <div className="bg-ibicuitinga-skyBlue/10 p-2 rounded-lg">
                <User size={16} className="text-ibicuitinga-skyBlue" />
              </div>
              {app.citizen.name}
            </div>
          </div>

          {/* Badge de Data/Hora com Simetria Vertical */}
          <div className="bg-ibicuitinga-navy text-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[160px] shadow-lg">
            <p className="text-4xl font-black">{app.time}</p>
            <div className="mt-2 pt-2 border-t border-white/20 w-full text-center">
              <p className="text-[10px] font-black text-ibicuitinga-yellow uppercase flex items-center justify-center gap-1">
                <Calendar size={12} /> {app.date.split('-').reverse().join('/')}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Card: Ações (Cancelamento) */}
        <div className="mt-auto pt-8 border-t border-gray-100">
          {app.status === 'scheduled' && (
            <div className="space-y-4">
              {isCancellationAllowed() ? (
                <button 
                  onClick={() => onCancel(app.id)} 
                  className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-5 rounded-[2rem] font-black uppercase text-xs transition-all group"
                >
                  <Trash2 size={20} className="group-hover:rotate-12 transition-transform" /> 
                  Cancelar Agendamento
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                  <div className="bg-gray-200 p-3 rounded-2xl text-gray-400">
                    <Info size={20} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 leading-tight">
                    <span className="text-gray-600 block mb-1 uppercase tracking-tighter">Cancelamento Bloqueado</span>
                    O prazo de 48h de antecedência expirou. Caso não possa comparecer, entre em contato por telefone.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Seção de Avaliação (caso o serviço já tenha ocorrido e não foi cancelado) */}
          {canRate && !showRatingForm && app.status !== 'cancelled' && (
            <button 
              onClick={() => setShowRatingForm(true)}
              className="w-full bg-ibicuitinga-navy text-white p-5 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-ibicuitinga-royalBlue transition-all"
            >
              <Star size={20} /> Avaliar Atendimento
            </button>
          )}

          {/* Aqui entraria o formulário de avaliação se showRatingForm fosse true */}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;