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
    return differenceInHours(appointmentDateTime, new Date()) >= 24;
  };

  return (
    <div className={`bg-white rounded-[3rem] shadow-2xl border-t-8 overflow-hidden animate-scale-in transition-transform hover:scale-[1.01] ${app.status === 'cancelled' ? 'border-red-500' : 'border-ibicuitinga-lightGreen'}`}>
      <div className="p-8 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${app.status === 'scheduled' ? 'bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen' : app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue'}`}>
              {app.status === 'scheduled' ? 'Agendado' : app.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
            </span>
            <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase">{app.serviceName}</h3>
            <div className="flex items-center gap-2 text-gray-500 font-bold">
              <User size={16} className="text-ibicuitinga-skyBlue" /> {app.citizen.name}
            </div>
          </div>
          <div className="bg-ibicuitinga-navy/5 p-6 rounded-[2.5rem] text-center min-w-[140px] shadow-inner">
            <p className="text-4xl font-black text-ibicuitinga-navy">{app.time}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center gap-1">
              <Calendar size={12} /> {app.date.split('-').reverse().join('/')}
            </p>
          </div>
        </div>

        {/* Lógica de Cancelamento e Avaliação (Resumida para brevidade) */}
        {app.status === 'scheduled' && (
            <div className="pt-8 border-t border-gray-100 space-y-4">
                {isCancellationAllowed() ? (
                    <button onClick={() => onCancel(app.id)} className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-5 rounded-[2rem] font-black uppercase text-xs transition-all">
                        <Trash2 size={20} /> Cancelar Agendamento
                    </button>
                ) : (
                    <p className="text-xs text-center font-bold text-gray-400 italic">Cancelamento indisponível (prazo de 24h expirado).</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};