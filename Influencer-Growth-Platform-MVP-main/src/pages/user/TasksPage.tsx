import React, { useState } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore, AssignedTask } from '../../contexts/DataStore';
import { ExternalLink, CheckCircle, Video, Instagram, Youtube, Twitter } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

export function TasksPage() {
  const { formatAmount } = useCurrency();
  const { user, refreshUser } = useAuth();
  const { getUserById, updateUser } = useDataStore();
  
  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);
  const [handle, setHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) return null;

  const fullUser = getUserById(user.id);
  const userTasks = fullUser?.assignedTasks || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !handle || !fullUser) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateUser(user.id, {
      assignedTasks: fullUser.assignedTasks.map(t =>
        t.id === selectedTask.id
          ? { ...t, status: 'submitted' as const, submittedHandle: handle, submittedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    refreshUser();

    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTask(null);
      setHandle('');
    }, 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return <Video className="h-7 w-7 text-cyan-400" />;
      case 'instagram': return <Instagram className="h-7 w-7 text-pink-500" />;
      case 'youtube': return <Youtube className="h-7 w-7 text-red-500" />;
      case 'twitter': return <Twitter className="h-7 w-7 text-blue-400" />;
      default: return <Video className="h-7 w-7 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'submitted': return <Badge variant="outline" className="border-blue-500/20 text-blue-400">Submitted</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const pendingTasks = userTasks.filter(t => t.status === 'pending');
  const submittedTasks = userTasks.filter(t => t.status === 'submitted');
  const completedTasks = userTasks.filter(t => t.status === 'completed');
  const rejectedTasks = userTasks.filter(t => t.status === 'rejected');

  return (
    <UserLayout>
      <div className="space-y-6 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-white font-cyber">Your Tasks</h1>
          <p className="text-zinc-400">Complete tasks to earn rewards. Verification takes 24-48 hours.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-amber-500">{pendingTasks.length}</p>
            <p className="text-xs text-zinc-500">Pending</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-blue-400">{submittedTasks.length}</p>
            <p className="text-xs text-zinc-500">Submitted</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-emerald-500">{completedTasks.length}</p>
            <p className="text-xs text-zinc-500">Completed</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-red-500">{rejectedTasks.length}</p>
            <p className="text-xs text-zinc-500">Rejected</p>
          </Card>
        </div>

        {userTasks.length === 0 ? (
          <Card className="text-center py-16">
            <CheckCircle className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tasks Available</h3>
            <p className="text-zinc-400">Check back later - admin will assign tasks to you</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Pending Tasks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingTasks.map(task => (
                    <Card
                      key={task.id}
                      className="hover:border-amber-500/50 transition-all cursor-pointer group"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                          {getPlatformIcon(task.platform)}
                        </div>
                        {getStatusBadge(task.status)}
                      </div>

                      <h3 className="text-lg font-semibold text-zinc-100 mb-2 line-clamp-2">{task.title}</h3>
                      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{task.instructions}</p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                        <span className="text-xl font-bold text-amber-500">{formatAmount(task.reward)}</span>
                        <Button size="sm" className="group-hover:bg-amber-500 group-hover:text-black transition-colors">
                          Start Task
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {submittedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Awaiting Verification</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submittedTasks.map(task => (
                    <Card key={task.id} className="opacity-80">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-zinc-800">{getPlatformIcon(task.platform)}</div>
                        {getStatusBadge(task.status)}
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{task.title}</h3>
                      <p className="text-sm text-zinc-500">Handle: {task.submittedHandle}</p>
                      <p className="text-sm text-zinc-500">Submitted: {task.submittedAt}</p>
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <span className="text-xl font-bold text-amber-500">{formatAmount(task.reward)}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Completed Tasks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTasks.map(task => (
                    <Card key={task.id} className="border-emerald-500/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-zinc-800">{getPlatformIcon(task.platform)}</div>
                        {getStatusBadge(task.status)}
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{task.title}</h3>
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <span className="text-xl font-bold text-emerald-500">+{formatAmount(task.reward)}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Drawer isOpen={!!selectedTask && selectedTask.status === 'pending'} onClose={() => setSelectedTask(null)} title="Task Details">
        {selectedTask && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Reward</span>
                <span className="text-2xl font-bold text-amber-500">{formatAmount(selectedTask.reward)}</span>
              </div>
              <div className="h-px bg-zinc-700" />
              <div>
                <h4 className="text-sm font-medium text-zinc-200 mb-3">Instructions</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{selectedTask.instructions}</p>
              </div>
              {selectedTask.link && (
                <Button variant="outline" className="w-full" onClick={() => window.open(selectedTask.link, '_blank')}>
                  Open Task Link <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Submit Your Account Handle</label>
                <Input placeholder="@yourusername" value={handle} onChange={e => setHandle(e.target.value)} required />
                <p className="text-xs text-zinc-500 mt-2">Enter the username you used to complete this task so we can verify</p>
              </div>

              {isSuccess ? (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Task Submitted Successfully!</span>
                </div>
              ) : (
                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  Submit for Verification
                </Button>
              )}
            </form>

            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Note:</strong> After submission, our team will verify your completion within 24-48 hours. Once approved, the reward will be added to your balance automatically.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </UserLayout>
  );
}
