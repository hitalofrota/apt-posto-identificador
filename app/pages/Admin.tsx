import React, { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { DashboardTab } from "../components/admin/DashboardTab";
import { ReportsTab } from "../components/admin/ReportsTab";
import { Lock, LogOut, LogIn, User, KeyRound, AlertTriangle } from "lucide-react";

const Admin: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "schedule" | "feedback" | "reports">("dashboard");
  const [drilldownType, setDrilldownType] = useState<"total" | "today" | "active" | null>(null);

  // --- Hook de Dados ---
  const { appointments, actions } = useAdminData(isAuthenticated);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

  // --- Tela de Login ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-navy max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-ibicuitinga-navy rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-yellow shadow-lg shadow-ibicuitinga-navy/20">
            <Lock size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter">Acesso Restrito</h2>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Área exclusiva para servidores</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(false); }}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-ibicuitinga-navy outline-none transition-colors ${loginError ? "border-red-500" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="admin"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-ibicuitinga-navy outline-none transition-colors ${loginError ? "border-red-500" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="admin"
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-xs font-black mt-2 ml-1 animate-pulse flex items-center gap-1">
                  <AlertTriangle size={12} /> Credenciais incorretas.
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-ibicuitinga-royalBlue transition-all shadow-xl flex items-center justify-center gap-2 group">
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /> Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Layout Administrativo ---
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Aqui você pode adicionar os modais de Drilldown e Edit que extrairemos depois */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-ibicuitinga-navy text-ibicuitinga-yellow rounded-2xl shadow-xl">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tight leading-none">Gestão Institucional</h2>
            <p className="text-xs text-ibicuitinga-royalBlue font-bold uppercase tracking-widest mt-1">Sessão do Administrador</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex bg-gray-200 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {(["dashboard", "schedule", "feedback", "reports"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? "bg-white text-ibicuitinga-navy shadow-sm" : "text-gray-500 hover:text-ibicuitinga-navy"}`}
              >
                {tab === "dashboard" ? "Início" : tab === "schedule" ? "Agenda" : tab === "feedback" ? "Feedbacks" : "Relatórios"}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-2xl transition-colors shadow-sm flex items-center justify-center">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Renderização das Abas */}
      {activeTab === "dashboard" && (
        <DashboardTab appointments={appointments} setDrilldownType={setDrilldownType} />
      )}

      {activeTab === "reports" && (
        <ReportsTab appointments={appointments} />
      )}

      {activeTab === "feedback" && (
        <div className="p-10 text-center text-gray-400 font-bold italic bg-white rounded-[2.5rem]">
          Componente de Feedback (FeedbackTab) em breve...
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="p-10 text-center text-gray-400 font-bold italic bg-white rounded-[2.5rem]">
          Componente de Agenda (ScheduleTab) em breve...
        </div>
      )}
    </div>
  );
};

export default Admin;