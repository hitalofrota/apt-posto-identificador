import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Appointment } from "../../types";
import { SERVICES } from "../../constants";
import { format } from "date-fns";

interface DashboardTabProps {
  appointments: Appointment[];
  setDrilldownType: (type: "total" | "today" | "active" | null) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ 
  appointments, 
  setDrilldownType 
}) => {
  // --- Lógica de Cálculos (Copiada do seu Admin original) ---
  const totalApps = appointments.length;
  const activeApps = appointments.filter(
    (a) => a.status === "scheduled"
  ).length;
  const todayApps = appointments.filter(
    (a) =>
      a.date === format(new Date(), "yyyy-MM-dd") && a.status === "scheduled"
  ).length;

  const dataByService = SERVICES.map((s) => {
    let name: string = s.name;
    // Mapeamento de nomes curtos para o gráfico
    if (s.id === "1") name = "Alistamento";
    else if (s.id === "2") name = "CDI";
    else if (s.id === "4") name = "CIN";
    else if (s.id === "6") name = "Outros";

    return {
      name,
      count: appointments.filter((a) => a.serviceId === s.id).length,
    };
  });

  const averageRating = appointments.filter((a) => a.rating).length > 0
    ? (
        appointments.reduce((acc, a) => acc + (a.rating || 0), 0) /
        appointments.filter((a) => a.rating).length
      ).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setDrilldownType("total")}
          className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-ibicuitinga-royalBlue cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Total Geral
          </p>
          <h3 className="text-3xl font-black text-ibicuitinga-navy mt-1">
            {totalApps}
          </h3>
          <p className="text-[10px] text-ibicuitinga-royalBlue font-bold mt-2 uppercase">
            Ver Registros
          </p>
        </div>

        <div
          onClick={() => setDrilldownType("today")}
          className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-ibicuitinga-lightGreen cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Para Hoje
          </p>
          <h3 className="text-3xl font-black text-ibicuitinga-navy mt-1">
            {todayApps}
          </h3>
          <p className="text-[10px] text-ibicuitinga-lightGreen font-bold mt-2 uppercase">
            Ver Hoje
          </p>
        </div>

        <div
          onClick={() => setDrilldownType("active")}
          className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-ibicuitinga-orange cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Ativos
          </p>
          <h3 className="text-3xl font-black text-ibicuitinga-navy mt-1">
            {activeApps}
          </h3>
          <p className="text-[10px] text-ibicuitinga-orange font-bold mt-2 uppercase">
            Ver Ativos
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-ibicuitinga-yellow">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Avaliação Média
          </p>
          <h3 className="text-3xl font-black text-ibicuitinga-navy mt-1">
            {averageRating}
          </h3>
        </div>
      </div>

      {/* Seção do Gráfico */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-80">
        <h4 className="font-black text-ibicuitinga-navy uppercase text-xs tracking-widest mb-6">
          Demanda por Serviço
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataByService}>
            <XAxis
              dataKey="name"
              fontSize={10}
              fontWeight="bold"
              axisLine={false}
              tickLine={false}
            />
            <YAxis fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
              {dataByService.map((_, index) => (
                <Cell
                  key={index}
                  fill={["#055FAD", "#00A859", "#FC7917", "#FEB914"][index % 4]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};