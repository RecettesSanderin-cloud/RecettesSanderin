import { Translations } from './types';

export const MAX_FREE_CREDITS = 5;
export const SUBSCRIPTION_PRICE = 10; // Euros

export const SYSTEM_INSTRUCTION = `
You are RecettesSanderin, a world-class culinary expert and professional chef.
Your task is to answer questions EXCLUSIVELY related to cooking, food, recipes, ingredients, kitchen techniques, culinary history, and food safety.

Rules:
1. If the user asks about anything NOT related to food or cooking (e.g., politics, coding, math, general life advice), you must politely decline.
2. If declining, say: "I am RecettesSanderin, a culinary AI. Please ask me something about food or cooking." (Translate this based on the user's language).
3. Detect the language of the user's input (English or French) and reply in the SAME language.
4. Be concise, helpful, and encouraging.
5. If providing a recipe, format it clearly with ingredients and steps.
`;

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
  }
};