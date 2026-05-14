import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SCOREBOARD } from '../src/utils/constants';

const createClient = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient,
}));

const loadScoreboardService = async () => {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'public-key');

  return import('../src/services/scoreboard');
};

describe('scoreboard service', () => {
  beforeEach(() => {
    createClient.mockReset();
    vi.unstubAllEnvs();
  });

  it('loads scores ordered by remaining time and maps database rows', async () => {
    const limit = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'score-1',
          player_name: 'Ada',
          time_remaining: 12.4,
          created_at: '2026-05-14T00:00:00.000Z',
        },
      ],
      error: null,
    });
    const secondOrder = vi.fn(() => ({ limit }));
    const firstOrder = vi.fn(() => ({ order: secondOrder }));
    const select = vi.fn(() => ({ order: firstOrder }));
    const from = vi.fn(() => ({ select }));

    createClient.mockReturnValue({ from });

    const { fetchScores, isScoreboardConfigured } =
      await loadScoreboardService();

    await expect(fetchScores()).resolves.toEqual([
      {
        id: 'score-1',
        playerName: 'Ada',
        timeRemainingSeconds: 12.4,
        createdAt: '2026-05-14T00:00:00.000Z',
      },
    ]);

    expect(isScoreboardConfigured).toBe(true);
    expect(createClient).toHaveBeenCalledWith(
      'https://project.supabase.co',
      'public-key',
    );
    expect(from).toHaveBeenCalledWith(SCOREBOARD.tableName);
    expect(select).toHaveBeenCalledWith(
      'id, player_name, time_remaining, created_at',
    );
    expect(firstOrder).toHaveBeenCalledWith('time_remaining', {
      ascending: false,
    });
    expect(secondOrder).toHaveBeenCalledWith('created_at', {
      ascending: true,
    });
    expect(limit).toHaveBeenCalledWith(SCOREBOARD.limit);
  });

  it('trims and limits player names before submitting a score', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'score-2',
        player_name: 'LongPlayerName1',
        time_remaining: 9.8,
        created_at: '2026-05-14T00:00:00.000Z',
      },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));

    createClient.mockReturnValue({ from });

    const { submitScore } = await loadScoreboardService();
    const savedScore = await submitScore({
      playerName: '  LongPlayerName12345  ',
      timeRemainingSeconds: 9.8,
    });

    expect(insert).toHaveBeenCalledWith({
      player_name: 'LongPlayerName1',
      time_remaining: 9.8,
    });
    expect(savedScore.playerName).toBe('LongPlayerName1');
  });

  it('rejects scoreboard calls when Supabase env vars are missing', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');

    const { fetchScores, isScoreboardConfigured } = await import(
      '../src/services/scoreboard'
    );

    expect(isScoreboardConfigured).toBe(false);
    await expect(fetchScores()).rejects.toThrow('Supabase is not configured');
  });
});
