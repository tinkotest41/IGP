import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatCurrency } from '../../lib/utils';
import { Task } from '../../types';
import { Instagram, Twitter, Youtube, Video } from 'lucide-react';
interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}
export function TaskCard({
  task,
  onClick
}: TaskCardProps) {
  const {
    currency
  } = useCurrency();
  const getIcon = () => {
    switch (task.platform) {
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'tiktok':
        return <Video className="h-6 w-6 text-cyan-400" />;
      // Using Video as TikTok proxy
      case 'twitter':
        return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'youtube':
        return <Youtube className="h-6 w-6 text-red-500" />;
    }
  };
  return <Card hover className="cursor-pointer group" onClick={() => onClick(task)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
          {getIcon()}
        </div>
        <Badge variant={task.status === 'completed' ? 'success' : 'default'}>
          {task.status}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-zinc-100 mb-1 line-clamp-1">
        {task.title}
      </h3>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {task.instructions}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
        <span className="text-lg font-bold text-amber-500">
          {formatCurrency(task.reward, currency.code, currency.rate)}
        </span>
        <Button size="sm" variant="secondary" className="group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500">
          Start Task
        </Button>
      </div>
    </Card>;
}