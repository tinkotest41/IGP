import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  className
}: DrawerProps) {
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
  return <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      <div className={cn('relative h-full w-full max-w-md transform border-l border-zinc-800 bg-zinc-900 shadow-2xl transition-transform animate-in slide-in-from-right duration-300', className)}>
        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-6">
          {title && <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>}
          <button onClick={onClose} className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>;
}