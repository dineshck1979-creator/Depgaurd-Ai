import React, { useState } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ScannerView } from './components/ScannerView';
import { HowItWorksView } from './components/HowItWorksView';
import { SecurityView } from './components/SecurityView';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && <DashboardView onNavigate={setCurrentTab} />}
        {currentTab === 'scanner' && <ScannerView />}
        {currentTab === 'how-it-works' && <HowItWorksView onNavigate={setCurrentTab} />}
        {currentTab === 'security' && <SecurityView onNavigate={setCurrentTab} />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} />
    </div>
  );
}
