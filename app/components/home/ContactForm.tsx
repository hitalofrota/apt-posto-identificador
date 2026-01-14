import React, { useState } from 'react';
import { CONTACT_INFO } from '../../constants';

export const ContactForm: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '', phone: '', email: '', subject: '', message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, subject, message } = contactForm;
    
    const emailBody = `Nome: ${name}\nTelefone: ${phone}\nE-mail: ${email}\n\nAssunto: ${subject}\n\nMensagem:\n${message}`;
    const mailtoLink = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    alert(`Obrigado, ${name}! Abrindo seu e-mail...`);
    setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white text-ibicuitinga-navy p-8 rounded-[2.5rem] shadow-2xl">
      <h3 className="font-black text-2xl mb-6">Enviar Mensagem</h3>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <input 
          type="text" name="name" placeholder="Seu Nome" required 
          value={contactForm.name} onChange={handleInputChange}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="tel" name="phone" placeholder="Telefone" required
            value={contactForm.phone} onChange={handleInputChange}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
          />
          <input 
            type="email" name="email" placeholder="E-mail" required
            value={contactForm.email} onChange={handleInputChange}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold"
          />
        </div>
        <select 
          name="subject" required value={contactForm.subject} onChange={handleInputChange}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold appearance-none"
        >
          <option value="">Selecione o Assunto</option>
          <option value="Dúvida">Dúvida sobre Documentação</option>
          <option value="Alistamento">Alistamento Militar</option>
          <option value="Identidade">Carteira de Identidade</option>
          <option value="Outros">Outros</option>
        </select>
        <textarea 
          name="message" placeholder="Mensagem..." required rows={3}
          value={contactForm.message} onChange={handleInputChange}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-ibicuitinga-royalBlue outline-none font-bold resize-none"
        ></textarea>
        <button type="submit" className="w-full bg-ibicuitinga-navy text-white py-4 rounded-2xl font-black hover:bg-ibicuitinga-royalBlue transition-all active:scale-95 shadow-xl">
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
};