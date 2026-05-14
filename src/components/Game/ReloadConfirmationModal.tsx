import { AnimatePresence } from 'framer-motion';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { useTranslation } from '../../store/useI18nStore';

type ReloadConfirmationModalProps = {
  action: 'back' | 'reload';
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ReloadConfirmationModal = ({
  action,
  isOpen,
  onCancel,
  onConfirm,
}: ReloadConfirmationModalProps) => {
  const { t } = useTranslation();
  
  const contentByAction = {
    back: {
      body: t('goBackBody'),
      confirmLabel: t('goBackLabel'),
    },
    reload: {
      body: t('reloadBody'),
      confirmLabel: t('reloadLabel'),
    },
  } as const;

  const content = contentByAction[action];

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen
          labelledBy="reload-confirmation-title"
          onClose={onCancel}
          shouldCloseOnDialogPointerDown={false}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <p
                id="reload-confirmation-title"
                className="text-2xl font-bold text-[var(--color-text-main)]"
              >
                {t('leaveMatch')}
              </p>
              <p className="text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                {content.body}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="secondary" onClick={onCancel}>
                {t('keepPlaying')}
              </Button>
              <Button type="button" variant="danger" onClick={onConfirm}>
                {content.confirmLabel}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};
