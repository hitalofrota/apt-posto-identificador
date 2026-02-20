import React, { useState, useEffect } from "react";
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isBefore, 
  startOfToday, 
  getDay,
  getHours,
  getMinutes
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { getSlotsForDate } from "../../services/scheduler";
import { TimeSlot } from "../../types";
import { toISODate } from "../../utils/dateUtils";

const FERIADOS = [
  "2026-01-01", 
];

interface DateTimeStepProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  onNext: () => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime, 
  onNext 
}) => {
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  useEffect(() => {
    const load = async () => {
      if (!selectedDate) {
        setSlots([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getSlotsForDate(toISODate(selectedDate));
        setSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar slots:", error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  const daysInMonth = eachDayOfInterval({ 
    start: startOfMonth(calendarMonth), 
    end: endOfMonth(calendarMonth) 
  });

  const firstDayOfMonth = getDay(daysInMonth[0]);

  const isDateDisabled = (day: Date) => {
    const today = startOfToday();
    const dateStr = toISODate(day);
    const dayOfWeek = getDay(day);
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return isBefore(day, today) || FERIADOS.includes(dateStr) || isWeekend;
  };

  const isTimePassed = (slotTime: string) => {
    if (!selectedDate || !isSameDay(selectedDate, new Date())) return false;

    const now = new Date();
    const currentHour = getHours(now);
    const currentMinute = getMinutes(now);
    
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);

    if (slotHour < currentHour) return true;
    if (slotHour === currentHour && slotMinute <= currentMinute) return true;
    
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100">
        
        <div className="flex justify-between items-center mb-8 px-2">
          <button 
            type="button"
            onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-ibicuitinga-navy" />
          </button>
          
          <h3 className="font-black uppercase tracking-widest text-ibicuitinga-navy">
            {format(calendarMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          
          <button 
            type="button"
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-ibicuitinga-navy" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[11px] font-black text-gray-500 uppercase pb-2 border-b border-gray-50 mb-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 w-full" />
          ))}

          {daysInMonth.map((day) => {
            const disabled = isDateDisabled(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button 
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => { 
                  setSelectedDate(day); 
                  setSelectedTime("");
                }}
                className={`
                  h-12 w-full rounded-2xl font-bold transition-all text-sm flex items-center justify-center
                  ${disabled 
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed opacity-40"
                    : isSelected 
                      ? "bg-ibicuitinga-navy text-white shadow-lg scale-105"
                      : "bg-white border-2 border-gray-50 text-ibicuitinga-navy hover:border-ibicuitinga-royalBlue hover:bg-ibicuitinga-royalBlue/5"
                  }
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 animate-slide-up">
          <h4 className="font-black uppercase text-xs mb-6 flex items-center gap-2 text-ibicuitinga-navy">
            <Clock size={16} className="text-ibicuitinga-royalBlue" /> 
            Horários para {format(selectedDate, "dd/MM")}
          </h4>
          
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-ibicuitinga-royalBlue" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {slots.length > 0 ? (
                slots.map(slot => {
                  const isPast = isTimePassed(slot.time);
                  const isButtonDisabled = !slot.available || isPast;

                  return (
                    <button 
                      key={slot.time} 
                      type="button"
                      disabled={isButtonDisabled} 
                      onClick={() => setSelectedTime(slot.time)}
                      className={`
                        py-3 rounded-2xl font-black text-sm transition-all
                        ${selectedTime === slot.time 
                          ? "bg-ibicuitinga-royalBlue text-white shadow-md scale-105" 
                          : "bg-gray-50 text-ibicuitinga-navy hover:bg-gray-200 disabled:opacity-20 disabled:grayscale"
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-4 text-gray-400 font-bold">
                  Nenhum horário disponível nesta data.
                </div>
              )}
            </div>
          )}
          
          <button 
            type="button"
            onClick={onNext} 
            disabled={!selectedTime} 
            className="w-full mt-8 bg-ibicuitinga-navy text-white py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Avançar para Dados
          </button>
        </div>
      )}
    </div>
  );
};