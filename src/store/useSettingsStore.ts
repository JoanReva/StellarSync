import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  isMuted: boolean;
};

type SettingsActions = {
  setMuted: (isMuted: boolean) => void;
  toggleMute: () => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isMuted: false,
      setMuted: (isMuted) => set({ isMuted }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: 'stellarsync-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isMuted: state.isMuted }),
    },
  ),
);
