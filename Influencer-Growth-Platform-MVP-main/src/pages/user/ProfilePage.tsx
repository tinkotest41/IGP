import React, { useState } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, Globe, Copy, Award } from 'lucide-react';
export function ProfilePage() {
  const {
    user,
    refreshUser
  } = useAuth();
  const { updateUser } = useDataStore();
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  if (!user) return null;

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      updateUser(user.id, {
        phone: phone || user.phone,
        country: country || user.country
      });
      refreshUser();
      setSaveMessage('Changes saved successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      setSaveMessage('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://agency.com/signup?ref=${user.referralCode}`);
    // Could add toast here
  };
  return <UserLayout>
      <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="h-24 w-24 flex-shrink-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-amber-500 flex items-center justify-center text-3xl font-bold text-zinc-400">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-cyber">{user.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit">
                Level {user.level} Member
              </span>
              <span className="text-zinc-500 text-sm">
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Referral Program
              </h3>
              <p className="text-sm text-zinc-400">
                Earn 5% commission on every task your referrals complete.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <code className="bg-black/30 px-3 py-2 rounded text-amber-500 font-mono text-sm flex-1 sm:flex-none">
                {user.referralCode}
              </code>
              <Button size="sm" variant="outline" onClick={copyReferral}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Details Form */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user.name} icon={<User className="h-4 w-4" />} readOnly className="opacity-50 cursor-not-allowed" />
              <Input label="Email Address" defaultValue={user.email} icon={<Mail className="h-4 w-4" />} readOnly className="opacity-50 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone className="h-4 w-4" />} />
              <Input label="Country" value={country} onChange={e => setCountry(e.target.value)} icon={<Globe className="h-4 w-4" />} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              {saveMessage && (
                <span className={`text-sm py-2 px-3 rounded ${saveMessage.includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {saveMessage}
                </span>
              )}
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>;
}