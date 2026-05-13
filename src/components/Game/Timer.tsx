import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/useGameStore';
import {
  TICKING_THRESHOLD_MS,
  TIMER_ANIMATION_CONFIG,
  TIMER_TICK_MS,
} from '../../utils/constants';

export const Timer = () => {
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const isTimerPaused = useGameStore((state) => state.isTimerPaused);
  const status = useGameStore((state) => state.status);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const { play, stop } = useAudio();
  const isLowTime =
    status === 'playing' &&
    !isTimerPaused &&
    timeRemaining > 0 &&
    timeRemaining <= TICKING_THRESHOLD_MS;
  const formattedTimeRemaining = (timeRemaining / 1000).toFixed(1);

  useEffect(() => {
    if (status !== 'playing' || isTimerPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      tickTimer();
    }, TIMER_TICK_MS);

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
      aria-label={`Remaining time: ${formattedTimeRemaining} seconds`}
      className="absolute left-4 top-4 z-20 flex items-baseline gap-2 rounded-full px-5 py-3 ring-2 sm:left-5 sm:top-5"
      animate={
        isLowTime
          ? {
              backgroundColor: 'var(--color-timer-low-bg)',
              color: 'var(--color-timer-low-text)',
              boxShadow: [...TIMER_ANIMATION_CONFIG.lowTimeBoxShadow],
            }
          : {
              backgroundColor: 'var(--color-timer-bg)',
              color: 'var(--color-timer-text)',
              boxShadow: TIMER_ANIMATION_CONFIG.normalBoxShadow,
            }
      }
      transition={
        isLowTime
          ? {
              repeat: Infinity,
              duration: TIMER_ANIMATION_CONFIG.lowTimeDurationSeconds,
            }
          : { duration: TIMER_ANIMATION_CONFIG.normalDurationSeconds }
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
          color: 'var(--color-timer-label)',
        }}
      >
        Remaining time
      </span>
      <motion.span
        className="text-2xl font-bold tabular-nums"
        animate={
          isLowTime
            ? {
                scale: [...TIMER_ANIMATION_CONFIG.lowTimeScalePulse],
                color: 'var(--color-timer-low-text)',
              }
            : {
                scale: TIMER_ANIMATION_CONFIG.normalScale,
                color: 'var(--color-timer-text)',
              }
        }
        transition={
          isLowTime
            ? {
                repeat: Infinity,
                duration: TIMER_ANIMATION_CONFIG.lowTimeDurationSeconds,
              }
            : { duration: TIMER_ANIMATION_CONFIG.normalDurationSeconds }
        }
      >
        {formattedTimeRemaining}s
      </motion.span>
    </motion.div>
  );
};
