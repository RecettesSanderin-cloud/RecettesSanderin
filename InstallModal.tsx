import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  language: Language;
  onClose: () => void;
}

export const InstallModal: React.FC<Props> = ({ language, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-orange-600">
             <i className="fas fa-download text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-stone-800">{UI_TEXT.installTitle[language]}</h2>
        </div>

        <div className="space-y-6">
          {/* iOS Instructions */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 mb-2 text-stone-800 font-bold">
              <i className="fab fa-apple text-lg"></i>
              <span>iPhone / iPad</span>
            </div>
            <ol className="text-sm text-stone-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="bg-stone-200 text-stone-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>
                  {UI_TEXT.installIos[language]} 
                  <i className="fas fa-share-from-square mx-1 text-blue-500"></i>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-stone-200 text-stone-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>
                   {UI_TEXT.installIosStep2[language]}
                   <i className="fas fa-plus-square mx-1 text-stone-400"></i>
                </span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
             <div className="flex items-center gap-2 mb-2 text-stone-800 font-bold">
              <i className="fab fa-android text-lg text-green-600"></i>
              <span>Android</span>
            </div>
            <p className="text-sm text-stone-600">
              {UI_TEXT.installAndroid[language]}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {UI_TEXT.close[language]}
        </button>
      </div>
    </div>
  );
};