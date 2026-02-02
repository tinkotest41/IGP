import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencySwitcher } from '../ui/CurrencySwitcher';
import { LayoutDashboard, CheckSquare, User, LogOut, Wallet, Menu, X, Users, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
export function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [{
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    label: 'Tasks',
    path: '/tasks',
    icon: CheckSquare
  }, {
    label: 'Referrals',
    path: '/referrals',
    icon: Users
  }, {
    label: 'Withdraw',
    path: '/withdraw',
    icon: Wallet
  }, {
    label: 'KYC',
    path: '/kyc',
    icon: ShieldCheck
  }, {
    label: 'Profile',
    path: '/profile',
    icon: User
  }];
  return <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="font-bold text-black">E</span>
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline-block">
              EXCLUSIVE<span className="text-amber-500">AGENCY</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-100'}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>)}
          </nav>

          <div className="flex items-center gap-4">
            <CurrencySwitcher />
            <div className="hidden md:flex items-center gap-3 border-l border-zinc-800 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-zinc-200">
                  {user?.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-500">
                    Level {user?.level}
                  </Badge>
                  {user?.kycVerified && <Badge variant="success" className="text-[10px]">
                      Verified
                    </Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-red-400">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-zinc-400 hover:text-zinc-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 z-30 top-16 bg-zinc-950 border-b border-zinc-800 p-4 animate-in slide-in-from-top-5">
          <nav className="flex flex-col gap-4">
            {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>)}
            <div className="border-t border-zinc-800 pt-4 mt-2">
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {user?.name}
                  </p>
                  <p className="text-xs text-amber-500">
                    Level {user?.level} Member
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </nav>
        </div>}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>;
}