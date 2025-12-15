import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary:
      'bg-[var(--accent-blue)] text-[var(--text-inverse)] hover:bg-[var(--accent-blue)] focus:ring-[var(--accent-blue)]',
    secondary:
      'bg-[var(--badge-bg)] text-[var(--text-primary)] hover:bg-[var(--bg-main)] focus:ring-[var(--border-subtle)]',
    outline:
      'border-2 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--badge-bg)] focus:ring-[var(--border-subtle)]',
    ghost:
      'text-[var(--text-secondary)] hover:bg-[var(--badge-bg)] focus:ring-[var(--border-subtle)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

