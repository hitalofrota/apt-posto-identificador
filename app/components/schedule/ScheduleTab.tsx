import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Info, Lock, Unlock, Loader2 } from 'lucide-react';
import { getTodayStr, toMonthYear, displayDate } from "../../utils/dateUtils";
import { getSlotsForDate } from "../../services/scheduler";
import { TimeSlot } from "../../types";

interface ScheduleTabProps {
  blockedDates: string[];
  actions: {
    handleBlockDate: (date: string) => Promise<void>;
    handleBlockSlot: (date: string, time: string) => Promise<void>;
    handleBlockMonth: (month: string, isBlocked: boolean) => Promise<void>;
  };
  checkMonthBlocked: (month: string) => boolean;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  blockedDates,
  actions,
  checkMonthBlocked
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedMonth, setSelectedMonth] = useState(toMonthYear(new Date()));
  
  const [daySlots, setDaySlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const loadDayStatus = async () => {
    setIsLoadingSlots(true);
    try {
      const data = await getSlotsForDate(selectedDate);
      setDaySlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar status do dia:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadDayStatus();
  }, [selectedDate]);

  const isDateBlocked = blockedDates.includes(selectedDate);
  const isMonthBlocked = checkMonthBlocked(selectedMonth);

  const handleToggleSlot = async (time: string) => {
    await actions.handleBlockSlot(selectedDate, time);
    await loadDayStatus()
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <button 
              onClick={async () => {
                await actions.handleBlockDate(selectedDate);
                loadDayStatus();
              }}
              className={`w-32 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-md transition-all active:scale-95 ${
                isDateBlocked ? 'bg-green-500 text-white' : 'bg-ibicuitinga-navy text-white'
              }`}
            >
              {isDateBlocked ? 'Liberar Dia' : 'Bloquear Dia'}
            </button>
          </div>
        </div>

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
            <button 
              onClick={() => actions.handleBlockMonth(selectedMonth, isMonthBlocked)}
              className={`w-32 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-md transition-all active:scale-95 ${
                isMonthBlocked ? 'bg-green-500 text-white' : 'bg-ibicuitinga-navy text-white'
              }`}
            >
              {isMonthBlocked ? 'Liberar Mês' : 'Bloquear Mês'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            Controle de Horários: {displayDate(selectedDate)}
            {isLoadingSlots && <Loader2 size={14} className="animate-spin text-ibicuitinga-royalBlue" />}
          </h3>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isDateBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {isDateBlocked ? 'Data Totalmente Bloqueada' : 'Data Disponível'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {daySlots.map((slot) => {
            const isBlocked = isDateBlocked || !slot.available;

            return (
              <button
                key={slot.time}
                onClick={() => !isDateBlocked && handleToggleSlot(slot.time)}
                disabled={isDateBlocked || isLoadingSlots}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 group relative ${
                  isBlocked 
                    ? 'bg-red-50 border-red-100' 
                    : 'bg-white border-gray-50 hover:border-ibicuitinga-royalBlue shadow-sm'
                } ${isLoadingSlots ? 'opacity-50' : ''}`}
              >
                <div className="absolute top-3 right-3">
                  {isBlocked ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} className="text-gray-200" />}
                </div>
                
                <span className={`text-2xl font-black ${isBlocked ? 'text-red-600' : 'text-ibicuitinga-navy'}`}>
                  {slot.time}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isBlocked ? 'text-red-400' : 'text-gray-400'}`}>
                  {isBlocked ? 'Indisponível' : 'Livre'}
                </span>
              </button>
            );
          })}
          
          {!isLoadingSlots && daySlots.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
              Nenhum horário configurado para esta data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};