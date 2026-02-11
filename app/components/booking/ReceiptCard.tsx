import React from "react";
import { Check, MessageCircle, Printer } from "lucide-react";
import { Appointment } from "../../types";
import { generateWhatsAppLink } from "../../services/scheduler";

interface ReceiptCardProps {
  appointment: Appointment;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ appointment }) => {
  return (
    <>
      {/* Estilos de Impressão Restritivos */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          html, body {
            height: 100vh;
            overflow: hidden;
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 2cm;
            border: none !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .check-container {
            background-color: #22c55e !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}} />

      <div id="printable-receipt" className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-ibicuitinga-lightGreen text-center space-y-8">
        <div className="w-20 h-20 bg-ibicuitinga-lightGreen rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg animate-bounce check-container">
          <Check size={48} strokeWidth={3} />
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-ibicuitinga-navy tracking-tighter uppercase leading-tight">
            Agendamento Realizado!
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            Salva o protocolo abaixo para sua segurança.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-[2rem] border-4 border-dashed border-gray-100">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            Protocolo Oficial
          </p>
          <p className="text-4xl font-black text-ibicuitinga-navy tracking-widest mt-2">
            {appointment.protocol}
          </p>
        </div>

        <div className="grid gap-3 no-print">
          <a
            href={generateWhatsAppLink(appointment)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ibicuitinga-lightGreen text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition"
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