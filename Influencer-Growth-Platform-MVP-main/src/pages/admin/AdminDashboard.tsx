import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Users, DollarSign, CheckSquare, TrendingUp, Search, Edit, Plus, Eye, ShieldCheck, Ban, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDataStore, UserWithPassword, AssignedTask } from '../../contexts/DataStore';
import { useAuth } from '../../contexts/AuthContext';
import { MembershipLevel } from '../../types';

export function AdminDashboard() {
  const { user: currentAdmin } = useAuth();
  const { formatAmount } = useCurrency();
  const { 
    getAllUsers, 
    updateUser, 
    adjustUserBalance, 
    approveKYC, 
    updateUserLevel,
    banUser,
    unbanUser,
    addTask 
  } = useDataStore();

  const users = getAllUsers();
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editBalanceModalOpen, setEditBalanceModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState<'add' | 'subtract'>('add');

  const [newTask, setNewTask] = useState({
    title: '',
    reward: '',
    platform: 'tiktok' as 'tiktok' | 'instagram' | 'youtube' | 'twitter',
    link: '',
    instructions: ''
  });

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + u.totalBalance, 0);
  const pendingTasks = users.reduce((sum, u) => sum + u.assignedTasks.filter(t => t.status === 'pending' || t.status === 'submitted').length, 0);
  const totalRevenue = totalBalance * 0.1;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user: UserWithPassword) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleEditBalance = (user: UserWithPassword) => {
    setSelectedUser(user);
    setEditBalanceModalOpen(true);
  };

  const handleBalanceUpdate = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    adjustUserBalance(selectedUser.id, amount, balanceAction, 'admin');
    setEditBalanceModalOpen(false);
    setBalanceAmount('');
    
    const updatedUser = getAllUsers().find(u => u.id === selectedUser.id);
    if (updatedUser) setSelectedUser(updatedUser);
  };

  const handleAssignTask = (user: UserWithPassword) => {
    setSelectedUser(user);
    setTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    if (!selectedUser || !newTask.title || !newTask.reward) return;
    
    const task: AssignedTask = {
      id: `T${Date.now()}`,
      title: newTask.title,
      reward: parseFloat(newTask.reward),
      platform: newTask.platform,
      link: newTask.link,
      instructions: newTask.instructions,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      targetUserId: selectedUser.id
    };
    
    addTask(task, selectedUser.id);
    setTaskModalOpen(false);
    setNewTask({ title: '', reward: '', platform: 'tiktok', link: '', instructions: '' });
  };

  const handleApproveTask = (userId: string, taskId: string) => {
    const user = users.find(u => u.id === userId);
    const task = user?.assignedTasks.find(t => t.id === taskId);
    if (task) {
      updateUser(userId, {
        assignedTasks: user!.assignedTasks.map(t =>
          t.id === taskId ? { ...t, status: 'completed' as const } : t
        )
      });
      adjustUserBalance(userId, task.reward, 'add', 'task');
    }
  };

  const handleRejectTask = (userId: string, taskId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, {
        assignedTasks: user.assignedTasks.map(t =>
          t.id === taskId ? { ...t, status: 'rejected' as const } : t
        )
      });
    }
  };

  const handleApproveKYC = (userId: string) => {
    approveKYC(userId);
    const updatedUser = getAllUsers().find(u => u.id === userId);
    if (updatedUser) setSelectedUser(updatedUser);
  };

  const handleUpdateLevel = (userId: string, level: MembershipLevel) => {
    updateUserLevel(userId, level);
    const updatedUser = getAllUsers().find(u => u.id === userId);
    if (updatedUser) setSelectedUser(updatedUser);
  };

  const handleToggleBan = (userId: string, currentStatus: string) => {
    if (currentStatus === 'banned') {
      unbanUser(userId);
    } else {
      banUser(userId);
    }
    const updatedUser = getAllUsers().find(u => u.id === userId);
    if (updatedUser) setSelectedUser(updatedUser);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-zinc-400">Complete overview and management center</p>
        </div>

        {/* Admin Profile Card */}
        {currentAdmin && (
          <Card className="bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 border-red-500/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentAdmin.name}</h2>
                    <p className="text-sm text-red-500 font-medium">Administrator</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-300">{currentAdmin.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-300">{currentAdmin.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-300">{currentAdmin.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-300">Since {currentAdmin.joinDate}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                Full Access
              </Badge>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-white">{totalUsers}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Payouts</p>
                <h3 className="text-3xl font-bold text-white">{formatAmount(totalBalance)}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-white">{pendingTasks}</h3>
                <p className="text-xs text-amber-500 mt-2">Needs review</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Revenue</p>
                <h3 className="text-3xl font-bold text-white">{formatAmount(totalRevenue)}</h3>
                <p className="text-xs text-purple-400 mt-2">Platform fees</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search users by name, email, or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <p className="text-sm text-zinc-400">View and manage all user accounts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">KYC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                      No users found. Users will appear here after they sign up.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                          <p className="text-xs text-zinc-600 font-mono">{user.referralCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-amber-500/20 text-amber-500">
                          Level {user.level}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-emerald-500">{formatAmount(user.totalBalance)}</p>
                        <p className="text-xs text-zinc-500">Task: {formatAmount(user.taskEarnings)}</p>
                        <p className="text-xs text-zinc-500">Ref: {formatAmount(user.referralEarnings)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{user.referralCount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Badge variant="success" className="text-xs">
                            {user.assignedTasks.filter(t => t.status === 'completed').length}
                          </Badge>
                          <Badge variant="warning" className="text-xs">
                            {user.assignedTasks.filter(t => t.status === 'pending' || t.status === 'submitted').length}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.kycVerified ? 'success' : 'warning'}>
                          {user.kycVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewUser(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditBalance(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Edit Balance">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleAssignTask(user)} className="p-2 hover:bg-zinc-800 rounded text-amber-400 hover:text-amber-300 transition-colors" title="Assign Task">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`User Details: ${selectedUser?.name}`} className="max-w-4xl">
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">User ID</p>
                  <p className="font-mono text-zinc-200 text-sm">{selectedUser.id}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Code</p>
                  <p className="font-mono text-amber-500">{selectedUser.referralCode}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Phone</p>
                  <p className="text-zinc-200">{selectedUser.phone}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Country</p>
                  <p className="text-zinc-200">{selectedUser.country}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Email</p>
                  <p className="text-zinc-200 text-sm">{selectedUser.email}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Join Date</p>
                  <p className="text-zinc-200">{selectedUser.joinDate}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referred By</p>
                  <p className="text-zinc-200">{selectedUser.referredBy || 'None'}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Count</p>
                  <p className="text-zinc-200">{selectedUser.referralCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-emerald-500">{formatAmount(selectedUser.totalBalance)}</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Task Earnings</p>
                  <p className="text-2xl font-bold text-blue-400">{formatAmount(selectedUser.taskEarnings)}</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Earnings</p>
                  <p className="text-2xl font-bold text-purple-400">{formatAmount(selectedUser.referralEarnings)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 mb-2">Change Level</p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(level => (
                      <button
                        key={level}
                        onClick={() => handleUpdateLevel(selectedUser.id, level as MembershipLevel)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${selectedUser.level === level ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700 text-zinc-400 hover:border-amber-500'}`}
                      >
                        Level {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 items-end">
                  {!selectedUser.kycVerified && (
                    <Button onClick={() => handleApproveKYC(selectedUser.id)} className="bg-emerald-600 hover:bg-emerald-700">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Approve KYC
                    </Button>
                  )}
                  <Button
                    onClick={() => handleToggleBan(selectedUser.id, selectedUser.status)}
                    variant="outline"
                    className={selectedUser.status === 'banned' ? 'border-emerald-500/20 text-emerald-500' : 'border-red-500/20 text-red-500'}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    {selectedUser.status === 'banned' ? 'Unban User' : 'Ban User'}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">Assigned Tasks ({selectedUser.assignedTasks.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUser.assignedTasks.length === 0 ? (
                    <p className="text-zinc-500 text-center py-4">No tasks assigned</p>
                  ) : (
                    selectedUser.assignedTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-zinc-200">{task.title}</p>
                          <p className="text-xs text-zinc-500">Handle: {task.submittedHandle || 'Not submitted'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-emerald-500">{formatAmount(task.reward)}</p>
                          <Badge variant={task.status === 'completed' ? 'success' : task.status === 'rejected' ? 'danger' : 'warning'}>
                            {task.status}
                          </Badge>
                          {task.status === 'submitted' && (
                            <div className="flex gap-1">
                              <Button size="sm" className="bg-emerald-600" onClick={() => handleApproveTask(selectedUser.id, task.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/20 text-red-500" onClick={() => handleRejectTask(selectedUser.id, task.id)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={editBalanceModalOpen} onClose={() => setEditBalanceModalOpen(false)} title="Edit User Balance">
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-400">Current Balance</p>
                <p className="text-2xl font-bold text-white">{formatAmount(selectedUser.totalBalance)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setBalanceAction('add')}
                  className={`flex-1 py-2 rounded-lg border transition-colors ${balanceAction === 'add' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                >
                  Add Funds
                </button>
                <button
                  onClick={() => setBalanceAction('subtract')}
                  className={`flex-1 py-2 rounded-lg border transition-colors ${balanceAction === 'subtract' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                >
                  Deduct Funds
                </button>
              </div>

              <Input label="Amount" type="number" step="0.01" placeholder="0.00" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)} />

              <Button className="w-full" onClick={handleBalanceUpdate}>
                Update Balance
              </Button>
            </div>
          )}
        </Modal>

        <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title={`Assign Task to ${selectedUser?.name}`}>
          <div className="space-y-4">
            <Input label="Task Title" placeholder="e.g., Follow @brand on TikTok" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Reward Amount ($)" type="number" step="0.01" placeholder="0.50" value={newTask.reward} onChange={e => setNewTask({ ...newTask, reward: e.target.value })} />
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Platform</label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                  value={newTask.platform}
                  onChange={e => setNewTask({ ...newTask, platform: e.target.value as any })}
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
            </div>

            <Input label="Task Link" placeholder="https://..." value={newTask.link} onChange={e => setNewTask({ ...newTask, link: e.target.value })} />

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Instructions</label>
              <textarea
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                placeholder="Describe what the user needs to do..."
                value={newTask.instructions}
                onChange={e => setNewTask({ ...newTask, instructions: e.target.value })}
              />
            </div>

            <Button className="w-full" onClick={handleCreateTask}>
              Assign Task
            </Button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
