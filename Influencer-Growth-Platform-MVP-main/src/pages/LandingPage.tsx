import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Lock, CheckCircle, Zap, Shield, DollarSign, Star, TrendingUp, Moon, Sun } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../types';

export function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('landing-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const handleThemeChange = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('landing-theme', newTheme);
  };

  const levels = MEMBERSHIP_TIERS.map((tier, index) => ({
    level: tier.level,
    price: `$${tier.price}`,
    name: tier.name,
    color: index === 0 ? 'from-zinc-500 to-zinc-600' :
           index === 1 ? 'from-amber-700 to-amber-800' :
           index === 2 ? 'from-slate-400 to-slate-500' :
           index === 3 ? 'from-yellow-500 to-yellow-600' :
           index === 4 ? 'from-cyan-500 to-cyan-600' :
           'from-purple-500 to-purple-600',
    popular: index === 3,
    features: tier.features.slice(0, 5)
  }));

  const bgColor = isDark ? 'bg-zinc-950' : 'bg-white';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const cardBg = isDark ? 'bg-zinc-900/50' : 'bg-zinc-100/50';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const navBg = isDark ? 'bg-zinc-950/80' : 'bg-white/80';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-600';
  
  return <div className={`min-h-screen ${bgColor} ${textColor} selection:bg-amber-500/30 transition-colors duration-300`}>
      {/* Animated Cyber Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid Background */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950' : 'bg-gradient-to-b from-white via-zinc-50 to-white'}`} />
        
        {/* Perspective Grid Animation */}
        <div className={`absolute inset-0 perspective-grid ${isDark ? 'opacity-20' : 'opacity-30'}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(0deg, ${isDark ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.25)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(251, 146, 60, 0.15)' : 'rgba(251, 146, 60, 0.25)'} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
            animation: 'grid-flow 20s linear infinite'
          }} />
        </div>

        {/* Holographic Orbs - More Visible */}
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-amber-500/20' : 'bg-amber-400/30'}`} style={{
          boxShadow: isDark ? '0 0 100px rgba(251, 146, 60, 0.4)' : '0 0 100px rgba(251, 146, 60, 0.5)',
          animationDuration: '4s'
        }} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-purple-500/20' : 'bg-purple-400/30'}`} style={{
          boxShadow: isDark ? '0 0 100px rgba(168, 85, 247, 0.4)' : '0 0 100px rgba(168, 85, 247, 0.5)',
          animationDelay: '1s',
          animationDuration: '4s'
        }} />
        <div className={`absolute top-1/2 left-1/4 w-80 h-80 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/25'}`} style={{
          boxShadow: isDark ? '0 0 80px rgba(34, 211, 238, 0.3)' : '0 0 80px rgba(34, 211, 238, 0.4)',
          animationDelay: '2s',
          animationDuration: '4s'
        }} />

        {/* Neon Lines */}
        <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-40' : 'opacity-50'}`} preserveAspectRatio="none" style={{ mixBlendMode: 'screen' }}>
          <defs>
            <linearGradient id="neonGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? 'rgba(251, 146, 60, 0.8)' : 'rgba(251, 146, 60, 1)'} />
              <stop offset="50%" stopColor={isDark ? 'rgba(34, 211, 238, 0.6)' : 'rgba(34, 211, 238, 0.8)'} />
              <stop offset="100%" stopColor={isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 1)'} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Diagonal Lines */}
          <line x1="0%" y1="20%" x2="100%" y2="80%" stroke="url(#neonGradient1)" strokeWidth="2" filter="url(#glow)" />
          <line x1="100%" y1="20%" x2="0%" y2="80%" stroke="url(#neonGradient1)" strokeWidth="2" filter="url(#glow)" />
          
          {/* Corner Lines */}
          <line x1="0%" y1="0%" x2="30%" y2="30%" stroke="url(#neonGradient1)" strokeWidth="1.5" filter="url(#glow)" opacity="0.6" />
          <line x1="100%" y1="0%" x2="70%" y2="30%" stroke="url(#neonGradient1)" strokeWidth="1.5" filter="url(#glow)" opacity="0.6" />
          <line x1="0%" y1="100%" x2="30%" y2="70%" stroke="url(#neonGradient1)" strokeWidth="1.5" filter="url(#glow)" opacity="0.6" />
          <line x1="100%" y1="100%" x2="70%" y2="70%" stroke="url(#neonGradient1)" strokeWidth="1.5" filter="url(#glow)" opacity="0.6" />
          
          {/* Horizontal Tech Lines */}
          <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="url(#neonGradient1)" strokeWidth="1" filter="url(#glow)" opacity="0.4" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="url(#neonGradient1)" strokeWidth="1" filter="url(#glow)" opacity="0.4" />
          <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="url(#neonGradient1)" strokeWidth="1" filter="url(#glow)" opacity="0.4" />
        </svg>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                opacity: isDark ? 0.4 : 0.6,
                boxShadow: isDark ? '0 0 10px rgba(251, 146, 60, 0.8)' : '0 0 15px rgba(251, 146, 60, 1)',
              }}
            />
          ))}
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes grid-flow {
            0% { background-position: 0 0; }
            100% { background-position: 60px 60px; }
          }
          @keyframes float {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: ${isDark ? '0.3' : '0.5'};
            }
            50% { 
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
              opacity: ${isDark ? '0.6' : '0.8'};
            }
          }
          .perspective-grid {
            perspective: 1000px;
          }
        `}</style>
      </div>

      {/* Navbar */}
      <nav className={`w-full border-b ${borderColor} ${navBg} backdrop-blur-xl fixed top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="font-bold text-black text-lg">E</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                EXCLUSIVE
              </span>
              <p className={`text-[10px] ${textSecondary} uppercase tracking-wider`}>
                Influencer Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleThemeChange}
              className={`p-2 rounded-lg border ${borderColor} hover:bg-zinc-800 transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-amber-600" />
              )}
            </button>
            <Link to="/login" className={`text-sm font-medium ${textSecondary} hover:${isDark ? 'text-zinc-100' : 'text-zinc-900'} transition-colors hidden sm:block`}>
              Member Login
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="rounded-full shadow-lg shadow-amber-500/20">
                Join Network
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative pt-32 pb-20 px-6 overflow-hidden`}>
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 ${isDark ? 'bg-amber-500/5' : 'bg-amber-500/10'} text-amber-500 text-sm font-medium uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
            <Lock className="h-4 w-4" />
            Invitation-Only Network
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 leading-tight drop-shadow-lg">
            Turn Your Influence Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Consistent Income
            </span>
          </h1>

          <p className={`text-xl sm:text-2xl ${textSecondary} max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200`}>
            Join the elite network of creators earning daily from premium brand
            campaigns. Six exclusive membership tiers. Unlimited earning potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 text-base shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-shadow hover:scale-105 duration-200">
                Start Earning Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className={`w-full sm:w-auto rounded-full px-8 text-base border-zinc-700 hover:border-zinc-600 ${isDark ? 'hover:bg-zinc-900' : 'hover:bg-zinc-200'}`}>
                Member Access
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-8 pt-12 text-sm ${textSecondary} animate-in fade-in duration-1000 delay-500`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>1,200+ Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>$45K+ Paid Out</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 px-6 ${isDark ? 'bg-zinc-900/30' : 'bg-zinc-100/30'} border-y ${borderColor}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-4`}>
              How It Works
            </h2>
            <p className={textSecondary}>
              Simple, transparent, and profitable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[{
            step: '01',
            icon: Lock,
            title: 'Get Invited',
            desc: 'Receive a referral code from an existing member or purchase access.'
          }, {
            step: '02',
            icon: Star,
            title: 'Choose Your Level',
            desc: 'Select from 3 membership tiers based on your goals and commitment.'
          }, {
            step: '03',
            icon: Zap,
            title: 'Complete Tasks',
            desc: 'Access daily tasks from top brands. Follow, like, share, and earn.'
          }, {
            step: '04',
            icon: DollarSign,
            title: 'Get Paid',
            desc: 'Withdraw earnings once you hit $15 and 5 referrals. Fast payouts.'
          }].map((item, i) => <div key={i} className={`relative group hover:scale-105 transition-transform duration-300`}>
                <div className="text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-zinc-200 to-zinc-300 border-zinc-400'} border mb-6 relative`}>
                    <item.icon className="h-8 w-8 text-amber-500" />
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold ${textColor} mb-3`}>
                    {item.title}
                  </h3>
                  <p className={textSecondary}>{item.desc}</p>
                </div>
                {i < 3 && <div className={`hidden md:block absolute top-8 left-full w-full h-0.5 ${isDark ? 'bg-gradient-to-r from-zinc-700 to-transparent' : 'bg-gradient-to-r from-zinc-400 to-transparent'}`} />}
              </div>)}
          </div>
        </div>
      </section>

      {/* Membership Levels */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-4`}>
              Choose Your Level
            </h2>
            <p className={textSecondary}>
              Unlock higher earnings as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, i) => <div key={i} className={`relative rounded-2xl border transition-all duration-300 hover:shadow-2xl ${level.popular ? `border-amber-500/50 ${isDark ? 'shadow-2xl shadow-amber-500/20' : 'shadow-lg shadow-amber-500/30'}` : borderColor} ${cardBg} backdrop-blur-sm p-8 ${isDark ? 'hover:border-zinc-700' : 'hover:border-zinc-400'} group hover:scale-105`}>
                {level.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>}

                <div className="text-center mb-8">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${level.color} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <span className="text-2xl font-bold text-white">
                      {level.level}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
                    {level.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl font-bold ${textColor}`}>
                      {level.price}
                    </span>
                    <span className={textSecondary}>one-time</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {level.features.map((feature, j) => <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{feature}</span>
                    </li>)}
                </ul>

                <Link to="/signup">
                  <Button variant={level.popular ? 'primary' : 'outline'} className="w-full rounded-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 px-6 ${isDark ? 'bg-zinc-900/30' : 'bg-zinc-100/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Shield,
            title: 'Secure & Verified',
            desc: 'KYC verification ensures a trusted community of real creators.'
          }, {
            icon: TrendingUp,
            title: 'Referral Bonuses',
            desc: 'Earn 5% commission on every task your referrals complete.'
          }, {
            icon: Zap,
            title: 'Instant Payouts',
            desc: 'Withdraw your earnings as soon as you hit the threshold.'
          }].map((feature, i) => <div key={i} className={`p-8 rounded-2xl border ${borderColor} ${cardBg} backdrop-blur-sm ${isDark ? 'hover:bg-zinc-900' : 'hover:bg-zinc-200'} transition-colors group hover:scale-105 duration-300`}>
                <div className={`h-12 w-12 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'} flex items-center justify-center mb-6 text-amber-500 group-hover:shadow-lg transition-shadow`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl font-bold ${textColor} mb-3`}>
                  {feature.title}
                </h3>
                <p className={textSecondary}>{feature.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl border ${borderColor} bg-gradient-to-br ${isDark ? 'from-zinc-900 to-zinc-950' : 'from-zinc-100 to-white'} p-12 relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-amber-500/5 to-purple-500/5' : 'bg-gradient-to-br from-amber-500/10 to-purple-500/10'}`} />
            <div className="relative z-10">
              <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-4`}>
                Ready to Start Earning?
              </h2>
              <p className={`text-xl ${textSecondary} mb-8`}>
                Join 1,200+ creators already making money with their influence
              </p>
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 shadow-2xl shadow-amber-500/30 hover:scale-110 transition-transform duration-200">
                  Apply for Membership <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'} py-8 px-6 text-center ${textSecondary} text-sm`}>
        <p>&copy; 2024 Exclusive Influencer Agency. All rights reserved.</p>
      </footer>
    </div>;
}