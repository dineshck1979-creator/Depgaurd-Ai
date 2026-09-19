import React from 'react';
import { ShieldCheck, GitBranch, Heart } from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">DepGuard AI</span>
            <span className="text-slate-400">|</span>
            <span>Built by <strong className="text-slate-700">Team Neural Nexus</strong> for Hackathon 2026</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('scanner')}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Scanner
            </button>
            <button
              onClick={() => onSelectTab('how-it-works')}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onSelectTab('security')}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Security
            </button>
          </div>

          <div className="text-slate-400 font-mono text-2xs">
            Zero-Execution Security Sandbox • MIT License
          </div>
        </div>
      </div>
    </footer>
  );
};
