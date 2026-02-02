import { useState } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, TrendingUp, Copy, CheckCircle, Calendar, UserPlus } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../../types';

export function ReferralsPage() {
  const { user } = useAuth();
  const { getAllUsers } = useDataStore();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  // Get the actual referral bonus rate for the user
  const userBonusRate = user.referralBonusRate || MEMBERSHIP_TIERS.find(t => t.level === user.level)?.referralBonus || 5;

  const allUsers = getAllUsers();
  const referredUsers = allUsers.filter(u => u.referredBy === user.referralCode);

  const referralLink = `https://exclusive-agency.com/signup?ref=${user.referralCode}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UserLayout>
      <div className="space-y-8 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-white font-cyber">Referral Program</h1>
          <p className="text-zinc-400">Earn {userBonusRate}% commission on every task your referrals complete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Referrals</p>
                <h3 className="text-3xl font-bold text-white">{referredUsers.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Commission Rate</p>
                <h3 className="text-3xl font-bold text-purple-400">{userBonusRate}%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Your Referral Link</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm text-zinc-300 overflow-x-auto">
              {referralLink}
            </div>
            <Button onClick={copyLink} className="sm:w-auto">
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Your referral code: <span className="text-amber-500 font-mono">{user.referralCode}</span>
          </p>
        </Card>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">People You Referred</h2>

          {referredUsers.length === 0 ? (
            <Card className="text-center py-16">
              <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No referrals yet</h3>
              <p className="text-zinc-400 mb-6">Share your referral link to start earning commissions</p>
              <Button onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Referral Link
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {referredUsers.map(referral => (
                <Card key={referral.id} className="bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/10 hover:border-amber-500/30 transition-all">
                  <div className="flex flex-col gap-4">
                    {/* Header with Avatar and Basic Info */}
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                        {referral.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-white text-lg">{referral.name}</h4>
                          <Badge variant="outline" className="text-xs border-amber-500/20 text-amber-500">
                            Level {referral.level}
                          </Badge>
                          <Badge variant={referral.status === 'active' ? 'success' : 'danger'} className="text-xs">
                            {referral.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 break-all">{referral.email}</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                      <div className="bg-zinc-900/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 mb-1">Join Date</p>
                        <p className="text-sm font-medium text-zinc-200 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-amber-500" />
                          {referral.joinDate}
                        </p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 mb-1">Member Tier</p>
                        <p className="text-sm font-medium text-amber-500">Level {referral.level}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 mb-1">Commission You Earn</p>
                        <p className="text-sm font-semibold text-emerald-400">{userBonusRate}% per task</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-lg p-3">
                        <p className="text-xs text-zinc-500 mb-1">Account Status</p>
                        <p className={`text-sm font-medium ${referral.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {referral.status === 'active' ? 'Active' : 'Suspended'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">How Referral Commissions Work</h3>
          <div className="space-y-3 text-sm text-zinc-400">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0">1</div>
              <p>Share your unique referral link with friends and family</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0">2</div>
              <p>When they sign up and complete tasks, you earn {userBonusRate}% commission</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs flex-shrink-0">3</div>
              <p>Commissions are added to your balance instantly and can be withdrawn</p>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}
