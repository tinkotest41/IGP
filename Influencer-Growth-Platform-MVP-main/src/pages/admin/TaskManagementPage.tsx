import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDataStore, AssignedTask } from '../../contexts/DataStore';
import { MembershipLevel, TaskPlatform, MEMBERSHIP_TIERS } from '../../types';
import { Plus, Check, X, Search, Instagram, Video, Youtube, Twitter, Send, Facebook, MessageCircle, Smartphone, Sparkles, List, Users, User } from 'lucide-react';

const PLATFORMS: { id: TaskPlatform; name: string; icon: React.ReactNode }[] = [
  { id: 'tiktok', name: 'TikTok', icon: <Video className="w-4 h-4 text-cyan-400" /> },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4 text-red-500" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4 text-blue-400" /> },
  { id: 'snapchat', name: 'Snapchat', icon: <Smartphone className="w-4 h-4 text-yellow-400" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4 text-blue-600" /> },
  { id: 'telegram', name: 'Telegram', icon: <Send className="w-4 h-4 text-sky-400" /> },
  { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="w-4 h-4 text-green-500" /> },
  { id: 'custom', name: 'Custom', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
];

export function TaskManagementPage() {
  const { formatAmount } = useCurrency();
  const { getAllUsers, updateUser, adjustUserBalance, addTask, getAllTasks } = useDataStore();
  
  const users = getAllUsers().filter(u => u.role !== 'admin');
  const allTasks = getAllTasks();
  const [targetType, setTargetType] = useState<'all' | 'level' | 'user'>('all');
  const [selectedLevel, setSelectedLevel] = useState<MembershipLevel>(1);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'verify' | 'history'>('create');

  const [platform, setPlatform] = useState<TaskPlatform>('tiktok');
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [link, setLink] = useState('');
  const [instructions, setInstructions] = useState('');
  const [customPlatformName, setCustomPlatformName] = useState('');

  const allPendingSubmissions = users.flatMap(user => 
    user.assignedTasks
      .filter(t => t.status === 'submitted')
      .map(task => ({ task, user }))
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reward) return;

    const task: AssignedTask = {
      id: `TASK-${Date.now()}`,
      platform,
      title: platform === 'custom' && customPlatformName ? `[${customPlatformName}] ${title}` : title,
      reward: parseFloat(reward),
      link,
      instructions,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      isBroadcast: targetType !== 'user',
      isCustom: platform === 'custom',
      targetLevel: targetType === 'level' ? selectedLevel : undefined,
      targetUserId: targetType === 'user' ? selectedUserId : undefined
    };

    if (targetType === 'user' && selectedUserId) {
      addTask(task, selectedUserId);
    } else if (targetType === 'level') {
      addTask(task, undefined, selectedLevel);
    } else {
      addTask(task);
    }

    setTitle('');
    setReward('');
    setLink('');
    setInstructions('');
    setSelectedUserId('');
    setUserSearchQuery('');
    setCustomPlatformName('');
  };

  const handleVerify = (userId: string, taskId: string, action: 'approve' | 'reject') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const task = user.assignedTasks.find(t => t.id === taskId);
    if (!task) return;

    if (action === 'approve') {
      updateUser(userId, {
        assignedTasks: user.assignedTasks.map(t =>
          t.id === taskId ? { ...t, status: 'completed' as const } : t
        )
      });
      adjustUserBalance(userId, task.reward, 'add', 'task');
    } else {
      updateUser(userId, {
        assignedTasks: user.assignedTasks.map(t =>
          t.id === taskId ? { ...t, status: 'rejected' as const } : t
        )
      });
    }
  };

  const getPlatformIcon = (p: string) => {
    const platform = PLATFORMS.find(pl => pl.id === p);
    return platform?.icon || <Sparkles className="w-4 h-4 text-purple-400" />;
  };

  const getTargetInfo = (task: AssignedTask) => {
    if (task.targetUserId) {
      const user = users.find(u => u.id === task.targetUserId);
      return { type: 'user', label: user?.name || 'Unknown User' };
    }
    if (task.targetLevel) {
      const tier = MEMBERSHIP_TIERS.find(t => t.level === task.targetLevel);
      return { type: 'level', label: `${tier?.name || 'Level ' + task.targetLevel} Users` };
    }
    return { type: 'all', label: 'All Users' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Management</h1>
            <p className="text-zinc-400">Create, assign, and verify user task submissions</p>
          </div>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            {[
              { id: 'create', label: 'Create Task', icon: <Plus className="w-4 h-4" /> },
              { id: 'verify', label: `Verify (${allPendingSubmissions.length})`, icon: <Check className="w-4 h-4" /> },
              { id: 'history', label: 'All Tasks', icon: <List className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-amber-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-white">Create New Task</h2>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${platform === p.id ? 'bg-zinc-800 border-amber-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                      >
                        {p.icon}
                        <span className="text-xs">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {platform === 'custom' && (
                  <Input 
                    label="Custom Platform Name" 
                    placeholder="e.g. Discord, Reddit, LinkedIn..." 
                    value={customPlatformName} 
                    onChange={e => setCustomPlatformName(e.target.value)} 
                  />
                )}

                <Input label="Task Title" placeholder="e.g. Follow @brandname" value={title} onChange={e => setTitle(e.target.value)} required />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Reward ($)" type="number" step="0.01" placeholder="0.50" value={reward} onChange={e => setReward(e.target.value)} required />
                  <div>
                    <label className="text-sm text-zinc-400 mb-1 block">Target Audience</label>
                    <select
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      value={targetType}
                      onChange={e => setTargetType(e.target.value as any)}
                    >
                      <option value="all">All Users</option>
                      <option value="level">Specific Level</option>
                      <option value="user">Specific User</option>
                    </select>
                  </div>
                </div>

                {targetType === 'level' && (
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <label className="text-sm text-zinc-400 mb-2 block">Select Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {MEMBERSHIP_TIERS.map(tier => (
                        <button
                          key={tier.level}
                          type="button"
                          onClick={() => setSelectedLevel(tier.level as MembershipLevel)}
                          className={`py-2 rounded border transition-colors text-sm ${selectedLevel === tier.level ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
                        >
                          {tier.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {targetType === 'user' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-9 w-4 h-4 text-zinc-500" />
                      <Input
                        label="Search User"
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                    {userSearchQuery && (
                      <div className="max-h-40 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-lg">
                        {filteredUsers.length === 0 ? (
                          <p className="p-3 text-zinc-500 text-sm">No users found</p>
                        ) : (
                          filteredUsers.slice(0, 5).map(user => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setUserSearchQuery(user.name);
                              }}
                              className={`w-full p-3 text-left hover:bg-zinc-800 transition-colors ${selectedUserId === user.id ? 'bg-zinc-800' : ''}`}
                            >
                              <p className="text-white text-sm">{user.name}</p>
                              <p className="text-zinc-500 text-xs">{user.email} • Level {user.level}</p>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Input label="Task Link" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} required />

                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Instructions</label>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                    placeholder="Describe exactly what the user needs to do..."
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  Publish Task
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Task Assignment Preview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    {targetType === 'all' && <Users className="w-5 h-5 text-emerald-500" />}
                    {targetType === 'level' && <Sparkles className="w-5 h-5 text-amber-500" />}
                    {targetType === 'user' && <User className="w-5 h-5 text-blue-500" />}
                    <span className="font-medium text-white">
                      {targetType === 'all' && 'Broadcast to All Users'}
                      {targetType === 'level' && `${MEMBERSHIP_TIERS.find(t => t.level === selectedLevel)?.name} Level Only`}
                      {targetType === 'user' && (selectedUserId ? `Assigned to: ${users.find(u => u.id === selectedUserId)?.name || 'Select user'}` : 'Select a user')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {targetType === 'all' && `This task will be visible to all ${users.length} users`}
                    {targetType === 'level' && `This task will be visible to ${users.filter(u => u.level === selectedLevel).length} users at this level`}
                    {targetType === 'user' && 'This task will only be visible to the selected user'}
                  </p>
                </div>

                {title && (
                  <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      {getPlatformIcon(platform)}
                      <span className="font-medium text-white">{platform === 'custom' && customPlatformName ? `[${customPlatformName}] ${title}` : title}</span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{instructions || 'No instructions yet...'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-500 font-bold">{reward ? formatAmount(parseFloat(reward)) : '$0.00'}</span>
                      <Badge variant="warning">Preview</Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Verification Queue</h2>
              <Badge variant="warning">{allPendingSubmissions.length} Pending</Badge>
            </div>

            {allPendingSubmissions.length === 0 ? (
              <Card className="text-center py-12">
                <Check className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No pending submissions</p>
                <p className="text-zinc-600 text-sm mt-1">Submissions will appear here when users complete tasks</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPendingSubmissions.map(({ task, user }) => (
                  <Card key={`${user.id}-${task.id}`} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(task.platform)}
                        <div>
                          <span className="font-medium text-white">{user.name}</span>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-emerald-500 font-bold">{formatAmount(task.reward)}</span>
                    </div>
                    
                    <p className="text-sm text-zinc-300 mb-2">{task.title}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                      <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                        Handle: @{task.submittedHandle}
                      </span>
                      <span>{task.submittedAt}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleVerify(user.id, task.id, 'approve')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleVerify(user.id, task.id, 'reject')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">All Created Tasks</h2>
              <Badge variant="default">{allTasks.length} Total</Badge>
            </div>

            <Card className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                        No tasks created yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    allTasks.map(task => {
                      const targetInfo = getTargetInfo(task);
                      return (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="font-medium text-zinc-200">{task.title}</div>
                            <div className="text-xs text-zinc-500 truncate max-w-[200px]">{task.link}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(task.platform)}
                              <span className="text-zinc-300 capitalize">{task.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-emerald-500 font-medium">
                            {formatAmount(task.reward)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {targetInfo.type === 'all' && <Users className="w-4 h-4 text-emerald-500" />}
                              {targetInfo.type === 'level' && <Sparkles className="w-4 h-4 text-amber-500" />}
                              {targetInfo.type === 'user' && <User className="w-4 h-4 text-blue-500" />}
                              <span className="text-zinc-300">{targetInfo.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-500">{task.createdAt}</TableCell>
                          <TableCell>
                            {task.isCustom ? (
                              <Badge variant="warning">Custom</Badge>
                            ) : task.isBroadcast ? (
                              <Badge variant="success">Broadcast</Badge>
                            ) : (
                              <Badge variant="default">Direct</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
