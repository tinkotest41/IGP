import { useState, useEffect } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IDType } from '../../types';
import { Upload, CheckCircle, AlertCircle, FileText, Clock, XCircle } from 'lucide-react';

export function KYCPage() {
  const { user, refreshUser } = useAuth();
  const { getUserById, submitKYC } = useDataStore();
  
  const [idType, setIdType] = useState<IDType>('national_id');
  const [idNumber, setIdNumber] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  const fullUser = getUserById(user.id);
  const kycStatus = fullUser?.kycStatus || 'not_submitted';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitKYC(user.id, idType, idNumber, frontImage || undefined);
    refreshUser();
    
    setIsSubmitting(false);
  };

  if (kycStatus === 'approved') {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="cyber-card text-center py-16 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 relative">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 font-cyber">
              Identity Verified
            </h2>
            <p className="text-zinc-400 mb-6">
              Your account has been successfully verified
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 font-medium">
              <CheckCircle className="h-5 w-5" />
              <span>KYC Approved</span>
            </div>
            <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-zinc-400">
                You now have full access to withdrawals and premium features
              </p>
            </div>
          </Card>
        </div>
      </UserLayout>
    );
  }

  if (kycStatus === 'rejected') {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="cyber-card text-center py-16 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
            <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 font-cyber">
              Verification Rejected
            </h2>
            <p className="text-zinc-400 mb-6">
              Your documents did not pass verification. Please submit again with clearer documents.
            </p>
            <Button onClick={() => window.location.reload()} className="cyber-button">
              Submit Again
            </Button>
          </Card>
        </div>
      </UserLayout>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="cyber-card text-center py-16 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20">
            <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 relative">
              <Clock className="h-10 w-10 text-amber-500" />
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 font-cyber">
              Verification Pending
            </h2>
            <p className="text-zinc-400 mb-6">
              Your documents are being reviewed by our team
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 font-medium">
              <Clock className="h-5 w-5" />
              Under Review
            </div>
            <div className="mt-8 p-6 bg-zinc-900/50 rounded-lg max-w-md mx-auto space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Documents Submitted</p>
                  <p className="text-xs text-zinc-500">Your ID documents have been received</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                  <Clock className="h-3 w-3 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Admin Review</p>
                  <p className="text-xs text-zinc-500">Typically takes 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-zinc-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500">Approval</p>
                  <p className="text-xs text-zinc-600">You'll be notified when approved</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </UserLayout>
    );
  }

  const idTypes: { value: IDType; label: string }[] = [
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'passport', label: 'Passport' },
    { value: 'voters_card', label: "Voter's Card" },
    { value: 'residence_permit', label: 'Residence Permit' }
  ];

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white font-cyber">Identity Verification (KYC)</h1>
          <p className="text-zinc-400">Complete KYC to unlock withdrawals and higher earning limits</p>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-500">
            <p className="font-semibold mb-1">Verification Required</p>
            <p className="text-amber-500/80">
              You must verify your identity to withdraw funds and access premium features.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="cyber-card">
            <h3 className="text-lg font-semibold text-white mb-4">Select ID Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {idTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setIdType(type.value)}
                  className={`p-4 rounded-lg border transition-all ${
                    idType === type.value 
                      ? 'bg-amber-500/10 border-amber-500 text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{type.label}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="cyber-card">
            <h3 className="text-lg font-semibold text-white mb-4">ID Information</h3>
            <Input
              label="ID Number"
              placeholder="Enter your ID number"
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              className="cyber-input"
              required
            />
          </Card>

          <Card className="cyber-card">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Documents</h3>
            <p className="text-sm text-zinc-400 mb-4">Please ensure images are clear and all details are visible</p>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Front of ID *</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, setFrontImage)}
                    className="hidden"
                    id="front-upload"
                    required
                  />
                  <label
                    htmlFor="front-upload"
                    className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors bg-zinc-900/50"
                  >
                    {frontImage ? (
                      <img src={frontImage} alt="Front" className="h-full w-full object-contain rounded-lg p-2" />
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-500 font-medium">Click to upload</p>
                        <p className="text-xs text-zinc-600 mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full cyber-button"
            size="lg"
            isLoading={isSubmitting}
            disabled={!idNumber || !frontImage}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      </div>
    </UserLayout>
  );
}
