import React, { useMemo } from "react";
import { 
  Users, 
  CalendarDays, 
  Clock, 
  Star, 
  Calendar, 
  Filter, 
  RefreshCcw,
  TrendingUp
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { getTodayStr } from "../../utils/dateUtils";

interface DashboardProps {
  appointments: any[];
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedService: string;
  setSelectedService: (val: string) => void;
  serviceOptions: string[];
  resetFilters: () => void;
  setDrilldownType: (type: string | null) => void;
}

export const DashboardTab: React.FC<DashboardProps> = ({
  appointments,
  selectedMonth,
  setSelectedMonth,
  selectedService,
  setSelectedService,
  serviceOptions,
  resetFilters,
  setDrilldownType
}) => {
  const today = getTodayStr();

  const stats = [
    { 
      label: "Total Geral", 
      value: appointments.length, 
      color: "border-ibicuitinga-royalBlue", 
      textColor: "text-ibicuitinga-royalBlue",
      icon: <Users size={20} />,
      action: "VER REGISTROS"
    },
    { 
      label: "Para Hoje", 
      value: appointments.filter(a => a.date === today).length, 
      color: "border-green-500", 
      textColor: "text-green-600",
      icon: <CalendarDays size={20} />,
      action: "VER HOJE"
    },
    { 
      label: "Ativos", 
      value: appointments.filter(a => a.status === 'scheduled').length, 
      color: "border-orange-500", 
      textColor: "text-orange-600",
      icon: <Clock size={20} />,
      action: "VER ATIVOS"
    },
    { 
      label: "Avaliação Média", 
      value: "5.0", 
      color: "border-yellow-500", 
      textColor: "text-yellow-600",
      icon: <Star size={20} />,
      action: ""
    }
  ];

  const chartData = useMemo(() => {
    const labels: { [key: string]: string } = {
      '1ª e 2ª via da Carteira de Identidade Nacional': 'CIN',
      'Alistamento Militar': 'Alistamento',
      '1ª e 2ª via do Certificado de Dispensa de Incorporação': 'CDI',
      'Outros Serviços': 'Outros'
    };

    const data = serviceOptions.map(service => ({
      name: labels[service] || service.split(' ')[0],
      fullName: service,
      total: appointments.filter(a => a.serviceName === service).length
    }));

    if (!data.find(d => d.name === 'Outros')) {
      data.push({
        name: 'Outros',
        fullName: 'Outros Serviços',
        total: appointments.filter(a => a.serviceName.toLowerCase().includes('outro')).length
      });
    }
    return data;
  }, [appointments, serviceOptions]);

  const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            onClick={() => stat.action && setDrilldownType(stat.label)}
            className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-4 ${stat.color} 
              transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
              ${stat.action ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <div className={`${stat.textColor} opacity-50`}>{stat.icon}</div>
            </div>
            <div className={`text-4xl font-black ${stat.textColor} mb-4`}>{stat.value}</div>
            
            {stat.action && (
              <div className={`text-[10px] font-black uppercase tracking-tighter ${stat.textColor} flex items-center gap-1`}>
                {stat.action}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-ibicuitinga-navy">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-ibicuitinga-navy uppercase tracking-tight">Demanda por Serviço</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fluxo volumétrico mensal</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-50 flex-1 lg:flex-none">
              <Calendar size={14} className="text-ibicuitinga-royalBlue" />
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-[10px] font-black uppercase outline-none text-ibicuitinga-navy bg-transparent cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-50 flex-1 lg:flex-none">
              <Filter size={14} className="text-ibicuitinga-royalBlue" />
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="text-[10px] font-black uppercase outline-none text-ibicuitinga-navy bg-transparent cursor-pointer min-w-[140px]"
              >
                <option value="all">Todos os Serviços</option>
                {serviceOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="p-2.5 bg-white text-gray-400 hover:text-ibicuitinga-navy rounded-xl border border-gray-50 shadow-sm transition-all active:scale-95"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                labelStyle={{ fontWeight: 900, color: '#1e3a8a', fontSize: '12px' }}
              />
              <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};