import { useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../Common/Modal';
import { useGameStore } from '../../store/useGameStore';
import { FEEDBACK_MODAL_CONFIG } from '../../utils/constants';

const feedbackText = {
  match: "Nice! it's a match",
  mismatch: 'Sorry, but this is not a match',
} as const;

export const FeedbackModal = () => {
  const feedback = useGameStore((state) => state.feedback);
  const resolvePendingSelection = useGameStore(
    (state) => state.resolvePendingSelection,
  );
  const clearFeedback = useGameStore((state) => state.clearFeedback);

  const closeFeedback = useCallback(() => {
    resolvePendingSelection();
    clearFeedback();
  }, [clearFeedback, resolvePendingSelection]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      closeFeedback();
    }, FEEDBACK_MODAL_CONFIG.autoCloseMs);

    return () => window.clearTimeout(timeoutId);
  }, [closeFeedback, feedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <Modal
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
