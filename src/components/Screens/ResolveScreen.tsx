import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Common/Button';
import { Confetti } from '../Game/Confetti';
import { Scoreboard } from '../Game/Scoreboard';
import { type GameStatus, useGameStore } from '../../store/useGameStore';
import { useTranslation } from '../../store/useI18nStore';

type ResolveScreenProps = {
  status: GameStatus;
  onPlayAgain: () => void;
};

export const ResolveScreen = ({ status, onPlayAgain }: ResolveScreenProps) => {
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);
  const didWin = status === 'won';
  const { t } = useTranslation();
  const timeRemaining = useGameStore((state) => state.timeRemaining);

  useEffect(() => {
    playAgainButtonRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8 px-6 py-8 text-center">
      <Confetti isActive variant={didWin ? 'win' : 'lose'} />

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={
          didWin
            ? {
                opacity: 1,
                y: 0,
                scale: [0.92, 1.08, 1],
                filter: [
                  'var(--filter-resolve-win-rest)',
                  'var(--filter-resolve-win-burst)',
                  'var(--filter-resolve-win-settle)',
                ],
              }
            : {
                opacity: 1,
                y: 0,
                x: [0, -7, 7, -4, 4, 0],
                filter: ['saturate(1)', 'saturate(0.25)', 'saturate(0.7)'],
              }
        }
        transition={
          didWin
            ? {
                opacity: { duration: 0.18 },
                y: { type: 'spring', stiffness: 180, damping: 18 },
                scale: { duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.9, delay: 0.08 },
              }
            : {
                opacity: { duration: 0.2 },
                y: { type: 'spring', stiffness: 180, damping: 18 },
                x: { duration: 0.42, delay: 0.2 },
                filter: { duration: 0.8, delay: 0.15 },
              }
        }
        className="pb-6 text-5xl font-bold text-[var(--color-text-main)] sm:text-6xl"
      >
        {didWin ? t('youDidIt') : t('oopsLost')}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.15 }}
      >
        <Button ref={playAgainButtonRef} onClick={onPlayAgain} size="lg">
          {t('playAgain')}
        </Button>
      </motion.div>

      {didWin && (
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 18,
            delay: 0.25,
          }}
        >
          <Scoreboard timeRemainingMs={timeRemaining} />
        </motion.div>
      )}
    </div>
  );
};
