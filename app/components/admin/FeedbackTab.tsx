import React from 'react';
import { Star, MessageSquare, User, Tag } from 'lucide-react';
import { Appointment } from '../../types';

interface FeedbackTabProps {
  appointments: Appointment[];
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ appointments }) => {
  const feedbacks = appointments
    .filter((app) => app.rating !== undefined && app.rating !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (feedbacks.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 animate-fade-in">
        <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
        <p className="text-gray-300 font-black uppercase tracking-widest">Nenhum feedback recebido ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tight">
          Satisfação do Cidadão
        </h3>
        <span className="bg-ibicuitinga-royalBlue/10 text-ibicuitinga-royalBlue px-3 py-1 rounded-full text-xs font-bold">
          {feedbacks.length} avaliações
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {feedbacks.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow"
          >
            {/* Badge da Nota */}
            <div className="bg-ibicuitinga-yellow/10 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[80px]">
              <Star className="text-ibicuitinga-yellow fill-ibicuitinga-yellow" size={24} />
              <span className="text-2xl font-black text-ibicuitinga-navy mt-1">{item.rating}</span>
            </div>

            {/* Conteúdo do Feedback */}
            <div className="flex-grow space-y-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={12} /> POR: {item.citizen.name}
                </div>
                <div className="flex items-center gap-1">
                  <Tag size={12} /> PROTOCOLO: {item.protocol}
                </div>
                <div className="text-ibicuitinga-royalBlue">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <p className="text-ibicuitinga-navy italic font-bold text-lg leading-relaxed">
                "{item.feedback || 'O cidadão não deixou um comentário por escrito.'}"
              </p>

              <div className="inline-block bg-ibicuitinga-skyBlue/10 text-ibicuitinga-royalBlue text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                {item.serviceName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};