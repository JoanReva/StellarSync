import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScreenWrapper } from './components/Common/ScreenWrapper';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

type ScreenState = 'START' | 'GAME' | 'RESOLVE';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('START');

  return (
    <ErrorBoundary>
      {/* mode="wait" asegura que la pantalla actual haga el fade-out antes de que la otra inicie sus animaciones */}
      <AnimatePresence mode="wait">
        {currentScreen === 'START' && (
          <ScreenWrapper id="start-wrapper">
            START SCREEN
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