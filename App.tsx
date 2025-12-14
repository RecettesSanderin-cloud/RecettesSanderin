import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Language } from './types';
import { AuthScreen } from './components/AuthScreen';
import { ChatBubble } from './components/ChatBubble';
import { PaywallModal } from './components/PaywallModal';
import { InstallModal } from './components/InstallModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { generateCulinaryResponse } from './services/geminiService';
import { UI_TEXT, MAX_FREE_CREDITS } from './constants';

const App: React.FC = () => {
  // State
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
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if app is already installed (standalone mode)
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    
    checkStandalone();
    window.addEventListener('resize', checkStandalone); // Sometimes mode changes on rotation/resize
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log("Install prompt captured");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('recettessanderin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Welcome message
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist user updates
  useEffect(() => {
    if (user) {
      setIsSaved(false);
      localStorage.setItem('recettessanderin_user', JSON.stringify(user));
      // Simulate a quick save delay for visual feedback
      const timer = setTimeout(() => setIsSaved(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogin = (email: string) => {
    // Check if user exists in storage (simple mock)
    // In a real app, this calls an API
    const savedUser = localStorage.getItem(`user_${email}`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const newUser: User = {
        email,
        isSubscribed: false,
        creditsRemaining: MAX_FREE_CREDITS
      };
      setUser(newUser);
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
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

    // Check credits/subscription
    if (!user.isSubscribed && user.creditsRemaining <= 0) {
      setShowPaywall(true);
      return;
    }

    const userMsgText = inputValue;
    setInputValue('');

    // Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
      timestamp: Date.now()
    };
    
    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setIsLoading(true);

    // Prepare history for API (convert internal format to API format)
    const apiHistory = newHistory.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Call Gemini
    const responseText = await generateCulinaryResponse(userMsgText, apiHistory);

    setIsLoading(false);

    // Add AI Response
    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }
    ]);

    // Decrement credits if not subscribed
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
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share cancelled by user
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Failed to copy link");
      }
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Automatic Install (Android/Chrome)
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
      } catch (e) {
        console.error("Install prompt failed", e);
        setShowInstallHelp(true);
      }
    } else {
      // Manual Install Guide (iOS or prompt blocked/unavailable)
      setShowInstallHelp(true);
    }
  };

  // 1. Auth View
  if (!user) {
    return <AuthScreen onLogin={handleLogin} language={language} />;
  }

  // 2. Main Chat View
  return (
    <div className="flex h-screen flex-col bg-stone-50 relative">
      {/* Header */}
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
          
          {/* Install Button (Hidden if already in standalone mode) */}
          {!isStandalone && (
            <button 
              onClick={handleInstallClick}
              className={`text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors shadow-md ${deferredPrompt ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' : 'bg-stone-600 hover:bg-stone-700'}`}
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

      {/* Credit Status Bar (Mobile Only) */}
      <div className="sm:hidden bg-orange-50 px-4 py-1 text-center text-xs text-orange-800 border-b border-orange-100 flex justify-between items-center">
         {user.isSubscribed 
             ? <span className="font-bold"><i className="fas fa-star mr-1"></i>{UI_TEXT.premiumMember[language]}</span> 
             : <span>{UI_TEXT.remainingCredits[language]} <strong>{user.creditsRemaining}</strong></span>
          }
      </div>

      {/* Chat Area */}
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

      {/* Input Area */}
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
             <span className={`text-[10px] flex items-center gap-1 transition-colors duration-300 ${isSaved ? 'text-green-600' : 'text-orange-400'}`}>
               <i className={`fas ${isSaved ? 'fa-check-circle' : 'fa-sync fa-spin'}`}></i>
               {isSaved 
                 ? (language === 'fr' ? 'Sauvegardé' : 'Saved') 
                 : (language === 'fr' ? 'Sauvegarde...' : 'Saving...')
               }
             </span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-4 py-2 rounded-lg shadow-xl text-sm z-50 transition-opacity duration-300 flex items-center gap-2">
          <i className="fas fa-check"></i>
          {UI_TEXT.shareSuccess[language]}
        </div>
      )}

      {/* Modals */}
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

export default App;