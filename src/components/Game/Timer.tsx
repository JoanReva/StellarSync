import { useEffect, useRef, useState } from 'react';
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

const isPageActive = () => {
  return document.visibilityState === 'visible' && document.hasFocus();
};

export const Timer = () => {
  const lastTickAtRef = useRef<number | null>(null);
  const [isTickingAudible, setIsTickingAudible] = useState(isPageActive);
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const isTimerPaused = useGameStore((state) => state.isTimerPaused);
  const status = useGameStore((state) => state.status);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const { t } = useTranslation();
  const { play, stop } = useAudio();
  const isLowTime =
    status === 'playing' &&
    !isTimerPaused &&
    isTickingAudible &&
    timeRemaining > 0 &&
    timeRemaining <= GAME_RULES.lowTimeThresholdMs;
  const formattedTimeRemaining = (timeRemaining / 1000).toFixed(1);

  useEffect(() => {
    if (status !== 'playing' || isTimerPaused) {
      lastTickAtRef.current = null;
      return undefined;
    }

    lastTickAtRef.current = Date.now();

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const lastTickAt = lastTickAtRef.current ?? now;

      tickTimer(now - lastTickAt);
      lastTickAtRef.current = now;
    }, GAME_RULES.timerTickMs);

    return () => {
      window.clearInterval(intervalId);
      lastTickAtRef.current = null;
    };
  }, [isTimerPaused, status, tickTimer]);

  useEffect(() => {
    const updateTickingAudibility = () => {
      const isActive = isPageActive();

      setIsTickingAudible(isActive);

      if (!isActive) {
        stop('ticking');
      }
    };

    document.addEventListener('visibilitychange', updateTickingAudibility);
    window.addEventListener('blur', updateTickingAudibility);
    window.addEventListener('focus', updateTickingAudibility);

    return () => {
      document.removeEventListener('visibilitychange', updateTickingAudibility);
      window.removeEventListener('blur', updateTickingAudibility);
      window.removeEventListener('focus', updateTickingAudibility);
    };
  }, [stop]);

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
      className="absolute left-3 top-3 z-20 flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-center ring-2 sm:left-5 sm:top-5 sm:flex-row sm:items-baseline sm:gap-2 sm:rounded-full sm:px-5 sm:py-3 sm:text-left"
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
        className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] leading-none sm:text-sm sm:tracking-wide"
        style={{
          color: isLowTime
            ? 'var(--color-timer-low-label)'
            : 'var(--color-timer-label)',
        }}
      >
        {t('remainingTime')}
      </span>
      <motion.span
        className="text-xl font-bold tabular-nums leading-none sm:text-2xl"
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
