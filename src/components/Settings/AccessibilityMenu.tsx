import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from '../../store/useI18nStore';

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
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t('accessibilitySettings')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-12 w-auto px-4 items-center justify-center gap-2 rounded-full bg-[var(--color-surface)] text-sm font-bold text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="16" cy="4" r="1"></circle>
          <path d="m18 19 1-7-6 1"></path>
          <path d="m5 8 3-3 5.5 3-2.36 3.5"></path>
          <path d="M4.24 14.5a5 5 0 0 0 6.88 6"></path>
          <path d="M13.76 17.5a5 5 0 0 0-6.88-6"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[var(--color-surface)] p-4 text-left shadow-[var(--shadow-panel)] ring-1 ring-[var(--color-panel-ring)]">
          <div className="flex flex-col gap-4">
            <ToggleRow
              checked={isColorBlindModeEnabled}
              label={t('colorSafeMode')}
              onToggle={toggleColorBlindMode}
            />
            <ToggleRow
              checked={isVisualFeedbackEnabled}
              label={t('visualCues')}
              onToggle={toggleVisualFeedback}
            />
            <ToggleRow
              checked={isCardLabelEnabled}
              label={t('cardLabels')}
              onToggle={toggleCardLabels}
            />
          </div>
        </div>
      )}
    </div>
  );
};
