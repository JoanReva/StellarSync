import soundOffUrl from '../../assets/sound--off.svg';
import soundOnUrl from '../../assets/sound--on.svg';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from '../../store/useI18nStore';

export const MuteButton = () => {
  const isMuted = useSettingsStore((state) => state.isMuted);
  const toggleMute = useSettingsStore((state) => state.toggleMute);
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={isMuted ? t('unmuteSound') : t('muteSound')}
      aria-pressed={isMuted}
      onClick={toggleMute}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      <img
        src={isMuted ? soundOffUrl : soundOnUrl}
        alt=""
        aria-hidden="true"
        className="h-6 w-6"
      />
    </button>
  );
};
