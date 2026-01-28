import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, MapPin, Phone, Mail, ShieldCheck, Calendar, FileText, ClipboardCheck } from 'lucide-react';
import { CONTACT_INFO, CITY_NAME, ORG_NAME } from '../constants';
import { ContactForm } from '../components/home/ContactForm';

const Home: React.FC = () => {
  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida.")}`;

  const documentSections = [
    { 
      title: "Alistamento Militar", 
      docs: ["Certidão de Nascimento", "Comprovante de Passaporte", "Carteira de Identidade (RG)", "CPF"] 
    },
    { 
      title: "1ª e 2ª via do CDI", 
      docs: ["Documento de Identidade (RG)", "CPF", "Certificado de Alistamento Militar", "Comprovante de Quitação Eleitoral"] 
    },
    { 
      title: "1ª e 2ª via da CIN", 
      docs: ["Certidão de Nascimento ou Casamento", "CPF", "Comprovante de Residência", "Foto 3x4 recente"] 
    },
    { 
      title: "Outros Serviços", 
      docs: ["Entre em contato para verificar a documentação específica necessária"],
      footer: "Consulte nossa equipe para serviços especiais ou situações específicas"
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* 1. Hero Section */}
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
            <Link to="/agendar" className="bg-ibicuitinga-yellow text-ibicuitinga-navy px-10 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 group transition-transform hover:scale-105">
              <Calendar size={22} className="group-hover:rotate-12 transition-transform" /> Agendar
            </Link>
            <Link to="/meus-agendamentos" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              <Search size={22} /> Consultar protocolo
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Documents Section - Simetria nos Cards */}
      <div className="bg-ibicuitinga-navy rounded-[3rem] p-8 md:p-12 shadow-2xl border-t-8 border-ibicuitinga-yellow text-white">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-ibicuitinga-yellow p-4 rounded-2xl text-ibicuitinga-navy">
              <ClipboardCheck size={28} />
            </div>
            <h2 className="text-4xl font-black">Documentos <span className="text-ibicuitinga-yellow">Necessários</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {documentSections.map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-ibicuitinga-yellow p-3 rounded-xl text-ibicuitinga-navy shrink-0">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                </div>
                <div className="flex-grow">
                  <ul className="space-y-3 text-sm font-bold text-white/80 pl-1">
                    {item.docs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-ibicuitinga-yellow font-black">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {item.footer && (
                  <p className="text-xs font-bold text-white/40 mt-6 pt-4 border-t border-white/5 italic">
                    {item.footer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mt-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <Info size={24} className="text-ibicuitinga-yellow shrink-0" />
              <p className="text-sm font-bold leading-relaxed">
                <span className="font-black text-ibicuitinga-yellow uppercase tracking-tight">Importante:</span> Apresentar originais e cópias legíveis dos documentos citados acima. Em caso de dúvidas, entre em contato com nossa equipe antes de realizar o agendamento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contact Section - Simetria Vertical Perfeita */}
      <div className="bg-ibicuitinga-navy rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Coluna Esquerda: Contatos */}
          <div className="flex flex-col h-full">
            <h2 className="text-4xl font-black tracking-tight mb-8">Fale <span className="text-ibicuitinga-yellow">Conosco</span></h2>
            
            <div className="flex flex-col flex-grow gap-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
                 className="flex-grow flex items-center gap-5 bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-ibicuitinga-lightGreen/20 transition-all group">
                <div className="bg-ibicuitinga-lightGreen p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                  <Phone size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">WhatsApp</p>
                  <p className="text-xl md:text-2xl font-black">{CONTACT_INFO.whatsappFormatted}</p>
                </div>
              </a>

              <div className="flex-grow flex items-center gap-5 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="bg-ibicuitinga-royalBlue p-4 rounded-2xl text-white">
                  <Mail size={26} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">E-mail Institucional</p>
                  <p className="text-sm md:text-lg font-black truncate">{CONTACT_INFO.email}</p>
                </div>
              </div>

              <div className="flex-grow flex items-center gap-5 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="bg-ibicuitinga-orange p-4 rounded-2xl text-white">
                  <MapPin size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">Endereço</p>
                  <p className="text-sm md:text-base font-bold leading-tight">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Formulário */}
          <div className="flex flex-col h-full">
            <ContactForm />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;