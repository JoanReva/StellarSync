import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { useTranslation } from '../../store/useI18nStore';
import { useGameStore } from '../../store/useGameStore';
import { GAME_RULES } from '../../utils/constants';

const TIMER_MOTION = {
  normalScale: 1,
  lowTimeScalePulse: [1, 1.045, 1],
  lowTimeDurationSeconds: 0.75,
  normalDurationSeconds: 0.2,
  lowTimeBoxShadow: [
    'var(--shadow-timer-normal)',
    'var(--shadow-timer-low)',
    'var(--shadow-timer-normal)',
  ],
  normalBoxShadow: 'var(--shadow-timer-normal)',
} as const;

export const Timer = () => {
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const isTimerPaused = useGameStore((state) => state.isTimerPaused);
  const status = useGameStore((state) => state.status);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const { t } = useTranslation();
  const { play, stop } = useAudio();
  const isLowTime =
    status === 'playing' &&
    !isTimerPaused &&
    timeRemaining > 0 &&
    timeRemaining <= GAME_RULES.lowTimeThresholdMs;
  const formattedTimeRemaining = (timeRemaining / 1000).toFixed(1);

  useEffect(() => {
    if (status !== 'playing' || isTimerPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      tickTimer();
    }, GAME_RULES.timerTickMs);

    return () => window.clearInterval(intervalId);
  }, [isTimerPaused, status, tickTimer]);

  useEffect(() => {
    if (isLowTime) {
      play('ticking');
      return () => stop('ticking');
    }

    stop('ticking');
    return undefined;
  }, [isLowTime, play, stop]);

  return (
    <motion.div
      role="timer"
      aria-live={isLowTime ? 'assertive' : 'polite'}
      aria-label={t('remainingTimeAria', { time: formattedTimeRemaining })}
      className="absolute left-4 top-4 z-20 flex items-baseline gap-2 rounded-full px-5 py-3 ring-2 sm:left-5 sm:top-5"
      animate={
        isLowTime
          ? {
              backgroundColor: 'var(--color-timer-low-bg)',
              color: 'var(--color-timer-low-text)',
              boxShadow: [...TIMER_MOTION.lowTimeBoxShadow],
            }
          : {
              backgroundColor: 'var(--color-timer-bg)',
              color: 'var(--color-timer-text)',
              boxShadow: TIMER_MOTION.normalBoxShadow,
            }
      }
      transition={
        isLowTime
          ? {
              repeat: Infinity,
              duration: TIMER_MOTION.lowTimeDurationSeconds,
            }
          : { duration: TIMER_MOTION.normalDurationSeconds }
      }
      style={{
        ['--tw-ring-color' as string]: isLowTime
          ? 'var(--color-timer-low-ring)'
          : 'var(--color-timer-ring)',
      }}
    >
      <span
        className="text-sm font-semibold uppercase tracking-wide"
        style={{
          color: isLowTime
            ? 'var(--color-timer-low-label)'
            : 'var(--color-timer-label)',
        }}
      >
        {t('remainingTime')}
      </span>
      <motion.span
        className="text-2xl font-bold tabular-nums"
        animate={
          isLowTime
            ? {
                scale: [...TIMER_MOTION.lowTimeScalePulse],
                color: 'var(--color-timer-low-text)',
              }
            : {
                scale: TIMER_MOTION.normalScale,
                color: 'var(--color-timer-text)',
              }
        }
        transition={
          isLowTime
            ? {
                repeat: Infinity,
                duration: TIMER_MOTION.lowTimeDurationSeconds,
              }
            : { duration: TIMER_MOTION.normalDurationSeconds }
        }
      >
        {formattedTimeRemaining}s
      </motion.span>
    </motion.div>
  );
};
