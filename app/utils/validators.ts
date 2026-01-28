export function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== "string") return false;
  const cleanCpf = cpf.replace(/[^\d]+/g, "");
  if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;
  
  const values = cleanCpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((values
      .slice(0, count - 1)
      .reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;
      
  return rest(10) === values[9] && rest(11) === values[10];
}

export const formatPhone = (value: string) => {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 2) return nums;
  if (nums.length <= 7) return `(${nums.substring(0, 2)}) ${nums.substring(2)}`;
  return `(${nums.substring(0, 2)}) ${nums.substring(2, 7)}-${nums.substring(7, 11)}`;
};

export const formatCPF = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
  let formatted = onlyNumbers;
  
  if (onlyNumbers.length > 9) {
    formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6, 9)}-${onlyNumbers.slice(9)}`;
  } else if (onlyNumbers.length > 6) {
    formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6)}`;
  } else if (onlyNumbers.length > 3) {
    formatted = `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3)}`;
  }
  
  return formatted;
};

export const isPossibleCPF = (value: string) => {
  const clean = value.replace(/\D/g, "");
  return /^\d/.test(value) && clean.length <= 11;
};

export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
  if (!match) return value;
  if (match[2]) {
    return `${match[1]}-${match[2]}`;
  }
  return match[1];
};