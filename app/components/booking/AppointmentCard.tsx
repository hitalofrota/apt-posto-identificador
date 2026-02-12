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
  Printer,
  Check,
  Fingerprint,
  FileText
} from "lucide-react";
import { parseISO, differenceInHours } from "date-fns";
import { displayDate, toISODate } from "../../utils/dateUtils";

interface Props {
  app: Appointment;
  onCancel: (id: string) => void;
  onRate?: (id: string, rating: number, feedback: string) => void;
}

export const AppointmentCard: React.FC<Props> = ({ app, onCancel }) => {
  const today = displayDate(toISODate(new Date()));

  const isCancellationAllowed = () => {
    if (app.status !== "scheduled") return false;
    try {
      const appointmentDateTime = parseISO(`${app.date}T${app.time}`);
      return differenceInHours(appointmentDateTime, new Date()) >= 24;
    } catch (error) {
      return false;
    }
  };

  const getStatusDisplay = () => {
    switch (app.status) {
      case "cancelled":
        return {
          label: "Cancelado",
          css: "bg-red-100 text-red-600",
          icon: <XCircle size={14} />,
          borderColor: "border-red-500"
        };
      case "completed":
        return {
          label: "Concluído",
          css: "bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue",
          icon: <CheckCircle size={14} />,
          borderColor: "border-ibicuitinga-royalBlue"
        };
      case "scheduled":
      default:
        return {
          label: "Agendado",
          css: "bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen",
          icon: <Clock size={14} />,
          borderColor: "border-ibicuitinga-lightGreen"
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <>
      {/* CSS para Impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: auto; }
          html, body { 
            height: 100vh; 
            overflow: hidden; 
            margin: 0 !important; 
            padding: 0 !important; 
            background-color: white !important; 
          }
          body * { visibility: hidden; }
          #printable-receipt-${app.id}, #printable-receipt-${app.id} * { visibility: visible; }
          #printable-receipt-${app.id} {
            position: absolute;
            top: 0; left: 0; width: 100%;
            margin: 0; padding: 1.5cm;
            border: none !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}} />

      <div className={`bg-white rounded-[3rem] shadow-2xl border-t-8 overflow-hidden transition-all hover:scale-[1.01] ${status.borderColor}`}>
        <div className="p-8 md:p-10 space-y-8">
          {/* Cabeçalho do Card */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-3">
              <span className={`flex items-center gap-2 w-fit text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${status.css}`}>
                {status.icon} {status.label}
              </span>
              <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase leading-none">
                {app.serviceName}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 font-bold">
                <User size={16} className="text-ibicuitinga-skyBlue" /> {app.citizen.name}
              </div>
            </div>

            <div className="bg-ibicuitinga-navy/5 p-6 rounded-[2.5rem] text-center min-w-[140px] shadow-inner">
              <p className="text-4xl font-black text-ibicuitinga-navy">{app.time}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center gap-1">
                <Calendar size={12} /> {displayDate(app.date)}
              </p>
            </div>
          </div>

          {/* Seção de Ações de Cancelamento */}
          {app.status === "scheduled" && (
            <div className="pt-8 border-t border-gray-100">
              {isCancellationAllowed() ? (
                <button
                  onClick={() => onCancel(app.id)}
                  className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-5 rounded-[2rem] font-black uppercase text-xs transition-all shadow-sm active:scale-95"
                >
                  <Trash2 size={20} /> Cancelar Agendamento
                </button>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-3 text-amber-700 text-xs font-bold border border-amber-100">
                  <AlertCircle size={18} className="shrink-0" /> 
                  Cancelamento disponível apenas com 24h de antecedência.
                </div>
              )}
            </div>
          )}
          
          {/* Informação de Protocolo e Botão de Imprimir */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-50">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
              Protocolo: {app.protocol}
            </span>
            
            {/* SÓ MOSTRA O BOTÃO DE IMPRIMIR SE NÃO ESTIVER CANCELADO */}
            {app.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 text-ibicuitinga-royalBlue font-black uppercase text-[10px] tracking-widest hover:opacity-70 transition-all bg-ibicuitinga-royalBlue/5 px-6 py-2 rounded-full"
              >
                <Printer size={16} /> Imprimir Comprovante
              </button>
            )}
          </div>
        </div>
      </div>

      {/* COMPROVANTE OCULTO (Só aparece na impressão devido ao CSS acima) */}
      <div id={`printable-receipt-${app.id}`} className="hidden print:block bg-white text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-ibicuitinga-lightGreen rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
            Comprovante de Agendamento
          </h2>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocolo Oficial</p>
          <p className="text-3xl font-black text-ibicuitinga-navy tracking-tight">{app.protocol}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left border-y border-gray-100 py-6">
          <div className="flex items-center gap-3">
            <User size={20} className="text-ibicuitinga-navy" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</p>
              <p className="font-black text-ibicuitinga-navy uppercase leading-tight">{app.citizen.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Fingerprint size={20} className="text-ibicuitinga-navy" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Serviço Solicitado</p>
              <p className="font-black text-ibicuitinga-navy uppercase leading-tight">{app.serviceName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-ibicuitinga-navy" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Data</p>
                <p className="font-black text-ibicuitinga-navy text-lg">{displayDate(app.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-ibicuitinga-navy" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Horário</p>
                <p className="font-black text-ibicuitinga-navy text-lg">{app.time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-50 mt-2">
            <FileText size={18} className="text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Emitido em</p>
              <p className="font-bold text-gray-600 text-sm">{today}</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-gray-400 font-bold uppercase px-4 leading-relaxed">
          Para o atendimento, é obrigatório apresentar este comprovante e um documento oficial com foto.
        </p>
      </div>
    </>
  );
};