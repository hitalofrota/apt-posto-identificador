import React, { useState, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { getSlotsForDate } from "../../services/scheduler";
import { TimeSlot } from "../../types";

interface DateTimeStepProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  onNext: () => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, onNext }) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!selectedDate) return;
      setLoading(true);
      const data = await getSlotsForDate(format(selectedDate, "yyyy-MM-dd"));
      setSlots(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    load();
  }, [selectedDate]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}><ChevronLeft /></button>
          <h3 className="font-black uppercase tracking-widest">{format(calendarMonth, "MMMM yyyy", { locale: ptBR })}</h3>
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}><ChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 gap-2">
           {/* Renderização do calendário (mantenha sua lógica de botões de dias aqui) */}
           {eachDayOfInterval({ start: startOfMonth(calendarMonth), end: endOfMonth(calendarMonth) }).map(day => (
             <button 
              key={day.toISOString()}
              disabled={isBefore(day, startOfToday()) || isWeekend(day)}
              onClick={() => { setSelectedDate(day); setSelectedTime(""); }}
              className={`h-10 rounded-xl font-bold ${selectedDate && isSameDay(day, selectedDate) ? "bg-ibicuitinga-navy text-white" : "bg-gray-50"}`}
             >{format(day, "d")}</button>
           ))}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white p-6 rounded-3xl shadow-lg animate-fade-in">
          <h4 className="font-black uppercase text-xs mb-4 flex items-center gap-2"><Clock size={16} /> Horários para {format(selectedDate, "dd/MM")}</h4>
          {loading ? <Loader2 className="animate-spin mx-auto" /> : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map(slot => (
                <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}
                  className={`py-3 rounded-xl font-black text-sm ${selectedTime === slot.time ? "bg-ibicuitinga-royalBlue text-white" : "bg-gray-50"}`}
                >{slot.time}</button>
              ))}
            </div>
          )}
          <button onClick={onNext} disabled={!selectedTime} className="w-full mt-6 bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black disabled:opacity-50">Continuar</button>
        </div>
      )}
    </div>
  );
};