import React, { useState } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  isWeekend,
  isBefore,
  startOfToday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  Printer,
  MessageCircle,
  Star,
  Send,
  X,
} from "lucide-react";
import { SERVICES, SLOT_DURATION_MINUTES } from "../constants";
import {
  getSlotsForDate,
  createAppointment,
  generateWhatsAppLink,
  hasActiveAppointmentOnDay,
  rateAppointment,
} from "../services/scheduler";
import { Service, Appointment, Citizen } from "../types";
import { Link } from "react-router-dom";

const STEPS = ["Serviço", "Data & Hora", "Dados", "Sucesso"];

function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const values = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((values
      .slice(0, count - 1)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;
  return rest(10) === values[9] && rest(11) === values[10];
}

const formatPhone = (value: string) => {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 2) return nums;
  if (nums.length <= 7) return `(${nums.substring(0, 2)}) ${nums.substring(2)}`;
  return `(${nums.substring(0, 2)}) ${nums.substring(2, 7)}-${nums.substring(7, 11)}`;
};

const Booking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customDesc, setCustomDesc] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [citizenData, setCitizenData] = useState<Citizen>({
    name: "",
    hasCpf: true,
    cpf: "",
    phone: "",
    email: "",
  });
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<Appointment | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showDoubleBookingAlert, setShowDoubleBookingAlert] = useState(false);

  // Rating state for integrated survey
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (!service.requiresDescription) setCustomDesc("");
    setTimeout(() => setCurrentStep(1), 200);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(calendarMonth),
    end: endOfMonth(calendarMonth),
  });

  const slots = selectedDate
    ? getSlotsForDate(format(selectedDate, "yyyy-MM-dd"))
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const formatted = formatPhone(value);
      setCitizenData((prev) => ({ ...prev, [name]: formatted }));
      setFormErrors((prev) => ({ ...prev, phone: "" }));
    } else if (name === "cpf") {
      // Remove tudo que não é número e limita a 11 dígitos
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);

      // Formata no padrão 000.000.000-00
      let formatted = onlyNumbers;
      if (onlyNumbers.length > 9) {
        formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6, 9)}-${onlyNumbers.slice(9)}`;
      } else if (onlyNumbers.length > 6) {
        formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6)}`;
      } else if (onlyNumbers.length > 3) {
        formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3)}`;
      }

      setCitizenData((prev) => ({ ...prev, [name]: formatted }));

      // Validação simples
      if (onlyNumbers.length !== 11 && onlyNumbers.length > 0) {
        setFormErrors((prev) => ({ ...prev, cpf: "Digite 11 números" }));
      } else {
        setFormErrors((prev) => ({ ...prev, cpf: "" }));
      }
    } else {
      setCitizenData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = () => {
    const errors: { [key: string]: string } = {};

    // Name validation: at least two words
    const nameWords = citizenData.name.trim().split(/\s+/);
    if (nameWords.length < 2) {
      errors.name =
        "Por favor, informe seu nome completo (pelo menos duas palavras).";
    }

    // Phone validation: (XX) XXXXX-XXXX
    const phoneDigits = citizenData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      errors.phone =
        "Informe um número de contato válido no formato (88) 99999-9999.";
    }

    if (citizenData.hasCpf && citizenData.cpf && !isValidCPF(citizenData.cpf)) {
      errors.cpf = "CPF Inválido.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) return;

    // Check for double booking
    if (citizenData.hasCpf && citizenData.cpf) {
      if (
        hasActiveAppointmentOnDay(
          citizenData.cpf,
          format(selectedDate, "yyyy-MM-dd")
        )
      ) {
        setShowDoubleBookingAlert(true);
        return;
      }
    }

    const appointment = createAppointment({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      customDescription: customDesc,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      citizen: citizenData,
    });
    setConfirmedAppointment(appointment);
    setCurrentStep(3);
  };

  const handleRatingSubmit = () => {
    if (!confirmedAppointment || rating === 0) return;
    rateAppointment(confirmedAppointment.id, rating, feedback);
    setRatingSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center bg-gray-50 px-3 transition-all ${idx <= currentStep ? "text-ibicuitinga-royalBlue" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all shadow-md ${
                idx < currentStep
                  ? "bg-ibicuitinga-lightGreen text-white"
                  : idx === currentStep
                    ? "bg-ibicuitinga-navy text-white ring-4 ring-ibicuitinga-royalBlue/20"
                    : "bg-white text-gray-400 border-2 border-gray-200"
              }`}
            >
              {idx < currentStep ? <Check size={20} /> : idx + 1}
            </div>
            <span className="text-[10px] font-black uppercase mt-2 tracking-widest hidden sm:block">
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-6 rounded-2xl border-4 text-left transition-all flex items-center justify-between group ${
                  selectedService?.id === service.id
                    ? "border-ibicuitinga-royalBlue bg-ibicuitinga-skyBlue/5"
                    : "border-white bg-white hover:border-ibicuitinga-skyBlue/30 shadow-sm"
                }`}
              >
                <span className="font-black text-ibicuitinga-navy uppercase tracking-tight">
                  {service.name}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedService?.id === service.id ? "bg-ibicuitinga-royalBlue border-ibicuitinga-royalBlue text-white" : "border-gray-200"}`}
                >
                  {selectedService?.id === service.id && <Check size={14} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl border-4 border-white p-6">
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
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({
                  length: startOfMonth(calendarMonth).getDay(),
                }).map((_, i) => (
                  <div key={i} />
                ))}
                {daysInMonth.map((day) => {
                  const isSelected =
                    selectedDate && isSameDay(day, selectedDate);
                  const disabled =
                    isBefore(day, startOfToday()) || isWeekend(day);
                  return (
                    <button
                      key={day.toISOString()}
                      disabled={disabled}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }}
                      className={`h-10 w-full rounded-xl text-sm font-bold transition flex items-center justify-center ${isSelected ? "bg-ibicuitinga-navy text-white shadow-lg scale-110" : !disabled ? "bg-gray-50 text-ibicuitinga-navy hover:bg-ibicuitinga-skyBlue/20" : "text-gray-200 cursor-not-allowed"}`}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedDate && (
              <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-ibicuitinga-skyBlue animate-fade-in">
                <h4 className="font-black text-ibicuitinga-navy uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <Clock size={16} /> Horários disponíveis
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-3 rounded-xl font-black text-sm transition ${selectedTime === slot.time ? "bg-ibicuitinga-royalBlue text-white" : slot.available ? "bg-gray-50 text-ibicuitinga-navy hover:bg-ibicuitinga-skyBlue/20" : "bg-gray-100 text-gray-300 decoration-line-through cursor-not-allowed"}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedTime}
                  className="w-full mt-6 bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-royalBlue space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={citizenData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: José da Silva Santos"
                  className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy ${formErrors.name ? "border-red-500" : "border-gray-100"}`}
                />
                {formErrors.name && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={citizenData.phone}
                    onChange={handleInputChange}
                    placeholder="(88) 99999-9999"
                    className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy ${formErrors.phone ? "border-red-500" : "border-gray-100"}`}
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={citizenData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy ${formErrors.cpf ? "border-red-500" : "border-gray-100"}`}
                  />
                  {formErrors.cpf && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">
                      {formErrors.cpf}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-ibicuitinga-skyBlue/5 rounded-2xl border border-ibicuitinga-skyBlue/20">
              <label className="flex gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="w-6 h-6 rounded-lg text-ibicuitinga-royalBlue focus:ring-ibicuitinga-royalBlue"
                />
                <span className="text-xs font-bold text-ibicuitinga-navy/70 leading-relaxed group-hover:text-ibicuitinga-navy">
                  Declaro estar ciente de que meus dados serão processados
                  exclusivamente para fins de agendamento institucional.
                </span>
              </label>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:text-ibicuitinga-navy transition"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!lgpdConsent || !citizenData.name}
                className="flex-[2] bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 active:scale-95 transition-transform"
              >
                Confirmar Protocolo
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && confirmedAppointment && (
          <div className="space-y-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-ibicuitinga-lightGreen text-center space-y-8 animate-fade-in">
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
                  {confirmedAppointment.protocol}
                </p>
              </div>
              <div className="grid gap-3">
                <a
                  href={generateWhatsAppLink(confirmedAppointment)}
                  target="_blank"
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

            {/* Integrated Satisfaction Rating */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-ibicuitinga-yellow/20">
              {!ratingSubmitted ? (
                <div className="text-center space-y-4">
                  <h4 className="font-black text-ibicuitinga-navy uppercase text-sm tracking-widest">
                    Avalie nosso sistema de agendamento
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
                        placeholder="Gostaria de deixar uma sugestão ou elogio? (Opcional)"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-yellow resize-none"
                        rows={2}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <button
                        onClick={handleRatingSubmit}
                        className="bg-ibicuitinga-navy text-ibicuitinga-yellow px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 mx-auto hover:bg-ibicuitinga-royalBlue transition-colors"
                      >
                        <Send size={16} /> Enviar Avaliação
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-ibicuitinga-lightGreen font-black uppercase text-sm animate-pulse tracking-widest">
                  Obrigado pela sua avaliação! Sua satisfação é nossa
                  prioridade.
                </div>
              )}
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="text-ibicuitinga-royalBlue font-black uppercase text-[10px] tracking-widest hover:underline"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ALERT BALLOON FOR DOUBLE BOOKING */}
      {showDoubleBookingAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ibicuitinga-navy/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center space-y-6 animate-scale-in relative border-t-8 border-ibicuitinga-orange">
            <button
              onClick={() => setShowDoubleBookingAlert(false)}
              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-ibicuitinga-navy transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-ibicuitinga-orange/20 rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-orange">
              <AlertCircle size={48} strokeWidth={3} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-tight">
                Limite de Atendimento
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                Você já possui um agendamento ativo para este dia. <br />{" "}
                <span className="text-ibicuitinga-orange">
                  Não é permitido realizar dois agendamentos no mesmo dia.
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowDoubleBookingAlert(false)}
              className="w-full bg-ibicuitinga-navy text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform"
            >
              Entendi, obrigado.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
