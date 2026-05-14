import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsStore } from '../src/store/useSettingsStore';

const resetSettingsStore = () => {
  useSettingsStore.setState({
    isColorBlindModeEnabled: false,
    isMuted: false,
    isCardLabelEnabled: true,
    isVisualFeedbackEnabled: true,
  });
};

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsStore();
  });

  it('starts with accessible visual defaults enabled', () => {
    expect(useSettingsStore.getState().isCardLabelEnabled).toBe(true);
    expect(useSettingsStore.getState().isVisualFeedbackEnabled).toBe(true);
    expect(useSettingsStore.getState().isColorBlindModeEnabled).toBe(false);
    expect(useSettingsStore.getState().isMuted).toBe(false);
  });

  it('updates each persisted preference independently', () => {
    useSettingsStore.getState().toggleColorBlindMode();
    useSettingsStore.getState().toggleCardLabels();
    useSettingsStore.getState().toggleVisualFeedback();
    useSettingsStore.getState().toggleMute();

    expect(useSettingsStore.getState().isColorBlindModeEnabled).toBe(true);
    expect(useSettingsStore.getState().isCardLabelEnabled).toBe(false);
    expect(useSettingsStore.getState().isVisualFeedbackEnabled).toBe(false);
    expect(useSettingsStore.getState().isMuted).toBe(true);

    useSettingsStore.getState().setMuted(false);

    expect(useSettingsStore.getState().isMuted).toBe(false);
  });
});
