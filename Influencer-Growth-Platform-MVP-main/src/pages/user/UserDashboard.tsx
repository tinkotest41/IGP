import { useEffect } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { BalanceCard } from '../../components/cards/BalanceCard';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDataStore } from '../../contexts/DataStore';
import { MEMBERSHIP_TIERS } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle, Video, Instagram, Youtube, Twitter, Send, Facebook, MessageCircle, Smartphone, Sparkles } from 'lucide-react';

export function UserDashboard() {
  const { user, refreshUser } = useAuth();
  const { formatAmount } = useCurrency();
  const { getUserById } = useDataStore();

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  const fullUser = getUserById(user.id);
  const userTasks = fullUser?.assignedTasks || [];
  const pendingTasks = userTasks.filter(t => t.status === 'pending');

  const withdrawalThreshold = 15;
  const progress = Math.min(user.totalBalance / withdrawalThreshold * 100, 100);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return <Video className="h-6 w-6 text-cyan-400" />;
      case 'instagram': return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'youtube': return <Youtube className="h-6 w-6 text-red-500" />;
      case 'twitter': return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'telegram': return <Send className="h-6 w-6 text-sky-400" />;
      case 'facebook': return <Facebook className="h-6 w-6 text-blue-600" />;
      case 'whatsapp': return <MessageCircle className="h-6 w-6 text-green-500" />;
      case 'snapchat': return <Smartphone className="h-6 w-6 text-yellow-400" />;
      default: return <Sparkles className="h-6 w-6 text-purple-400" />;
    }
  };

  const getLevelColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'from-zinc-400 to-zinc-600',
      2: 'from-amber-600 to-amber-800',
      3: 'from-slate-300 to-slate-500',
      4: 'from-yellow-400 to-yellow-600',
      5: 'from-cyan-400 to-cyan-600',
      6: 'from-purple-400 to-purple-600'
    };
    return colors[level] || 'from-zinc-400 to-zinc-600';
  };

  return (
    <UserLayout>
      <div className="space-y-8 animate-fade-in-up px-4 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-cyber">Welcome back, {user.name}!</h1>
            <p className="text-zinc-400">Here's your earnings overview</p>
          </div>
          <Link to="/tasks">
            <Button className="cyber-button">
              View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BalanceCard title="Total Balance" amount={user.totalBalance} type="total" />
          <BalanceCard title="Task Earnings" amount={user.taskEarnings} type="task" />
          <BalanceCard title="Referral Earnings" amount={user.referralEarnings} type="referral" />
        </div>

        <Card className="cyber-card bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Withdrawal Eligibility</h3>
              <p className="text-sm text-zinc-400">
                Reach {formatAmount(withdrawalThreshold)} and 5 referrals to withdraw
              </p>
            </div>
            <span className="text-3xl font-bold text-amber-500 font-cyber">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Current: {formatAmount(user.totalBalance)}</span>
            <span>Goal: {formatAmount(withdrawalThreshold)} + {user.referralCount}/5 refs</span>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Pending Tasks ({pendingTasks.length})</h2>
            <Link to="/tasks" className="text-sm text-amber-500 hover:text-amber-400 font-medium">
              View All
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <Card className="cyber-card text-center py-12">
              <CheckCircle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No pending tasks right now</p>
              <p className="text-sm text-zinc-600 mt-2">Check back later for new tasks from admin</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTasks.slice(0, 4).map((task, index) => (
                <Card key={task.id} className={`cyber-card hover:border-amber-500/50 transition-colors cursor-pointer stagger-${index + 1}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-zinc-800">
                      {getPlatformIcon(task.platform)}
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{task.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{task.instructions}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-500">
                      {formatAmount(task.reward)}
                    </span>
                    <Link to="/tasks">
                      <Button size="sm" className="cyber-button">Start Task</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Membership Levels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEMBERSHIP_TIERS.map((tier, index) => (
              <Card 
                key={tier.level} 
                className={`cyber-card relative stagger-${index + 1} ${
                  user.level === tier.level 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : user.level < tier.level 
                      ? 'opacity-60' 
                      : ''
                }`}
              >
                {user.level < tier.level && (
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                      <p className="text-sm text-zinc-400 font-medium">Upgrade to Unlock</p>
                    </div>
                  </div>
                )}

                {user.level === tier.level && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                    CURRENT
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${getLevelColor(tier.level)} mb-3`}>
                    <span className="text-xl font-bold text-white">{tier.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-cyber">{tier.name}</h3>
                  <p className="text-2xl font-bold text-amber-500">${tier.price}</p>
                  <p className="text-xs text-zinc-500 mt-1">{tier.taskReward} per task</p>
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
