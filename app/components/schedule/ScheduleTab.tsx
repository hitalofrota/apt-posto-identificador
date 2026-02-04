import React, { useState } from 'react';
import { Calendar, Clock, Info, Lock, Unlock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleTabProps {
  blockedDates: string[];
  blockedSlots: string[];
  actions: {
    handleBlockDate: (date: string) => Promise<void>;
    handleBlockSlot: (date: string, time: string) => Promise<void>;
    handleBlockMonth: (month: string, isBlocked: boolean) => Promise<void>;
  };
  checkMonthBlocked: (month: string) => boolean;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  blockedDates,
  blockedSlots,
  actions,
  checkMonthBlocked
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  const timeSlots = [
    '08:00', '08:20', '08:40', '09:00', '09:20', '09:40',
    '10:00', '10:20', '10:40', '14:10', '14:30', '14:50', '15:10'
  ];

  const isDateBlocked = blockedDates.includes(selectedDate);
  const isMonthBlocked = checkMonthBlocked(selectedMonth);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* SEÇÃO DE CONTROLES - AJUSTE DE TAMANHO E CENTRALIZAÇÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card Controle Diário */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-ibicuitinga-orange flex flex-col justify-center min-h-[160px]">
          <h3 className="font-black text-ibicuitinga-navy uppercase tracking-tighter text-xl mb-6 text-left ml-2">
            Controle Diário
          </h3>
          <div className="flex gap-3 items-center w-full px-2">
            <div className="flex-1">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue text-sm"
              />
            </div>
            {/* Botão com tamanho reduzido (w-32) e fonte menor (text-[9px]) */}
            <button 
              onClick={() => actions.handleBlockDate(selectedDate)}
              className={`w-32 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                isDateBlocked ? 'bg-green-500 text-white' : 'bg-ibicuitinga-navy text-white'
              }`}
            >
              {isDateBlocked ? 'Liberar Dia' : 'Bloquear Dia'}
            </button>
          </div>
        </div>

        {/* Card Controle Mensal */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-ibicuitinga-royalBlue flex flex-col justify-center min-h-[160px]">
          <h3 className="font-black text-ibicuitinga-navy uppercase tracking-tighter text-xl mb-6 text-left ml-2">
            Controle Mensal
          </h3>
          <div className="flex gap-3 items-center w-full px-2">
            <div className="flex-1">
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue text-sm"
              />
            </div>
            {/* Botão com tamanho reduzido (w-32) e fonte menor (text-[9px]) */}
            <button 
              onClick={() => actions.handleBlockMonth(selectedMonth, isMonthBlocked)}
              className={`w-32 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                isMonthBlocked ? 'bg-green-500 text-white' : 'bg-ibicuitinga-navy text-white'
              }`}
            >
              {isMonthBlocked ? 'Liberar Mês' : 'Bloquear Mês'}
            </button>
          </div>
        </div>
      </div>

      {/* GRADE DE HORÁRIOS */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
            Controle de Horários: {format(parseISO(selectedDate), "dd/MM/yyyy")}
          </h3>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isDateBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {isDateBlocked ? 'Data Bloqueada' : 'Data Disponível'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {timeSlots.map((time) => {
            const slotKey = `${selectedDate}_${time}`;
            const isSlotBlocked = blockedSlots.includes(slotKey) || isDateBlocked;

            return (
              <button
                key={time}
                onClick={() => !isDateBlocked && actions.handleBlockSlot(selectedDate, time)}
                disabled={isDateBlocked}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 group relative ${
                  isSlotBlocked 
                    ? 'bg-gray-50 border-gray-100 opacity-60' 
                    : 'bg-white border-gray-50 hover:border-ibicuitinga-royalBlue shadow-sm'
                }`}
              >
                <span className={`text-2xl font-black ${isSlotBlocked ? 'text-gray-300' : 'text-ibicuitinga-navy'}`}>{time}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {isSlotBlocked ? 'Indisponível' : 'Disponível'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};