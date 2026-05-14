export const CARD_SYMBOLS = ['star', 'moon', 'sun', 'comet'] as const;

export const PAIRS_PER_SYMBOL = 2;
export const TOTAL_CARDS = CARD_SYMBOLS.length * PAIRS_PER_SYMBOL;
export const TOTAL_PAIRS = CARD_SYMBOLS.length;
export const GAME_DURATION_SECONDS = 10;
export const GAME_DURATION_MS = GAME_DURATION_SECONDS * 1000;
export const TIMER_TICK_MS = 100;
export const TICKING_THRESHOLD_SECONDS = 5;
export const TICKING_THRESHOLD_MS = TICKING_THRESHOLD_SECONDS * 1000;

export const CARD_ANIMATION_CONFIG = {
  hoverLiftY: -4,
  tapScale: 0.97,
  waitingOpacity: 0.48,
  waitingScale: 0.96,
  comparingPulseY: [0, -3, 0],
  flipDurationSeconds: 0.45,
  comparingPulseDurationSeconds: 0.8,
  comparingRingDurationSeconds: 0.8,
  waitingShimmerDurationSeconds: 0.9,
} as const;

export const CARD_THEME_CONFIG = {
  backBackground: 'var(--color-card-back-bg)',
  backText: 'var(--color-card-back-text)',
  backBorder: 'var(--color-card-back-border)',
  frontBackground: 'var(--color-card-front-bg)',
  frontBorder: 'var(--color-card-front-border)',
  comparingRing: 'var(--color-card-comparing-ring)',
  comparingGlow: 'var(--color-card-comparing-glow)',
  waitingOverlay: 'var(--color-card-waiting-overlay)',
} as const;

export const BOARD_ANIMATION_CONFIG = {
  comparisonDelayMs: 1000,
} as const;

export const FEEDBACK_MODAL_CONFIG = {
  autoCloseMs: 1000,
} as const;

export const TIMER_ANIMATION_CONFIG = {
  normalScale: 1,
  lowTimeScalePulse: [1, 1.045, 1],
  lowTimeDurationSeconds: 0.75,
  normalDurationSeconds: 0.2,
  lowTimeBoxShadow: [
    'var(--shadow-timer-normal)',
    '0 14px 30px var(--color-timer-low-shadow)',
    'var(--shadow-timer-normal)',
  ],
  normalBoxShadow: 'var(--shadow-timer-normal)',
} as const;
