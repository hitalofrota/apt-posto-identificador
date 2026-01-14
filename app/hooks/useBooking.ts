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

  // --- Handlers fiéis ao original ---

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Redirecionamento automático com delay conforme o original
    setTimeout(() => setCurrentStep(1), 200);
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

const validateAndSubmit = (lgpdConsent: boolean) => {
    // 1. Limpa erros anteriores antes de começar nova validação
    const errors: { [key: string]: string } = {};

    // 2. Validação de Nome: pelo menos duas palavras
    const nameWords = citizenData.name.trim().split(/\s+/);
    if (!citizenData.name.trim()) {
      errors.name = "O nome é obrigatório.";
    } else if (nameWords.length < 2) {
      errors.name = "Informe seu nome completo (pelo menos duas palavras).";
    }

    // 3. Validação de Telefone: 11 dígitos numéricos
    const phoneDigits = citizenData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      errors.phone = "Informe um WhatsApp válido no formato (88) 99999-9999.";
    }

    // 4. Validação de CPF
    if (citizenData.hasCpf) {
      if (!citizenData.cpf) {
        errors.cpf = "O CPF é obrigatório.";
      } else if (!isValidCPF(citizenData.cpf)) {
        errors.cpf = "CPF Inválido. Verifique os números.";
      }
    }

    // 5. Se houver qualquer erro, atualiza o estado e para a execução
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Interrompe aqui, não avança para o sucesso
    }

    // 6. Se chegou aqui, não há erros. Limpa o estado de erros e prossegue
    setFormErrors({});

    if (!lgpdConsent) return;

    // Verificação de agendamento duplicado (Double Booking)
    if (citizenData.cpf && selectedDate) {
      if (hasActiveAppointmentOnDay(citizenData.cpf, format(selectedDate, "yyyy-MM-dd"))) {
        setShowDoubleBookingAlert(true);
        return;
      }
    }

    // Criar agendamento (Simulação de salvamento)
    const appointment = createAppointment({
      serviceId: selectedService!.id,
      serviceName: selectedService!.name,
      date: format(selectedDate!, "yyyy-MM-dd"),
      time: selectedTime!,
      citizen: citizenData,
    });

    setConfirmedAppointment(appointment);
    setCurrentStep(3); // Vai para a tela de sucesso
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