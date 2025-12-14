// This file contains the source code of the application to enable the "Download ZIP" feature.
// In a real development environment, this would be handled by a build tool or CI/CD pipeline.

export const FILE_CONTENTS: Record<string, string> = {
  "index.html": `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#ea580c" />
    
    <!-- PWA Settings -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="RecettesSanderin">
    <meta name="application-name" content="RecettesSanderin">
    
    <title>RecettesSanderin - Expert Culinaire</title>
    
    <link rel="manifest" href="manifest.json" />
    <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3461/3461980.png">
    <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/3461/3461980.png">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');
      body {
        font-family: 'Lato', sans-serif;
        overscroll-behavior-y: none; /* Prevents pull-to-refresh on mobile */
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Playfair Display', serif;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@19.2.1/",
    "react": "https://esm.sh/react@19.2.1",
    "react-dom/": "https://esm.sh/react-dom@19.2.1/",
    "react-markdown": "https://esm.sh/react-markdown@10.1.0",
    "@google/genai": "https://esm.sh/@google/genai@1.31.0"
  }
}
</script>
</head>
  <body class="bg-stone-50 text-stone-800 selection:bg-orange-200">
    <div id="root"></div>
    <script type="module" src="./index.js"></script>
  </body>
</html>`,

  "index.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Register Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  "manifest.json": `{
  "name": "RecettesSanderin",
  "short_name": "RecettesSanderin",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#fafaf9",
  "theme_color": "#ea580c",
  "orientation": "portrait",
  "id": "/?source=pwa",
  "icons": [
    {
      "src": "https://cdn-icons-png.flaticon.com/512/3461/3461980.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://cdn-icons-png.flaticon.com/512/3461/3461980.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`,

  "sw.js": `const CACHE_NAME = 'recettes-sanderin-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
           return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});`,

  "types.ts": `export type Language = 'en' | 'fr';

export interface User {
  email: string;
  isSubscribed: boolean;
  creditsRemaining: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}`,

  "constants.ts": `import { Translations } from './types';

export const MAX_FREE_CREDITS = 5;
export const SUBSCRIPTION_PRICE = 10; // Euros

export const SYSTEM_INSTRUCTION = \`
You are RecettesSanderin, a world-class culinary expert and professional chef.
Your task is to answer questions EXCLUSIVELY related to cooking, food, recipes, ingredients, kitchen techniques, culinary history, and food safety.

Rules:
1. If the user asks about anything NOT related to food or cooking (e.g., politics, coding, math, general life advice), you must politely decline.
2. If declining, say: "I am RecettesSanderin, a culinary AI. Please ask me something about food or cooking." (Translate this based on the user's language).
3. Detect the language of the user's input (English or French) and reply in the SAME language.
4. Be concise, helpful, and encouraging.
5. If providing a recipe, format it clearly with ingredients and steps.
\`;

export const UI_TEXT: Translations = {
  welcome: {
    en: "Welcome to RecettesSanderin",
    fr: "Bienvenue sur RecettesSanderin"
  },
  subtitle: {
    en: "Your personal culinary expert",
    fr: "Votre expert culinaire personnel"
  },
  loginTitle: {
    en: "Sign In / Sign Up",
    fr: "Connexion / Inscription"
  },
  emailLabel: {
    en: "Email Address",
    fr: "Adresse e-mail"
  },
  startBtn: {
    en: "Start Cooking",
    fr: "Commencer"
  },
  remainingCredits: {
    en: "Free questions left:",
    fr: "Questions gratuites restantes :"
  },
  premiumMember: {
    en: "Premium Member",
    fr: "Membre Premium"
  },
  upgradeTitle: {
    en: "Upgrade to Premium",
    fr: "Passer à Premium"
  },
  upgradeDesc: {
    en: "You have used all your free questions. Subscribe for unlimited access.",
    fr: "Vous avez utilisé toutes vos questions gratuites. Abonnez-vous pour un accès illimité."
  },
  price: {
    en: "€10 / month",
    fr: "10 € / mois"
  },
  subscribeBtn: {
    en: "Subscribe with Stripe",
    fr: "S'abonner avec Stripe"
  },
  placeholder: {
    en: "Ask for a recipe, tip, or ingredient...",
    fr: "Demandez une recette, une astuce ou un ingrédient..."
  },
  send: {
    en: "Send",
    fr: "Envoyer"
  },
  logout: {
    en: "Logout",
    fr: "Déconnexion"
  },
  processing: {
    en: "Processing...",
    fr: "Traitement..."
  },
  chefThinking: {
    en: "RecettesSanderin is thinking...",
    fr: "RecettesSanderin réfléchit..."
  },
  shareBtn: {
    en: "Share",
    fr: "Partager"
  },
  shareSuccess: {
    en: "Link copied to clipboard!",
    fr: "Lien copié dans le presse-papier !"
  },
  shareMessage: {
    en: "Check out RecettesSanderin, your AI culinary expert!",
    fr: "Découvrez RecettesSanderin, votre expert culinaire IA !"
  },
  installBtn: {
    en: "Install App",
    fr: "Installer l'app"
  },
  installTitle: {
    en: "Install RecettesSanderin",
    fr: "Installer RecettesSanderin"
  },
  installIos: {
    en: "On iOS (iPhone/iPad): Tap the Share button",
    fr: "Sur iOS (iPhone/iPad) : Appuyez sur Partager"
  },
  installIosStep2: {
    en: "Then select 'Add to Home Screen'",
    fr: "Puis sélectionnez 'Sur l'écran d'accueil'"
  },
  installAndroid: {
    en: "On Android: Tap the menu (3 dots) and select 'Install App' or 'Add to Home Screen'.",
    fr: "Sur Android : Appuyez sur le menu (3 points) et choisissez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'."
  },
  close: {
    en: "Close",
    fr: "Fermer"
  },
  downloadBtn: {
    en: "Download Site (ZIP)",
    fr: "Télécharger le site (ZIP)"
  }
};`,

  "services/geminiService.ts": `import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCulinaryResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the Chef. Please check your connection.";
  }
};`,

  "services/mockStripeService.ts": `export const processMockPayment = async (amount: number): Promise<{ success: boolean; transactionId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      resolve({
        success: true,
        transactionId: isSuccess ? \`txn_\${Math.random().toString(36).substring(7)}\` : undefined
      });
    }, 2000);
  });
};`,

  "components/LanguageSwitcher.tsx": `import React from 'react';
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
        className={\`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 z-10 \${
          currentLang === 'fr' ? 'bg-orange-600 text-white shadow-md' : 'text-stone-600 hover:text-stone-800'
        }\`}
      >
        FR
      </button>
      <button
        onClick={() => onToggle('en')}
        className={\`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 z-10 \${
          currentLang === 'en' ? 'bg-orange-600 text-white shadow-md' : 'text-stone-600 hover:text-stone-800'
        }\`}
      >
        EN
      </button>
    </div>
  );
};`,

  "components/AuthScreen.tsx": `import React, { useState } from 'react';
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
};`,

  "components/ChatBubble.tsx": `import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface Props {
  message: Message;
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={\`flex w-full mb-6 \${isModel ? 'justify-start' : 'justify-end'}\`}>
      <div className={\`flex max-w-[85%] md:max-w-[75%] \${isModel ? 'flex-row' : 'flex-row-reverse'}\`}>
        
        <div className={\`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md \${
          isModel ? 'bg-white mr-3 text-orange-600' : 'bg-orange-600 ml-3 text-white'
        }\`}>
          <i className={\`fas \${isModel ? 'fa-user-chef' : 'fa-user'}\`}></i>
        </div>

        <div className={\`p-4 rounded-2xl shadow-sm overflow-hidden text-sm md:text-base leading-relaxed \${
          isModel 
            ? 'bg-white text-stone-800 rounded-tl-none border border-stone-100' 
            : 'bg-orange-600 text-white rounded-tr-none'
        }\`}>
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
};`,

  "components/PaywallModal.tsx": `import React, { useState } from 'react';
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
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"></div>
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
};`,

  "components/InstallModal.tsx": `import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  language: Language;
  onClose: () => void;
}

export const InstallModal: React.FC<Props> = ({ language, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose}></div>
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
};`,
};

// We also need to construct App.tsx dynamically since it imports this file, creating a circular dependency if we're not careful.
// For the downloadable version, we will inject the App.tsx content WITHOUT the FILE_CONTENTS import to avoid bloat.
// The user doesn't need the download feature inside the downloaded app.

export const APP_TSX_CONTENT = `import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Language } from './types';
import { AuthScreen } from './components/AuthScreen';
import { ChatBubble } from './components/ChatBubble';
import { PaywallModal } from './components/PaywallModal';
import { InstallModal } from './components/InstallModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { generateCulinaryResponse } from './services/geminiService';
import { UI_TEXT, MAX_FREE_CREDITS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('recettessanderin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: language === 'fr' 
          ? "Bonjour ! Je suis RecettesSanderin, votre expert culinaire. Posez-moi vos questions !" 
          : "Hello! I am RecettesSanderin, your culinary expert. Ask me any culinary questions.",
        timestamp: Date.now()
      }
    ]);
  }, []);

  useEffect(() => {
    if (user) {
      setIsSaved(false);
      localStorage.setItem('recettessanderin_user', JSON.stringify(user));
      const timer = setTimeout(() => setIsSaved(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogin = (email: string) => {
    const savedUser = localStorage.getItem(\`user_\${email}\`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const newUser: User = {
        email,
        isSubscribed: false,
        creditsRemaining: MAX_FREE_CREDITS
      };
      setUser(newUser);
      localStorage.setItem(\`user_\${email}\`, JSON.stringify(newUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('recettessanderin_user');
    setMessages([]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !user || isLoading) return;

    if (!user.isSubscribed && user.creditsRemaining <= 0) {
      setShowPaywall(true);
      return;
    }

    const userMsgText = inputValue;
    setInputValue('');

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
      timestamp: Date.now()
    };
    
    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setIsLoading(true);

    const apiHistory = newHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await generateCulinaryResponse(userMsgText, apiHistory);

    setIsLoading(false);

    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }
    ]);

    if (!user.isSubscribed) {
      setUser(prev => prev ? ({
        ...prev,
        creditsRemaining: Math.max(0, prev.creditsRemaining - 1)
      }) : null);
    }
  };

  const handleSubscribeSuccess = () => {
    setUser(prev => prev ? ({ ...prev, isSubscribed: true }) : null);
    setShowPaywall(false);
    alert(language === 'fr' ? "Merci pour votre abonnement !" : "Thank you for subscribing!");
  };

  const handleShare = async () => {
    const shareData = {
      title: 'RecettesSanderin',
      text: UI_TEXT.shareMessage[language],
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {}
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      } catch (e) {
        setShowInstallHelp(true);
      }
    } else {
      setShowInstallHelp(true);
    }
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} language={language} />;
  }

  return (
    <div className="flex h-screen flex-col bg-stone-50 relative">
      <header className="bg-white border-b border-stone-200 px-4 py-3 shadow-sm z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
             <i className="fas fa-hat-chef text-xl"></i>
           </div>
           <div>
             <h1 className="font-bold text-stone-800 leading-tight">RecettesSanderin</h1>
             <p className="text-xs text-stone-500 hidden sm:block">
               {user.isSubscribed 
                 ? <span className="text-orange-600 font-bold"><i className="fas fa-star mr-1"></i>{UI_TEXT.premiumMember[language]}</span> 
                 : <span>{UI_TEXT.remainingCredits[language]} <strong className="text-stone-800">{user.creditsRemaining}</strong></span>
               }
             </p>
           </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher currentLang={language} onToggle={setLanguage} />
          {!isStandalone && (
            <button 
              onClick={handleInstallClick}
              className={\`text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors shadow-md \${deferredPrompt ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' : 'bg-stone-600 hover:bg-stone-700'}\`}
              title={UI_TEXT.installBtn[language]}
            >
              <i className="fas fa-download text-xs"></i>
            </button>
          )}
          <button onClick={handleShare} className="text-stone-400 hover:text-stone-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100">
            <i className="fas fa-share-alt text-lg" title={UI_TEXT.shareBtn[language]}></i>
          </button>
          <button onClick={handleLogout} className="text-stone-400 hover:text-stone-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100">
            <i className="fas fa-sign-out-alt text-lg" title={UI_TEXT.logout[language]}></i>
          </button>
        </div>
      </header>

      <div className="sm:hidden bg-orange-50 px-4 py-1 text-center text-xs text-orange-800 border-b border-orange-100">
         {user.isSubscribed 
             ? <span className="font-bold"><i className="fas fa-star mr-1"></i>{UI_TEXT.premiumMember[language]}</span> 
             : <span>{UI_TEXT.remainingCredits[language]} <strong>{user.creditsRemaining}</strong></span>
          }
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start w-full mb-6">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-stone-100 flex items-center gap-2">
                 <i className="fas fa-circle-notch fa-spin text-orange-500"></i>
                 <span className="text-stone-500 text-sm animate-pulse">{UI_TEXT.chefThinking[language]}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-stone-200 p-4 z-20 pb-safe">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative flex items-center shadow-lg rounded-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={UI_TEXT.placeholder[language]}
              className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-transparent focus:border-orange-200 focus:ring-0 bg-stone-100 text-stone-800 placeholder-stone-400 transition-all outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shadow-md w-10 h-10"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-2">
             <p className="text-[10px] text-stone-400">Powered by Gemini AI • RecettesSanderin © 2024</p>
             <span className={\`text-[10px] flex items-center gap-1 transition-colors duration-300 \${isSaved ? 'text-green-600' : 'text-orange-400'}\`}>
               <i className={\`fas \${isSaved ? 'fa-check-circle' : 'fa-sync fa-spin'}\`}></i>
               {isSaved 
                 ? (language === 'fr' ? 'Sauvegardé' : 'Saved') 
                 : (language === 'fr' ? 'Sauvegarde...' : 'Saving...')
               }
             </span>
          </div>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-4 py-2 rounded-lg shadow-xl text-sm z-50 transition-opacity duration-300 flex items-center gap-2">
          <i className="fas fa-check"></i>
          {UI_TEXT.shareSuccess[language]}
        </div>
      )}

      {showPaywall && (
        <PaywallModal 
          language={language} 
          onSubscribeSuccess={handleSubscribeSuccess} 
        />
      )}
      
      {showInstallHelp && (
        <InstallModal 
          language={language} 
          onClose={() => setShowInstallHelp(false)}
        />
      )}
    </div>
  );
};

export default App;`;
