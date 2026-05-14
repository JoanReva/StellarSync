import { createJSONStorage } from 'zustand/middleware';

export const STORAGE_KEYS = {
  i18n: 'i18n-storage',
  settings: 'stellarsync-settings',
} as const;

export const createLocalJSONStorage = <T>() =>
  createJSONStorage<T>(() => localStorage);
