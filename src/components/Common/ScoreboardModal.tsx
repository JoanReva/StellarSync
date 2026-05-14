import { Button } from './Button';
import { Modal } from './Modal';
import { Scoreboard } from '../Game/Scoreboard';
import { useTranslation } from '../../store/useI18nStore';

type ScoreboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ScoreboardModal = ({
  isOpen,
  onClose,
}: ScoreboardModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      className="max-w-2xl border border-[var(--color-scoreboard-ring)] bg-[var(--color-scoreboard-modal-bg)] px-4 py-4 text-left sm:px-5 sm:py-5"
      isOpen={isOpen}
      labelledBy="scoreboard-modal-title"
      onClose={onClose}
      shouldCloseOnDialogPointerDown={false}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-scoreboard-divider)] pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              {t('scoreboardEyebrow')}
            </p>
            <h2
              id="scoreboard-modal-title"
              className="text-2xl font-bold text-[var(--color-text-main)]"
            >
              {t('scoreboardTitle')}
            </h2>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            aria-label={t('closeScoreboard')}
            onClick={onClose}
            className="h-10 w-10 shrink-0 p-0 text-lg leading-none"
          >
            x
          </Button>
        </div>

        <Scoreboard />
      </div>
    </Modal>
  );
};
