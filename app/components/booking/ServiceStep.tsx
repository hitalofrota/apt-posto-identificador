import React from "react";
import { Check } from "lucide-react";
import { SERVICES } from "../../constants";
import { Service } from "../../types";

interface Props {
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export const ServiceStep: React.FC<Props> = ({ selectedService, onSelect }) => (
  <div className="grid grid-cols-1 gap-4 animate-fade-in">
    {SERVICES.map((service) => (
      <button
        key={service.id}
        onClick={() => onSelect(service)}
        className={`p-6 rounded-2xl border-4 text-left transition-all flex items-center justify-between group ${
          selectedService?.id === service.id
            ? "border-ibicuitinga-royalBlue bg-ibicuitinga-skyBlue/5"
            : "border-white bg-white hover:border-ibicuitinga-skyBlue/30 shadow-sm"
        }`}
      >
        <div className="flex flex-col gap-2">
          <span className="font-black text-ibicuitinga-navy uppercase tracking-tight leading-tight">
            {service.name}
          </span>
          
          {/* Balão de descrição conforme a imagem 2 */}
          {service.description && (
            <div className="flex">
              <span className="bg-white border border-gray-200 text-gray-500 text-[11px] px-3 py-1.5 rounded-lg shadow-sm font-bold normal-case">
                {service.description}
              </span>
            </div>
          )}
        </div>

        <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          selectedService?.id === service.id 
            ? "bg-ibicuitinga-royalBlue border-ibicuitinga-royalBlue text-white" 
            : "border-gray-200"
        }`}>
          {selectedService?.id === service.id && <Check size={14} strokeWidth={3} />}
        </div>
      </button>
    ))}
  </div>
);