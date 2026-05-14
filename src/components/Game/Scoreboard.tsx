import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../Common/Button';
import {
  fetchScores,
  isScoreboardConfigured,
  submitScore,
  type ScoreboardEntry,
} from '../../services/scoreboard';
import { useTranslation } from '../../store/useI18nStore';
import { GAME_RULES, SCOREBOARD } from '../../utils/constants';

type ScoreboardProps = {
  timeRemainingMs: number;
};

type ScoreboardStatus = 'loading' | 'ready' | 'error';
type SubmitStatus = 'idle' | 'saving' | 'saved' | 'error';

const formatMilliseconds = (milliseconds: number) =>
  (milliseconds / 1000).toFixed(1);

const formatSeconds = (seconds: number) => seconds.toFixed(1);

export const Scoreboard = ({ timeRemainingMs }: ScoreboardProps) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<ScoreboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [scoreboardStatus, setScoreboardStatus] =
    useState<ScoreboardStatus>(isScoreboardConfigured ? 'loading' : 'ready');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const isSubmitDisabled =
    !isScoreboardConfigured ||
    submitStatus === 'saving' ||
    submitStatus === 'saved' ||
    playerName.trim().length === 0;

  const scoreSummary = useMemo(
    () =>
      t('scoreSummary', {
        time: formatMilliseconds(timeRemainingMs),
      }),
    [t, timeRemainingMs],
  );

  const loadScores = async () => {
    if (!isScoreboardConfigured) {
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
    if (!isScoreboardConfigured) {
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
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setSubmitStatus('saving');

    try {
      await submitScore({
        playerName,
        timeRemainingSeconds: Number(formatMilliseconds(timeRemainingMs)),
      });
      setPlayerName('');
      setSubmitStatus('saved');
      await loadScores();
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section className="w-full rounded-2xl bg-[var(--color-scoreboard-bg)] p-5 text-left shadow-[var(--shadow-panel)] ring-1 ring-[var(--color-scoreboard-ring)]">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[var(--color-text-main)]">
          {t('scoreboardTitle')}
        </h2>
        <p className="text-sm font-semibold text-[var(--color-text-muted)]">
          {scoreSummary}
        </p>
      </div>

      <form
        className="mb-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
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
      </form>

      {!isScoreboardConfigured && (
        <p className="mb-4 rounded-lg bg-[var(--color-scoreboard-notice-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-scoreboard-notice-text)]">
          {t('scoreUnavailable')}
        </p>
      )}

      {submitStatus === 'saved' && (
        <p className="mb-4 text-sm font-bold text-[var(--color-success)]">
          {t('scoreSaved')}
        </p>
      )}

      {submitStatus === 'error' && (
        <p className="mb-4 text-sm font-bold text-[var(--color-error)]">
          {t('scoreSubmitError')}
        </p>
      )}

      {scoreboardStatus === 'loading' && (
        <p className="text-sm font-semibold text-[var(--color-text-muted)]">
          {t('scoreLoading')}
        </p>
      )}

      {scoreboardStatus === 'error' && (
        <p className="text-sm font-bold text-[var(--color-error)]">
          {t('scoreLoadError')}
        </p>
      )}

      {isScoreboardConfigured &&
        scoreboardStatus === 'ready' &&
        scores.length === 0 && (
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">
            {t('noScoresYet')}
          </p>
        )}

      {scores.length > 0 && (
        <ol className="flex flex-col gap-2">
          {scores.map((score, index) => (
            <li
              key={score.id}
              className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-xl bg-[var(--color-scoreboard-row-bg)] px-3 py-2 ring-1 ring-[var(--color-scoreboard-row-ring)]"
            >
              <span className="text-sm font-bold text-[var(--color-text-muted)]">
                {index + 1}
              </span>
              <span className="truncate text-sm font-bold text-[var(--color-text-main)]">
                {score.playerName}
              </span>
              <span className="text-right text-xs font-bold text-[var(--color-text-muted)]">
                {t('scoreRowStats', {
                  time: formatSeconds(score.timeRemainingSeconds),
                })}
              </span>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-4 text-xs font-semibold text-[var(--color-text-muted)]">
        {t('scoreRules', {
          time: formatMilliseconds(GAME_RULES.durationMs),
        })}
      </p>
    </section>
  );
};
