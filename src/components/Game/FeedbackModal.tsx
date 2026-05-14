import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../Common/Modal';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { FEEDBACK_MODAL_CONFIG } from '../../utils/constants';

const feedbackText = {
  match: "nice! it's a match",
  mismatch: 'sorry, but this is not a match',
} as const;

export const FeedbackModal = () => {
  const hasClosedRef = useRef(false);
  const feedback = useGameStore((state) => state.feedback);
  const status = useGameStore((state) => state.status);
  const isVisualFeedbackEnabled = useSettingsStore(
    (state) => state.isVisualFeedbackEnabled,
  );
  const pauseTimer = useGameStore((state) => state.pauseTimer);
  const resumeTimer = useGameStore((state) => state.resumeTimer);
  const resolvePendingSelection = useGameStore(
    (state) => state.resolvePendingSelection,
  );
  const clearFeedback = useGameStore((state) => state.clearFeedback);
  const accentColor =
    isVisualFeedbackEnabled && feedback?.type === 'match'
      ? 'var(--color-modal-match-accent)'
      : isVisualFeedbackEnabled
        ? 'var(--color-modal-mismatch-accent)'
        : undefined;

  const closeFeedback = useCallback(() => {
    if (hasClosedRef.current) {
      return;
    }

    hasClosedRef.current = true;
    resolvePendingSelection();
    clearFeedback();
    if (status === 'playing') {
      resumeTimer();
    }
  }, [clearFeedback, resolvePendingSelection, resumeTimer, status]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    hasClosedRef.current = false;
    pauseTimer();

    const timeoutId = window.setTimeout(() => {
      closeFeedback();
    }, FEEDBACK_MODAL_CONFIG.autoCloseMs);

    return () => window.clearTimeout(timeoutId);
  }, [closeFeedback, feedback, pauseTimer]);

  return (
    <AnimatePresence>
      {feedback && (
        <Modal
          accentColor={accentColor}
          isOpen
          labelledBy="feedback-modal-title"
          onClose={closeFeedback}
        >
          <p
            id="feedback-modal-title"
            className="text-2xl font-bold text-[var(--color-text-main)]"
          >
            {feedbackText[feedback.type]}
          </p>
        </Modal>
      )}
    </AnimatePresence>
  );
};
