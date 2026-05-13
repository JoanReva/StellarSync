import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScreenWrapper } from './components/Common/ScreenWrapper';
import { StartScreen } from './components/Screens/StartScreen';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { GameScreen } from './components/Screens/GameScreen';
import { useGameStore } from './store/useGameStore';

type ScreenState = 'START' | 'GAME' | 'RESOLVE';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('START');
  const startGame = useGameStore((state) => state.startGame);

  const handleStart = () => {
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
            <GameScreen />
          </ScreenWrapper>
        )}

        {currentScreen === 'RESOLVE' && (
          <ScreenWrapper id="resolve-wrapper">
            RESOLVE SCREEN
          </ScreenWrapper>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;
