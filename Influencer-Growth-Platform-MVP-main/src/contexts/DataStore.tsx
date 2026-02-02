import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, MembershipLevel, TaskPlatform, KYCStatus, IDType, Passcode } from '../types';

export interface UserWithPassword extends User {
  password: string;
  assignedTasks: AssignedTask[];
  kycDocuments?: {
    idType: IDType;
    idNumber: string;
    documentUrl?: string;
    submittedAt: string;
  };
  withdrawalDetails?: {
    method: string;
    accountDetails: string;
  };
  referralBonusRate?: number;
}

export interface AssignedTask {
  id: string;
  platform: TaskPlatform;
  title: string;
  reward: number;
  link: string;
  instructions: string;
  status: 'pending' | 'submitted' | 'completed' | 'rejected';
  submittedHandle?: string;
  submittedAt?: string;
  createdAt: string;
  targetLevel?: MembershipLevel;
  targetUserId?: string;
  isBroadcast?: boolean;
  isCustom?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedAt?: string;
  adminNote?: string;
}

interface DataStoreContextType {
  users: UserWithPassword[];
  tasks: AssignedTask[];
  withdrawals: WithdrawalRequest[];
  passcodes: Passcode[];
  
  addUser: (user: UserWithPassword) => void;
  updateUser: (userId: string, updates: Partial<UserWithPassword>) => void;
  getUserByEmail: (email: string) => UserWithPassword | undefined;
  getUserById: (userId: string) => UserWithPassword | undefined;
  getUserByReferralCode: (code: string) => UserWithPassword | undefined;
  getAllUsers: () => UserWithPassword[];
  
  addTask: (task: AssignedTask, targetUserId?: string, targetLevel?: MembershipLevel) => void;
  updateTask: (taskId: string, userId: string, updates: Partial<AssignedTask>) => void;
  getUserTasks: (userId: string) => AssignedTask[];
  getAllTasks: () => AssignedTask[];
  getAllPendingSubmissions: () => { task: AssignedTask; user: UserWithPassword }[];
  
  adjustUserBalance: (userId: string, amount: number, type: 'add' | 'subtract', reason: 'task' | 'referral' | 'admin') => void;
  approveKYC: (userId: string) => void;
  rejectKYC: (userId: string) => void;
  submitKYC: (userId: string, idType: IDType, idNumber: string, documentUrl?: string) => void;
  updateUserLevel: (userId: string, level: MembershipLevel) => void;
  updateUserReferralCount: (userId: string, count: number) => void;
  updateUserReferralBonus: (userId: string, rate: number) => void;
  updateUserReferralEarnings: (userId: string, earnings: number) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  
  addWithdrawal: (withdrawal: WithdrawalRequest) => void;
  updateWithdrawal: (withdrawalId: string, status: 'approved' | 'rejected', adminNote?: string) => void;
  
  generatePasscodes: (level: MembershipLevel, quantity: number) => Passcode[];
  validatePasscode: (code: string) => { valid: boolean; level?: MembershipLevel };
  usePasscode: (code: string, userId: string) => boolean;
  getPasscodes: () => Passcode[];
  
  refreshData: () => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'app_users',
  TASKS: 'app_tasks',
  WITHDRAWALS: 'app_withdrawals',
  PASSCODES: 'app_passcodes',
};

const DEFAULT_ADMIN: UserWithPassword = {
  id: 'admin-001',
  name: 'System Admin',
  email: 'admin@agency.com',
  password: 'admin123',
  phone: '+1234567890',
  country: 'Nigeria',
  role: 'admin',
  level: 6,
  referralCode: 'ADMIN01',
  totalBalance: 0,
  taskEarnings: 0,
  referralEarnings: 0,
  referralCount: 0,
  joinDate: '2024-01-01',
  status: 'active',
  kycVerified: true,
  kycStatus: 'approved',
  assignedTasks: [],
};

