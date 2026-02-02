import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { COUNTRIES, MEMBERSHIP_TIERS } from '../../types';
import { Check, ChevronRight, Lock, User, Phone, Globe, Key, Mail, Sparkles } from 'lucide-react';

export function MultiStepSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { validatePasscode, getUserByReferralCode } = useDataStore();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passcodeLevel, setPasscodeLevel] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    referralCode: searchParams.get('ref') || '',
    adminPasscode: '',
    fullName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.referralCode.trim()) {
      return 'Referral code is required';
    }
    // Allow ADMIN001 as a master referral code
    if (formData.referralCode.trim().toUpperCase() === 'ADMIN001') {
      return null;
    }
    const referrer = getUserByReferralCode(formData.referralCode.trim());
    if (!referrer) {
      return 'Invalid referral code. Please check and try again.';
    }
    return null;
  };

  const validateStep2 = () => {
    if (!formData.adminPasscode.trim()) {
      return 'Access passcode is required';
    }
    const validation = validatePasscode(formData.adminPasscode.trim());
    if (!validation.valid) {
      return 'Invalid or already used passcode. Get a valid passcode from our Telegram bot.';
    }
    setPasscodeLevel(validation.level || 1);
    return null;
  };

  const validateStep3 = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.country) return 'Country is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleNext = () => {
    let err = null;
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setStep(step + 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }
    setIsLoading(true);
    try {
      const result = await register({
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        country: formData.country,
        password: formData.password,
        referredBy: formData.referralCode.trim(),
        level: passcodeLevel || 1,
        passcode: formData.adminPasscode.trim()
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const levelInfo = passcodeLevel ? MEMBERSHIP_TIERS.find(t => t.level === passcodeLevel) : null;

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden cyber-card animate-fade-in-up">
      <div className="flex items-center justify-between px-8 pt-8 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
              step >= s 
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30' 
                : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700'
            }`}>
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`h-0.5 w-16 mx-2 transition-all duration-500 rounded-full ${
                step > s ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-zinc-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="px-8 pb-8">
        <h2 className="text-2xl font-bold text-white mb-2 font-cyber">
          {step === 1 && 'Who referred you?'}
          {step === 2 && 'Enter Access Code'}
          {step === 3 && 'Create Your Profile'}
        </h2>
        <p className="text-zinc-400 mb-6 text-sm">
          {step === 1 && 'Enter the referral code of the member who invited you.'}
          {step === 2 && 'Enter the passcode from our Telegram bot to verify your membership level.'}
          {step === 3 && 'Complete your profile to join the exclusive network.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <Input
                name="referralCode"
                placeholder="Referral Code (e.g., ABC123)"
                value={formData.referralCode}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                className="cyber-input"
                autoFocus
              />
              <p className="text-xs text-zinc-500">
                Get a referral code from an existing member to join.
              </p>
              <Button type="button" onClick={handleNext} className="w-full cyber-button">
                Verify Code <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <Input
                name="adminPasscode"
                placeholder="Membership Passcode"
                value={formData.adminPasscode}
                onChange={handleChange}
                icon={<Key className="h-4 w-4" />}
                className="cyber-input"
                autoFocus
              />
              <div className="text-xs text-zinc-400 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 space-y-2">
                <p className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Get your passcode from our <strong className="text-amber-500">Telegram Bot</strong></span>
                </p>
                <p className="text-zinc-500">Your passcode determines your membership level and benefits.</p>
              </div>
              <Button type="button" onClick={handleNext} className="w-full cyber-button">
                Validate Access <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              {levelInfo && (
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-lg mb-4">
                  <p className="text-xs text-zinc-400 mb-1">Your Membership Level</p>
                  <p className="text-lg font-bold text-amber-500">{levelInfo.name} (Level {levelInfo.level})</p>
                  <p className="text-xs text-zinc-500 mt-1">Task rewards: {levelInfo.taskReward}</p>
                </div>
              )}
              
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                className="cyber-input"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                className="cyber-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="phone"
                  placeholder="WhatsApp Number"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone className="h-4 w-4" />}
                  className="cyber-input"
                />
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full h-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer cyber-input"
                  >
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="h-4 w-4" />}
                className="cyber-input"
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Lock className="h-4 w-4" />}
                className="cyber-input"
              />
              <Button type="submit" className="w-full cyber-button" isLoading={isLoading}>
                Complete Registration
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-fade-in-up">
              {error}
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
