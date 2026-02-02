import React from 'react';
import { Link } from 'react-router-dom';
import { MultiStepSignup } from '../components/forms/MultiStepSignup';

export function SignupPage() {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Cyber Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
        
        {/* Perspective Grid Animation */}
        <div className="absolute inset-0 perspective-grid opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0',
            animation: 'grid-flow 20s linear infinite'
          }} />
        </div>

        {/* Holographic Orbs - More Visible */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-2xl animate-pulse bg-amber-500/20" style={{
          boxShadow: '0 0 100px rgba(251, 146, 60, 0.4)',
          animationDuration: '4s'
        }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-2xl animate-pulse bg-purple-500/20" style={{
          boxShadow: '0 0 100px rgba(168, 85, 247, 0.4)',
          animationDelay: '1s',
          animationDuration: '4s'
        }} />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full blur-2xl animate-pulse bg-cyan-500/15" style={{
          boxShadow: '0 0 80px rgba(34, 211, 238, 0.3)',
          animationDelay: '2s',
          animationDuration: '4s'
        }} />

        {/* Neon Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" style={{ mixBlendMode: 'screen' }}>
          <defs>
            <linearGradient id="neonGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.8)" />
              <stop offset="50%" stopColor="rgba(34, 211, 238, 0.6)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
            </linearGradient>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Diagonal Lines */}
          <line x1="0%" y1="20%" x2="100%" y2="80%" stroke="url(#neonGradient2)" strokeWidth="2" filter="url(#glow2)" />
          <line x1="100%" y1="20%" x2="0%" y2="80%" stroke="url(#neonGradient2)" strokeWidth="2" filter="url(#glow2)" />
          
          {/* Corner Lines */}
          <line x1="0%" y1="0%" x2="30%" y2="30%" stroke="url(#neonGradient2)" strokeWidth="1.5" filter="url(#glow2)" opacity="0.6" />
          <line x1="100%" y1="0%" x2="70%" y2="30%" stroke="url(#neonGradient2)" strokeWidth="1.5" filter="url(#glow2)" opacity="0.6" />
          <line x1="0%" y1="100%" x2="30%" y2="70%" stroke="url(#neonGradient2)" strokeWidth="1.5" filter="url(#glow2)" opacity="0.6" />
          <line x1="100%" y1="100%" x2="70%" y2="70%" stroke="url(#neonGradient2)" strokeWidth="1.5" filter="url(#glow2)" opacity="0.6" />
          
          {/* Horizontal Tech Lines */}
          <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="url(#neonGradient2)" strokeWidth="1" filter="url(#glow2)" opacity="0.4" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="url(#neonGradient2)" strokeWidth="1" filter="url(#glow2)" opacity="0.4" />
          <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="url(#neonGradient2)" strokeWidth="1" filter="url(#glow2)" opacity="0.4" />
        </svg>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                opacity: 0.4,
                boxShadow: '0 0 10px rgba(251, 146, 60, 0.8)',
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
              opacity: 0.3;
            }
            50% { 
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
              opacity: 0.6;
            }
          }
          .perspective-grid {
            perspective: 1000px;
          }
        `}</style>
      </div>

      <div className="w-full max-w-md mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 mb-6 shadow-lg shadow-amber-500/20">
          <span className="font-bold text-xl text-black">E</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 font-cyber">Join the Network</h1>
        <p className="text-zinc-400">
          Complete the steps below to request access.
        </p>
      </div>

      <div className="w-full relative z-10">
        <MultiStepSignup />
      </div>

      <p className="mt-8 text-zinc-500 text-sm relative z-10">
        Already a member?{' '}
        <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>;
}