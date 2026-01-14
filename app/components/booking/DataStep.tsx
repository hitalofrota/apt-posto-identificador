import React, { useState } from "react";
import { formatPhone, formatCPF } from "../../utils/validators";
import { Citizen } from "../../types";
import { AlertCircle } from "lucide-react";

interface Props {
  data: Citizen;
  setData: React.Dispatch<React.SetStateAction<Citizen>>;
  formErrors: { [key: string]: string };
  onSubmit: (lgpd: boolean) => void;
  onBack: () => void;
}

export const DataStep: React.FC<Props> = ({ data, setData, formErrors, onSubmit, onBack }) => {
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: any = type === "checkbox" ? checked : value;

    if (name === "phone") newValue = formatPhone(value);
    if (name === "cpf") newValue = formatCPF(value);

    setData((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-royalBlue space-y-6 animate-fade-in">
      <div className="space-y-5">
        {/* Campo Nome */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Nome Completo</label>
          <input
            type="text" name="name" value={data.name} onChange={handleInputChange}
            placeholder="Ex: José da Silva Santos"
            className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy transition-colors ${formErrors.name ? "border-red-500 bg-red-50/30" : "border-gray-100"}`}
          />
          {formErrors.name && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1 animate-shake">
              <AlertCircle size={12} /> {formErrors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo WhatsApp */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">WhatsApp</label>
            <input
              type="tel" name="phone" value={data.phone} onChange={handleInputChange}
              placeholder="(88) 99999-9999"
              className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy transition-colors ${formErrors.phone ? "border-red-500 bg-red-50/30" : "border-gray-100"}`}
            />
            {formErrors.phone && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1 animate-shake">
                <AlertCircle size={12} /> {formErrors.phone}
              </p>
            )}
          </div>

          {/* Campo CPF */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">CPF</label>
            <input
              type="text" name="cpf" value={data.cpf} onChange={handleInputChange}
              placeholder="000.000.000-00"
              className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold text-ibicuitinga-navy transition-colors ${formErrors.cpf ? "border-red-500 bg-red-50/30" : "border-gray-100"}`}
            />
            {formErrors.cpf && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1 animate-shake">
                <AlertCircle size={12} /> {formErrors.cpf}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Consentimento LGPD */}
      <div className="p-4 bg-ibicuitinga-skyBlue/5 rounded-2xl border border-ibicuitinga-skyBlue/20">
        <label className="flex gap-4 cursor-pointer group">
          <input
            type="checkbox" checked={lgpdConsent} onChange={(e) => setLgpdConsent(e.target.checked)}
            className="w-6 h-6 rounded-lg text-ibicuitinga-royalBlue focus:ring-ibicuitinga-royalBlue"
          />
          <span className="text-xs font-bold text-ibicuitinga-navy/70 leading-relaxed group-hover:text-ibicuitinga-navy">
            Declaro estar ciente de que meus dados serão processados exclusivamente para fins de agendamento institucional.
          </span>
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <button onClick={onBack} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:text-ibicuitinga-navy transition-colors">
          Voltar
        </button>
        <button
          onClick={() => onSubmit(lgpdConsent)}
          disabled={!lgpdConsent || !data.name}
          className="flex-[2] bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 active:scale-95 transition-transform"
        >
          Confirmar Protocolo
        </button>
      </div>
    </div>
  );
};