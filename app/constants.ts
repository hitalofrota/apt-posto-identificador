import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  { id: '4', name: ServiceType.CIN, requiresDescription: false },
  { id: '1', name: ServiceType.ALISTAMENTO, requiresDescription: false },
  { 
    id: '2', 
    name: ServiceType.CDI, 
    description: 'Quitação com o serviço militar',
    requiresDescription: false 
  },
  { id: '6', name: ServiceType.OUTROS, requiresDescription: true },
];

export const SLOT_DURATION_MINUTES = 20;

export const MORNING_START = "08:00";
export const MORNING_END = "11:00";
export const AFTERNOON_START = "14:10";
export const AFTERNOON_END = "15:30";

export const CONTACT_INFO = {
  email: "juntamilitar@ibicuitinga.ce.gov.br",
  whatsapp: "5588994874751",
  whatsappFormatted: "(88) 99487-4751",
  address: "Rua José Damasceno, 1577, Centro, Ibicuitinga"
};

export const CITY_NAME = "Ibicuitinga-CE";
export const ORG_NAME = "Posto de Identificação";