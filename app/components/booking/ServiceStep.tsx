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
        <span className="font-black text-ibicuitinga-navy uppercase tracking-tight">{service.name}</span>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedService?.id === service.id ? "bg-ibicuitinga-royalBlue border-ibicuitinga-royalBlue text-white" : "border-gray-200"}`}>
          {selectedService?.id === service.id && <Check size={14} />}
        </div>
      </button>
    ))}
  </div>
);