import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Common/Button';
import { useAudio } from '../../hooks/useAudio';
import { useTranslation } from '../../store/useI18nStore';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const { play } = useAudio();
  const { t } = useTranslation();

  useEffect(() => {
    startButtonRef.current?.focus();
  }, []);

  const handleStart = () => {
    play('start');
    onStart();
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-10 px-6">
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <img
          src="/logo.svg"
          alt={t('gameLogo')}
          className="h-auto max-h-40 w-48 object-contain md:max-h-48 md:w-52"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 2 } }}
      >
        <h1 className="pb-6 text-center text-7xl font-bold">
          {t('stellarSync')}
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 }}
      >
        <Button ref={startButtonRef} onClick={handleStart} size="lg">
          {t('start')}
        </Button>
      </motion.div>
    </div>
  );
};
