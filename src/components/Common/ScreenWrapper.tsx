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
      initial={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden"
    >
      {children}
    </motion.div>
  );
};