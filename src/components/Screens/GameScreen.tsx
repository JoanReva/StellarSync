import { useEffect, useRef } from 'react';
import { Board } from '../Game/Board';
import { FeedbackModal } from '../Game/FeedbackModal';
import { Timer } from '../Game/Timer';
import { VisualFeedback } from '../Game/VisualFeedback';
import { SettingsControls } from '../Settings/SettingsControls';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/useGameStore';

type GameScreenProps = {
  onResolve: () => void;
};

const RESOLVE_SCREEN_DELAY_MS = 450;

export const GameScreen = ({ onResolve }: GameScreenProps) => {
  const playedResultSoundRef = useRef<string | null>(null);
  const feedback = useGameStore((state) => state.feedback);
  const status = useGameStore((state) => state.status);
  const { isMuted, play, stop } = useAudio();

  useEffect(() => {
    if (isMuted || status !== 'playing') {
      stop('background');
      return undefined;
    }

    play('background');

    return () => {
      stop('background');
    };
  }, [isMuted, play, status, stop]);

  useEffect(() => {
    if (feedback?.type === 'match') {
      play('correct');
    }

    if (feedback?.type === 'mismatch') {
      play('incorrect');
    }
  }, [feedback, play]);

  useEffect(() => {
    if (status !== 'won' && status !== 'lost') {
      playedResultSoundRef.current = null;
      return undefined;
    }

    if (playedResultSoundRef.current === status) {
      return undefined;
    }

    playedResultSoundRef.current = status;
    stop('ticking');
    play(status === 'won' ? 'win' : 'lose');

    return undefined;
  }, [play, status, stop]);

  useEffect(() => {
    if (status !== 'won' && status !== 'lost') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onResolve();
    }, RESOLVE_SCREEN_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [onResolve, status]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-20 sm:py-24">
      <Timer />
      <SettingsControls />
      <Board />
      <VisualFeedback />
      <FeedbackModal />
    </div>
  );
};
