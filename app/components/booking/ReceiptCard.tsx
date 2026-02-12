import React from "react";
import { Check, MessageCircle, Printer, Calendar, Clock, User, Fingerprint, FileText } from "lucide-react";
import { Appointment } from "../../types";
import { generateWhatsAppLink } from "../../services/scheduler";
import { displayDate, toISODate } from "../../utils/dateUtils";

interface ReceiptCardProps {
  appointment: Appointment;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ appointment }) => {
  // Padronização: Utilizamos displayDate do helper para formatar a data do agendamento
  const formattedAppointmentDate = displayDate(appointment.date);
  
  // Padronização: Geramos a data de emissão no formato brasileiro localmente
  const today = displayDate(toISODate(new Date()));

  return (
    <>
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
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
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
          .no-print { display: none !important; height: 0 !important; }
          .check-container {
            background-color: #22c55e !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}} />

      <div id="printable-receipt" className="bg-white p-8 rounded-[3rem] shadow-2xl border-t-8 border-ibicuitinga-lightGreen text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-ibicuitinga-lightGreen rounded-2xl flex items-center justify-center mx-auto text-white shadow-md check-container">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
            Agendamento Realizado!
          </h2>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocolo Oficial</p>
          <p className="text-3xl font-black text-ibicuitinga-navy tracking-tight">{appointment.protocol}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left border-y border-gray-100 py-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-ibicuitinga-navy border border-gray-100">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</p>
              <p className="font-black text-ibicuitinga-navy uppercase leading-tight">{appointment.citizenName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-ibicuitinga-navy border border-gray-100">
              <Fingerprint size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Serviço Solicitado</p>
              <p className="font-black text-ibicuitinga-navy uppercase leading-tight">{appointment.serviceName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-ibicuitinga-navy border border-gray-100">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Data do Atendimento</p>
                <p className="font-black text-ibicuitinga-navy text-lg">{formattedAppointmentDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-ibicuitinga-navy border border-gray-100">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Horário</p>
                <p className="font-black text-ibicuitinga-navy text-lg">{appointment.time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-50 mt-2">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Comprovante gerado em</p>
              <p className="font-bold text-gray-600 text-sm">{today}</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-gray-400 font-bold uppercase px-4 leading-relaxed">
          Para o atendimento, é obrigatório apresentar este comprovante e um documento oficial com foto.
        </p>

        <div className="grid gap-3 no-print pt-4">
          <a
            href={generateWhatsAppLink(appointment)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ibicuitinga-lightGreen text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <MessageCircle size={20} /> Salvar no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Printer size={20} /> Imprimir Comprovante
          </button>
        </div>
      </div>
    </>
  );
};