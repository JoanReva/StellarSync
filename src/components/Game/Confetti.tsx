import { useEffect } from 'react';
import confetti from 'canvas-confetti';

type ConfettiProps = {
  isActive: boolean;
  variant?: 'win' | 'lose';
};

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const confettiColorVariables = {
  lose: '--confetti-lose-colors',
  win: '--confetti-win-colors',
} as const;

const getConfettiColors = (variant: 'win' | 'lose') => {
  return getCssVariable(confettiColorVariables[variant])
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);
};

export const Confetti = ({ isActive, variant = 'win' }: ConfettiProps) => {
  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    if (variant === 'lose') {
      const colors = getConfettiColors('lose');
      const intervalId = window.setInterval(() => {
        confetti({
          colors,
          disableForReducedMotion: true,
          particleCount: 22,
          spread: 44,
          startVelocity: 10,
          gravity: 0.52,
          scalar: 0.9,
          ticks: 210,
          origin: {
            x: Math.random(),
            y: -0.05,
          },
        });
      }, 160);

      const stopTimeoutId = window.setTimeout(() => {
        window.clearInterval(intervalId);
      }, 1800);

      confetti({
        colors,
        disableForReducedMotion: true,
        particleCount: 52,
        spread: 150,
        startVelocity: 18,
        gravity: 0.75,
        scalar: 0.8,
        ticks: 160,
        origin: { x: 0.5, y: 0.12 },
      });

      const sideDriftTimeoutId = window.setTimeout(() => {
        confetti({
          colors,
          disableForReducedMotion: true,
          particleCount: 42,
          angle: 90,
          spread: 95,
          startVelocity: 12,
          gravity: 0.65,
          scalar: 0.75,
          ticks: 180,
          origin: { x: 0.5, y: 0 },
        });
      }, 520);

      return () => {
        window.clearInterval(intervalId);
        window.clearTimeout(stopTimeoutId);
        window.clearTimeout(sideDriftTimeoutId);
      };
    }

    const colors = getConfettiColors('win');
    const defaults = {
      colors,
      disableForReducedMotion: true,
      scalar: 1.15,
      ticks: 260,
    };

    confetti({
      ...defaults,
      particleCount: 160,
      spread: 105,
      startVelocity: 58,
      origin: { x: 0.5, y: 0.35 },
    });

    confetti({
      ...defaults,
      particleCount: 70,
      angle: 60,
      spread: 75,
      startVelocity: 48,
      origin: { x: 0, y: 0.65 },
    });

    confetti({
      ...defaults,
      particleCount: 70,
      angle: 120,
      spread: 75,
      startVelocity: 48,
      origin: { x: 1, y: 0.65 },
    });

    confetti({
      ...defaults,
      particleCount: 70,
      spread: 360,
      startVelocity: 32,
      scalar: 1.7,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star', 'circle'],
    });

    const endTime = Date.now() + 1900;
    const intervalId = window.setInterval(() => {
      confetti({
        ...defaults,
        particleCount: 38,
        spread: 78,
        startVelocity: 36,
        decay: 0.91,
        origin: {
          x: 0.25 + Math.random() * 0.5,
          y: 0.18,
        },
      });

      if (Date.now() > endTime) {
        window.clearInterval(intervalId);
      }
    }, 180);

    const rainTimeoutId = window.setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 150,
        spread: 135,
        startVelocity: 20,
        gravity: 0.72,
        origin: { x: 0.5, y: 0 },
      });
    }, 700);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(rainTimeoutId);
    };
  }, [isActive, variant]);

  return null;
};
