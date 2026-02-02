import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDataStore, WithdrawalRequest } from '../../contexts/DataStore';
import { MEMBERSHIP_TIERS, MembershipLevel } from '../../types';
import { Download, CheckCircle, Wallet, Key, Copy, Check, X } from 'lucide-react';

export function FinancePage() {
  const { formatAmount } = useCurrency();
  const { withdrawals, updateWithdrawal, getAllUsers, generatePasscodes, getPasscodes } = useDataStore();
  
  const users = getAllUsers();
  const passcodes = getPasscodes();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject'>('approve');

  const [passcodeLevel, setPasscodeLevel] = useState<MembershipLevel>(1);
  const [passcodeQuantity, setPasscodeQuantity] = useState(10);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [showPasscodeList, setShowPasscodeList] = useState(false);

  const filteredWithdrawals = withdrawals.filter(w => filter === 'all' ? true : w.status === filter);

  const totalUserBalance = users.reduce((sum, u) => sum + u.totalBalance, 0);
  const totalPendingWithdrawals = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
  const totalApprovedPayouts = withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);

  const handleWithdrawalAction = (withdrawal: WithdrawalRequest, action: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setConfirmAction(action);
    setConfirmModalOpen(true);
  };

  const confirmWithdrawalAction = () => {
    if (selectedWithdrawal) {
      updateWithdrawal(selectedWithdrawal.id, confirmAction === 'approve' ? 'approved' : 'rejected');
      setConfirmModalOpen(false);
      setSelectedWithdrawal(null);
    }
  };

  const handleGeneratePasscodes = () => {
    const newPasscodes = generatePasscodes(passcodeLevel, passcodeQuantity);
    setGeneratedCodes(newPasscodes.map(p => p.code));
  };

  const copyCodes = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'));
  };

  const downloadCodes = () => {
    const tier = MEMBERSHIP_TIERS.find(t => t.level === passcodeLevel);
    const content = generatedCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tier?.name || 'Level' + passcodeLevel}_passcodes_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unusedPasscodes = passcodes.filter(p => !p.used);
  const usedPasscodes = passcodes.filter(p => p.used);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance & Codes</h1>
          <p className="text-zinc-400">Manage payouts and generate access codes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <p className="text-sm text-zinc-400 mb-1">Total User Balances</p>
            <p className="text-2xl font-bold text-emerald-500">{formatAmount(totalUserBalance)}</p>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <p className="text-sm text-zinc-400 mb-1">Pending Withdrawals</p>
            <p className="text-2xl font-bold text-amber-500">{formatAmount(totalPendingWithdrawals)}</p>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <p className="text-sm text-zinc-400 mb-1">Total Paid Out</p>
            <p className="text-2xl font-bold text-blue-400">{formatAmount(totalApprovedPayouts)}</p>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <p className="text-sm text-zinc-400 mb-1">Active Passcodes</p>
            <p className="text-2xl font-bold text-purple-400">{unusedPasscodes.length}</p>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              Withdrawal Requests
            </h2>
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      No withdrawal requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithdrawals.map(w => (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div className="font-medium text-zinc-200">{w.userName}</div>
                      </TableCell>
                      <TableCell className="font-mono text-emerald-500 font-medium">
                        {formatAmount(w.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={w.method === 'crypto' ? 'success' : w.method === 'bank' ? 'default' : 'warning'}>
                          {w.method.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-zinc-400" title={w.details}>
                        {w.details}
                      </TableCell>
                      <TableCell className="text-zinc-500">{w.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant={w.status === 'approved' ? 'success' : w.status === 'rejected' ? 'danger' : 'warning'}>
                          {w.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {w.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleWithdrawalAction(w, 'approve')}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={() => handleWithdrawalAction(w, 'reject')}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>

        <section className="space-y-4 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              Passcode Generator
            </h2>
            <Button variant="outline" size="sm" onClick={() => setShowPasscodeList(!showPasscodeList)}>
              {showPasscodeList ? 'Hide' : 'View'} All Passcodes ({passcodes.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Membership Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MEMBERSHIP_TIERS.map(tier => (
                      <button
                        key={tier.level}
                        onClick={() => setPasscodeLevel(tier.level as MembershipLevel)}
                        className={`py-3 px-2 rounded-lg border transition-all text-sm ${passcodeLevel === tier.level ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                      >
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-xs opacity-70">${tier.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Quantity</label>
                  <Input type="number" min="1" max="100" value={passcodeQuantity} onChange={e => setPasscodeQuantity(parseInt(e.target.value) || 10)} />
                </div>

                <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-white" onClick={handleGeneratePasscodes}>
                  Generate {passcodeQuantity} Passcodes
                </Button>

                <p className="text-xs text-zinc-500 text-center">
                  Generated codes are saved and can be used for signup immediately
                </p>
              </div>
            </Card>

            <Card className="p-6 flex flex-col h-full min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-zinc-200">Generated Output</h3>
                {generatedCodes.length > 0 && (
                  <div className="flex gap-2">
                    <button onClick={copyCodes} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Copy to clipboard">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={downloadCodes} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Download TXT">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800 p-4 overflow-y-auto font-mono text-sm text-zinc-300">
                {generatedCodes.length > 0 ? (
                  <ul className="space-y-1">
                    {generatedCodes.map((code, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="text-zinc-600 w-6">{i + 1}.</span>
                        <span className="text-emerald-400">{code}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600 italic">
                    No codes generated yet...
                  </div>
                )}
              </div>
            </Card>
          </div>

          {showPasscodeList && (
            <Card className="p-0 overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-medium text-zinc-200">All Passcodes</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-500">Available: {unusedPasscodes.length}</span>
                  <span className="text-zinc-500">Used: {usedPasscodes.length}</span>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Used By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passcodes.slice(0, 50).map(p => {
                    const tier = MEMBERSHIP_TIERS.find(t => t.level === p.level);
                    const usedByUser = p.usedBy ? users.find(u => u.id === p.usedBy) : null;
                    return (
                      <TableRow key={p.code}>
                        <TableCell className="font-mono text-amber-400">{p.code}</TableCell>
                        <TableCell>
                          <Badge variant="default">{tier?.name || `Level ${p.level}`}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.used ? 'danger' : 'success'}>
                            {p.used ? 'USED' : 'AVAILABLE'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-500">{p.createdAt.split('T')[0]}</TableCell>
                        <TableCell className="text-zinc-400">
                          {usedByUser ? usedByUser.name : p.used ? 'Unknown' : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {passcodes.length > 50 && (
                <div className="p-4 text-center text-sm text-zinc-500 border-t border-zinc-800">
                  Showing 50 of {passcodes.length} passcodes
                </div>
              )}
            </Card>
          )}
        </section>

        <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} title={confirmAction === 'approve' ? 'Confirm Payment' : 'Reject Withdrawal'}>
          <div className="space-y-4">
            <div className={`p-4 ${confirmAction === 'approve' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} border rounded-lg flex items-start gap-3`}>
              {confirmAction === 'approve' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className={`${confirmAction === 'approve' ? 'text-emerald-500' : 'text-red-500'} font-medium`}>
                  {confirmAction === 'approve' ? 'Mark as Paid?' : 'Reject this request?'}
                </p>
                <p className={`text-sm ${confirmAction === 'approve' ? 'text-emerald-500/80' : 'text-red-500/80'} mt-1`}>
                  {confirmAction === 'approve' 
                    ? `This will approve the withdrawal of ${selectedWithdrawal && formatAmount(selectedWithdrawal.amount)}.`
                    : 'This will reject the withdrawal request and the user will be notified.'}
                </p>
              </div>
            </div>

            {selectedWithdrawal && (
              <div className="bg-zinc-900 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Recipient:</span>
                  <span className="text-zinc-200">{selectedWithdrawal.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount:</span>
                  <span className="text-emerald-400 font-medium">{formatAmount(selectedWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Method:</span>
                  <span className="text-zinc-200">{selectedWithdrawal.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Details:</span>
                  <span className="text-zinc-200 text-right max-w-[200px] truncate">{selectedWithdrawal.details}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                className={`flex-1 ${confirmAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`} 
                onClick={confirmWithdrawalAction}
              >
                {confirmAction === 'approve' ? 'Confirm Payment' : 'Reject Request'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
