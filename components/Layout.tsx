
import React from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ORG_NAME, CITY_NAME } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // URL pública do brasão de Ibicuitinga para garantir exibição imediata
  const brasaoUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b3/Bras%C3%A3o_de_Ibicuitinga.png";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-ibicuitinga-navy text-white shadow-lg sticky top-0 z-50 border-b-4 border-ibicuitinga-yellow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="bg-white p-1 rounded-xl shadow-inner transition-transform group-hover:scale-105">
              <img 
                src={brasaoUrl} 
                alt="Brasão de Ibicuitinga" 
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback para o ícone de escudo caso a imagem falhe
                  (e.target as any).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight uppercase tracking-tight">{ORG_NAME}</h1>
              <p className="text-[10px] text-ibicuitinga-skyBlue font-bold uppercase tracking-widest">{CITY_NAME}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link to="/" className="hover:text-ibicuitinga-yellow transition-colors">Início</Link>
            <Link to="/meus-agendamentos" className="hover:text-ibicuitinga-yellow transition-colors">Meus Agendamentos</Link>
            <Link to="/admin" className="bg-ibicuitinga-royalBlue hover:bg-ibicuitinga-skyBlue px-4 py-2 rounded-xl transition-all shadow-md active:scale-95">
              Área Institucional
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-ibicuitinga-navy px-4 py-6 space-y-4 border-t border-white/10 animate-fade-in">
            <Link to="/" className="block text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Início</Link>
            <Link to="/meus-agendamentos" className="block text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Meus Agendamentos</Link>
            <Link to="/admin" className="block text-lg font-bold py-2 text-ibicuitinga-yellow" onClick={() => setIsMenuOpen(false)}>Área Institucional</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ibicuitinga-navy text-white/60 py-12 mt-auto border-t-8 border-ibicuitinga-lightGreen">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <img 
              src={brasaoUrl} 
              alt="Brasão Municipal" 
              className="h-20 w-auto brightness-0 invert opacity-40 hover:opacity-100 transition-opacity" 
            />
          </div>
          <div className="flex justify-center gap-2 max-w-[200px] mx-auto h-2">
            <div className="flex-1 bg-ibicuitinga-yellow rounded-full"></div>
            <div className="flex-1 bg-ibicuitinga-orange rounded-full"></div>
            <div className="flex-1 bg-ibicuitinga-lightGreen rounded-full"></div>
            <div className="flex-1 bg-ibicuitinga-royalBlue rounded-full"></div>
          </div>
          <div className="text-sm">
            <p className="font-black text-white uppercase tracking-widest">© {new Date().getFullYear()} {ORG_NAME}</p>
            <p className="mt-1 font-medium">Prefeitura Municipal de Ibicuitinga - Ceará</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
