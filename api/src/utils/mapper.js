import { format, parseISO } from 'date-fns';

export const mapAppointment = (app) => {
  if (!app) return null;
  
  return {
    ...app,
    citizen: {
      name: app.citizenName,
      phone: app.citizenPhone,
      email: app.citizenEmail,
      cpf: app.citizenCpf,
      hasCpf: app.citizenHasCpf,
      cep: app.citizenCep
    }
  };
};

export const generateProtocol = (date, time) => {
  try {
    const dateObj = parseISO(date);
    const datePart = format(dateObj, "yyyyMMdd");
    
    const timePart = time.replace(/\D/g, "").substring(0, 4);
    
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    
    return `${datePart}${timePart}-${randomPart}`;
  } catch (error) {
    const fallbackDate = new Date().getTime().toString().slice(-8);
    return `ERR-${fallbackDate}`;
  }
};