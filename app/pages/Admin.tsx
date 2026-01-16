import React, { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { useAuth } from "../contexts/AuthContext";
import { DashboardTab } from "../components/admin/DashboardTab";
import { ReportsTab } from "../components/admin/ReportsTab";
import { Lock, LogOut, LogIn, User, KeyRound, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";

const Admin: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "schedule" | "feedback" | "reports">("dashboard");

  const { appointments } = useAdminData(isAuthenticated);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: usernameInput,
        password: passwordInput,
      });
      
      login(response.data.token);
    } catch (err) {
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-navy max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-ibicuitinga-navy rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-yellow shadow-lg">
            <Lock size={32} strokeWidth={2.5} />
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter">Acesso Restrito</h2>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Identifique-se para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={usernameInput}
                  disabled={isLoading}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all ${loginError ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="Seu usuário"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={passwordInput}
                  disabled={isLoading}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all ${loginError ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-xs font-black mt-2 flex items-center gap-1 animate-bounce">
                  <AlertTriangle size={12} /> Usuário ou senha inválidos.
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-ibicuitinga-royalBlue disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={18} />}
              {isLoading ? "Autenticando..." : "Entrar no Sistema"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Layout Administrativo (Quando Logado) ---
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-ibicuitinga-navy text-ibicuitinga-yellow rounded-2xl shadow-xl">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tight leading-none">Gestão Institucional</h2>
            <p className="text-xs text-ibicuitinga-royalBlue font-bold uppercase tracking-widest mt-1">Olá, Administrador</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <nav className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {(["dashboard", "schedule", "feedback", "reports"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-ibicuitinga-navy shadow-sm" : "text-gray-500 hover:text-ibicuitinga-navy"}`}
              >
                {tab === "dashboard" ? "Início" : tab === "schedule" ? "Agenda" : tab === "feedback" ? "Feedbacks" : "Relatórios"}
              </button>
            ))}
          </nav>
          <button 
            onClick={logout} 
            className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-2xl transition-all shadow-sm group"
            title="Sair"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="transition-all duration-500">
        {activeTab === "dashboard" && <DashboardTab appointments={appointments} setDrilldownType={() => {}} />}
        {activeTab === "reports" && <ReportsTab appointments={appointments} />}
        {(activeTab === "feedback" || activeTab === "schedule") && (
           <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
             <p className="text-gray-300 font-black uppercase tracking-widest">Módulo em Desenvolvimento</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Admin;