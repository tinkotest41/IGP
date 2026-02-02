import React from 'react';
import { cn } from '../../lib/utils';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}
export function Card({
  className,
  hover,
  children,
  ...props
}: CardProps) {
  return <div className={cn('rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 shadow-xl', hover && 'transition-transform duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-amber-500/5', className)} {...props}>
      {children}
    </div>;
}