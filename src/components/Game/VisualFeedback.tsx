import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';

export const VisualFeedback = () => {
  const feedback = useGameStore((state) => state.feedback);
  const isVisualFeedbackEnabled = useSettingsStore(
    (state) => state.isVisualFeedbackEnabled,
  );

  if (!feedback || !isVisualFeedbackEnabled) {
    return null;
  }

  const color =
    feedback.type === 'match'
      ? 'var(--color-visual-match)'
      : 'var(--color-visual-mismatch)';

  return (
    <AnimatePresence>
      <motion.div
        key={feedback.type}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.55, 0.2] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow: `inset 0 0 0 14px ${color}, inset 0 0 72px ${color}`,
        }}
      />
    </AnimatePresence>
  );
};
