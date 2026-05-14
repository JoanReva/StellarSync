import { beforeEach, describe, expect, it } from 'vitest';
import {
  translate,
  useI18nStore,
  type TranslationKey,
} from '../src/store/useI18nStore';

describe('useI18nStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useI18nStore.setState({ language: 'en' });
  });

  it('translates shared UI and scoreboard copy in both languages', () => {
    expect(translate('en', 'scoreboardTitle')).toBe('Scoreboard');
    expect(translate('es', 'scoreboardTitle')).toBe('Marcador');
    expect(translate('en', 'viewScoreboard')).toBe('View scoreboard');
    expect(translate('es', 'viewScoreboard')).toBe('Ver marcador');
  });

  it('replaces interpolation params without leaking placeholders', () => {
    expect(translate('en', 'remainingTimeAria', { time: 12 })).toBe(
      'Remaining time: 12 seconds',
    );
    expect(
      translate('es', 'scoreEntryLabel', {
        rank: 2,
        player: 'Ada',
        time: 8.5,
      }),
    ).toBe('Puesto 2: Ada, 8.5 segundos restantes');
  });

  it('keeps English and Spanish dictionaries aligned', () => {
    const englishKeys = Object.keys(
      Object.fromEntries(
        ([
          'start',
          'scoreboardTitle',
          'scoreSaved',
          'closeScoreboard',
          'scoreRules',
        ] satisfies TranslationKey[]).map((key) => [key, translate('en', key)]),
      ),
    );

    englishKeys.forEach((key) => {
      expect(translate('es', key as TranslationKey).length).toBeGreaterThan(0);
    });
  });

  it('falls back to English when an invalid language is set', () => {
    useI18nStore.getState().setLanguage('fr' as never);

    expect(useI18nStore.getState().language).toBe('en');
  });
});
