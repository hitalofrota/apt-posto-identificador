import React, { useState } from "react";
import { UserPlus, KeyRound, ShieldCheck, Eye, EyeOff, CheckCircle } from "lucide-react";
import api from "../services/api";

// Senha "portão" — só quem souber entra na tela de cadastro
const GATE_PASSWORD = "admin@setup2024";

type Step = "gate" | "form" | "success";

const CreateUser: React.FC = () => {
  const [step, setStep] = useState<Step>("gate");

  const [gateInput, setGateInput] = useState("");
  const [gateError, setGateError] = useState(false);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupSecret, setSignupSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateInput === GATE_PASSWORD) {
      setStep("form");
    } else {
      setGateError(true);
      setGateInput("");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    try {
      await api.post("/users/signup/create", { username, password, name, signupSecret });
      setStep("success");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Erro ao criar usuário.";
      setFormError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-8 border-green-500 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle size={36} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter">Usuário Criado!</h2>
            <p className="text-gray-400 font-bold text-sm mt-2">
              O usuário <span className="text-ibicuitinga-navy">@{username}</span> foi cadastrado com sucesso.
            </p>
          </div>
          <button
            onClick={() => { setStep("gate"); setUsername(""); setName(""); setPassword(""); setSignupSecret(""); setGateInput(""); }}
            className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-ibicuitinga-royalBlue transition-all shadow-xl"
          >
            Criar outro usuário
          </button>
        </div>
      </div>
    );
  }

  if (step === "gate") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-navy max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-ibicuitinga-navy rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-yellow shadow-lg">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-ibicuitinga-navy uppercase tracking-tighter">Área Restrita</h2>
            <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Informe a senha de acesso</p>
          </div>
          <form onSubmit={handleGate} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={gateInput}
                  onChange={(e) => { setGateInput(e.target.value); setGateError(false); }}
                  className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all ${gateError ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-ibicuitinga-royalBlue"}`}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {gateError && (
                <p className="text-red-500 text-xs font-black mt-2 ml-1">Senha incorreta.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-ibicuitinga-royalBlue transition-all shadow-xl"
            >
              Continuar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-8 border-ibicuitinga-orange max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-ibicuitinga-orange rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <UserPlus size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter leading-none">Novo Usuário</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Cadastro de administrador</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-ibicuitinga-royalBlue transition-all"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-ibicuitinga-royalBlue transition-all"
              placeholder="Ex: joao.silva"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-4 pr-12 font-bold outline-none focus:border-ibicuitinga-royalBlue transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chave de Cadastro</label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={signupSecret}
                onChange={(e) => setSignupSecret(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-4 pr-12 font-bold outline-none focus:border-ibicuitinga-royalBlue transition-all"
                placeholder="Chave fornecida pelo sistema"
              />
              <button type="button" onClick={() => setShowSecret(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {formError && (
            <p className="text-red-500 text-xs font-black ml-1">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ibicuitinga-orange text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl mt-2"
          >
            {isLoading ? "Criando..." : "Criar Usuário"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
