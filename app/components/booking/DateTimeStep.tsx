import React, { useState } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  isBefore,
  startOfToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getSlotsForDate } from "../../services/scheduler";

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
  onNext,
}) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(calendarMonth),
    end: endOfMonth(calendarMonth),
  });

  const slots = selectedDate
    ? getSlotsForDate(format(selectedDate, "yyyy-MM-dd"))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border-4 border-white p-6">
        {/* Cabeçalho do Calendário */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="font-black text-ibicuitinga-navy uppercase tracking-widest">
            {format(calendarMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <button
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* --- DIAS DA SEMANA (Adicionado aqui) --- */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Grade de Dias */}
        <div className="grid grid-cols-7 gap-2">
          {/* Espaçamento para o primeiro dia do mês começar no dia da semana correto */}
          {Array.from({
            length: startOfMonth(calendarMonth).getDay(),
          }).map((_, i) => (
            <div key={i} />
          ))}

          {daysInMonth.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const disabled = isBefore(day, startOfToday()) || isWeekend(day);

            return (
              <button
                key={day.toISOString()}
                disabled={disabled}
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedTime("");
                }}
                className={`h-10 w-full rounded-xl text-sm font-bold transition flex items-center justify-center 
        ${
          isSelected
            ? "bg-ibicuitinga-navy text-white shadow-lg scale-110"
            : !disabled
              ? "bg-gray-50 text-ibicuitinga-navy hover:bg-ibicuitinga-skyBlue/20"
              : // MELHORIA DE VISIBILIDADE:
                // Trocamos text-gray-200 por text-gray-400 (mais escuro)
                // Aumentamos opacity de 40 para 60
                "text-gray-400 bg-gray-50/50 cursor-not-allowed opacity-60"
        }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Horários (Só aparece após selecionar o dia) */}
      {selectedDate && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-ibicuitinga-skyBlue animate-fade-in">
          <h4 className="font-black text-ibicuitinga-navy uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <Clock size={16} /> Horários disponíveis para{" "}
            {format(selectedDate, "dd/MM")}
          </h4>

          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-3 rounded-xl font-black text-sm transition 
                  ${
                    selectedTime === slot.time
                      ? "bg-ibicuitinga-royalBlue text-white"
                      : slot.available
                        ? "bg-gray-50 text-ibicuitinga-navy hover:bg-ibicuitinga-skyBlue/20"
                        : "bg-gray-100 text-gray-300 decoration-line-through cursor-not-allowed"
                  }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={!selectedTime}
            className="w-full mt-6 bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 active:scale-95 transition-all"
          >
            Continuar para Dados Pessoais
          </button>
        </div>
      )}
    </div>
  );
};
