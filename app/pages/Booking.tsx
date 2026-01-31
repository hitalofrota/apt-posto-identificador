import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import { ServiceStep } from "../components/booking/ServiceStep";
import { DateTimeStep } from "../components/booking/DateTimeStep";
import { DataStep } from "../components/booking/DataStep";
import { SuccessStep } from "../components/booking/SuccessStep";
import { Check, X, AlertTriangle, Info, MapPinOff } from "lucide-react";

const STEPS = ["Serviço", "Data & Hora", "Dados", "Sucesso"];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selectedService,
    handleServiceSelect,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    citizenData,
    setCitizenData,
    formErrors,
    confirmedAppointment,
    handleNext,
    handleBack,
    validateAndSubmit,
    showDoubleBookingAlert,
    setShowDoubleBookingAlert,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
  } = useBooking();

  const handleCloseAndGoHome = () => {
    setShowErrorModal(false);
    setShowDoubleBookingAlert(false);
    navigate("/");
  };

  const handleBackButton = () => {
    if (currentStep === 0) navigate("/");
    else handleBack();
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center bg-gray-50 px-3 transition-all ${idx <= currentStep ? "text-ibicuitinga-royalBlue" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all shadow-md ${idx < currentStep ? "bg-ibicuitinga-lightGreen text-white" : idx === currentStep ? "bg-ibicuitinga-navy text-white ring-4 ring-ibicuitinga-royalBlue/20" : "bg-white text-gray-400 border-2 border-gray-200"}`}
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
          <ServiceStep
            selectedService={selectedService}
            onSelect={handleServiceSelect}
          />
        )}
        {currentStep === 1 && (
          <DateTimeStep
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <DataStep
            data={citizenData}
            setData={setCitizenData}
            formErrors={formErrors}
            onBack={handleBack}
            onSubmit={validateAndSubmit}
          />
        )}
        {currentStep === 3 && confirmedAppointment && (
          <SuccessStep appointment={confirmedAppointment} />
        )}
      </div>

      {currentStep < 2 && (
        <div className="mt-8">
          <button
            onClick={handleBackButton}
            className="w-full py-4 rounded-2xl font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all border-2 border-gray-100"
          >
            Voltar
          </button>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ibicuitinga-navy/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center space-y-6 animate-scale-in relative border-t-8 border-red-500">
            <button
              onClick={handleCloseAndGoHome}
              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-ibicuitinga-navy transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500">
              <MapPinOff size={48} strokeWidth={3} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
                Limite por Cidade
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={handleCloseAndGoHome}
              className="w-full bg-ibicuitinga-navy text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform"
            >
              Entendi, obrigado
            </button>
          </div>
        </div>
      )}

      {showDoubleBookingAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ibicuitinga-navy/90 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center space-y-6 animate-scale-in relative border-t-8 border-ibicuitinga-orange">
            <button
              onClick={handleCloseAndGoHome}
              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-ibicuitinga-navy transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-ibicuitinga-orange/20 rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-orange">
              <Info size={48} strokeWidth={3} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-tight">
                Limite de Atendimento
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                Você já possui um agendamento ativo para este dia.
              </p>
            </div>
            <button
              onClick={handleCloseAndGoHome}
              className="w-full bg-ibicuitinga-navy text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform"
            >
              Entendi, obrigado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
