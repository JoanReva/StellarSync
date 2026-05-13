import { create } from 'zustand';
import {
  CARD_SYMBOLS,
  GAME_DURATION_MS,
  TIMER_TICK_MS,
  TOTAL_PAIRS,
} from '../utils/constants';
import { shuffle, type RandomSource } from '../utils/shuffle';

export type CardSymbol = (typeof CARD_SYMBOLS)[number];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Feedback = {
  type: 'match' | 'mismatch';
};

export type MemoryCard = {
  id: string;
  symbol: CardSymbol;
  pairIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameState = {
  cards: MemoryCard[];
  selectedCardIds: string[];
  isBoardLocked: boolean;
  matchesFound: number;
  attempts: number;
  status: GameStatus;
  feedback: Feedback | null;
  timeRemaining: number;
  isTimerPaused: boolean;
};

type GameActions = {
  startGame: (randomSource?: RandomSource) => void;
  resetGame: (randomSource?: RandomSource) => void;
  selectCard: (cardId: string) => void;
  resolvePendingSelection: () => void;
  clearFeedback: () => void;
  tickTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  loseGame: () => void;
};

export type GameStore = GameState & GameActions;

const createDeck = (randomSource?: RandomSource): MemoryCard[] => {
  const deck = CARD_SYMBOLS.flatMap((symbol) =>
    [0, 1].map((pairIndex) => ({
      id: `${symbol}-${pairIndex}`,
      symbol,
      pairIndex,
      isFlipped: false,
      isMatched: false,
    })),
  );

  return shuffle(deck, randomSource);
};

const createInitialState = (): GameState => ({
  cards: [],
  selectedCardIds: [],
  isBoardLocked: false,
  matchesFound: 0,
  attempts: 0,
  status: 'idle',
  feedback: null,
  timeRemaining: GAME_DURATION_MS,
  isTimerPaused: true,
});

const flipCard = (card: MemoryCard): MemoryCard => ({
  ...card,
  isFlipped: true,
});

const unflipCard = (card: MemoryCard): MemoryCard => ({
  ...card,
  isFlipped: false,
});

const matchCard = (card: MemoryCard): MemoryCard => ({
  ...card,
  isFlipped: true,
  isMatched: true,
});

export const useGameStore = create<GameStore>((set) => ({
  ...createInitialState(),

  startGame: (randomSource) => {
    set({
      ...createInitialState(),
      cards: createDeck(randomSource),
      status: 'playing',
      isTimerPaused: false,
    });
  },

  resetGame: (randomSource) => {
    set({
      ...createInitialState(),
      cards: createDeck(randomSource),
      status: 'playing',
      isTimerPaused: false,
    });
  },

  selectCard: (cardId) => {
    set((state) => {
      if (state.status !== 'playing' || state.isBoardLocked) {
        return state;
      }

      const selectedCard = state.cards.find((card) => card.id === cardId);

      if (!selectedCard || selectedCard.isFlipped || selectedCard.isMatched) {
        return state;
      }

      if (state.selectedCardIds.length === 0) {
        return {
          ...state,
          cards: state.cards.map((card) =>
            card.id === cardId ? flipCard(card) : card,
          ),
          selectedCardIds: [cardId],
          feedback: null,
        };
      }

      const firstCardId = state.selectedCardIds[0];
      const firstCard = state.cards.find((card) => card.id === firstCardId);

      if (!firstCard || firstCard.id === selectedCard.id) {
        return state;
      }

      const isMatch = firstCard.symbol === selectedCard.symbol;
      const nextAttempts = state.attempts + 1;

      if (!isMatch) {
        return {
          ...state,
          cards: state.cards.map((card) =>
            card.id === cardId ? flipCard(card) : card,
          ),
          selectedCardIds: [firstCard.id, selectedCard.id],
          isBoardLocked: true,
          attempts: nextAttempts,
          feedback: { type: 'mismatch' },
        };
      }

      const nextMatchesFound = state.matchesFound + 1;
      const nextStatus = nextMatchesFound === TOTAL_PAIRS ? 'won' : 'playing';
      const matchedIds = new Set([firstCard.id, selectedCard.id]);

      return {
        ...state,
        cards: state.cards.map((card) =>
          matchedIds.has(card.id) ? matchCard(card) : card,
        ),
        selectedCardIds: [firstCard.id, selectedCard.id],
        isBoardLocked: true,
        matchesFound: nextMatchesFound,
        attempts: nextAttempts,
        status: nextStatus,
        isTimerPaused: nextStatus === 'won',
        feedback: { type: 'match' },
      };
    });
  },

  resolvePendingSelection: () => {
    set((state) => {
      if (!state.isBoardLocked || state.selectedCardIds.length !== 2) {
        return state;
      }

      const pendingIds = new Set(state.selectedCardIds);

      return {
        ...state,
        cards: state.cards.map((card) =>
          pendingIds.has(card.id) && !card.isMatched ? unflipCard(card) : card,
        ),
        selectedCardIds: [],
        isBoardLocked: false,
      };
    });
  },

  clearFeedback: () => {
    set({ feedback: null });
  },

  tickTimer: () => {
    set((state) => {
      if (state.status !== 'playing' || state.isTimerPaused) {
        return state;
      }

      const nextTimeRemaining = Math.max(
        state.timeRemaining - TIMER_TICK_MS,
        0,
      );

      if (nextTimeRemaining === 0) {
        return {
          ...state,
          timeRemaining: 0,
          selectedCardIds: [],
          isBoardLocked: false,
          isTimerPaused: true,
          status: 'lost',
        };
      }

      return {
        ...state,
        timeRemaining: nextTimeRemaining,
      };
    });
  },

  pauseTimer: () => {
    set((state) => ({
      ...state,
      isTimerPaused: true,
    }));
  },

  resumeTimer: () => {
    set((state) => ({
      ...state,
      isTimerPaused: state.status !== 'playing',
    }));
  },

  loseGame: () => {
    set((state) => ({
      ...state,
      selectedCardIds: [],
      isBoardLocked: false,
      isTimerPaused: true,
      status: state.status === 'won' ? 'won' : 'lost',
    }));
  },
}));

export const createMemoryDeck = createDeck;
