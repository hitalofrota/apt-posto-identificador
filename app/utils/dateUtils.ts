import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const toISODate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const toMonthYear = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

export const displayDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const safeDateString = dateString.includes('T') ? dateString : `${dateString}T12:00:00`;
    return format(parseISO(safeDateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString;
  }
};

export const getTodayStr = (): string => {
  return toISODate(new Date());
};