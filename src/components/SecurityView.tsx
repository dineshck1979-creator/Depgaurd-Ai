import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileCode,
  DownloadCloud,
  CheckCircle2,
  AlertOctagon,
  Database,
  Cpu,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { NavTab } from '../types';
import { SecurityBoundaryPanel } from './SecurityBoundaryPanel';

interface SecurityViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Architecture & Guarantees</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          DepGuard AI Security Model
        </h1>
        <p className="text-base text-slate-600">
          When analyzing potentially malicious or untrusted AI-generated code snippets, the security of the analysis tool itself is paramount. DepGuard AI operates under strict zero-execution, zero-installation boundaries.
        </p>
      </div>

      {/* Embedded Security Boundary Panel (Explicit 6 Boundaries) */}
      <SecurityBoundaryPanel />

      {/* Threat Landscape: AI Dependency Hallucination */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Threat Briefing: AI Dependency Attacks</h2>
            <p className="text-xs text-slate-500">Why pre-install inspection is a non-negotiable security control</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Package Hallucination Exploits</h3>
            <p className="leading-relaxed">
              When LLMs are prompted to solve complex tasks, they frequently predict statistically plausible package names that do not actually exist (e.g. <code className="font-mono bg-white px-1 py-0.5 border border-slate-200 text-rose-600">totally_fake_package_928374</code> or <code className="font-mono bg-white px-1 py-0.5 border border-slate-200 text-rose-600">huggingface-pytorch-utils</code>).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">2. “Slopsquatting” & Typosquatting</h3>
            <p className="leading-relaxed">
              Adversaries continuously scrape common LLM code answers, identify recurring fabricated import names, and claim them on PyPI and npm with embedded telemetry, credentials stealers, or reverse shells.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">3. The Install-Time Code Execution Danger</h3>
            <p className="leading-relaxed">
              In Python, simply executing <code className="font-mono bg-white px-1 py-0.5 border border-slate-200">pip install package</code> runs <code className="font-mono bg-white px-1 py-0.5 border border-slate-200">setup.py</code> with full user permissions. In JavaScript, <code className="font-mono bg-white px-1 py-0.5 border border-slate-200">preinstall</code> and <code className="font-mono bg-white px-1 py-0.5 border border-slate-200">postinstall</code> hooks run immediately.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">4. The DepGuard AI Defense</h3>
            <p className="leading-relaxed">
              By placing DepGuard AI between the AI code output and your local terminal or CI/CD container, every dependency is isolated, extracted, and verified against legitimate registry history before a single byte of untrusted package code touches your disk.
            </p>
          </div>
        </div>

        {/* Advisory Warning */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Important Limitation: Registry Existence ≠ Safety Guarantee</h4>
            <p className="text-2xs leading-relaxed">
              Verifying that a package exists on PyPI or npm proves that the name is registered and exists on the registry. It does not automatically mean the code is safe, vetted, or free of vulnerabilities. Registry metadata is technical evidence to inform developer judgment, not a substitute for human review or security audits.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => onNavigate('scanner')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <span>Launch Scanner to Inspect Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
