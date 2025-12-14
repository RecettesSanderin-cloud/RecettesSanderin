export type Language = 'en' | 'fr';

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
}