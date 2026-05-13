import { useEffect } from 'react';
import { Board } from '../Game/Board';
import { FeedbackModal } from '../Game/FeedbackModal';
import { MuteButton } from '../Settings/MuteButton';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/useGameStore';

export const GameScreen = () => {
  const feedback = useGameStore((state) => state.feedback);
  const { isMuted, play, stop } = useAudio();

  useEffect(() => {
    if (isMuted) {
      stop('background');
      return undefined;
    }

    play('background');

    return () => {
      stop('background');
    };
  }, [isMuted, play, stop]);

  useEffect(() => {
    if (feedback?.type === 'match') {
      play('correct');
    }

    if (feedback?.type === 'mismatch') {
      play('incorrect');
    }
  }, [feedback, play]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-20 sm:py-24">
      <MuteButton />
      <Board />
      <FeedbackModal />
    </div>
  );
};
