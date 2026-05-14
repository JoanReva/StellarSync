import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../Common/Button';
import {
  fetchScores,
  isScoreboardConfigured,
  submitScore,
  type ScoreboardEntry,
} from '../../services/scoreboard';
import { useTranslation } from '../../store/useI18nStore';
import { SCOREBOARD } from '../../utils/constants';

type ScoreboardProps = {
  canSubmit?: boolean;
  showEntries?: boolean;
  timeRemainingMs?: number;
};

type ScoreboardStatus = 'loading' | 'ready' | 'error';
type SubmitStatus = 'idle' | 'saving' | 'saved' | 'error';

const formatMilliseconds = (milliseconds: number) =>
  (milliseconds / 1000).toFixed(1);

const formatSeconds = (seconds: number) => Number(seconds).toFixed(1);

const getRankClassName = (index: number) => {
  if (index === 0) {
    return 'bg-[var(--color-scoreboard-rank-first-bg)] text-[var(--color-scoreboard-rank-first-text)]';
  }

  if (index === 1) {
    return 'bg-[var(--color-scoreboard-rank-second-bg)] text-[var(--color-scoreboard-rank-second-text)]';
  }

  if (index === 2) {
    return 'bg-[var(--color-scoreboard-rank-third-bg)] text-[var(--color-scoreboard-rank-third-text)]';
  }

  return 'bg-[var(--color-scoreboard-rank-bg)] text-[var(--color-text-muted)]';
};

const getEntryClassName = (index: number, isCurrentScore: boolean) => {
  if (isCurrentScore) {
    return 'bg-[var(--color-scoreboard-current-bg)] ring-[var(--color-scoreboard-current-ring)]';
  }

  if (index === 0) {
    return 'bg-[var(--color-scoreboard-entry-first-bg)] ring-[var(--color-scoreboard-entry-first-ring)]';
  }

  if (index === 1) {
    return 'bg-[var(--color-scoreboard-entry-second-bg)] ring-[var(--color-scoreboard-entry-second-ring)]';
  }

  if (index === 2) {
    return 'bg-[var(--color-scoreboard-entry-third-bg)] ring-[var(--color-scoreboard-entry-third-ring)]';
  }

  return 'bg-[var(--color-scoreboard-row-bg)] ring-[var(--color-scoreboard-row-ring)]';
};

