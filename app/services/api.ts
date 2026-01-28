import axios from "axios";
import { Appointment } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@AdminToken");
  
  if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    if (config.headers) {
      delete config.headers.Authorization;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const appointmentsApi = {
  // Rota pública para listar agendamentos e calcular disponibilidade
  getAll: () => api.get<Appointment[]>("/appointments").then(r => r.data),
  
  // Rota pública para buscar agendamentos de um cidadão específico
  getByCpf: (cpf: string) => 
    api.get<Appointment[]>(`/appointments/citizen/${cpf.replace(/\D/g, "")}`).then(r => r.data),
  
  // Rota pública para criação de agendamento
  create: (data: Partial<Appointment>) => 
    api.post<Appointment>("/appointments", data).then(r => r.data),
  
  // Rotas que geralmente são privadas (precisam de token)
  update: (app: Appointment) => api.put(`/appointments/${app.id}`, app),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
  
  // Rota de avaliação (pública ou baseada no protocolo)
  rate: (id: string, rating: number, feedback: string) =>
    api.patch<Appointment>(`/appointments/${id}/rate`, { rating, feedback }).then(r => r.data),
};

export const blocksApi = {
  getDates: () => api.get<string[]>("/blocks/dates").then(r => r.data),
  getSlots: () => api.get<string[]>("/blocks/slots").then(r => r.data),
  toggleDate: (date: string) => api.post("/blocks/date", { date }),
  toggleSlot: (date: string, time: string) => api.post("/blocks/slot", { date, time }),
  toggleMonth: (month: string) => api.post("/blocks/month", { month }),
};

export default api;