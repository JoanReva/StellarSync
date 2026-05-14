import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type ModalProps = {
  accentColor?: string;
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  labelledBy: string;
  onClose?: () => void;
  shouldCloseOnDialogPointerDown?: boolean;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const Modal = ({
  accentColor,
  isOpen,
  children,
  className = '',
  labelledBy,
  onClose,
  shouldCloseOnDialogPointerDown = true,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    dialogRef.current?.focus();

    return () => {
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  const handlePointerDown = () => {
    onClose?.();
  };

  const handleDialogPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (shouldCloseOnDialogPointerDown) {
      onClose?.();
      return;
    }

    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-modal-overlay)] px-4"
      onPointerDown={handlePointerDown}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onKeyDown={handleKeyDown}
        onPointerDown={handleDialogPointerDown}
        className={`w-full max-w-sm rounded-2xl bg-[var(--color-modal-bg)] px-6 py-7 text-center shadow-[var(--shadow-modal)] outline-none ring-1 ring-[var(--color-modal-ring)] ${className}`}
        style={{
          boxShadow: accentColor
            ? `var(--shadow-modal-base), 0 0 0 3px ${accentColor}, inset 0 0 18px ${accentColor}`
            : undefined,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
