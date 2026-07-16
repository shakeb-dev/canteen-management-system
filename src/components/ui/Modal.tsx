import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  noPadding?: boolean;
}

const SIZE_CLASSES = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'sm',
  noPadding = false
}: ModalProps) {

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] p-4 overflow-y-auto">
      {/* Backdrop - Reduced blur and lighter overlay */}
      <div
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-[1px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Centering Container */}
      <div className="relative min-h-full flex items-center justify-center">
        {/* Modal - Sharp Borders & Elevation */}
        <div
          className={cn(
            "relative w-full",
            "bg-white dark:bg-slate-950",
            "rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
            "border border-slate-200 dark:border-slate-800",
            "transition-all duration-300 animate-in fade-in zoom-in-95",
            SIZE_CLASSES[size],
            className
          )}
        >
          {/* Header - Sharp & High Contrast */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                "text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100",
                "hover:bg-slate-200/50 dark:hover:bg-slate-800",
                "active:scale-95"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className={cn(
            !noPadding && "p-6",
            "max-h-[70vh] overflow-y-auto custom-scrollbar"
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}



