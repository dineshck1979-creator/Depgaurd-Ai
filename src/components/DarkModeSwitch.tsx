import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DarkModeSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 select-none">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <button
        type="button"
        id="dark-mode-toggle-switch"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode theme"
        onClick={toggleTheme}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isDark
            ? 'bg-indigo-600 border-indigo-500 shadow-inner'
            : 'bg-slate-200 border-slate-300 shadow-xs'
        }`}
      >
        <span className="sr-only">Toggle dark mode</span>
        {/* Sliding Thumb */}
        <span
          className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
            isDark ? 'translate-x-7 bg-slate-900 text-amber-300' : 'translate-x-1 bg-white text-amber-500'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-current text-indigo-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-current text-amber-500" />
          )}
        </span>
      </button>
    </div>
  );
};
