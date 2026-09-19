import React from 'react';
import {
  ShieldAlert,
  Terminal,
  Ban,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const SecurityBoundaryPanel: React.FC = () => {
  const boundaries = [
    {
      title: 'No Code Execution',
      desc: 'Submitted Python or JavaScript code is never executed, evaluated, or run in any container or sandbox. Extraction operates strictly via static syntax tokenization and AST parsing.',
      icon: <Ban className="w-4 h-4 text-rose-600" />,
      badge: 'Zero Runtime',
      color: 'rose',
    },
    {
      title: 'No pip install',
      desc: 'DepGuard AI never invokes pip, wheels, or setup.py scripts. This completely neutralizes malicious install-time hooks, pre-install binaries, and arbitrary shell triggers.',
      icon: <Terminal className="w-4 h-4 text-amber-600" />,
      badge: 'No pip Process',
      color: 'amber',
    },
    {
      title: 'No npm install',
      desc: 'DepGuard AI never invokes npm, npx, yarn, or pnpm. It never triggers package.json postinstall lifecycle scripts that threat actors weaponize in Node.js supply-chain attacks.',
      icon: <Terminal className="w-4 h-4 text-amber-600" />,
      badge: 'No npm Process',
      color: 'amber',
    },
    {
      title: 'No Automatic Package Installation',
      desc: 'No packages are ever downloaded, cached, or installed in the background. Automated downloads represent a primary vector for remote code execution.',
      icon: <Lock className="w-4 h-4 text-blue-600" />,
      badge: 'Zero Auto-Download',
      color: 'blue',
    },
    {
      title: 'Registry Metadata Is Evidence, Not a Safety Guarantee',
      desc: 'Proving that a package exists on PyPI or npm proves only that the name is registered. It DOES NOT guarantee that the package code is clean, safe, maintained, or free from malware.',
      icon: <AlertTriangle className="w-4 h-4 text-indigo-600" />,
      badge: 'Zero Trust Principle',
      color: 'indigo',
    },
    {
      title: 'Developer Makes the Final Decision',
      desc: 'DepGuard AI provides transparent, factual evidence and threat signals. The human developer reviews the findings and retains absolute control over whether to install.',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      badge: 'Human-in-the-Loop',
      color: 'emerald',
    },
  ];

  return (
    <div id="security-boundary-panel" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              DepGuard AI Security Boundaries
            </h2>
            <p className="text-2xs text-slate-700 font-medium">
              Strict isolation policies governing dependency verification and AI analysis
            </p>
          </div>
        </div>
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <CheckCircle2 className="w-3 h-3" />
          <span>Enforced In All Environments</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {boundaries.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2 hover:bg-slate-100/60 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    {item.icon}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                </div>
              </div>
              <p className="text-2xs text-slate-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-3xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Boundary #{idx + 1}
              </span>
              <span className="text-3xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