export const Scoreboard = ({
  canSubmit = false,
  showEntries = true,
  timeRemainingMs,
}: ScoreboardProps) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<ScoreboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [savedScoreId, setSavedScoreId] = useState<string | null>(null);
  const [isSavedNoticeVisible, setIsSavedNoticeVisible] = useState(false);
  const [scoreboardStatus, setScoreboardStatus] =
    useState<ScoreboardStatus>(
      isScoreboardConfigured && showEntries ? 'loading' : 'ready',
    );
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const isSubmitDisabled =
    !isScoreboardConfigured ||
    !canSubmit ||
    timeRemainingMs === undefined ||
    submitStatus === 'saving' ||
    submitStatus === 'saved' ||
    playerName.trim().length === 0;

  const scoreSummary = useMemo(
    () => {
      if (timeRemainingMs === undefined) {
        return '';
      }

      return t('scoreSummary', {
        time: formatMilliseconds(timeRemainingMs),
      });
    },
    [t, timeRemainingMs],
  );

  const loadScores = async () => {
    if (!isScoreboardConfigured || !showEntries) {
      setScoreboardStatus('ready');
      return;
    }

    setScoreboardStatus('loading');

    try {
      setScores(await fetchScores());
      setScoreboardStatus('ready');
    } catch {
      setScoreboardStatus('error');
    }
  };

  useEffect(() => {
    if (!isScoreboardConfigured || !showEntries) {
      return undefined;
    }

    let isMounted = true;

    const loadInitialScores = async () => {
      try {
        const nextScores = await fetchScores();

        if (isMounted) {
          setScores(nextScores);
          setScoreboardStatus('ready');
        }
      } catch {
        if (isMounted) {
          setScoreboardStatus('error');
        }
      }
    };

    void loadInitialScores();

    return () => {
      isMounted = false;
    };
  }, [showEntries]);

  useEffect(() => {
    if (!isSavedNoticeVisible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSavedNoticeVisible(false);
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [isSavedNoticeVisible]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled || timeRemainingMs === undefined) {
      return;
    }

    setSubmitStatus('saving');

    try {
      const savedScore = await submitScore({
        playerName,
        timeRemainingSeconds: Number(formatMilliseconds(timeRemainingMs)),
      });
      setPlayerName('');
      setSavedScoreId(savedScore.id);
      setSubmitStatus('saved');
      setIsSavedNoticeVisible(true);

      if (showEntries) {
        await loadScores();
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section className="w-full text-left">
      <div className="mb-4">
        {canSubmit && timeRemainingMs !== undefined && (
          <div className="rounded-xl bg-[var(--color-scoreboard-result-bg)] px-4 py-3 ring-1 ring-[var(--color-scoreboard-result-ring)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              {t('yourScore')}
            </p>
            <p className="text-3xl font-bold tabular-nums text-[var(--color-scoreboard-result-text)]">
              {scoreSummary}
            </p>
          </div>
        )}
      </div>

      {canSubmit && submitStatus !== 'saved' && (
        <form
          className="mb-5 flex flex-col gap-3 rounded-2xl bg-[var(--color-scoreboard-form-bg)] p-4 ring-1 ring-[var(--color-scoreboard-row-ring)]"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="text-sm font-bold text-[var(--color-text-main)]"
              htmlFor="score-player-name"
            >
              {t('scoreNameLabel')}
            </label>
            <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
              {t('scoreNameHelp')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="score-player-name"
              type="text"
              value={playerName}
              maxLength={SCOREBOARD.playerNameMaxLength}
              placeholder={t('scoreNamePlaceholder')}
              aria-label={t('scoreNameLabel')}
              onChange={(event) => {
                setPlayerName(event.target.value);
                if (submitStatus === 'error') {
                  setSubmitStatus('idle');
                }
              }}
              className="min-h-12 flex-1 rounded-full border-2 border-[var(--color-scoreboard-input-border)] bg-[var(--color-scoreboard-input-bg)] px-4 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-scoreboard-input-focus)]"
            />
            <Button type="submit" size="sm" disabled={isSubmitDisabled}>
              {submitStatus === 'saving' ? t('savingScore') : t('saveScore')}
            </Button>
          </div>
        </form>
      )}

      {!isScoreboardConfigured && (
        <p className="mb-4 rounded-xl bg-[var(--color-scoreboard-notice-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-scoreboard-notice-text)]">
          {t('scoreUnavailable')}
        </p>
      )}

      {(submitStatus === 'error' ||
        (submitStatus === 'saved' && isSavedNoticeVisible)) && (
        <div aria-live="polite" className="mb-4 flex justify-center">
          {submitStatus === 'saved' && isSavedNoticeVisible && (
            <p className="rounded-full bg-[var(--color-scoreboard-saved-bg)] px-4 py-2 text-center text-sm font-bold text-[var(--color-scoreboard-saved-text)]">
              {t('scoreSaved')}
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-center text-sm font-bold text-[var(--color-error)]">
              {t('scoreSubmitError')}
            </p>
          )}
        </div>
      )}

      {showEntries && scoreboardStatus === 'loading' && (
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">
            {t('scoreLoading')}
          </p>
        </div>
      )}

      {showEntries && scoreboardStatus === 'error' && (
        <p className="text-sm font-bold text-[var(--color-error)]">
          {t('scoreLoadError')}
        </p>
      )}

      {showEntries &&
        isScoreboardConfigured &&
        scoreboardStatus === 'ready' &&
        scores.length === 0 && (
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">
            {t('noScoresYet')}
          </p>
        )}

      {showEntries && scores.length > 0 && (
        <div className="max-h-72 overflow-y-auto pr-1">
          <ol className="flex flex-col gap-2" aria-label={t('scoreboardTitle')}>
            {scores.map((score, index) => (
              <li
                key={score.id}
                aria-label={t('scoreEntryLabel', {
                  rank: index + 1,
                  player: score.playerName,
                  time: formatSeconds(score.timeRemainingSeconds),
                })}
                className={`grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-xl px-3 py-2 ring-1 ${getEntryClassName(
                  index,
                  score.id === savedScoreId,
                )}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${getRankClassName(
                    index,
                  )}`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--color-text-main)]">
                    {score.playerName}
                  </span>
                  {score.id === savedScoreId && (
                    <span className="text-xs font-bold text-[var(--color-scoreboard-current-text)]">
                      {t('yourSavedScore')}
                    </span>
                  )}
                </span>
                <span className="text-right text-xs font-bold text-[var(--color-text-muted)]">
                  {t('scoreRowStats', {
                    time: formatSeconds(score.timeRemainingSeconds),
                  })}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {showEntries && (
        <p className="mt-4 text-xs font-semibold text-[var(--color-text-muted)]">
          {t('scoreRules')}
        </p>
      )}
    </section>
  );
};
