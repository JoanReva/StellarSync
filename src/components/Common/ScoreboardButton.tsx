import { Button } from './Button';
import { useTranslation } from '../../store/useI18nStore';

type ScoreboardButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  variant?: 'control' | 'button';
};

export const ScoreboardButton = ({
  isOpen,
  onClick,
  variant = 'control',
}: ScoreboardButtonProps) => {
  const { t } = useTranslation();

  if (variant === 'button') {
    return (
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="min-w-44"
        aria-expanded={isOpen}
        onClick={onClick}
      >
        {t('viewScoreboard')}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={t('scoreboardTitle')}
      onClick={onClick}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-lg font-bold text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      #
    </button>
  );
};
