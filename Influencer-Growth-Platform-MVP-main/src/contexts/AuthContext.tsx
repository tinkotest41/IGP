import { useEffect, useState, createContext, useContext } from 'react';
import { User, UserRole, MembershipLevel, KYCStatus } from '../types';
import { useDataStore, UserWithPassword } from './DataStore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    referredBy?: string;
    level?: number;
    passcode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserByEmail, getUserById, addUser, users, usePasscode, getUserByReferralCode } = useDataStore();

  useEffect(() => {
    const savedUserId = localStorage.getItem('auth_user_id');
    if (savedUserId) {
      const foundUser = getUserById(savedUserId);
      if (foundUser) {
        const { password, assignedTasks, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
    setIsLoading(false);
  }, [users, getUserById]);

  const refreshUser = () => {
    const savedUserId = localStorage.getItem('auth_user_id');
    if (savedUserId) {
      const foundUser = getUserById(savedUserId);
      if (foundUser) {
        const { password, assignedTasks, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Hardcoded admin credentials - always allow login
    const ADMIN_EMAIL = 'admin@agency.com';
    const ADMIN_PASSWORD = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Find or create admin user
      let foundUser = getUserByEmail(ADMIN_EMAIL);
      
      if (!foundUser) {
        // If admin doesn't exist in storage, log them in anyway
        const adminUser = {
          id: 'admin-001',
          name: 'System Admin',
          email: ADMIN_EMAIL,
          phone: '+1234567890',
          country: 'Nigeria',
          role: 'admin' as const,
          level: 6,
          referralCode: 'ADMIN01',
          totalBalance: 0,
          taskEarnings: 0,
          referralEarnings: 0,
          referralCount: 0,
          joinDate: '2024-01-01',
          status: 'active' as const,
          kycVerified: true,
          kycStatus: 'approved' as const,
          assignedTasks: [],
          password: ADMIN_PASSWORD,
        };
        foundUser = adminUser as any;
      }

      const { password: _, assignedTasks, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user_id', foundUser.id);
      setIsLoading(false);
      return { success: true };
    }

    const foundUser = getUserByEmail(email);
    
    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: 'User not found. Please check your email or sign up.' };
    }

    if (foundUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    if (foundUser.status === 'banned') {
      setIsLoading(false);
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    const { password: _, assignedTasks, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user_id', foundUser.id);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    referredBy?: string;
    level?: number;
    passcode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (userData.referredBy) {
      // Allow ADMIN001 as a master referral code
      if (userData.referredBy.trim().toUpperCase() !== 'ADMIN001') {
        const referrer = getUserByReferralCode(userData.referredBy);
        if (!referrer) {
          setIsLoading(false);
          return { success: false, error: 'Invalid referral code.' };
        }
      }
    }

    const referralCode = `REF${Date.now().toString(36).toUpperCase()}`;
    const userId = `user-${Date.now()}`;
    
    if (userData.passcode) {
      usePasscode(userData.passcode, userId);
    }
    
    const newUser: UserWithPassword = {
      id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      country: userData.country,
      password: userData.password,
      role: 'user' as UserRole,
      level: (userData.level || 1) as MembershipLevel,
      referralCode,
      referredBy: userData.referredBy,
      totalBalance: 0,
      taskEarnings: 0,
      referralEarnings: 0,
      referralCount: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      kycVerified: false,
      kycStatus: 'not_submitted' as KYCStatus,
      assignedTasks: [],
      usedPasscode: userData.passcode,
    };

    addUser(newUser);

    const { password: _, assignedTasks, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user_id', newUser.id);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user_id');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
