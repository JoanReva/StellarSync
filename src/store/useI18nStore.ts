import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLocalJSONStorage, STORAGE_KEYS } from './storage';

export type Language = 'en' | 'es';

const DEFAULT_LANGUAGE: Language = 'en';

const isLanguage = (value: unknown): value is Language =>
  value === 'en' || value === 'es';

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
    memoryCards: 'Memory cards',
    toggleLanguage: 'Toggle language',
    gameLogo: 'Game logo',
    stellarSync: 'StellarSync',
    memorySubtitle: 'Memory Game',
    symbol_star: 'Star',
    symbol_moon: 'Moon',
    symbol_sun: 'Sun',
    symbol_comet: 'Comet',
    cardMatched: '{symbol} card, matched',
    cardRevealed: '{symbol} card',
    revealCard: 'Reveal card',
    viewScoreboard: 'View scoreboard',
    close: 'Close',
    closeScoreboard: 'Close scoreboard',
    scoreboardTitle: 'Scoreboard',
    scoreboardEyebrow: 'Best times',
    scoreSummary: '{time}s left',
    yourScore: 'Your result',
    scoreNameLabel: 'Player name',
    scoreNameHelp: 'Save your winning run.',
    scoreNamePlaceholder: 'Name',
    saveScore: 'Save',
    savingScore: 'Saving',
    scoreSaved: 'Score saved',
    scoreUnavailable: 'Connect Supabase to save and load the scoreboard.',
    scoreLoading: 'Loading',
    scoreLoadError: 'Could not load scores.',
    scoreSubmitError: 'Could not save score.',
    noScoresYet: 'No scores yet.',
    scoreRowStats: '{time}s',
    scoreEntryLabel: 'Rank {rank}: {player}, {time} seconds left',
    yourSavedScore: 'Your saved score',
    scoreRules: 'Ranked by highest remaining time.',
  },
  es: {
    start: 'Comenzar',
    leaveMatch: '\u00bfAbandonar esta partida?',
    goBackBody: 'Tu progreso actual se perder\u00e1 si regresas.',
    goBackLabel: 'Regresar',
    reloadBody: 'Tu progreso actual se perder\u00e1 si recargas la p\u00e1gina.',
    reloadLabel: 'Recargar',
    keepPlaying: 'Seguir jugando',
    remainingTimeAria: 'Tiempo restante: {time} segundos',
    remainingTime: 'Tiempo restante',
    youDidIt: '\u00a1Lo lograste!',
    oopsLost: 'Uy, no los encontraste todos',
    playAgain: 'Jugar de nuevo',
    match: '\u00a1Genial! Es un par',
    mismatch: 'Lo siento, no es un par',
    accessibilitySettings: 'Ajustes de accesibilidad',
    colorSafeMode: 'Modo dalt\u00f3nico',
    visualCues: 'Se\u00f1ales visuales',
    cardLabels: 'Etiquetas de cartas',
    unmuteSound: 'Activar sonido',
    muteSound: 'Silenciar sonido',
    oopsError: '\u00a1Uy! Algo sali\u00f3 mal.',
    restartGame: 'Reiniciar juego',
    memoryCards: 'Cartas de memoria',
    toggleLanguage: 'Cambiar idioma',
    gameLogo: 'Logo del juego',
    stellarSync: 'StellarSync',
    memorySubtitle: 'Juego de Memoria',
    symbol_star: 'Estrella',
    symbol_moon: 'Luna',
    symbol_sun: 'Sol',
    symbol_comet: 'Cometa',
    cardMatched: 'Carta {symbol}, emparejada',
    cardRevealed: 'Carta {symbol}',
    revealCard: 'Revelar carta',
    viewScoreboard: 'Ver marcador',
    close: 'Cerrar',
    closeScoreboard: 'Cerrar marcador',
    scoreboardTitle: 'Marcador',
    scoreboardEyebrow: 'Mejores tiempos',
    scoreSummary: '{time}s restantes',
    yourScore: 'Tu resultado',
    scoreNameLabel: 'Nombre del jugador',
    scoreNameHelp: 'Guarda tu partida ganadora.',
    scoreNamePlaceholder: 'Nombre',
    saveScore: 'Guardar',
    savingScore: 'Guardando',
    scoreSaved: 'Puntaje guardado',
    scoreUnavailable: 'Conecta Supabase para guardar y cargar el marcador.',
    scoreLoading: 'Cargando',
    scoreLoadError: 'No se pudieron cargar.',
    scoreSubmitError: 'No se pudo guardar.',
    noScoresYet: 'A\u00fan no hay puntajes.',
    scoreRowStats: '{time}s',
    scoreEntryLabel: 'Puesto {rank}: {player}, {time} segundos restantes',
    yourSavedScore: 'Tu puntaje guardado',
    scoreRules: 'Ordenado por mayor tiempo restante.',
  },
};

export type TranslationKey = keyof typeof translations.en;
type TranslationParams = Record<string, string | number>;

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

type PersistedI18nState = Pick<I18nStore, 'language'>;

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) =>
        set({ language: isLanguage(language) ? language : DEFAULT_LANGUAGE }),
    }),
    {
      name: STORAGE_KEYS.i18n,
      storage: createLocalJSONStorage<PersistedI18nState>(),
      partialize: (state) => ({ language: state.language }),
      merge: (persistedState, currentState) => {
        const persistedLanguage =
          persistedState &&
          typeof persistedState === 'object' &&
          'language' in persistedState
            ? persistedState.language
            : undefined;

        return {
          ...currentState,
          language: isLanguage(persistedLanguage)
            ? persistedLanguage
            : currentState.language,
        };
      },
    },
  ),
);

export const translate = (
  language: Language,
  key: TranslationKey,
  params?: TranslationParams,
) => {
  let text = translations[language][key];

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }

  return text;
};

export const useTranslation = () => {
  const language = useI18nStore((state) => state.language);

  const t = (key: TranslationKey, params?: TranslationParams) =>
    translate(language, key, params);

  return { t, language };
};
