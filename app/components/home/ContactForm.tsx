import React, { useState } from 'react';
import { CONTACT_INFO } from '../../constants';

export const ContactForm: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, subject, message } = contactForm;
    const text = `*Nova Mensagem*\n\n*Nome:* ${name}\n*Assunto:* ${subject}\n*Mensagem:* ${message}`;
    const phoneNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappLink, '_blank');
    setContactForm({ name: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white text-ibicuitinga-navy p-8 rounded-[2.5rem] shadow-2xl">
      <h3 className="font-black text-2xl mb-6">Enviar Mensagem</h3>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <input 
          type="text" 
          name="name" 
          placeholder="Seu Nome" 
          required 
          value={contactForm.name} 
          onChange={handleInputChange}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
        />

        <select 
          name="subject" 
          required 
          value={contactForm.subject} 
          onChange={handleInputChange}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold appearance-none"
        >
          <option value="">Selecione o Assunto</option>
          <option value="Dúvida">Dúvida sobre Documentação</option>
          <option value="Alistamento">Alistamento Militar</option>
          <option value="Identidade">Carteira de Identidade</option>
          <option value="Outros">Outros</option>
        </select>

        <div className="relative">
          <textarea 
            name="message" 
            placeholder="Mensagem..." 
            required 
            rows={5}
            maxLength={100}
            value={contactForm.message} 
            onChange={handleInputChange}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold resize-none"
          ></textarea>
          <div className="text-right text-xs font-bold text-gray-400 mt-1 mr-2">
            {contactForm.message.length}/100
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black hover:bg-ibicuitinga-royalBlue transition-all active:scale-95 shadow-xl"
        >
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
};