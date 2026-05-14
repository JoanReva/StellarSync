export const CARD_SYMBOLS = ["star", "moon", "sun", "comet"] as const;

export const GAME_RULES = {
  pairsPerSymbol: 2,
  durationMs: 30000,
  timerTickMs: 100,
  lowTimeThresholdMs: 10000,
} as const;

export const SCOREBOARD = {
  limit: 5,
  playerNameMaxLength: 15,
  tableName: "leaderboard",
} as const;
