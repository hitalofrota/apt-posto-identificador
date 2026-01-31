export enum ServiceType {
  ALISTAMENTO = 'Alistamento Militar',
  CDI = '1ª e 2ª via do Certificado de Dispensa de Incorporação',
  CIN = '1ª e 2ª via da Carteira de Identidade Nacional',
  OUTROS = 'Outros Serviços'
}

export interface Service {
  id: string;
  name: ServiceType;
  description?: string;
  requiresDescription: boolean;
}

export interface Citizen {
  id: string;
  name: string;
  hasCpf: boolean;
  cep?: string;
  cpf?: string;
  phone: string;
  email?: string;
}

export interface Appointment {
  id: string;
  protocol: string;
  serviceId: string;
  serviceName: string;
  customDescription?: string;
  date: string;
  time: string;
  citizenId: string;
  citizen: Citizen;
  createdAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySchedule {
  date: string;
  isHoliday: boolean;
  isWeekend: boolean;
  slots: TimeSlot[];
}