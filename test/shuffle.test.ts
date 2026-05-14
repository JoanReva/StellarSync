import { describe, expect, it } from 'vitest';
import { isDeckOrderValid, shuffleUntilValid } from '../src/utils/shuffle';

describe('deck order validation', () => {
  it('rejects adjacent matching pairs', () => {
    expect(isDeckOrderValid(['star', 'star', 'moon', 'sun'])).toBe(false);
  });

  it('rejects identical halves', () => {
    expect(isDeckOrderValid(['star', 'moon', 'sun', 'comet', 'star', 'moon', 'sun', 'comet'])).toBe(false);
  });

  it('rejects mirrored halves', () => {
    expect(isDeckOrderValid(['star', 'moon', 'sun', 'comet', 'comet', 'sun', 'moon', 'star'])).toBe(false);
  });

  it('compares keys without string join collisions', () => {
    expect(isDeckOrderValid(['a,b', 'c', 'a', 'b,c'])).toBe(true);
  });

  it('accepts a non-trivial deck order', () => {
    expect(isDeckOrderValid(['star', 'moon', 'star', 'sun', 'comet', 'moon', 'sun', 'comet'])).toBe(true);
  });

  it('can validate shuffled objects by match key', () => {
    const deck = [
      { id: 'star-0', symbol: 'star' },
      { id: 'star-1', symbol: 'star' },
      { id: 'moon-0', symbol: 'moon' },
    ];

    expect(isDeckOrderValid(deck, { getMatchKey: (card) => card.symbol })).toBe(false);
  });

  it('keeps trying until it finds a valid order', () => {
    const randomValues = [
      0, 0, 0, 0, 0,
      0, 0, 0.39, 0.39, 0,
    ];
    let index = 0;

    const shuffled = shuffleUntilValid(
      ['star', 'star', 'moon', 'moon', 'comet', 'comet'],
      () => randomValues[index++] ?? 0.5,
      { maxAttempts: 3 },
    );

    expect(isDeckOrderValid(shuffled)).toBe(true);
  });

  it('falls back to a valid order when random attempts keep failing', () => {
    const shuffled = shuffleUntilValid(
      ['star', 'star', 'moon', 'moon', 'sun', 'sun', 'comet', 'comet'],
      () => 0,
      { maxAttempts: 2 },
    );

    expect(isDeckOrderValid(shuffled)).toBe(true);
  });

  it('works with uneven deck sizes', () => {
    const shuffled = shuffleUntilValid(
      ['star', 'star', 'moon', 'moon', 'sun'],
      () => 0,
      { maxAttempts: 2 },
    );

    expect(isDeckOrderValid(shuffled)).toBe(true);
  });
});
