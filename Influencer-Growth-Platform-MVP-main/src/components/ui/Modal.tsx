import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={onClose} />
      <div className={cn('relative w-full max-w-lg max-h-[90vh] flex flex-col transform rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl transition-all animate-in zoom-in-95 duration-200', className)}>
        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-6 flex-shrink-0">
          {title && <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>}
          <button onClick={onClose} className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>;
}