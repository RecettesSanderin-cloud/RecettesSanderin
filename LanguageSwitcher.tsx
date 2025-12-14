import React from 'react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onToggle }) => {
  return (
    <div className="flex bg-stone-200 rounded-full p-1 relative">
      <button
        onClick={() => onToggle('fr')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
          currentLang === 'fr' ? 'bg-orange-600 text-white shadow-md' : 'text-stone-600 hover:text-stone-800'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => onToggle('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
          currentLang === 'en' ? 'bg-orange-600 text-white shadow-md' : 'text-stone-600 hover:text-stone-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};