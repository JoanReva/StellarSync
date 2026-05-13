import { useCallback, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import backgroundUrl from '../assets/audio/background.mp3';
import correctUrl from '../assets/audio/correct.mp3';
import incorrectUrl from '../assets/audio/incorrect.mp3';
import loseUrl from '../assets/audio/lose.mp3';
import tickingUrl from '../assets/audio/ticking.mp3';
import winUrl from '../assets/audio/win.mp3';
import { useSettingsStore } from '../store/useSettingsStore';

export type SoundName =
  | 'background'
  | 'correct'
  | 'incorrect'
  | 'lose'
  | 'ticking'
  | 'win';

type SoundConfig = {
  src: string;
  volume: number;
  loop?: boolean;
};

const soundConfigs: Record<SoundName, SoundConfig> = {
  background: {
    src: backgroundUrl,
    volume: 0.3,
    loop: true,
  },
  correct: {
    src: correctUrl,
    volume: 1,
  },
  incorrect: {
    src: incorrectUrl,
    volume: 0.85,
  },
  lose: {
    src: loseUrl,
    volume: 0.9,
  },
  ticking: {
    src: tickingUrl,
    volume: 0.75,
    loop: true,
  },
  win: {
    src: winUrl,
    volume: 0.9,
  },
};

let sounds: Record<SoundName, Howl> | null = null;

const getSounds = () => {
  if (sounds) {
    return sounds;
  }

  sounds = Object.fromEntries(
    Object.entries(soundConfigs).map(([name, config]) => [
      name,
      new Howl({
        src: [config.src],
        volume: config.volume,
        loop: config.loop ?? false,
        preload: true,
        html5: true,
      }),
    ]),
  ) as Record<SoundName, Howl>;

  return sounds;
};

const isLoopingSound = (soundName: SoundName) => {
  return soundConfigs[soundName].loop === true;
};

export const useAudio = () => {
  const isMuted = useSettingsStore((state) => state.isMuted);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  const play = useCallback((soundName: SoundName) => {
    if (useSettingsStore.getState().isMuted) {
      return;
    }

    const sound = getSounds()[soundName];

    if (isLoopingSound(soundName) && sound.playing()) {
      return;
    }

    sound.play();
  }, []);

  const stop = useCallback((soundName: SoundName) => {
    getSounds()[soundName].stop();
  }, []);

  const stopAll = useCallback(() => {
    Object.values(getSounds()).forEach((sound) => sound.stop());
  }, []);

  return {
    isMuted,
    play,
    stop,
    stopAll,
  };
};
