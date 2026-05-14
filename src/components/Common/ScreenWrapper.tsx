import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScreenWrapperProps {
  children: ReactNode;
  id: string;
}

export const ScreenWrapper = ({ children, id }: ScreenWrapperProps) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[var(--color-screen-bg)]"
    >
      {children}
    </motion.div>
  );
};
