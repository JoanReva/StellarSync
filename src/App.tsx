import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScreenWrapper } from './components/Common/ScreenWrapper';
import { StartScreen } from './components/Screens/StartScreen';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { GameScreen } from './components/Screens/GameScreen';
import { ResolveScreen } from './components/Screens/ResolveScreen';
import { useGameStore } from './store/useGameStore';
import { useSettingsStore } from './store/useSettingsStore';

type ScreenState = 'START' | 'GAME' | 'RESOLVE';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('START');
  const startGame = useGameStore((state) => state.startGame);
  const status = useGameStore((state) => state.status);
  const isColorBlindModeEnabled = useSettingsStore(
    (state) => state.isColorBlindModeEnabled,
  );

  useEffect(() => {
    document.documentElement.dataset.colorMode = isColorBlindModeEnabled
      ? 'colorblind'
      : 'default';
  }, [isColorBlindModeEnabled]);

  const handleStart = () => {
    startGame();
    setCurrentScreen('GAME');
  };

  const handlePlayAgain = () => {
    startGame();
    setCurrentScreen('GAME');
  };

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
    </ErrorBoundary>
  );
}

export default App;