const INITIAL_PASSCODES: Passcode[] = [
  { code: 'STARTER-2024-A1B2', level: 1, used: false, createdAt: '2024-01-01' },
  { code: 'STARTER-2024-C3D4', level: 1, used: false, createdAt: '2024-01-01' },
  { code: 'BRONZE-2024-E5F6', level: 2, used: false, createdAt: '2024-01-01' },
  { code: 'BRONZE-2024-G7H8', level: 2, used: false, createdAt: '2024-01-01' },
  { code: 'SILVER-2024-I9J0', level: 3, used: false, createdAt: '2024-01-01' },
  { code: 'GOLD-2024-K1L2', level: 4, used: false, createdAt: '2024-01-01' },
  { code: 'PLAT-2024-M3N4', level: 5, used: false, createdAt: '2024-01-01' },
  { code: 'DIAMOND-2024-O5P6', level: 6, used: false, createdAt: '2024-01-01' },
];

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserWithPassword[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [passcodes, setPasscodes] = useState<Passcode[]>([]);

  const loadFromStorage = useCallback(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const storedWithdrawals = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
      const storedPasscodes = localStorage.getItem(STORAGE_KEYS.PASSCODES);

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        const hasAdmin = parsedUsers.some((u: UserWithPassword) => u.role === 'admin');
        setUsers(hasAdmin ? parsedUsers : [DEFAULT_ADMIN, ...parsedUsers]);
      } else {
        setUsers([DEFAULT_ADMIN]);
      }

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      if (storedWithdrawals) {
        setWithdrawals(JSON.parse(storedWithdrawals));
      }

      if (storedPasscodes) {
        setPasscodes(JSON.parse(storedPasscodes));
      } else {
        setPasscodes(INITIAL_PASSCODES);
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
      setUsers([DEFAULT_ADMIN]);
      setPasscodes(INITIAL_PASSCODES);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    if (passcodes.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PASSCODES, JSON.stringify(passcodes));
    }
  }, [passcodes]);

  const addUser = useCallback((user: UserWithPassword) => {
    setUsers(prev => [...prev, user]);
    
    if (user.referredBy) {
      const referrer = users.find(u => u.referralCode === user.referredBy);
      if (referrer) {
        setUsers(prev => prev.map(u => 
          u.id === referrer.id 
            ? { ...u, referralCount: u.referralCount + 1 }
            : u
        ));
      }
    }
  }, [users]);

  const updateUser = useCallback((userId: string, updates: Partial<UserWithPassword>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const getUserByEmail = useCallback((email: string) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }, [users]);

  const getUserById = useCallback((userId: string) => {
    return users.find(u => u.id === userId);
  }, [users]);

  const getUserByReferralCode = useCallback((code: string) => {
    return users.find(u => u.referralCode.toLowerCase() === code.toLowerCase());
  }, [users]);

  const getAllUsers = useCallback(() => {
    return users;
  }, [users]);

  const addTask = useCallback((task: AssignedTask, targetUserId?: string, targetLevel?: MembershipLevel) => {
    setTasks(prev => [...prev, task]);
    
    if (targetUserId) {
      setUsers(prev => prev.map(u => {
        if (u.id === targetUserId) {
          return { ...u, assignedTasks: [...u.assignedTasks, task] };
        }
        return u;
      }));
    } else if (targetLevel) {
      setUsers(prev => prev.map(u => {
        if (u.level === targetLevel && u.role !== 'admin') {
          return { ...u, assignedTasks: [...u.assignedTasks, { ...task, id: `${task.id}-${u.id}` }] };
        }
        return u;
      }));
    } else {
      setUsers(prev => prev.map(u => {
        if (u.role !== 'admin') {
          return { ...u, assignedTasks: [...u.assignedTasks, { ...task, id: `${task.id}-${u.id}` }] };
        }
        return u;
      }));
    }
  }, []);

  const updateTask = useCallback((taskId: string, userId: string, updates: Partial<AssignedTask>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          assignedTasks: u.assignedTasks.map(t => 
            t.id === taskId ? { ...t, ...updates } : t
          ),
        };
      }
      return u;
    }));
  }, []);

  const getUserTasks = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.assignedTasks || [];
  }, [users]);

  const getAllTasks = useCallback(() => {
    return tasks;
  }, [tasks]);

  const getAllPendingSubmissions = useCallback(() => {
    const submissions: { task: AssignedTask; user: UserWithPassword }[] = [];
    users.forEach(user => {
      user.assignedTasks
        .filter(t => t.status === 'submitted')
        .forEach(task => {
          submissions.push({ task, user });
        });
    });
    return submissions;
  }, [users]);

  const adjustUserBalance = useCallback((
    userId: string, 
    amount: number, 
    type: 'add' | 'subtract',
    reason: 'task' | 'referral' | 'admin'
  ) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const adjustment = type === 'add' ? amount : -amount;
        const newBalance = Math.max(0, u.totalBalance + adjustment);
        
        let taskEarnings = u.taskEarnings;
        let referralEarnings = u.referralEarnings;
        
        if (type === 'add') {
          if (reason === 'task') taskEarnings += amount;
          if (reason === 'referral') referralEarnings += amount;
        }
        
        return {
          ...u,
          totalBalance: newBalance,
          taskEarnings,
          referralEarnings,
        };
      }
      return u;
    }));
  }, []);

  const submitKYC = useCallback((userId: string, idType: IDType, idNumber: string, documentUrl?: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { 
        ...u, 
        kycStatus: 'pending' as KYCStatus,
        kycDocuments: {
          idType,
          idNumber,
          documentUrl,
          submittedAt: new Date().toISOString()
        }
      } : u
    ));
  }, []);

  const approveKYC = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, kycVerified: true, kycStatus: 'approved' as KYCStatus } : u
    ));
  }, []);

  const rejectKYC = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, kycVerified: false, kycStatus: 'rejected' as KYCStatus } : u
    ));
  }, []);

  const updateUserLevel = useCallback((userId: string, level: MembershipLevel) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, level } : u
    ));
  }, []);

  const updateUserReferralCount = useCallback((userId: string, count: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, referralCount: count } : u
    ));
  }, []);

  const updateUserReferralBonus = useCallback((userId: string, rate: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, referralBonusRate: rate } : u
    ));
  }, []);

  const updateUserReferralEarnings = useCallback((userId: string, earnings: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const difference = earnings - u.referralEarnings;
        return {
          ...u,
          referralEarnings: earnings,
          totalBalance: u.totalBalance + difference
        };
      }
      return u;
    }));
  }, []);

  const banUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'banned' } : u
    ));
  }, []);

  const unbanUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' } : u
    ));
  }, []);

  const addWithdrawal = useCallback((withdrawal: WithdrawalRequest) => {
    setWithdrawals(prev => [...prev, withdrawal]);
  }, []);

  const updateWithdrawal = useCallback((withdrawalId: string, status: 'approved' | 'rejected', adminNote?: string) => {
    setWithdrawals(prev => prev.map(w => 
      w.id === withdrawalId ? { ...w, status, adminNote, processedAt: new Date().toISOString() } : w
    ));
    
    if (status === 'approved') {
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if (withdrawal) {
        adjustUserBalance(withdrawal.userId, withdrawal.amount, 'subtract', 'admin');
      }
    }
  }, [withdrawals, adjustUserBalance]);

  const generatePasscodes = useCallback((level: MembershipLevel, quantity: number): Passcode[] => {
    const levelPrefixes: Record<MembershipLevel, string> = {
      1: 'STARTER',
      2: 'BRONZE',
      3: 'SILVER',
      4: 'GOLD',
      5: 'PLAT',
      6: 'DIAMOND'
    };
    
    const newCodes: Passcode[] = [];
    const year = new Date().getFullYear();
    
    for (let i = 0; i < quantity; i++) {
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `${levelPrefixes[level]}-${year}-${random}`;
      
      newCodes.push({
        code,
        level,
        used: false,
        createdAt: new Date().toISOString()
      });
    }
    
    setPasscodes(prev => [...prev, ...newCodes]);
    return newCodes;
  }, []);

  const validatePasscode = useCallback((code: string): { valid: boolean; level?: MembershipLevel } => {
    const passcode = passcodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (!passcode) return { valid: false };
    if (passcode.used) return { valid: false };
    return { valid: true, level: passcode.level };
  }, [passcodes]);

  const usePasscode = useCallback((code: string, userId: string): boolean => {
    const validation = validatePasscode(code);
    if (!validation.valid) return false;
    
    setPasscodes(prev => prev.map(p => 
      p.code.toUpperCase() === code.toUpperCase() 
        ? { ...p, used: true, usedBy: userId, usedAt: new Date().toISOString() }
        : p
    ));
    return true;
  }, [validatePasscode]);

  const getPasscodes = useCallback(() => {
    return passcodes;
  }, [passcodes]);

  const refreshData = useCallback(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <DataStoreContext.Provider value={{
      users,
      tasks,
      withdrawals,
      passcodes,
      addUser,
      updateUser,
      getUserByEmail,
      getUserById,
      getUserByReferralCode,
      getAllUsers,
      addTask,
      updateTask,
      getUserTasks,
      getAllTasks,
      getAllPendingSubmissions,
      adjustUserBalance,
      submitKYC,
      approveKYC,
      rejectKYC,
      updateUserLevel,
      updateUserReferralCount,
      updateUserReferralBonus,
      updateUserReferralEarnings,
      banUser,
      unbanUser,
      addWithdrawal,
      updateWithdrawal,
      generatePasscodes,
      validatePasscode,
      usePasscode,
      getPasscodes,
      refreshData,
    }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
}
