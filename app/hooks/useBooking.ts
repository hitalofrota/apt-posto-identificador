import { useState, useCallback } from "react";
import { format } from "date-fns";
import { createAppointment, hasActiveAppointmentOnDay } from "../services/scheduler";
import { Service, Appointment, Citizen } from "../types";
import { isValidCPF } from "../utils/validators";

const validateCitizenForm = (data: Citizen) => {
  const errors: Record<string, string> = {};

  const nameWords = data.name.trim().split(/\s+/);
  if (nameWords.length < 2) {
    errors.name = "Por favor, informe seu nome completo.";
  }

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length !== 11) {
    errors.phone = "Informe um WhatsApp válido com DDD.";
  }

  if (data.hasCpf && data.cpf && !isValidCPF(data.cpf)) {
    errors.cpf = "CPF Inválido.";
  }

  return errors;
};

export const useBooking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [citizenData, setCitizenData] = useState<Citizen>({
    name: "",
    hasCpf: true,
    cpf: "",
    phone: "",
    email: "",
  });

  const [uiState, setUiState] = useState({
    formErrors: {} as Record<string, string>,
    isSubmitting: false,
    showDoubleBookingAlert: false,
    confirmedAppointment: null as Appointment | null,
  });

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    setTimeout(() => setCurrentStep(1), 200);
  }, []);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const resetBooking = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setUiState({
      formErrors: {},
      isSubmitting: false,
      showDoubleBookingAlert: false,
      confirmedAppointment: null,
    });
  };

  const validateAndSubmit = async (lgpdConsent: boolean) => {
    const errors = validateCitizenForm(citizenData);
    if (Object.keys(errors).length > 0) {
      setUiState(prev => ({ ...prev, formErrors: errors }));
      return;
    }

    if (!lgpdConsent || !selectedService || !selectedDate || !selectedTime) {
      return;
    }

    setUiState(prev => ({ ...prev, isSubmitting: true, formErrors: {} }));

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      if (citizenData.cpf) {
        const alreadyHasBooking = await hasActiveAppointmentOnDay(citizenData.cpf, dateStr);
        if (alreadyHasBooking) {
          setUiState(prev => ({ ...prev, showDoubleBookingAlert: true, isSubmitting: false }));
          return;
        }
      }

      const appointment = await createAppointment({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: dateStr,
        time: selectedTime,
        citizen: citizenData,
      });

      setUiState(prev => ({ ...prev, confirmedAppointment: appointment }));
      setCurrentStep(3);
    } catch (err) {
      console.error("Erro ao processar agendamento:", err);
      alert("Não foi possível finalizar seu agendamento. Tente novamente em instantes.");
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    currentStep,
    selectedService,
    selectedDate,
    selectedTime,
    citizenData,
    ...uiState,
    
    setSelectedDate,
    setSelectedTime,
    setCitizenData,
    setShowDoubleBookingAlert: (val: boolean) => setUiState(prev => ({ ...prev, showDoubleBookingAlert: val })),

    handleServiceSelect,
    handleNext,
    handleBack,
    validateAndSubmit,
    resetBooking
  };
};