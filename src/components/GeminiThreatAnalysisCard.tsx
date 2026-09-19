import React from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Lock,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { GeminiThreatAnalysis, SuspiciousSignal } from '../types';

interface GeminiThreatAnalysisCardProps {
  analysis: GeminiThreatAnalysis;
  source?: string;
  onReanalyze?: () => void;
  isLoading?: boolean;
}

export const GeminiThreatAnalysisCard: React.FC<GeminiThreatAnalysisCardProps> = ({
  analysis,
  source,
  onReanalyze,
  isLoading = false,
}) => {
  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            CRITICAL RISK
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            HIGH RISK
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-yellow-600" />
            MEDIUM RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            LOW RISK
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: SuspiciousSignal['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Info
          </span>
        );
    }
  };

  return (
    <div id="gemini-threat-analysis-card" className="bg-white rounded-xl border-2 border-indigo-200 shadow-sm overflow-hidden space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-indigo-200 flex items-center justify-center border border-white/20 backdrop-blur-xs shrink-0">
              <BrainCircuit className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Gemini Threat Analysis
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-mono font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  {source === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'AI Supply Chain Intelligence'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Zero code sent • Strictly evaluated from upstream public registry evidence
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {getRiskBadge(analysis.overallRisk)}
            {onReanalyze && (
              <button
                onClick={onReanalyze}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                title="Re-run threat analysis"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Executive Plain-Language Summary */}
        <div className="mt-4 p-3.5 rounded-lg bg-white/10 border border-white/15 text-xs sm:text-sm text-indigo-50 leading-relaxed">
          {analysis.summary}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Section 1: Verified Registry Facts vs AI Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Verified Upstream Registry Facts (Immutable Evidence)</span>
            </h4>
            <span className="text-3xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Deterministic Public Data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.verifiedFacts.map((fact, index) => (
              <div
                key={index}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono flex items-start space-x-2"
              >
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{fact.replace('[REGISTRY FACT] ', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Suspicious Signals & Supply-Chain Warnings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. Suspicious Signals & Vulnerability Risks</span>
            </h4>
            <span className="text-3xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              AI-Synthesized Threat Vectors
            </span>
          </div>

          {analysis.suspiciousSignals.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
              No anomalous signals or hallucination risks detected for these verified dependencies.
            </p>
          ) : (
            <div className="space-y-2.5">
              {analysis.suspiciousSignals.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                    item.severity === 'critical'
                      ? 'bg-rose-50/70 border-rose-200'
                      : item.severity === 'warning'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-blue-50/70 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{item.package}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">{item.signal}</span>
                    </div>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-2xs sm:text-xs">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Critical Security Advisory */}
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 space-y-1.5 shadow-2xs">
          <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-amber-900">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Critical Security Notice (Zero-Trust Model)</span>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            {analysis.securityAdvisory}
          </p>
        </div>

        {/* Section 4: Actionable Developer Recommendations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <span>3. Actionable Developer Recommendations</span>
          </h4>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {analysis.recommendations.map((rec, i) => (
              <li
                key={i}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-3xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer: Metadata */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-3xs text-slate-500 font-mono">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Analysis Generated: {new Date(analysis.analyzedAt).toLocaleTimeString()}</span>
          </span>
          <span>Zero Execution Sandbox • Strict Evidence Model</span>
        </div>
      </div>
    </div>
  );
};
