import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataStoreProvider } from './contexts/DataStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/user/UserDashboard';
import { TasksPage } from './pages/user/TasksPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { WithdrawalPage } from './pages/user/WithdrawalPage';
import { ReferralsPage } from './pages/user/ReferralsPage';
import { KYCPage } from './pages/user/KYCPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { TaskManagementPage } from './pages/admin/TaskManagementPage';
import { FinancePage } from './pages/admin/FinancePage';
import { KYCApprovalPage } from './pages/admin/KYCApprovalPage';

function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute requiredRole="user"><TasksPage /></ProtectedRoute>} />
      <Route path="/referrals" element={<ProtectedRoute requiredRole="user"><ReferralsPage /></ProtectedRoute>} />
      <Route path="/kyc" element={<ProtectedRoute requiredRole="user"><KYCPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />
      <Route path="/withdraw" element={<ProtectedRoute requiredRole="user"><WithdrawalPage /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute requiredRole="admin"><TaskManagementPage /></ProtectedRoute>} />
      <Route path="/admin/kyc" element={<ProtectedRoute requiredRole="admin"><KYCApprovalPage /></ProtectedRoute>} />
      <Route path="/admin/finance" element={<ProtectedRoute requiredRole="admin"><FinancePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <ThemeProvider>
        <DataStoreProvider>
          <AuthProvider>
            <CurrencyProvider>
              <AnimatedBackground />
              <AppRoutes />
            </CurrencyProvider>
          </AuthProvider>
        </DataStoreProvider>
      </ThemeProvider>
    </Router>
  );
}
