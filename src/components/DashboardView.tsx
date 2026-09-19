import React from 'react';
import {
  ShieldAlert,
  Terminal,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Layers,
  FileSearch,
  BookOpen,
  Code,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from '../types';
import { VerificationWorkflow } from './VerificationWorkflow';
import { SecurityBoundaryPanel } from './SecurityBoundaryPanel';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Hero / Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gradient-to-br from-indigo-100/60 to-blue-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neural Nexus Hackathon 2026 • DepGuard AI (Part 3 Final)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            DepGuard AI
          </h1>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            Pre-installation dependency verification and supply chain threat intelligence tool for AI-generated Python and JavaScript code. Inspect dependencies and review Gemini risk analysis before running <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-bold">pip install</code> or <code className="font-mono text-sm bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-bold">npm install</code>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-launch-scanner-btn"
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Code Scanner</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              id="dashboard-how-it-works-btn"
              onClick={() => onNavigate('how-it-works')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Architecture</span>
            </button>
            <button
              id="dashboard-security-btn"
              onClick={() => onNavigate('security')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security Model</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Workflow Stepper */}
      <VerificationWorkflow />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Ecosystems</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">PyPI & npm</div>
          <p className="text-xs text-slate-700 mt-1 font-medium">Live upstream public registry APIs</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Zero Execution</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">0% Executed</div>
          <p className="text-xs text-slate-700 mt-1 font-medium">100% pure static tokenization</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Gemini Intelligence</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600">Threat Analysis</div>
          <p className="text-xs text-slate-700 mt-1 font-medium">Evidence-only LLM reasoning</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Decision Model</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">Human in Loop</div>
          <p className="text-xs text-slate-700 mt-1 font-medium">Zero automated package downloads</p>
        </div>
      </div>

      {/* Threat Context & Value Proposition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Why DepGuard AI */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">The Problem: AI Package Hallucination & Slopsquatting</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Large Language Models (LLMs) frequently generate syntactically convincing code containing <em>non-existent packages</em> (e.g., <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 text-rose-600">totally_fake_package_928374</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 text-rose-600">flask-oauth-secure</code>).
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Threat actors monitor public LLM hallucination patterns and register these counterfeit package names on PyPI and npm. When an unsuspecting developer copies code from ChatGPT, Claude, or Copilot and runs <code className="font-mono text-xs bg-slate-100 px-1 py-0.5">pip install</code>, malicious payload scripts execute immediately via setup hooks.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">How DepGuard AI Protects Developers:</h3>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Extracts third-party requirements before you run your terminal package manager.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Translates internal module aliases to official distribution names (e.g. <code>PIL</code> → <code>Pillow</code>).</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verifies existence against real public registry APIs (never hardcoded mocks).</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Synthesizes threat signals with Gemini without ever sending user source code.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Launch & Testing Info */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-mono bg-white/10 text-indigo-200 border border-white/10">
              <Code className="w-3.5 h-3.5" />
              <span>Hackathon Live Demo</span>
            </div>
            <h2 className="text-lg font-bold text-white">Test Sample Code</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scan pre-configured test snippets containing verified imports alongside counterfeit test packages like <code className="font-mono text-xs text-indigo-300 bg-white/10 px-1 py-0.5 rounded">totally_fake_package_928374</code>.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('scanner')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white transition-colors flex items-center justify-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Go to Scanner Now</span>
            </button>
            <p className="text-3xs text-slate-400 text-center font-mono">
              Part 3 Active: Gemini Threat Analysis Enabled
            </p>
          </div>
        </div>
      </div>

      {/* Enforced Security Boundaries */}
      <SecurityBoundaryPanel />
    </div>
  );
};
