import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  ariaLabel = 'Diálogo',
  className,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={cn(
        'fixed inset-0 z-50 bg-[#140D0A]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200',
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={contentRef}
        className="w-full max-w-[460px] bg-[#241612] border border-[#38220F] rounded-2xl relative shadow-2xl flex flex-col overflow-hidden font-mono text-[#CFB28C] animate-in zoom-in-95 duration-200"
      >
        {children}
      </div>
    </div>
  );
};

export const DialogCloseButton: React.FC<{ onClick: () => void; ariaLabel?: string }> = ({
  onClick,
  ariaLabel = 'Fechar diálogo',
}) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute top-5 right-5 text-[#CFB28C]/60 hover:text-[#E89B55] transition-colors p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D28A4C] rounded"
    aria-label={ariaLabel}
  >
    <X className="w-4 h-4" />
  </button>
);

