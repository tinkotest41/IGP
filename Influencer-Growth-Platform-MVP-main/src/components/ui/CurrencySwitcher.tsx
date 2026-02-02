import React, { useEffect, useState, useRef } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ChevronDown } from 'lucide-react';
export function CurrencySwitcher() {
  const {
    currency,
    setCurrency,
    availableCurrencies
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors">
        <span>{currency.code}</span>
        <span className="text-zinc-500">|</span>
        <span>{currency.symbol}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
          {availableCurrencies.map(c => <button key={c.code} onClick={() => {
        setCurrency(c.code);
        setIsOpen(false);
      }} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${currency.code === c.code ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}>
              <span>{c.code}</span>
              <span className="opacity-50">{c.symbol}</span>
            </button>)}
        </div>}
    </div>;
}