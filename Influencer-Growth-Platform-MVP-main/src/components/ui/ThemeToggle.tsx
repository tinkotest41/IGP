import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-white/50 border border-zinc-700/50 hover:border-amber-500/50 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
      
      <div className="relative">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-500" />
        )}
      </div>
    </button>
  );
}
