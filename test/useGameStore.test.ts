import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore, type MemoryCard } from '../src/store/useGameStore';
import { CARD_SYMBOLS, GAME_RULES } from '../src/utils/constants';

const resetGameStore = () => {
  useGameStore.setState({
    cards: [],
    selectedCardIds: [],
    isBoardLocked: false,
    matchesFound: 0,
    attempts: 0,
    status: 'idle',
    feedback: null,
    timeRemaining: GAME_RULES.durationMs,
    isTimerPaused: true,
  });
};

const findPair = (cards: MemoryCard[]) => {
  const firstCard = cards[0];
  const secondCard = cards.find(
    (card) => card.symbol === firstCard.symbol && card.id !== firstCard.id,
  );

  if (!secondCard) {
    throw new Error('Pair not found');
  }

  return [firstCard, secondCard] as const;
};

const findMismatch = (cards: MemoryCard[]) => {
  const firstCard = cards[0];
  const secondCard = cards.find((card) => card.symbol !== firstCard.symbol);

  if (!secondCard) {
    throw new Error('Mismatch not found');
  }

  return [firstCard, secondCard] as const;
};

describe('useGameStore', () => {
  beforeEach(() => {
    resetGameStore();
  });

  it('starts a playable game with a full memory deck and active timer', () => {
    useGameStore.getState().startGame(() => 0.5);

    const state = useGameStore.getState();

    expect(state.status).toBe('playing');
    expect(state.isTimerPaused).toBe(false);
    expect(state.cards).toHaveLength(
      CARD_SYMBOLS.length * GAME_RULES.pairsPerSymbol,
    );
    expect(state.cards.every((card) => !card.isFlipped)).toBe(true);
  });

  it('marks matching selections and pauses the timer after the final match', () => {
    useGameStore.getState().startGame(() => 0.5);

    while (useGameStore.getState().status === 'playing') {
      const unmatchedCards = useGameStore
        .getState()
        .cards.filter((card) => !card.isMatched);
      const [firstCard, secondCard] = findPair(unmatchedCards);

      useGameStore.getState().selectCard(firstCard.id);
      useGameStore.getState().selectCard(secondCard.id);
      useGameStore.getState().resolvePendingSelection();
    }

    const state = useGameStore.getState();

    expect(state.status).toBe('won');
    expect(state.matchesFound).toBe(CARD_SYMBOLS.length);
    expect(state.attempts).toBe(CARD_SYMBOLS.length);
    expect(state.isTimerPaused).toBe(true);
  });

  it('locks mismatched cards until pending selection is resolved', () => {
    useGameStore.getState().startGame(() => 0.5);
    const [firstCard, secondCard] = findMismatch(useGameStore.getState().cards);

    useGameStore.getState().selectCard(firstCard.id);
    useGameStore.getState().selectCard(secondCard.id);

    expect(useGameStore.getState().isBoardLocked).toBe(true);
    expect(useGameStore.getState().attempts).toBe(1);
    expect(useGameStore.getState().feedback).toEqual({ type: 'mismatch' });

    useGameStore.getState().resolvePendingSelection();

    const state = useGameStore.getState();

    expect(state.isBoardLocked).toBe(false);
    expect(state.selectedCardIds).toHaveLength(0);
    expect(
      state.cards.filter((card) => card.id === firstCard.id || card.id === secondCard.id)
        .every((card) => !card.isFlipped),
    ).toBe(true);
  });

  it('loses the game when the timer reaches zero', () => {
    useGameStore.getState().startGame(() => 0.5);
    useGameStore.getState().tickTimer(GAME_RULES.durationMs);

    const state = useGameStore.getState();

    expect(state.status).toBe('lost');
    expect(state.timeRemaining).toBe(0);
    expect(state.isTimerPaused).toBe(true);
  });
});
