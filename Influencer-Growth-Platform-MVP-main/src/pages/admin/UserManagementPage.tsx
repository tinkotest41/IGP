import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Search, Download, Eye, Edit, ShieldCheck, Ban, Users, DollarSign, UserCheck } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDataStore, UserWithPassword } from '../../contexts/DataStore';
import { MembershipLevel, MEMBERSHIP_TIERS } from '../../types';

export function UserManagementPage() {
  const { formatAmount } = useCurrency();
  const { getAllUsers, approveKYC, rejectKYC, updateUserLevel, banUser, unbanUser, adjustUserBalance, updateUserReferralCount, updateUserReferralBonus, updateUserReferralEarnings } = useDataStore();
  
  const users = getAllUsers().filter(u => u.role !== 'admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBalanceModalOpen, setEditBalanceModalOpen] = useState(false);
  const [editReferralModalOpen, setEditReferralModalOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState<'add' | 'subtract'>('add');
  const [referralCount, setReferralCount] = useState('');
  const [referralBonus, setReferralBonus] = useState('');
  const [referralEarnings, setReferralEarnings] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || user.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleUserClick = (user: UserWithPassword) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleApproveKYC = () => {
    if (selectedUser) {
      approveKYC(selectedUser.id);
      refreshSelectedUser();
    }
  };

  const handleRejectKYC = () => {
    if (selectedUser) {
      rejectKYC(selectedUser.id);
      refreshSelectedUser();
    }
  };

  const handleUpdateLevel = (level: MembershipLevel) => {
    if (selectedUser) {
      updateUserLevel(selectedUser.id, level);
      refreshSelectedUser();
    }
  };

  const handleToggleBan = () => {
    if (selectedUser) {
      if (selectedUser.status === 'banned') {
        unbanUser(selectedUser.id);
      } else {
        banUser(selectedUser.id);
      }
      refreshSelectedUser();
    }
  };

  const handleEditBalance = (user: UserWithPassword) => {
    setSelectedUser(user);
    setEditBalanceModalOpen(true);
    setBalanceAmount('');
  };

  const handleEditReferral = (user: UserWithPassword) => {
    setSelectedUser(user);
    setEditReferralModalOpen(true);
    setReferralCount(user.referralCount.toString());
    setReferralBonus((user.referralBonusRate || MEMBERSHIP_TIERS.find(t => t.level === user.level)?.referralBonus || 5).toString());
    setReferralEarnings(user.referralEarnings.toString());
  };

  const handleBalanceUpdate = () => {
    if (!selectedUser || !balanceAmount) return;
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    adjustUserBalance(selectedUser.id, amount, balanceAction, 'admin');
    setEditBalanceModalOpen(false);
    setBalanceAmount('');
    refreshSelectedUser();
  };

  const handleReferralUpdate = () => {
    if (!selectedUser) return;
    
    const count = parseInt(referralCount);
    const bonus = parseFloat(referralBonus);
    const earnings = parseFloat(referralEarnings);
    
    if (!isNaN(count) && count >= 0) {
      updateUserReferralCount(selectedUser.id, count);
    }
    if (!isNaN(bonus) && bonus >= 0 && bonus <= 100) {
      updateUserReferralBonus(selectedUser.id, bonus);
    }
    if (!isNaN(earnings) && earnings >= 0) {
      updateUserReferralEarnings(selectedUser.id, earnings);
    }
    
    setEditReferralModalOpen(false);
    refreshSelectedUser();
  };

  const refreshSelectedUser = () => {
    if (selectedUser) {
      const updatedUser = getAllUsers().find(u => u.id === selectedUser.id);
      if (updatedUser) setSelectedUser(updatedUser);
    }
  };

  const getLevelColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'bg-zinc-500',
      2: 'bg-amber-700',
      3: 'bg-slate-400',
      4: 'bg-yellow-500',
      5: 'bg-cyan-500',
      6: 'bg-purple-500'
    };
    return colors[level] || 'bg-zinc-500';
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Level', 'Balance', 'Task Earnings', 'Referral Earnings', 'Referral Count', 'Status', 'KYC Status', 'Join Date', 'Referral Code', 'Referred By', 'Password'];
    const rows = users.map(u => [
      u.id, u.name, u.email, u.phone, u.country, u.level, u.totalBalance, u.taskEarnings, u.referralEarnings, u.referralCount, u.status, u.kycStatus, u.joinDate, u.referralCode, u.referredBy || '', u.password
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-zinc-400">View and manage all registered members ({users.length} total)</p>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500"
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">All Levels</option>
              {MEMBERSHIP_TIERS.map(tier => (
                <option key={tier.level} value={tier.level}>{tier.name}</option>
              ))}
            </select>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-zinc-400">Total Users</p>
                <p className="text-2xl font-bold text-blue-400">{users.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-sm text-zinc-400">Total Balances</p>
                <p className="text-2xl font-bold text-emerald-500">{formatAmount(users.reduce((sum, u) => sum + u.totalBalance, 0))}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-sm text-zinc-400">KYC Verified</p>
                <p className="text-2xl font-bold text-amber-500">{users.filter(u => u.kycVerified).length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <div className="flex items-center gap-3">
              <Ban className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-zinc-400">Banned Users</p>
                <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.status === 'banned').length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input placeholder="Search by name, email, phone, country, or user ID..." className="pl-10 bg-zinc-950 border-zinc-800" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-zinc-500">
                    {users.length === 0 ? 'No users registered yet.' : 'No users match your search.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => {
                  const tier = MEMBERSHIP_TIERS.find(t => t.level === user.level);
                  return (
                    <TableRow key={user.id} className="hover:bg-zinc-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-200">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-mono">{user.password}</code>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getLevelColor(user.level)} bg-opacity-20 border-current`}>
                          {tier?.name || `Level ${user.level}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-500">{formatAmount(user.totalBalance)}</TableCell>
                      <TableCell className="text-zinc-300">{user.referralCount}</TableCell>
                      <TableCell>
                        <Badge variant={user.kycStatus === 'approved' ? 'success' : user.kycStatus === 'pending' ? 'warning' : user.kycStatus === 'rejected' ? 'danger' : 'default'}>
                          {user.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500">{user.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button onClick={() => handleUserClick(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditBalance(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-emerald-500" title="Edit Balance">
                            <DollarSign className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditReferral(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-amber-500" title="Edit Referrals">
                            <Users className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
            <p>Showing {filteredUsers.length} of {users.length} users</p>
          </div>
        </Card>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`User Details: ${selectedUser?.name}`} className="max-w-4xl">
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">User ID</p>
                  <p className="font-mono text-zinc-200 text-xs truncate">{selectedUser.id}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Email</p>
                  <p className="text-zinc-200 text-sm truncate">{selectedUser.email}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Phone</p>
                  <p className="text-zinc-200">{selectedUser.phone}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Country</p>
                  <p className="text-zinc-200">{selectedUser.country}</p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Password</p>
                  <p className="font-mono text-red-400 text-sm font-semibold">{selectedUser.password}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Code</p>
                  <p className="font-mono text-amber-500 text-sm">{selectedUser.referralCode}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referred By</p>
                  <p className="text-zinc-200">{selectedUser.referredBy || 'None'}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Count</p>
                  <p className="text-zinc-200 font-bold">{selectedUser.referralCount}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Referral Bonus Rate</p>
                  <p className="text-amber-500 font-bold">{selectedUser.referralBonusRate || MEMBERSHIP_TIERS.find(t => t.level === selectedUser.level)?.referralBonus || 5}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-emerald-500">{formatAmount(selectedUser.totalBalance)}</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Task Earnings</p>
                  <p className="text-2xl font-bold text-blue-400">{formatAmount(selectedUser.taskEarnings)}</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Referral Earnings</p>
                  <p className="text-2xl font-bold text-purple-400">{formatAmount(selectedUser.referralEarnings)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-3">Membership Level</p>
                <div className="grid grid-cols-6 gap-2">
                  {MEMBERSHIP_TIERS.map(tier => (
                    <button
                      key={tier.level}
                      onClick={() => handleUpdateLevel(tier.level as MembershipLevel)}
                      className={`p-3 rounded-lg border transition-all ${selectedUser.level === tier.level ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700 text-zinc-400 hover:border-amber-500/50'}`}
                    >
                      <p className="font-medium text-sm">{tier.name}</p>
                      <p className="text-xs opacity-70">${tier.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                {selectedUser.kycStatus === 'pending' && (
                  <>
                    <Button onClick={handleApproveKYC} className="bg-emerald-600 hover:bg-emerald-700">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Approve KYC
                    </Button>
                    <Button onClick={handleRejectKYC} variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                      Reject KYC
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleToggleBan}
                  variant="outline"
                  className={selectedUser.status === 'banned' ? 'border-emerald-500/20 text-emerald-500' : 'border-red-500/20 text-red-500'}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  {selectedUser.status === 'banned' ? 'Unban User' : 'Ban User'}
                </Button>
                <Button onClick={() => handleEditBalance(selectedUser)} variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit Balance
                </Button>
                <Button onClick={() => handleEditReferral(selectedUser)} variant="outline" className="border-amber-500/50 text-amber-500">
                  <Users className="mr-2 h-4 w-4" /> Edit Referrals
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={editBalanceModalOpen} onClose={() => setEditBalanceModalOpen(false)} title="Edit User Balance">
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-400">Current Balance for {selectedUser.name}</p>
                <p className="text-2xl font-bold text-white">{formatAmount(selectedUser.totalBalance)}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setBalanceAction('add')} className={`flex-1 py-2 rounded-lg border transition-colors ${balanceAction === 'add' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  Add Funds
                </button>
                <button onClick={() => setBalanceAction('subtract')} className={`flex-1 py-2 rounded-lg border transition-colors ${balanceAction === 'subtract' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  Deduct Funds
                </button>
              </div>

              <Input label="Amount ($)" type="number" step="0.01" placeholder="0.00" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)} />

              <p className="text-xs text-zinc-500">
                New balance will be: {formatAmount(selectedUser.totalBalance + (balanceAction === 'add' ? parseFloat(balanceAmount) || 0 : -(parseFloat(balanceAmount) || 0)))}
              </p>

              <Button className="w-full" onClick={handleBalanceUpdate}>
                Update Balance
              </Button>
            </div>
          )}
        </Modal>

        <Modal isOpen={editReferralModalOpen} onClose={() => setEditReferralModalOpen(false)} title="Edit Referral Settings">
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-400">Editing referral settings for</p>
                <p className="text-lg font-bold text-white">{selectedUser.name}</p>
              </div>

              <Input 
                label="Referral Count" 
                type="number" 
                min="0"
                placeholder="0" 
                value={referralCount} 
                onChange={e => setReferralCount(e.target.value)} 
              />

              <Input 
                label="Referral Bonus Rate (%)" 
                type="number" 
                min="0"
                max="100"
                step="0.5"
                placeholder="5" 
                value={referralBonus} 
                onChange={e => setReferralBonus(e.target.value)} 
              />

              <Input 
                label="Referral Earnings ($)" 
                type="number" 
                min="0"
                step="0.01"
                placeholder="0.00" 
                value={referralEarnings} 
                onChange={e => setReferralEarnings(e.target.value)} 
              />

              <p className="text-xs text-zinc-500">
                Current referral earnings: {formatAmount(selectedUser.referralEarnings)}
              </p>
              <p className="text-xs text-zinc-500">
                Default bonus rate for {MEMBERSHIP_TIERS.find(t => t.level === selectedUser.level)?.name || 'this level'}: {MEMBERSHIP_TIERS.find(t => t.level === selectedUser.level)?.referralBonus || 5}%
              </p>

              <Button className="w-full" onClick={handleReferralUpdate}>
                Update Referral Settings
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
