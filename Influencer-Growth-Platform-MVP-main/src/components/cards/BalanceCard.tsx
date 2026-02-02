import React from 'react';
import { Card } from '../ui/Card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
interface BalanceCardProps {
  title: string;
  amount: number;
  type?: 'total' | 'task' | 'referral';
}
export function BalanceCard({
  title,
  amount,
  type = 'total'
}: BalanceCardProps) {
  const {
    currency
  } = useCurrency();
  const getIcon = () => {
    switch (type) {
      case 'total':
        return <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <TrendingUp className="h-5 w-5" />
          </div>;
      case 'task':
        return <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ArrowUpRight className="h-5 w-5" />
          </div>;
      case 'referral':
        return <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
            <ArrowUpRight className="h-5 w-5" />
          </div>;
    }
  };
  return <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold text-zinc-100 mt-1">
            {formatCurrency(amount, currency.code, currency.rate)}
          </h3>
        </div>
        {getIcon()}
      </div>

      {/* Progress bar for visualization */}
      <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
        <div className={`h-1.5 rounded-full ${type === 'total' ? 'bg-amber-500' : type === 'task' ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{
        width: '70%'
      }} // Mock progress
      />
      </div>
    </Card>;
}