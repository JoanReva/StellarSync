import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

const ToggleRow = ({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) => {
  return (
    <label className="flex items-center justify-between gap-4 text-sm font-semibold text-[var(--color-text-main)]">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-5 w-5 accent-[var(--color-primary)]"
      />
    </label>
  );
};

export const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isColorBlindModeEnabled = useSettingsStore(
    (state) => state.isColorBlindModeEnabled,
  );
  const isVisualFeedbackEnabled = useSettingsStore(
    (state) => state.isVisualFeedbackEnabled,
  );
  const isCardLabelEnabled = useSettingsStore(
    (state) => state.isCardLabelEnabled,
  );
  const toggleColorBlindMode = useSettingsStore(
    (state) => state.toggleColorBlindMode,
  );
  const toggleCardLabels = useSettingsStore((state) => state.toggleCardLabels);
  const toggleVisualFeedback = useSettingsStore(
    (state) => state.toggleVisualFeedback,
  );

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-lg font-bold text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      >
        Aa
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[var(--color-surface)] p-4 text-left shadow-[var(--shadow-panel)] ring-1 ring-[var(--color-panel-ring)]">
          <div className="flex flex-col gap-4">
            <ToggleRow
              checked={isColorBlindModeEnabled}
              label="Color-safe mode"
              onToggle={toggleColorBlindMode}
            />
            <ToggleRow
              checked={isVisualFeedbackEnabled}
              label="Visual cues"
              onToggle={toggleVisualFeedback}
            />
            <ToggleRow
              checked={isCardLabelEnabled}
              label="Card labels"
              onToggle={toggleCardLabels}
            />
          </div>
        </div>
      )}
    </div>
  );
};
