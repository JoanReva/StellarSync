export type RandomSource = () => number;

const DEFAULT_MAX_SHUFFLE_ATTEMPTS = 20;
const DEFAULT_MAX_FALLBACK_STEPS = 10_000;

export const shuffle = <T>(
  values: readonly T[],
  randomSource: RandomSource = Math.random,
): T[] => {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(randomSource() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

type DeckValidationOptions<T> = {
  getMatchKey?: (value: T) => PropertyKey;
};

const getDefaultMatchKey = <T>(value: T) => String(value);

const areArraysEqual = <T>(first: readonly T[], second: readonly T[]) => {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((value, index) => value === second[index]);
};

export const isDeckOrderValid = <T>(
  deck: readonly T[],
  options: DeckValidationOptions<T> = {},
): boolean => {
  const getMatchKey = options.getMatchKey ?? getDefaultMatchKey;

  for (let index = 0; index < deck.length - 1; index += 1) {
    if (getMatchKey(deck[index]) === getMatchKey(deck[index + 1])) {
      return false;
    }
  }

  const middleIndex = deck.length / 2;

  if (!Number.isInteger(middleIndex)) {
    return true;
  }

  const firstHalf = deck.slice(0, middleIndex).map(getMatchKey);
  const secondHalf = deck.slice(middleIndex).map(getMatchKey);

  if (areArraysEqual(firstHalf, secondHalf)) {
    return false;
  }

  if (areArraysEqual(firstHalf, [...secondHalf].reverse())) {
    return false;
  }

  return true;
};

const buildValidDeckOrder = <T>(
  values: readonly T[],
  options: DeckValidationOptions<T> & { maxFallbackSteps?: number },
): T[] | null => {
  const getMatchKey = options.getMatchKey ?? getDefaultMatchKey;
  const maxFallbackSteps =
    options.maxFallbackSteps ?? DEFAULT_MAX_FALLBACK_STEPS;
  const buckets = new Map<PropertyKey, T[]>();

  values.forEach((value) => {
    const key = getMatchKey(value);
    const bucket = buckets.get(key) ?? [];

    bucket.push(value);
    buckets.set(key, bucket);
  });

  const orderedKeys = [...buckets.keys()].sort(
    (firstKey, secondKey) =>
      (buckets.get(secondKey)?.length ?? 0) -
      (buckets.get(firstKey)?.length ?? 0),
  );
  const result: T[] = [];
  let steps = 0;

  const backtrack = (): boolean => {
    steps += 1;

    if (steps > maxFallbackSteps) {
      return false;
    }

    if (result.length === values.length) {
      return isDeckOrderValid(result, options);
    }

    const lastKey =
      result.length > 0 ? getMatchKey(result[result.length - 1]) : null;

    for (const key of orderedKeys) {
      if (key === lastKey) {
        continue;
      }

      const bucket = buckets.get(key);

      if (!bucket || bucket.length === 0) {
        continue;
      }

      const nextValue = bucket.pop();

      if (nextValue === undefined) {
        continue;
      }

      result.push(nextValue);

      if (backtrack()) {
        return true;
      }

      result.pop();
      bucket.push(nextValue);
    }

    return false;
  };

  return backtrack() ? result : null;
};

export const shuffleUntilValid = <T>(
  values: readonly T[],
  randomSource: RandomSource = Math.random,
  options: DeckValidationOptions<T> & {
    maxAttempts?: number;
    maxFallbackSteps?: number;
  } = {},
): T[] => {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_SHUFFLE_ATTEMPTS;
  let lastShuffle = [...values];

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const shuffled = shuffle(values, randomSource);

    if (isDeckOrderValid(shuffled, options)) {
      return shuffled;
    }

    lastShuffle = shuffled;
  }

  return buildValidDeckOrder(values, options) ?? lastShuffle;
};
