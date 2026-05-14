import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'es';

const translations = {
  en: {
    start: 'Start',
    leaveMatch: 'Leave this match?',
    goBackBody: 'Your current progress will be lost if you go back.',
    goBackLabel: 'Go back',
    reloadBody: 'Your current progress will be lost if you reload the page.',
    reloadLabel: 'Reload',
    keepPlaying: 'Keep playing',
    remainingTimeAria: 'Remaining time: {time} seconds',
    remainingTime: 'Remaining time',
    youDidIt: 'You did it!',
    oopsLost: "Oops, you didn't find them all",
    playAgain: 'Play again',
    match: "Nice! It's a match",
    mismatch: 'Sorry, but this is not a match',
    accessibilitySettings: 'Accessibility settings',
    colorSafeMode: 'Color-safe mode',
    visualCues: 'Visual cues',
    cardLabels: 'Card labels',
    unmuteSound: 'Unmute sound',
    muteSound: 'Mute sound',
    oopsError: 'Oops! Something went wrong.',
    restartGame: 'Restart Game',
    stellarSync: 'StellarSync',
    symbol_star: 'Star',
    symbol_moon: 'Moon',
    symbol_sun: 'Sun',
    symbol_comet: 'Comet',
    cardMatched: '{symbol} card, matched',
    cardRevealed: '{symbol} card',
    revealCard: 'Reveal card',
  },
  es: {
    start: 'Comenzar',
    leaveMatch: '¿Abandonar esta partida?',
    goBackBody: 'Tu progreso actual se perderá si regresas.',
    goBackLabel: 'Regresar',
    reloadBody: 'Tu progreso actual se perderá si recargas la página.',
    reloadLabel: 'Recargar',
    keepPlaying: 'Seguir jugando',
    remainingTimeAria: 'Tiempo restante: {time} segundos',
    remainingTime: 'Tiempo restante',
    youDidIt: '¡Lo lograste!',
    oopsLost: 'Uy, no los encontraste todos',
    playAgain: 'Jugar de nuevo',
    match: '¡Genial! Es un par',
    mismatch: 'Lo siento, no es un par',
    accessibilitySettings: 'Ajustes de accesibilidad',
    colorSafeMode: 'Modo daltónico',
    visualCues: 'Señales visuales',
    cardLabels: 'Etiquetas de cartas',
    unmuteSound: 'Activar sonido',
    muteSound: 'Silenciar sonido',
    oopsError: '¡Uy! Algo salió mal.',
    restartGame: 'Reiniciar juego',
    stellarSync: 'StellarSync',
    symbol_star: 'Estrella',
    symbol_moon: 'Luna',
    symbol_sun: 'Sol',
    symbol_comet: 'Cometa',
    cardMatched: 'Carta {symbol}, emparejada',
    cardRevealed: 'Carta {symbol}',
    revealCard: 'Revelar carta',
  },
};

type TranslationKey = keyof typeof translations.en;

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'i18n-storage',
    }
  )
);

export const useTranslation = () => {
  const language = useI18nStore((state) => state.language);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = translations[language][key];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return { t, language };
};
