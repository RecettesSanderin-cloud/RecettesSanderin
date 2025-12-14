import React, { useState } from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  onLogin: (email: string) => void;
  language: Language;
}

export const AuthScreen: React.FC<Props> = ({ onLogin, language }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="relative bg-white/95 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-t-4 border-orange-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-hat-chef text-4xl text-orange-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">RecettesSanderin</h1>
          <p className="text-stone-500">{UI_TEXT.subtitle[language]}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {UI_TEXT.emailLabel[language]}
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="contact@recettessanderin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>{UI_TEXT.startBtn[language]}</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};