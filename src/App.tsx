import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScreenWrapper } from './components/Common/ScreenWrapper';
import { StartScreen } from './components/Screens/StartScreen';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

type ScreenState = 'START' | 'GAME' | 'RESOLVE';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('START');

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {currentScreen === 'START' && (
          <ScreenWrapper id="start-wrapper">
            <StartScreen onStart={() => setCurrentScreen('GAME')} />
          </ScreenWrapper>
        )}

        {currentScreen === 'GAME' && (
          <ScreenWrapper id="game-wrapper">
             SECOND SCREEN
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