import { useState } from "react";
import { format } from "date-fns";
import { createAppointment, hasActiveAppointmentOnDay } from "../services/scheduler";
import { Service, Appointment, Citizen } from "../types";
import { isValidCPF } from "../utils/validators";

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [showDoubleBookingAlert, setShowDoubleBookingAlert] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setTimeout(() => setCurrentStep(1), 200);
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const validateAndSubmit = (lgpdConsent: boolean) => {
    const errors: { [key: string]: string } = {};

    // Validação de Nome completo
    const nameWords = citizenData.name.trim().split(/\s+/);
    if (nameWords.length < 2) {
      errors.name = "Por favor, informe seu nome completo.";
    }

    // Validação de Telefone (11 dígitos)
    const phoneDigits = citizenData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      errors.phone = "Informe um WhatsApp válido.";
    }

    // Validação de CPF
    if (citizenData.hasCpf && citizenData.cpf && !isValidCPF(citizenData.cpf)) {
      errors.cpf = "CPF Inválido.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!lgpdConsent) return;

    // --- BLOQUEIO DE AGENDAMENTO DUPLICADO ---
    if (citizenData.cpf && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      // Chama a função do scheduler que verifica o CPF limpo no localStorage
      const alreadyHasBooking = hasActiveAppointmentOnDay(citizenData.cpf, dateStr);

      if (alreadyHasBooking) {
        setShowDoubleBookingAlert(true); // Abre o modal de erro
        return; // Interrompe o processo aqui
      }
    }

    // Se não for duplicado, cria o agendamento
    const appointment = createAppointment({
      serviceId: selectedService!.id,
      serviceName: selectedService!.name,
      date: format(selectedDate!, "yyyy-MM-dd"),
      time: selectedTime!,
      citizen: citizenData,
    });

    setConfirmedAppointment(appointment);
    setCurrentStep(3);
  };

  return {
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
    showDoubleBookingAlert,
    setShowDoubleBookingAlert,
    handleNext,
    handleBack,
    validateAndSubmit,
  };
};