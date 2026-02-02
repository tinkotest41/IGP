import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, CheckSquare, DollarSign, LogOut, ShieldAlert, ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
export function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [{
    label: 'Overview',
    path: '/admin',
    icon: LayoutDashboard
  }, {
    label: 'Users',
    path: '/admin/users',
    icon: Users
  }, {
    label: 'Tasks',
    path: '/admin/tasks',
    icon: CheckSquare
  }, {
    label: 'KYC Approval',
    path: '/admin/kyc',
    icon: ShieldCheck
  }, {
    label: 'Finance',
    path: '/admin/finance',
    icon: DollarSign
  }];
  return <div className="min-h-screen bg-zinc-950 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col fixed h-full">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-100">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span className="font-bold tracking-tight">
              ADMIN<span className="text-red-500">PANEL</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>)}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-red-400" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <aside className="fixed inset-0 z-40 md:hidden bg-black/50">
          <div className="w-64 h-full border-r border-zinc-800 bg-zinc-950 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-100">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <span className="font-bold tracking-tight">ADMIN</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => <Link key={item.path} to={item.path} onClick={handleNavClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>)}
            </nav>

            <div className="p-4 border-t border-zinc-800">
              <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-red-400" onClick={() => { handleLogout(); handleNavClick(); }}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 md:hidden sticky top-0 z-40">
          <div className="flex items-center gap-2 text-zinc-100">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span className="font-bold">ADMIN</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-zinc-100">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>;
}