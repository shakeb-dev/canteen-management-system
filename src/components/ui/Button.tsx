import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const playHoverSound = () => {};
export const playClickSound = () => {};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    fullWidth,
    children,
    onMouseEnter,
    onClick,
    ...props
  }, ref) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    );

    const variants = {
      primary: cn(
        'bg-primary text-white',
        'hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20',
        'focus:ring-primary',
        'shadow-sm'
      ),
      secondary: cn(
        'bg-[#c5a059] text-white',
        'hover:bg-[#a38345] hover:shadow-md',
        'focus:ring-[#c5a059]',
        'shadow-sm'
      ),
      success: cn(
        'bg-emerald-600 text-white',
        'hover:bg-emerald-700 hover:shadow-md',
        'focus:ring-emerald-500',
        'shadow-sm'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700 hover:shadow-md',
        'focus:ring-red-500',
        'shadow-sm'
      ),
      ghost: cn(
        'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        'focus:ring-muted',
        'shadow-none'
      ),
    };

    const sizes = {
      sm: cn(
        'h-8 min-w-[32px] px-3 text-sm rounded-lg',
        'gap-1.5'
      ),
      md: cn(
        'h-10 min-w-[40px] px-4 text-sm rounded-lg',
        'gap-1.5'
      ),
      lg: cn(
        'h-11 min-w-[44px] px-5 text-sm rounded-lg',
        'gap-2'
      ),
    };

    const loadingStyles = isLoading && cn(
      'pointer-events-none',
      'before:absolute before:inset-0 before:bg-white/20 before:animate-pulse',
      'after:absolute after:top-1/2 after:left-1/2',
      'after:mt-[-0.5rem] after:ml-[-0.5rem]',
      'after:w-4 after:h-4 after:border-2 after:border-white',
      'after:border-t-transparent after:rounded-full',
      'after:animate-spin'
    );

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseEnter?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loadingStyles,
          className
        )}
        {...props}
      >
        <span className={cn(
          'relative z-10 flex items-center justify-center gap-2',
          isLoading && 'opacity-0'
        )}>
          {children}
        </span>
      </button>
    );
  }
);




