import { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { CheckCircle, XCircle, Eye, FileText, Clock } from 'lucide-react';
import { useDataStore, UserWithPassword } from '../../contexts/DataStore';
import { MEMBERSHIP_TIERS } from '../../types';

export function KYCApprovalPage() {
  const { getAllUsers, approveKYC, rejectKYC } = useDataStore();
  
  const users = getAllUsers();
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'not_submitted' | 'all'>('pending');

  const getKYCStatus = (user: UserWithPassword) => {
    return user.kycStatus || (user.kycVerified ? 'approved' : 'not_submitted');
  };

  const filteredUsers = users.filter(u => {
    const status = getKYCStatus(u);
    if (filter === 'all') return true;
    return status === filter;
  });

  const pendingCount = users.filter(u => getKYCStatus(u) === 'pending').length;
  const approvedCount = users.filter(u => getKYCStatus(u) === 'approved').length;
  const rejectedCount = users.filter(u => getKYCStatus(u) === 'rejected').length;
  const notSubmittedCount = users.filter(u => getKYCStatus(u) === 'not_submitted').length;

  const handleReview = (user: UserWithPassword) => {
    setSelectedUser(user);
    setReviewModalOpen(true);
  };

  const handleApprove = () => {
    if (selectedUser) {
      approveKYC(selectedUser.id);
      setReviewModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleReject = () => {
    if (selectedUser) {
      rejectKYC(selectedUser.id);
      setReviewModalOpen(false);
      setSelectedUser(null);
    }
  };

  const getLevelName = (level: number) => {
    return MEMBERSHIP_TIERS.find(t => t.level === level)?.name || `Level ${level}`;
  };

  const getStatusBadge = (user: UserWithPassword) => {
    const status = getKYCStatus(user);
    switch (status) {
      case 'approved':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="default">Not Submitted</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-cyber">KYC Verification</h1>
            <p className="text-zinc-400">Review and approve identity verification for users</p>
          </div>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 overflow-x-auto">
            {(['pending', 'approved', 'rejected', 'not_submitted', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f === 'not_submitted' ? 'Not Submitted' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cyber-card bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
                <p className="text-xs text-zinc-400">Pending Review</p>
              </div>
            </div>
          </Card>
          <Card className="cyber-card bg-emerald-500/10 border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold text-emerald-500">{approvedCount}</p>
                <p className="text-xs text-zinc-400">Verified</p>
              </div>
            </div>
          </Card>
          <Card className="cyber-card bg-red-500/10 border-red-500/20">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
                <p className="text-xs text-zinc-400">Rejected</p>
              </div>
            </div>
          </Card>
          <Card className="cyber-card bg-zinc-500/10 border-zinc-500/20">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-zinc-500" />
              <div>
                <p className="text-2xl font-bold text-zinc-400">{notSubmittedCount}</p>
                <p className="text-xs text-zinc-400">Not Submitted</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full">
              <Card className="cyber-card text-center py-16">
                <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No users with {filter !== 'all' ? filter.replace('_', ' ') : ''} status found</p>
              </Card>
            </div>
          ) : (
            filteredUsers.map(user => (
              <Card key={user.id} className="cyber-card hover:border-amber-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(user)}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Phone:</span>
                    <span className="text-zinc-200">{user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Country:</span>
                    <span className="text-zinc-200">{user.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Level:</span>
                    <span className="text-amber-500">{getLevelName(user.level)}</span>
                  </div>
                  {user.kycDocuments && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ID Type:</span>
                      <span className="text-zinc-200">{user.kycDocuments.idType.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>

                {getKYCStatus(user) === 'pending' && (
                  <Button variant="outline" className="w-full cyber-button" onClick={() => handleReview(user)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Review Documents
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>

        <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Review KYC" className="max-w-2xl">
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-zinc-400">{selectedUser.email}</p>
                  <div className="flex gap-4 mt-1 text-xs text-zinc-500">
                    <span>ID: {selectedUser.id}</span>
                    <span>•</span>
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Country</p>
                  <p className="text-zinc-200">{selectedUser.country}</p>
                </div>
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Membership</p>
                  <p className="text-amber-500">{getLevelName(selectedUser.level)}</p>
                </div>
                {selectedUser.kycDocuments && (
                  <>
                    <div className="p-4 bg-zinc-900 rounded-lg">
                      <p className="text-xs text-zinc-500 mb-1">ID Type</p>
                      <p className="text-zinc-200 capitalize">{selectedUser.kycDocuments.idType.replace('_', ' ')}</p>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-lg">
                      <p className="text-xs text-zinc-500 mb-1">ID Number</p>
                      <p className="text-zinc-200 font-mono">{selectedUser.kycDocuments.idNumber}</p>
                    </div>
                  </>
                )}
              </div>

              {selectedUser.kycDocuments?.documentUrl && (
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-2">Submitted Document</p>
                  <img 
                    src={selectedUser.kycDocuments.documentUrl} 
                    alt="ID Document" 
                    className="max-h-64 rounded-lg object-contain mx-auto"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10" 
                      onClick={handleReject}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                      onClick={handleApprove}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-400">
                  <strong>Review Notes:</strong> Verify that the ID is valid, matches the user's name, and is not expired.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
