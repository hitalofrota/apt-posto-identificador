import React, { useState } from "react";
import { Check, MessageCircle, Printer, Star, Send } from "lucide-react";
import { Appointment } from "../../types";
import { generateWhatsAppLink, rateAppointment } from "../../services/scheduler";
import { Link } from "react-router-dom";

interface SuccessStepProps {
  appointment: Appointment;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ appointment }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (rating === 0) return;
    rateAppointment(appointment.id, rating, feedback);
    setRatingSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-ibicuitinga-lightGreen text-center space-y-8">
        <div className="w-20 h-20 bg-ibicuitinga-lightGreen rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg animate-bounce">
          <Check size={48} strokeWidth={3} />
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-ibicuitinga-navy tracking-tighter uppercase leading-tight">
            Agendamento Realizado!
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            Salve o protocolo abaixo para sua segurança.
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

        <div className="grid gap-3">
          <a
            href={generateWhatsAppLink(appointment)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ibicuitinga-lightGreen text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <MessageCircle size={20} /> Salvar no WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Printer size={20} /> Imprimir Comprovante
          </button>
        </div>
      </div>

      {/* Pesquisa de Satisfação Integrada */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-ibicuitinga-yellow/20">
        {!ratingSubmitted ? (
          <div className="text-center space-y-4">
            <h4 className="font-black text-ibicuitinga-navy uppercase text-sm tracking-widest">
              Avalie nosso sistema
            </h4>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    size={32}
                    className={`${(hoverRating || rating) >= star ? "fill-ibicuitinga-yellow text-ibicuitinga-yellow" : "text-gray-200"}`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="animate-fade-in space-y-4">
                <textarea
                  placeholder="Gostaria de deixar uma sugestão? (Opcional)"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-yellow resize-none"
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  onClick={handleRatingSubmit}
                  className="bg-ibicuitinga-navy text-ibicuitinga-yellow px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 mx-auto"
                >
                  <Send size={16} /> Enviar Avaliação
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-ibicuitinga-lightGreen font-black uppercase text-sm animate-pulse tracking-widest">
            Obrigado pela sua avaliação!
          </div>
        )}
      </div>

      <div className="text-center">
        <Link to="/" className="text-ibicuitinga-royalBlue font-black uppercase text-[10px] tracking-widest hover:underline">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};