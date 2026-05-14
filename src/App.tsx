import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScreenWrapper } from './components/Common/ScreenWrapper';
import { StartScreen } from './components/Screens/StartScreen';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { GameScreen } from './components/Screens/GameScreen';
import { ResolveScreen } from './components/Screens/ResolveScreen';
import { ReloadConfirmationModal } from './components/Game/ReloadConfirmationModal';
import { usePreventPageUnload } from './hooks/usePreventPageUnload';
import { useGameStore } from './store/useGameStore';
import { useSettingsStore } from './store/useSettingsStore';

type ScreenState = 'START' | 'GAME' | 'RESOLVE';
type PendingLeaveAction = 'back' | 'reload';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('START');
  const [pendingLeaveAction, setPendingLeaveAction] =
    useState<PendingLeaveAction | null>(null);
  const isBrowserLeaveConfirmedRef = useRef(false);
  const startGame = useGameStore((state) => state.startGame);
  const feedback = useGameStore((state) => state.feedback);
  const pauseTimer = useGameStore((state) => state.pauseTimer);
  const resumeTimer = useGameStore((state) => state.resumeTimer);
  const status = useGameStore((state) => state.status);
  const isColorBlindModeEnabled = useSettingsStore(
    (state) => state.isColorBlindModeEnabled,
  );

  const isGameInProgress = status === 'playing';

  usePreventPageUnload(isGameInProgress, {
    shouldBypass: () => isBrowserLeaveConfirmedRef.current,
  });

  useEffect(() => {
    document.documentElement.dataset.colorMode = isColorBlindModeEnabled
      ? 'colorblind'
      : 'default';
  }, [isColorBlindModeEnabled]);

  const openLeaveConfirmation = useCallback(
    (action: PendingLeaveAction) => {
      pauseTimer();
      setPendingLeaveAction(action);
    },
    [pauseTimer],
  );

  useEffect(() => {
    if (!isGameInProgress) {
      return undefined;
    }

    const handleReloadShortcut = (event: KeyboardEvent) => {
      const isReloadShortcut =
        event.key === 'F5' ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r');

      if (!isReloadShortcut) {
        return;
      }

      event.preventDefault();
      openLeaveConfirmation('reload');
    };

    window.addEventListener('keydown', handleReloadShortcut);

    return () => {
      window.removeEventListener('keydown', handleReloadShortcut);
    };
  }, [isGameInProgress, openLeaveConfirmation]);

  useEffect(() => {
    if (pendingLeaveAction !== null && status === 'playing') {
      pauseTimer();
    }
  }, [feedback, pauseTimer, pendingLeaveAction, status]);

  useEffect(() => {
    if (!isGameInProgress) {
      return undefined;
    }

    window.history.pushState(
      { stellarSyncGameGuard: true },
      '',
      window.location.href,
    );

    const handleBrowserBack = () => {
      if (isBrowserLeaveConfirmedRef.current) {
        return;
      }

      window.history.pushState(
        { stellarSyncGameGuard: true },
        '',
        window.location.href,
      );
      openLeaveConfirmation('back');
    };

    window.addEventListener('popstate', handleBrowserBack);

    return () => {
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, [isGameInProgress, openLeaveConfirmation]);

  const handleStart = () => {
    isBrowserLeaveConfirmedRef.current = false;
    setPendingLeaveAction(null);
    startGame();
    setCurrentScreen('GAME');
  };

  const handlePlayAgain = () => {
    isBrowserLeaveConfirmedRef.current = false;
    setPendingLeaveAction(null);
    startGame();
    setCurrentScreen('GAME');
  };

  const handleCancelLeave = useCallback(() => {
    setPendingLeaveAction(null);

    if (status === 'playing' && !feedback) {
      resumeTimer();
    }
  }, [feedback, resumeTimer, status]);

  const handleConfirmLeave = useCallback(() => {
    isBrowserLeaveConfirmedRef.current = true;

    if (pendingLeaveAction === 'back') {
      window.history.go(-2);
      return;
    }

    window.location.reload();
  }, [pendingLeaveAction]);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {currentScreen === 'START' && (
          <ScreenWrapper id="start-wrapper">
            <StartScreen onStart={handleStart} />
          </ScreenWrapper>
        )}

        {currentScreen === 'GAME' && (
          <ScreenWrapper id="game-wrapper">
            <GameScreen onResolve={() => setCurrentScreen('RESOLVE')} />
          </ScreenWrapper>
        )}

        {currentScreen === 'RESOLVE' && (
          <ScreenWrapper id="resolve-wrapper">
            <ResolveScreen status={status} onPlayAgain={handlePlayAgain} />
          </ScreenWrapper>
        )}
      </AnimatePresence>
      <ReloadConfirmationModal
        action={pendingLeaveAction ?? 'reload'}
        isOpen={isGameInProgress && pendingLeaveAction !== null}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </ErrorBoundary>
  );
}

export default App;
