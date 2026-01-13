
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, MapPin, Phone, Mail, Send, ShieldCheck, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, phone, email, subject, message } = contactForm;
    const emailDestination = "juntamilitar@ibicuitinga.ce.gov.br";
    
    // Constructing the email body with the form data
    const emailBody = `Nome: ${name}
Telefone: ${phone}
E-mail de Contato: ${email}

Assunto: ${subject}

Mensagem:
${message}`;

    const mailtoLink = `mailto:${emailDestination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open the user's default email client
    window.location.href = mailtoLink;

    alert(`Obrigado, ${name}! Estamos abrindo seu cliente de e-mail para enviar sua mensagem sobre "${subject}" para a Junta Militar.`);
    setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const whatsappNumber = "5588994874751";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida sobre os serviços da Junta Militar.")}`;

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ibicuitinga-navy text-white shadow-2xl border-b-8 border-ibicuitinga-yellow hero-pattern">
        <div className="relative z-10 p-8 md:p-16 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-ibicuitinga-orange text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              <ShieldCheck size={14} /> Agendamento Digital
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter max-w-2xl">
              Bem-vindos ao <span className="text-ibicuitinga-yellow italic">Posto de Identificação Digital de Ibicuitinga</span>
            </h2>
            <p className="text-ibicuitinga-skyBlue text-lg md:text-xl font-medium max-w-xl">
              Agende serviços de identificação e alistamento militar com rapidez e segurança.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/agendar" 
              className="bg-ibicuitinga-yellow text-ibicuitinga-navy px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_10px_20px_rgba(254,185,20,0.3)] flex items-center justify-center gap-2 group"
            >
              <Calendar size={22} className="group-hover:rotate-12 transition-transform" /> 
              Agendar
            </Link>
            <Link 
              to="/meus-agendamentos" 
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search size={22} /> 
              Consultar protocolo
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-ibicuitinga-skyBlue/5 border-2 border-ibicuitinga-skyBlue/20 rounded-[2.5rem] p-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-ibicuitinga-navy text-ibicuitinga-yellow p-4 rounded-2xl shadow-xl">
            <Info size={32} />
          </div>
          <div className="space-y-4 flex-1">
            <h4 className="font-black text-2xl text-ibicuitinga-navy tracking-tight uppercase">Regras de Atendimento</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-ibicuitinga-navy/80 font-bold">
              <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-ibicuitinga-orange"></div>
                <p>O atendimento requer pontualidade.</p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-ibicuitinga-yellow"></div>
                <p>Leve documento original com foto.</p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-ibicuitinga-lightGreen"></div>
                <p>Nas sextas-feiras o atendimento é apenas pela manhã.</p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-ibicuitinga-royalBlue"></div>
                <p>Tenha seu protocolo sempre à mão.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-ibicuitinga-navy rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight">Fale <span className="text-ibicuitinga-yellow">Conosco</span></h2>
                    <p className="text-ibicuitinga-skyBlue font-medium mt-2 italic">Canais oficiais de comunicação da Junta Militar.</p>
                </div>
                
                <div className="space-y-4">
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10 hover:bg-ibicuitinga-lightGreen/20 transition-all group"
                    >
                        <div className="bg-ibicuitinga-lightGreen p-3 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">WhatsApp (Clique para falar)</p>
                            <p className="text-xl font-black">(88) 99487-4751</p>
                        </div>
                    </a>

                    <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10">
                        <div className="bg-ibicuitinga-royalBlue p-3 rounded-2xl text-white">
                            <Mail size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">E-mail Institucional</p>
                            <p className="text-sm md:text-base font-black truncate">juntamilitar@ibicuitinga.ce.gov.br</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/10">
                        <div className="bg-ibicuitinga-orange p-3 rounded-2xl text-white">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-ibicuitinga-skyBlue tracking-widest">Endereço Completo</p>
                            <p className="text-sm font-bold">Rua José Damasceno, 1577, Centro, Ibicuitinga</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white text-ibicuitinga-navy p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="font-black text-2xl mb-6">Enviar Mensagem</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Seu Nome" required
                        value={contactForm.name} onChange={handleInputChange} name="name"
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="tel" placeholder="Telefone" required
                            value={contactForm.phone} onChange={handleInputChange} name="phone"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
                        />
                        <input 
                            type="email" placeholder="E-mail" required
                            value={contactForm.email} onChange={handleInputChange} name="email"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
                        />
                    </div>
                    <select 
                        name="subject" required
                        value={contactForm.subject} onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold appearance-none"
                    >
                        <option value="">Selecione o Assunto</option>
                        <option value="Dúvida sobre Documentação">Dúvida sobre Documentação</option>
                        <option value="Alistamento Militar">Alistamento Militar</option>
                        <option value="Carteira de Identidade">Carteira de Identidade</option>
                        <option value="Reclamação ou Sugestão">Reclamação ou Sugestão</option>
                        <option value="Outros">Outros</option>
                    </select>
                    <textarea 
                        placeholder="Escreva sua mensagem detalhadamente..." required rows={3}
                        value={contactForm.message} onChange={handleInputChange} name="message"
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold resize-none"
                    ></textarea>
                    <button 
                        type="submit" 
                        className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black hover:bg-ibicuitinga-royalBlue transition-all shadow-xl active:scale-95"
                    >
                        Enviar Solicitação
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
