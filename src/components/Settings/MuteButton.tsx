import soundOffUrl from '../../assets/sound--off.svg';
import soundOnUrl from '../../assets/sound--on.svg';
import { useSettingsStore } from '../../store/useSettingsStore';

export const MuteButton = () => {
  const isMuted = useSettingsStore((state) => state.isMuted);
  const toggleMute = useSettingsStore((state) => state.toggleMute);

  return (
    <button
      type="button"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={isMuted}
      onClick={toggleMute}
      className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-text-main)] shadow-xl ring-2 ring-white/70 transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2 sm:right-5 sm:top-5"
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
