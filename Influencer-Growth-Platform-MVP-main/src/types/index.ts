export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'banned';
export type TaskStatus = 'pending' | 'submitted' | 'completed' | 'rejected';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';
export type MembershipLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TaskPlatform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'snapchat' | 'facebook' | 'telegram' | 'whatsapp' | 'custom';
export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';
export type IDType = 'national_id' | 'drivers_license' | 'passport' | 'voters_card' | 'residence_permit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  level: MembershipLevel;
  referralCode: string;
  referredBy?: string;
  totalBalance: number;
  taskEarnings: number;
  referralEarnings: number;
  referralCount: number;
  referralBonusRate?: number;
  joinDate: string;
  status: UserStatus;
  kycVerified: boolean;
  kycStatus: KYCStatus;
  avatarUrl?: string;
  usedPasscode?: string;
}

export interface Task {
  id: string;
  platform: TaskPlatform;
  title: string;
  reward: number;
  link: string;
  instructions: string;
  targetLevel?: MembershipLevel;
  targetUserId?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'bank' | 'crypto' | 'mobile_money';
  details: string;
  status: WithdrawalStatus;
  requestDate: string;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface Passcode {
  code: string;
  level: MembershipLevel;
  used: boolean;
  usedBy?: string;
  createdAt: string;
  usedAt?: string;
}

export interface MembershipTier {
  level: MembershipLevel;
  name: string;
  price: number;
  taskReward: string;
  referralBonus: number;
  features: string[];
  color: string;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    level: 1,
    name: 'Starter',
    price: 5,
    taskReward: '$0.20 - $0.50',
    referralBonus: 5,
    features: ['5 referrals required', 'Basic tasks', '5% referral bonus', 'Standard support'],
    color: 'zinc'
  },
  {
    level: 2,
    name: 'Bronze',
    price: 10,
    taskReward: '$0.50 - $1.00',
    referralBonus: 7,
    features: ['8 referrals required', 'More tasks', '7% referral bonus', 'Priority support'],
    color: 'amber'
  },
  {
    level: 3,
    name: 'Silver',
    price: 20,
    taskReward: '$1.00 - $2.00',
    referralBonus: 10,
    features: ['10 referrals required', 'Premium tasks', '10% referral bonus', 'Weekly bonuses'],
    color: 'slate'
  },
  {
    level: 4,
    name: 'Gold',
    price: 50,
    taskReward: '$2.00 - $5.00',
    referralBonus: 12,
    features: ['15 referrals required', 'VIP tasks', '12% referral bonus', 'Daily bonuses'],
    color: 'yellow'
  },
  {
    level: 5,
    name: 'Platinum',
    price: 100,
    taskReward: '$5.00 - $10.00',
    referralBonus: 15,
    features: ['20 referrals required', 'Elite tasks', '15% referral bonus', '24/7 support'],
    color: 'cyan'
  },
  {
    level: 6,
    name: 'Diamond',
    price: 200,
    taskReward: '$10.00 - $25.00',
    referralBonus: 20,
    features: ['30 referrals required', 'Exclusive tasks', '20% referral bonus', 'Brand partnerships'],
    color: 'purple'
  }
];

export const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom',
  'Canada', 'Australia', 'India', 'Pakistan', 'Bangladesh', 'Philippines',
  'Indonesia', 'Malaysia', 'Singapore', 'United Arab Emirates', 'Saudi Arabia',
  'Egypt', 'Morocco', 'Tanzania', 'Uganda', 'Cameroon', 'Ivory Coast',
  'Senegal', 'Rwanda', 'Ethiopia', 'Zimbabwe', 'Zambia', 'Botswana', 'Other'
];
