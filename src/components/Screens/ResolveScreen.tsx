import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Common/Button';
import { Confetti } from '../Game/Confetti';
import { useAudio } from '../../hooks/useAudio';
import type { GameStatus } from '../../store/useGameStore';

type ResolveScreenProps = {
  status: GameStatus;
  onPlayAgain: () => void;
};

export const ResolveScreen = ({ status, onPlayAgain }: ResolveScreenProps) => {
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);
  const didWin = status === 'won';
  const { play, stop } = useAudio();

  useEffect(() => {
    playAgainButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const soundName = didWin ? 'win' : 'lose';

    play(soundName);

    return () => {
      stop(soundName);
    };
  }, [didWin, play, stop]);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8 px-6 text-center">
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
                  'saturate(0.8) drop-shadow(0 0 0 rgba(250, 204, 21, 0))',
                  'saturate(1.5) drop-shadow(0 0 18px rgba(250, 204, 21, 0.75))',
                  'saturate(1.1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.35))',
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
        {didWin ? 'you did it' : "oops you didn't find them all"}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.15 }}
      >
        <Button ref={playAgainButtonRef} onClick={onPlayAgain} size="lg">
          Play again
        </Button>
      </motion.div>
    </div>
  );
};
