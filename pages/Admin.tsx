import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Calendar,
  Users,
  FileText,
  Ban,
  Download,
  Settings,
  XCircle,
  Star,
  MessageSquare,
  Edit2,
  Lock,
  Unlock,
  X,
  Save,
  ChevronRight,
  Clock,
  AlertTriangle,
  Trash2,
  CheckCircle,
  FileDown,
  Briefcase,
  Filter,
  Info,
  MousePointerClick,
  KeyRound,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import {
  getAllAppointments,
  getBlockedDates,
  toggleBlockDate,
  cancelAppointment,
  getDailySlots,
  getBlockedSlots,
  toggleBlockSlot,
  toggleBlockMonth,
  updateAppointment,
} from "../services/scheduler";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  getYear,
  getMonth,
  isWeekend,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SERVICES } from "../constants";
import { Appointment } from "../types";

const Admin: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // --- Dashboard State ---
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "schedule" | "feedback" | "reports"
  >("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [blockManagerMonth, setBlockManagerMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  // Modal states
  const [drilldownType, setDrilldownType] = useState<
    "total" | "today" | "active" | null
  >(null);
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);

  // Report Filter states
  const [reportDate, setReportDate] = useState("");
  const [reportMonthPart, setReportMonthPart] = useState("");
  const [reportYearPart, setReportYearPart] = useState(
    getYear(new Date()).toString()
  );
  const [reportServiceId, setReportServiceId] = useState("all");

  const refreshData = () => {
    setAppointments(getAllAppointments());
    setBlockedDates(getBlockedDates());
    setBlockedSlots(getBlockedSlots());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [activeTab, selectedDate, blockManagerMonth, isAuthenticated]);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais hardcoded para demonstração
    if (usernameInput === "admin" && passwordInput === "admin") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
    setActiveTab("dashboard");
  };

  // --- Login Screen Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-navy max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-ibicuitinga-navy rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-yellow shadow-lg shadow-ibicuitinga-navy/20">
            <Lock size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
              Acesso Restrito
            </h2>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">
              Área exclusiva para servidores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                Usuário
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError(false);
                  }}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-ibicuitinga-navy outline-none transition-colors ${loginError ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="Digite o usuário..."
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                Senha de Acesso
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-ibicuitinga-navy outline-none transition-colors ${loginError ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="Digite a senha..."
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-xs font-black mt-2 ml-1 animate-pulse flex items-center gap-1">
                  <AlertTriangle size={12} /> Credenciais incorretas.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-ibicuitinga-royalBlue transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
            >
              <LogIn
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />{" "}
              Entrar no Sistema
            </button>
          </form>
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">
              Caso não possua acesso, contate a{" "}
              <span className="text-ibicuitinga-royalBlue font-bold">
                Secretaria de Administração
              </span>
              .
            </p>
            <p className="text-[10px] text-gray-300 mt-2 font-mono">
              Credenciais Demo: admin / admin
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Logic ---

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
    if (s.id === "1") name = "Alistamento";
    else if (s.id === "2") name = "CDI";
    else if (s.id === "4") name = "CIN";
    else if (s.id === "6") name = "Outros";

    return {
      name,
      count: appointments.filter((a) => a.serviceId === s.id).length,
    };
  });

  const handleBlockDate = () => {
    toggleBlockDate(selectedDate);
    refreshData();
  };

  const isCurrentMonthBlocked = () => {
    try {
      const start = startOfMonth(parseISO(`${blockManagerMonth}-01`));
      const end = endOfMonth(start);
      const workDays = eachDayOfInterval({ start, end })
        .filter((d) => !isWeekend(d))
        .map((d) => format(d, "yyyy-MM-dd"));

      if (workDays.length === 0) return false;
      return workDays.every((d) => blockedDates.includes(d));
    } catch (e) {
      return false;
    }
  };

  const monthIsBlocked = isCurrentMonthBlocked();

  const handleBlockMonth = () => {
    const action = monthIsBlocked ? "LIBERAR" : "INABILITAR";
    if (
      window.confirm(
        `Tem certeza que deseja ${action} todos os dias e horários úteis de ${blockManagerMonth}?`
      )
    ) {
      toggleBlockMonth(blockManagerMonth);
      refreshData();
    }
  };

  const handleCancelAdmin = (id: string) => {
    if (
      window.confirm(
        "Deseja realmente CANCELAR este agendamento? Esta ação é irreversível e anula o protocolo."
      )
    ) {
      cancelAppointment(id);
      refreshData();
      if (editingApp && editingApp.id === id) setEditingApp(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editingApp) return;
    updateAppointment(editingApp);
    setEditingApp(null);
    refreshData();
    alert("Agendamento atualizado com sucesso!");
  };

  const monthOptions = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const currentYear = getYear(new Date());
  const yearOptions = Array.from({ length: 6 }, (_, i) =>
    (currentYear - 2 + i).toString()
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Agendamentos - Ibicuitinga", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

    let filtered = [...appointments];

    if (reportDate) {
      filtered = filtered.filter((app) => app.date === reportDate);
      doc.text(
        `Filtro: Data específica ${format(parseISO(reportDate), "dd/MM/yyyy")}`,
        14,
        38
      );
    }

    const combinedMonthYear = reportMonthPart
      ? `${reportYearPart}-${reportMonthPart}`
      : "";
    if (combinedMonthYear && !reportDate) {
      filtered = filtered.filter((app) =>
        app.date.startsWith(combinedMonthYear)
      );
      const monthLabel = monthOptions.find(
        (m) => m.value === reportMonthPart
      )?.label;
      doc.text(`Filtro: Período ${monthLabel} de ${reportYearPart}`, 14, 38);
    }

    if (reportServiceId !== "all") {
      const sName = SERVICES.find((s) => s.id === reportServiceId)?.name;
      filtered = filtered.filter((app) => app.serviceId === reportServiceId);
      doc.text(
        `Filtro: Serviço - ${sName}`,
        14,
        reportDate || combinedMonthYear ? 43 : 38
      );
    }

    const tableData = filtered.map((app) => [
      app.protocol,
      app.citizen.name,
      app.serviceName,
      `${format(parseISO(app.date), "dd/MM/yyyy")} ${app.time}`,
      app.status === "scheduled"
        ? "Ativo"
        : app.status === "cancelled"
          ? "Cancelado"
          : "Concluído",
    ]);

    autoTable(doc, {
      head: [["Protocolo", "Cidadão", "Serviço", "Data/Hora", "Status"]],
      body: tableData,
      startY:
        reportDate || combinedMonthYear || reportServiceId !== "all" ? 50 : 40,
      theme: "grid",
      headStyles: { fillColor: [23, 38, 93] },
    });

    const fileNameDate = format(new Date(), "yyyy-MM-dd");
    doc.save(`relatorio-agendamentos-${fileNameDate}.pdf`);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
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
            {appointments.filter((a) => a.rating).length > 0
              ? (
                  appointments.reduce((acc, a) => acc + (a.rating || 0), 0) /
                  appointments.filter((a) => a.rating).length
                ).toFixed(1)
              : "5.0"}
          </h3>
        </div>
      </div>

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

  const renderFeedback = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
        Satisfação do Cidadão
      </h3>
      <div className="grid gap-4">
        {appointments.filter((a) => a.rating).length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2.5rem] text-gray-400 font-bold italic">
            Nenhuma avaliação recebida ainda.
          </div>
        ) : (
          appointments
            .filter((a) => a.rating)
            .map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start"
              >
                <div className="bg-ibicuitinga-yellow/10 p-4 rounded-2xl text-ibicuitinga-yellow">
                  <Star size={24} className="fill-ibicuitinga-yellow" />
                  <p className="text-center font-black text-lg mt-1">
                    {app.rating}
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Por: {app.citizen.name} • Protocolo: {app.protocol}
                  </p>
                  <p className="font-bold text-ibicuitinga-navy leading-relaxed italic">
                    "{app.feedback || "Sem comentário adicional."}"
                  </p>
                  <p className="text-[10px] text-ibicuitinga-royalBlue font-black uppercase">
                    {app.serviceName}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl space-y-8 animate-fade-in border-2 border-ibicuitinga-skyBlue/10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-ibicuitinga-royalBlue/10 rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-royalBlue">
          <FileDown size={32} />
        </div>
        <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
          Central de Relatórios
        </h3>
        <p className="text-gray-500 font-medium text-sm">
          Selecione os filtros desejados para exportar o PDF personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
            Por Dia
          </label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => {
              setReportDate(e.target.value);
              if (e.target.value) {
                setReportMonthPart("");
              }
            }}
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none focus:border-ibicuitinga-royalBlue"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
            Por Mês
          </label>
          <div className="flex gap-2">
            <select
              value={reportMonthPart}
              onChange={(e) => {
                setReportMonthPart(e.target.value);
                if (e.target.value) setReportDate("");
              }}
              className="flex-[2] bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none focus:border-ibicuitinga-royalBlue appearance-none"
            >
              <option value="">Selecione o mês</option>
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={reportYearPart}
              onChange={(e) => {
                setReportYearPart(e.target.value);
                if (reportMonthPart) setReportDate("");
              }}
              className="flex-1 bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none focus:border-ibicuitinga-royalBlue appearance-none"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
            Por Serviço
          </label>
          <select
            value={reportServiceId}
            onChange={(e) => setReportServiceId(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none focus:border-ibicuitinga-royalBlue appearance-none"
          >
            <option value="all">Todos os Serviços</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
        <button
          onClick={() => {
            setReportDate("");
            setReportMonthPart("");
            setReportYearPart(getYear(new Date()).toString());
            setReportServiceId("all");
          }}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Limpar Filtros
        </button>
        <button
          onClick={generatePDF}
          className="bg-ibicuitinga-navy text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-ibicuitinga-royalBlue transition-all flex items-center gap-3 active:scale-95"
        >
          <Download size={20} /> Gerar PDF Filtrado
        </button>
      </div>
    </div>
  );

  const renderDrilldownModal = () => {
    if (!drilldownType) return null;
    const list = appointments.filter((a) => {
      if (drilldownType === "today")
        return (
          a.date === format(new Date(), "yyyy-MM-dd") &&
          a.status === "scheduled"
        );
      if (drilldownType === "active") return a.status === "scheduled";
      return true;
    });

    return (
      <div className="fixed inset-0 z-[110] bg-ibicuitinga-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-in">
          <div className="p-8 border-b-4 border-ibicuitinga-yellow flex justify-between items-center bg-gray-50">
            <div>
              <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
                Registros Detalhados
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {list.length} registros encontrados
              </p>
            </div>
            <button
              onClick={() => setDrilldownType(null)}
              className="p-2 bg-white rounded-xl shadow-md text-gray-400 hover:text-ibicuitinga-navy transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {list.map((app) => (
              <div
                key={app.id}
                className={`bg-white border-2 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${app.status === "cancelled" ? "border-red-50 opacity-60" : "border-gray-100"}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-ibicuitinga-navy text-white px-2 py-0.5 rounded-lg uppercase">
                      {app.protocol}
                    </span>
                    {app.status === "scheduled" && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen">
                        Ativo
                      </span>
                    )}
                    {app.status === "completed" && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase bg-ibicuitinga-royalBlue/20 text-ibicuitinga-royalBlue">
                        Concluído
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-ibicuitinga-navy text-lg">
                    {app.citizen.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    {app.serviceName} •{" "}
                    {format(parseISO(app.date), "dd/MM/yyyy")} às {app.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingApp(app)}
                    className="p-3 bg-ibicuitinga-royalBlue/10 text-ibicuitinga-royalBlue rounded-2xl hover:bg-ibicuitinga-royalBlue hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                  {app.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelAdmin(app.id)}
                      title="Cancelar Agendamento"
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!editingApp) return null;
    const availableTimes = getDailySlots(editingApp.date);

    return (
      <div className="fixed inset-0 z-[120] bg-ibicuitinga-navy/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 space-y-6 shadow-2xl animate-scale-in max-h-[95vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
                Alterar Registro
              </h3>
              <p className="text-[10px] font-black text-ibicuitinga-skyBlue uppercase tracking-widest">
                {editingApp.protocol}
              </p>
            </div>
            <button
              onClick={() => setEditingApp(null)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                Nome do Cidadão
              </label>
              <input
                type="text"
                value={editingApp.citizen.name}
                onChange={(e) =>
                  setEditingApp({
                    ...editingApp,
                    citizen: { ...editingApp.citizen, name: e.target.value },
                  })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                Telefone
              </label>
              <input
                type="text"
                value={editingApp.citizen.phone}
                onChange={(e) =>
                  setEditingApp({
                    ...editingApp,
                    citizen: { ...editingApp.citizen, phone: e.target.value },
                  })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                Serviço
              </label>
              <select
                value={editingApp.serviceId}
                onChange={(e) => {
                  const s = SERVICES.find((sv) => sv.id === e.target.value);
                  if (s)
                    setEditingApp({
                      ...editingApp,
                      serviceId: s.id,
                      serviceName: s.name,
                    });
                }}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue appearance-none"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                Data
              </label>
              <input
                type="date"
                value={editingApp.date}
                onChange={(e) =>
                  setEditingApp({ ...editingApp, date: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                Horário
              </label>
              <select
                value={editingApp.time}
                onChange={(e) =>
                  setEditingApp({ ...editingApp, time: e.target.value })
                }
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue appearance-none"
              >
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleSaveEdit}
              className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Save size={18} /> Salvar Alterações
            </button>

            {editingApp.status !== "cancelled" && (
              <button
                onClick={() => handleCancelAdmin(editingApp!.id)}
                className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={18} /> Cancelar este Agendamento
              </button>
            )}

            <button
              onClick={() => setEditingApp(null)}
              className="w-full py-2 font-black text-gray-400 uppercase text-[10px] tracking-widest hover:text-gray-600"
            >
              Voltar sem salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {renderDrilldownModal()}
      {renderEditModal()}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-ibicuitinga-navy text-ibicuitinga-yellow rounded-2xl shadow-xl">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tight leading-none">
              Gestão Institucional
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-ibicuitinga-royalBlue font-bold uppercase tracking-widest">
                Sessão de Controle do Administrador
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex bg-gray-200 p-1 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
            {(["dashboard", "schedule", "feedback", "reports"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? "bg-white text-ibicuitinga-navy shadow-sm" : "text-gray-500 hover:text-ibicuitinga-navy"}`}
                >
                  {tab === "dashboard"
                    ? "Início"
                    : tab === "schedule"
                      ? "Agenda"
                      : tab === "feedback"
                        ? "Feedbacks"
                        : "Relatórios"}
                </button>
              )
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-2xl transition-colors shadow-sm flex items-center justify-center"
            title="Sair do sistema"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "feedback" && renderFeedback()}
      {activeTab === "reports" && renderReports()}

      {activeTab === "schedule" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-ibicuitinga-orange space-y-6">
              <h3 className="font-black text-ibicuitinga-navy uppercase tracking-tighter text-xl">
                Controle Diário
              </h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue flex-1"
                />
                <button
                  onClick={handleBlockDate}
                  className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md transition active:scale-95 ${blockedDates.includes(selectedDate) ? "bg-ibicuitinga-orange text-white" : "bg-ibicuitinga-navy text-white"}`}
                >
                  {blockedDates.includes(selectedDate)
                    ? "Liberar Dia"
                    : "Bloquear Dia"}
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-ibicuitinga-royalBlue space-y-6">
              <h3 className="font-black text-ibicuitinga-navy uppercase tracking-tighter text-xl">
                Controle Mensal
              </h3>
              <div className="flex gap-4 items-center">
                <div className="w-40 flex-none">
                  <input
                    type="month"
                    value={blockManagerMonth}
                    onChange={(e) => setBlockManagerMonth(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-ibicuitinga-navy outline-none focus:border-ibicuitinga-royalBlue"
                  />
                </div>
                <button
                  onClick={handleBlockMonth}
                  className={`flex-1 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md transition active:scale-95 whitespace-nowrap ${monthIsBlocked ? "bg-ibicuitinga-orange hover:bg-red-500" : "bg-ibicuitinga-navy hover:bg-ibicuitinga-royalBlue"}`}
                >
                  {monthIsBlocked ? "LIBERAR MÊS" : "BLOQUEAR MÊS"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-ibicuitinga-navy uppercase text-xs tracking-widest">
                Controle de Horários:{" "}
                {format(parseISO(selectedDate), "dd/MM/yyyy")}
              </h4>
              <span
                className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${blockedDates.includes(selectedDate) ? "bg-red-100 text-red-500" : "bg-ibicuitinga-lightGreen/20 text-ibicuitinga-lightGreen"}`}
              >
                {blockedDates.includes(selectedDate)
                  ? "Data Bloqueada"
                  : "Data Disponível"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {getDailySlots(selectedDate).map((time) => {
                const app = appointments.find(
                  (a) =>
                    a.date === selectedDate &&
                    a.time === time &&
                    a.status !== "cancelled"
                );
                const isSlotBlocked = blockedSlots.includes(
                  `${selectedDate}|${time}`
                );
                const isDateBlocked = blockedDates.includes(selectedDate);

                let statusText = "DISPONÍVEL";
                let statusColor = "text-ibicuitinga-navy";
                let bgColor =
                  "bg-gray-50 border-white hover:border-ibicuitinga-skyBlue shadow-inner";

                if (app) {
                  statusText = "AGENDADO";
                  statusColor =
                    "text-ibicuitinga-royalBlue group-hover:text-red-500";
                  bgColor =
                    "bg-ibicuitinga-royalBlue/5 border-ibicuitinga-royalBlue/20 hover:bg-red-50 hover:border-red-500";
                } else if (isSlotBlocked || isDateBlocked) {
                  statusText = "BLOQUEADO";
                  statusColor = "text-ibicuitinga-orange";
                  bgColor =
                    "bg-ibicuitinga-orange/5 border-ibicuitinga-orange/20 scale-95 opacity-80";
                }

                return (
                  <div
                    key={time}
                    onClick={() => {
                      if (app) {
                        handleCancelAdmin(app.id);
                      } else if (!isDateBlocked) {
                        toggleBlockSlot(selectedDate, time);
                        refreshData();
                      }
                    }}
                    className={`p-4 rounded-3xl border-4 transition-all text-center cursor-pointer select-none group relative ${bgColor}`}
                  >
                    <p
                      className={`font-black text-xl transition-colors ${statusColor}`}
                    >
                      {time}
                    </p>
                    <p
                      className={`text-[9px] font-black uppercase mt-1 transition-colors ${app ? "group-hover:text-red-600" : "text-gray-400"}`}
                    >
                      {statusText}
                    </p>
                    {app && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <XCircle size={14} className="text-red-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-ibicuitinga-navy/5 rounded-2xl border border-ibicuitinga-navy/10 flex items-center gap-3">
              <div className="bg-ibicuitinga-royalBlue text-white p-2 rounded-xl">
                <MousePointerClick size={20} />
              </div>
              <p className="text-xs font-bold text-ibicuitinga-navy/80">
                <span className="text-ibicuitinga-royalBlue">Dica:</span> Clique
                em qualquer horário{" "}
                <span className="underline decoration-ibicuitinga-skyBlue decoration-2 underline-offset-2">
                  disponível
                </span>{" "}
                para bloqueá-lo manualmente ou em um horário bloqueado para
                liberá-lo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
