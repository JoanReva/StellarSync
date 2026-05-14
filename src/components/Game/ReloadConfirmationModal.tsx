import { AnimatePresence } from 'framer-motion';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';

type ReloadConfirmationModalProps = {
  action: 'back' | 'reload';
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const contentByAction = {
  back: {
    body: 'Your current progress will be lost if you go back.',
    confirmLabel: 'Go back',
  },
  reload: {
    body: 'Your current progress will be lost if you reload the page.',
    confirmLabel: 'Reload',
  },
} as const;

export const ReloadConfirmationModal = ({
  action,
  isOpen,
  onCancel,
  onConfirm,
}: ReloadConfirmationModalProps) => {
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
                Leave this match?
              </p>
              <p className="text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                {content.body}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Keep playing
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
