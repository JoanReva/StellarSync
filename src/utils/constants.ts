export const CARD_SYMBOLS = ['star', 'moon', 'sun', 'comet'] as const;

export const PAIRS_PER_SYMBOL = 2;
export const TOTAL_CARDS = CARD_SYMBOLS.length * PAIRS_PER_SYMBOL;
export const TOTAL_PAIRS = CARD_SYMBOLS.length;
export const GAME_DURATION_SECONDS = 30;
export const TICKING_THRESHOLD_SECONDS = 10;
