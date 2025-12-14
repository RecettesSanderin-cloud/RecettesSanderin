import React, { useState } from 'react';
import { Language } from '../types';
import { UI_TEXT, SUBSCRIPTION_PRICE } from '../constants';
import { processMockPayment } from '../services/mockStripeService';

interface Props {
  language: Language;
  onSubscribeSuccess: () => void;
}

export const PaywallModal: React.FC<Props> = ({ language, onSubscribeSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate Stripe Checkout Flow
    const result = await processMockPayment(SUBSCRIPTION_PRICE);
    if (result.success) {
      onSubscribeSuccess();
    } else {
      alert("Payment failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border-t-8 border-orange-500">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-crown text-3xl"></i>
        </div>

        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          {UI_TEXT.upgradeTitle[language]}
        </h2>
        
        <p className="text-stone-600 mb-8">
          {UI_TEXT.upgradeDesc[language]}
        </p>

        <div className="bg-stone-50 rounded-xl p-6 mb-8 border border-stone-200">
          <p className="text-sm text-stone-500 uppercase tracking-wide font-bold mb-1">Total</p>
          <p className="text-4xl font-bold text-stone-900">{UI_TEXT.price[language]}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
             <>
               <i className="fas fa-circle-notch fa-spin"></i>
               {UI_TEXT.processing[language]}
             </>
          ) : (
            <>
              <i className="fab fa-stripe text-xl"></i>
              {UI_TEXT.subscribeBtn[language]}
            </>
          )}
        </button>
        
        <p className="mt-4 text-xs text-stone-400">
          * This is a demo. No real money will be charged.
        </p>
      </div>
    </div>
  );
};