import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, MapPin, Phone, Mail, ShieldCheck, Calendar, FileText, ClipboardCheck } from 'lucide-react';
import { CONTACT_INFO, CITY_NAME, ORG_NAME } from '../constants';
import { ContactForm } from '../components/home/ContactForm';

const Home: React.FC = () => {
  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida.")}`;

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ibicuitinga-navy text-white shadow-2xl border-b-8 border-ibicuitinga-yellow hero-pattern">
        <div className="relative z-10 p-8 md:p-16 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-ibicuitinga-orange text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              <ShieldCheck size={14} /> Agendamento Digital
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter max-w-2xl">
              Bem-vindos ao <span className="text-ibicuitinga-yellow italic">{ORG_NAME} de {CITY_NAME}</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/agendar" className="bg-ibicuitinga-yellow text-ibicuitinga-navy px-10 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 group">
              <Calendar size={22} className="group-hover:rotate-12 transition-transform" /> Agendar
            </Link>
            <Link to="/meus-agendamentos" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2">
              <Search size={22} /> Consultar protocolo
            </Link>
          </div>
        </div>
      </div>

      {/* Documents Required Section - UNIFICADO COM FUNDO AZUL */}
      <div className="bg-ibicuitinga-navy rounded-[3rem] p-8 md:p-12 shadow-2xl border-t-8 border-ibicuitinga-yellow text-white">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-ibicuitinga-yellow p-4 rounded-2xl text-ibicuitinga-navy">
              <ClipboardCheck size={28} />
            </div>
            <h2 className="text-4xl font-black">Documentos <span className="text-ibicuitinga-yellow">Necessários</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Alistamento Militar */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-ibicuitinga-yellow p-3 rounded-xl text-ibicuitinga-navy">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black">Alistamento Militar</h3>
              </div>
              <ul className="space-y-3 text-sm font-bold text-white/80 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Certidão de Nascimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Comprovante de Passaporte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Carteira de Identidade (RG)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>CPF</span>
                </li>
              </ul>
            </div>

            {/* CDI (Certificado de Dispensa) */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-ibicuitinga-yellow p-3 rounded-xl text-ibicuitinga-navy">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black">1ª e 2ª via do CDI</h3>
              </div>
              <ul className="space-y-3 text-sm font-bold text-white/80 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Documento de Identidade (RG)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>CPF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Certificado de Alistamento Militar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Comprovante de Quitação Eleitoral</span>
                </li>
              </ul>
            </div>

            {/* CIN (Carteira de Identidade Nacional) */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-ibicuitinga-yellow p-3 rounded-xl text-ibicuitinga-navy">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black">1ª e 2ª via da CIN</h3>
              </div>
              <ul className="space-y-3 text-sm font-bold text-white/80 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Certidão de Nascimento ou Casamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>CPF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Comprovante de Residência</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Foto 3x4 recente</span>
                </li>
              </ul>
            </div>

            {/* Outros Serviços */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-ibicuitinga-yellow p-3 rounded-xl text-ibicuitinga-navy">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black">Outros Serviços</h3>
              </div>
              <div className="text-sm font-bold text-white/80 space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-ibicuitinga-yellow font-black">•</span>
                  <span>Entre em contato para verificar a documentação específica necessária</span>
                </p>
                <p className="text-xs font-bold text-white/40 mt-3 italic">
                  Consulte nossa equipe para serviços especiais ou situações específicas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/5 mt-6">
            <div className="flex items-center gap-3">
              <Info size={22} className="text-ibicuitinga-yellow" />
              <p className="text-sm font-bold">
                <span className="font-black text-ibicuitinga-yellow">Importante:</span> Apresentar originais e cópias legíveis dos documentos. Em caso de dúvidas, entre em contato antes do agendamento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-ibicuitinga-navy rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-tight">Fale <span className="text-ibicuitinga-yellow">Conosco</span></h2>
            <div className="space-y-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10 hover:bg-ibicuitinga-lightGreen/20 transition-all">
                <div className="bg-ibicuitinga-lightGreen p-3 rounded-2xl text-white"><Phone size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue">WhatsApp</p>
                  <p className="text-xl font-black">{CONTACT_INFO.whatsappFormatted}</p>
                </div>
              </a>
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10">
                <div className="bg-ibicuitinga-royalBlue p-3 rounded-2xl text-white"><Mail size={24} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue">E-mail Institucional</p>
                  <p className="text-sm md:text-base font-black truncate">{CONTACT_INFO.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10">
                <div className="bg-ibicuitinga-orange p-3 rounded-2xl text-white"><MapPin size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue">Endereço</p>
                  <p className="text-sm font-bold">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Home;