import { Button } from "./Button";
import { useTranslation } from "../../store/useI18nStore";

type ScoreboardButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  variant?: "control" | "button";
  className?: string;
};

export const ScoreboardButton = ({
  isOpen,
  onClick,
  variant = "control",
  className = "",
}: ScoreboardButtonProps) => {
  const { t } = useTranslation();

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className={className}
        aria-expanded={isOpen}
        onClick={onClick}
      >
        {t("viewScoreboard")}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={t("scoreboardTitle")}
      onClick={onClick}
      className="inline-flex h-12 w-auto px-4 items-center justify-center gap-2 rounded-full bg-[var(--color-surface)] text-sm font-bold text-[var(--color-text-main)] shadow-[var(--shadow-control)] ring-2 ring-[var(--color-surface-ring)] transition duration-200 hover:scale-105 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      </svg>
      <span className="hidden sm:inline">Rank</span>
    </button>
  );
};
