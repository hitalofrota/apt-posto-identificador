export const mapAppointment = (app) => {
  if (!app) return null;
  return {
    ...app,
    citizen: {
      name: app.citizenName,
      phone: app.citizenPhone,
      email: app.citizenEmail,
      cpf: app.citizenCpf,
      hasCpf: app.citizenHasCpf
    }
  };
};

export const generateProtocol = (date, time) => {
  const cleanDate = date.replace(/-/g, "");
  const cleanTime = time.replace(/:/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${cleanDate}${cleanTime}-${random}`;
};