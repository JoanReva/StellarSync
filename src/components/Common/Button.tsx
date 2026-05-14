import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full shadow-[var(--shadow-control)] focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text)] focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-main)] focus:ring-[var(--color-bg-secondary-hover)]",
    danger: "bg-[var(--color-error)] hover:bg-[var(--color-error-hover)] text-[var(--color-primary-text)] focus:ring-[var(--color-error)]",
  };

  const sizes = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-12 py-4 text-xl md:text-2xl",
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!disabled ? { scale: 1.08 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
