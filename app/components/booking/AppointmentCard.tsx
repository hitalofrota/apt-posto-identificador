import React from "react";
import { Appointment } from "../../types";
import {
  Trash2,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { parseISO, isBefore, startOfToday, differenceInHours } from "date-fns";
import { displayDate } from "../../utils/dateUtils";

interface Props {
  app: Appointment;
  onCancel: (id: string) => void;
  onRate: (id: string, rating: number, feedback: string) => void;
}

export const AppointmentCard: React.FC<Props> = ({ app, onCancel }) => {
  const appointmentDate = parseISO(app.date);
  const today = startOfToday();
  const isExpired = isBefore(appointmentDate, today);

  const isCancellationAllowed = () => {
    if (app.status !== "scheduled") return false;
    const appointmentDateTime = parseISO(`${app.date}T${app.time}`);
    return differenceInHours(appointmentDateTime, new Date()) >= 24;
  };

  const getStatusDisplay = () => {
    if (app.status === "cancelled") {
      return {
        label: "Cancelado",
        css: "bg-red-100 text-red-600",
        icon: <XCircle size={14} />,
      };
    }
    if (
      app.status === "completed" ||
      (app.status === "scheduled" && isExpired)
    ) {
      return {
        label: "Concluído",
        css: "bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue",
        icon: <CheckCircle size={14} />,
      };
    }
    return {
      label: "Agendado",
      css: "bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen",
      icon: <Clock size={14} />,
    };
  };

  const status = getStatusDisplay();

  return (
    <div
      className={`bg-white rounded-[3rem] shadow-2xl border-t-8 overflow-hidden transition-transform hover:scale-[1.01] ${app.status === "cancelled" ? "border-red-500" : "border-ibicuitinga-lightGreen"}`}
    >
      <div className="p-8 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <span
              className={`flex items-center gap-2 w-fit text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${status.css}`}
            >
              {status.icon} {status.label}
            </span>
            <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase leading-none">
              {app.serviceName}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 font-bold">
              <User size={16} className="text-ibicuitinga-skyBlue" />{" "}
              {app.citizen.name}
            </div>
          </div>
          <div className="bg-ibicuitinga-navy/5 p-6 rounded-[2.5rem] text-center min-w-[140px] shadow-inner">
            <p className="text-4xl font-black text-ibicuitinga-navy">
              {app.time}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center gap-1">
              <Calendar size={12} /> {displayDate(app.date)}
            </p>
          </div>
        </div>

        {app.status === "scheduled" && !isExpired && (
          <div className="pt-8 border-t border-gray-100">
            {isCancellationAllowed() ? (
              <button
                onClick={() => onCancel(app.id)}
                className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-5 rounded-[2rem] font-black uppercase text-xs transition-all"
              >
                <Trash2 size={20} /> Cancelar Agendamento
              </button>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-3 text-amber-700 text-xs font-bold border border-amber-100">
                <AlertCircle size={18} /> Cancelamento disponível apenas com 24h
                de antecedência.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};