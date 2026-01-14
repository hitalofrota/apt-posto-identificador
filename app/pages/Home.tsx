import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, MapPin, Phone, Mail, ShieldCheck, Calendar } from 'lucide-react';
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