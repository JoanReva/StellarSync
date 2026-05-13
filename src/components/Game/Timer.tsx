import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/useGameStore';
import { TICKING_THRESHOLD_SECONDS } from '../../utils/constants';

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
    timeRemaining <= TICKING_THRESHOLD_SECONDS;

  useEffect(() => {
    if (status !== 'playing' || isTimerPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      tickTimer();
    }, 1000);

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
      className="absolute left-4 top-4 z-20 rounded-full bg-white px-5 py-3 text-xl font-bold text-[var(--color-text-main)] shadow-xl ring-2 ring-white/70 sm:left-5 sm:top-5"
      animate={isLowTime ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={
        isLowTime
          ? { repeat: Infinity, duration: 0.8 }
          : { duration: 0.2 }
      }
    >
      {timeRemaining} seconds
    </motion.div>
  );
};
