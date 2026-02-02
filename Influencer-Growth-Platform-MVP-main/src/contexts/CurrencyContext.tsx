import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { Currency } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  availableCurrencies: Currency[];
  formatAmount: (amount: number) => string;
}

const defaultCurrencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'NGN', symbol: '₦', rate: 1550 },
  { code: 'GHS', symbol: 'GH₵', rate: 14.5 },
  { code: 'KES', symbol: 'KSh', rate: 153 },
  { code: 'ZAR', symbol: 'R', rate: 18.5 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'INR', symbol: '₹', rate: 83 },
  { code: 'PKR', symbol: 'Rs', rate: 278 },
  { code: 'BDT', symbol: '৳', rate: 110 },
  { code: 'PHP', symbol: '₱', rate: 56 },
  { code: 'AED', symbol: 'د.إ', rate: 3.67 },
  { code: 'CAD', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', rate: 1.53 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrencies[0]);

  const setCurrency = useCallback((code: string) => {
    const selected = defaultCurrencies.find(c => c.code === code);
    if (selected) {
      setCurrencyState(selected);
      localStorage.setItem('preferred_currency', code);
    }
  }, []);

  const formatAmount = useCallback((amount: number) => {
    const converted = amount * currency.rate;
    
    if (['NGN', 'KES', 'PKR', 'BDT', 'INR', 'PHP'].includes(currency.code)) {
      return `${currency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    
    return `${currency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  useEffect(() => {
    const saved = localStorage.getItem('preferred_currency');
    if (saved) {
      const selected = defaultCurrencies.find(c => c.code === saved);
      if (selected) setCurrencyState(selected);
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      availableCurrencies: defaultCurrencies,
      formatAmount
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export function formatCurrency(amount: number, code: string, rate: number): string {
  const currency = defaultCurrencies.find(c => c.code === code) || defaultCurrencies[0];
  const converted = amount * rate;
  
  if (['NGN', 'KES', 'PKR', 'BDT', 'INR', 'PHP'].includes(code)) {
    return `${currency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  return `${currency.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
