import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Scoreboard } from '../src/components/Game/Scoreboard';
import { ScoreboardModal } from '../src/components/Common/ScoreboardModal';
import { useI18nStore } from '../src/store/useI18nStore';

const mocks = vi.hoisted(() => ({
  fetchScores: vi.fn(),
  submitScore: vi.fn(),
}));

vi.mock('../src/services/scoreboard', () => ({
  fetchScores: mocks.fetchScores,
  submitScore: mocks.submitScore,
  isScoreboardConfigured: true,
}));

describe('Scoreboard', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.fetchScores.mockReset();
    mocks.submitScore.mockReset();
    useI18nStore.setState({ language: 'en' });
  });

  it('renders the modal in Spanish with loaded score entries', async () => {
    useI18nStore.setState({ language: 'es' });
    mocks.fetchScores.mockResolvedValue([
      {
        id: 'score-1',
        playerName: 'Ada',
        timeRemainingSeconds: 12.4,
        createdAt: '2026-05-14T00:00:00.000Z',
      },
      {
        id: 'score-2',
        playerName: 'Linus',
        timeRemainingSeconds: 10.2,
        createdAt: '2026-05-14T00:00:01.000Z',
      },
    ]);

    render(<ScoreboardModal isOpen onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Marcador' })).toBeTruthy();
    expect(screen.getByText('Mejores tiempos')).toBeTruthy();
    expect(await screen.findByText('Ada')).toBeTruthy();
    expect(
      screen.getByLabelText('Puesto 1: Ada, 12.4 segundos restantes'),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Cerrar marcador' }),
    ).toBeTruthy();
  });

  it('saves a winning score in English and hides the form after submit', async () => {
    mocks.submitScore.mockResolvedValue({
      id: 'score-3',
      playerName: 'Grace',
      timeRemainingSeconds: 14.2,
      createdAt: '2026-05-14T00:00:02.000Z',
    });

    render(<Scoreboard canSubmit showEntries={false} timeRemainingMs={14200} />);

    fireEvent.change(screen.getByLabelText('Player name'), {
      target: { value: 'Grace' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mocks.submitScore).toHaveBeenCalledWith({
        playerName: 'Grace',
        timeRemainingSeconds: 14.2,
      });
    });

    expect(await screen.findByText('Score saved')).toBeTruthy();
    expect(screen.queryByLabelText('Player name')).toBeNull();
  });
});
