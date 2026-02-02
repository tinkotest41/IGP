import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { User } from '../../types';
import { Phone, Mail, MapPin, Calendar, CheckCircle, XCircle, DollarSign, UserPlus, ShieldAlert, History } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
}
type Tab = 'profile' | 'referrals' | 'tasks' | 'actions';
export function UserDetailModal({
  isOpen,
  onClose,
  user,
  onUpdateUser
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const {
    formatAmount
  } = useCurrency();
  const [balanceAdjustment, setBalanceAdjustment] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  if (!user) return null;
  const handleVerifyKYC = () => {
    onUpdateUser(user.id, {
      kycVerified: true
    });
  };
  const handleRejectKYC = () => {
    onUpdateUser(user.id, {
      kycVerified: false
    });
  };
  const handleBanUser = () => {
    onUpdateUser(user.id, {
      status: user.status === 'active' ? 'banned' : 'active'
    });
  };
  const handleAdjustBalance = (type: 'add' | 'subtract') => {
    const amount = parseFloat(balanceAdjustment);
    if (isNaN(amount) || amount <= 0) return;
    const newBalance = type === 'add' ? user.totalBalance + amount : Math.max(0, user.totalBalance - amount);
    onUpdateUser(user.id, {
      totalBalance: newBalance
    });
    setBalanceAdjustment('');
    setAdjustmentReason('');
    alert(`Successfully ${type === 'add' ? 'added' : 'deducted'} ${formatAmount(amount)}`);
  };
  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
  }[] = [{
    id: 'profile',
    label: 'Profile',
    icon: UserPlus
  }, {
    id: 'referrals',
    label: 'Referrals',
    icon: UserPlus
  }, {
    id: 'tasks',
    label: 'Tasks',
    icon: History
  }, {
    id: 'actions',
    label: 'Actions',
    icon: ShieldAlert
  }];
  return <Modal isOpen={isOpen} onClose={onClose} title={`User Details: ${user.name}`}>
      <div className="flex flex-col h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>)}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeTab === 'profile' && <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase">
                    User ID
                  </span>
                  <p className="text-lg font-mono text-zinc-200">{user.id}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase">
                    Status
                  </span>
                  <div className="mt-1">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg">
                  <Mail className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Email Address</p>
                    <p className="text-zinc-200">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg">
                  <Phone className="w-5 h-5 text-zinc-400" />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-500">Phone Number</p>
                    <p className="text-zinc-200">{user.phone}</p>
                  </div>
                  <a href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">
                    WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Country</p>
                    <p className="text-zinc-200">{user.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-sm text-zinc-500">Join Date</p>
                    <p className="text-zinc-200">{user.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/30">
                <h4 className="text-sm font-medium text-zinc-300 mb-4">
                  KYC Verification
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.kycVerified ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-zinc-500" />}
                    <span className={user.kycVerified ? 'text-emerald-500' : 'text-zinc-500'}>
                      {user.kycVerified ? 'Verified Identity' : 'Unverified Identity'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!user.kycVerified && <Button size="sm" variant="outline" onClick={handleVerifyKYC} className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
                        Approve
                      </Button>}
                    {user.kycVerified && <Button size="sm" variant="outline" onClick={handleRejectKYC} className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                        Revoke
                      </Button>}
                  </div>
                </div>
              </div>
            </div>}

          {activeTab === 'referrals' && <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-500">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">
                    {user.referralCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Referral Earnings</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {formatAmount(user.referralEarnings)}
                  </p>
                </div>
              </div>

              <div className="text-center py-8 text-zinc-500">
                <p>Referral tree visualization would go here.</p>
                <p className="text-sm mt-2">
                  Showing direct referrals for {user.name}
                </p>
              </div>
            </div>}

          {activeTab === 'tasks' && <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-500">Tasks Completed</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Task Earnings</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {formatAmount(user.taskEarnings)}
                  </p>
                </div>
              </div>

              {/* Mock Task History List */}
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Follow @brand{i} on TikTok
                      </p>
                      <p className="text-xs text-zinc-500">
                        Submitted: 2024-01-2{i}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-500">
                        +{formatAmount(0.5)}
                      </p>
                      <Badge variant="success" className="text-[10px]">
                        VERIFIED
                      </Badge>
                    </div>
                  </div>)}
              </div>
            </div>}

          {activeTab === 'actions' && <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Balance Adjustment
                </h4>
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">
                        Amount
                      </label>
                      <Input type="number" placeholder="0.00" value={balanceAdjustment} onChange={e => setBalanceAdjustment(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">
                        Reason
                      </label>
                      <Input placeholder="e.g. Bonus, Correction" value={adjustmentReason} onChange={e => setAdjustmentReason(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAdjustBalance('add')} disabled={!balanceAdjustment}>
                      Add Funds
                    </Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleAdjustBalance('subtract')} disabled={!balanceAdjustment}>
                      Deduct Funds
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Danger Zone
                </h4>
                <div className="p-4 bg-red-950/20 rounded-lg border border-red-900/50 flex items-center justify-between">
                  <div>
                    <p className="text-zinc-200 font-medium">
                      Ban User Account
                    </p>
                    <p className="text-sm text-zinc-500">
                      Prevent this user from logging in or withdrawing.
                    </p>
                  </div>
                  <Button variant={user.status === 'active' ? 'danger' : 'outline'} onClick={handleBanUser}>
                    {user.status === 'active' ? 'Ban User' : 'Unban User'}
                  </Button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </Modal>;
}