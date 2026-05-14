import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  isColorBlindModeEnabled: boolean;
  isMuted: boolean;
  isCardLabelEnabled: boolean;
  isVisualFeedbackEnabled: boolean;
};

type SettingsActions = {
  setMuted: (isMuted: boolean) => void;
  toggleColorBlindMode: () => void;
  toggleCardLabels: () => void;
  toggleMute: () => void;
  toggleVisualFeedback: () => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isColorBlindModeEnabled: false,
      isMuted: false,
      isCardLabelEnabled: true,
      isVisualFeedbackEnabled: true,
      setMuted: (isMuted) => set({ isMuted }),
      toggleColorBlindMode: () =>
        set((state) => ({
          isColorBlindModeEnabled: !state.isColorBlindModeEnabled,
        })),
      toggleCardLabels: () =>
        set((state) => ({
          isCardLabelEnabled: !state.isCardLabelEnabled,
        })),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      toggleVisualFeedback: () =>
        set((state) => ({
          isVisualFeedbackEnabled: !state.isVisualFeedbackEnabled,
        })),
    }),
    {
      name: 'stellarsync-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isColorBlindModeEnabled: state.isColorBlindModeEnabled,
        isCardLabelEnabled: state.isCardLabelEnabled,
        isMuted: state.isMuted,
        isVisualFeedbackEnabled: state.isVisualFeedbackEnabled,
      }),
    },
  ),
);
