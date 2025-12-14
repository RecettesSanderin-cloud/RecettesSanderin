import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface Props {
  message: Message;
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
          isModel ? 'bg-white mr-3 text-orange-600' : 'bg-orange-600 ml-3 text-white'
        }`}>
          <i className={`fas ${isModel ? 'fa-user-chef' : 'fa-user'}`}></i>
        </div>

        {/* Message Content */}
        <div className={`p-4 rounded-2xl shadow-sm overflow-hidden text-sm md:text-base leading-relaxed ${
          isModel 
            ? 'bg-white text-stone-800 rounded-tl-none border border-stone-100' 
            : 'bg-orange-600 text-white rounded-tr-none'
        }`}>
          {isModel ? (
            <div className="prose prose-stone prose-sm max-w-none prose-p:my-1 prose-headings:text-orange-800 prose-strong:text-orange-900">
               <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ) : (
            <p>{message.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};