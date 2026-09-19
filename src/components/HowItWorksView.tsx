import React from 'react';
import {
  Search,
  RefreshCw,
  CheckCircle,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Code2,
  Terminal,
  Zap,
  Layers
} from 'lucide-react';
import { NavTab } from '../types';
import { SecurityBoundaryPanel } from './SecurityBoundaryPanel';

interface HowItWorksViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: 1,
      name: 'Extract',
      icon: <Search className="w-5 h-5 text-indigo-600" />,
      color: 'indigo',
      badge: 'Active (Part 1)',
      title: 'Static Import Extraction',
      description:
        'Statically parses Python (import pkg, import pkg.sub, from pkg import ...) and JavaScript (import pkg from "pkg", import "pkg", require("pkg")) statements. Local and relative paths (./utils, ../components) are strictly filtered out.',
      details: [
        'Pure static parsing: 100% safe, zero code execution',
        'Extracts root packages from nested submodules',
        'Collects exact source line number and statement context for evidence',
      ],
    },
    {
      step: 2,
      name: 'Normalize',
      icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      badge: 'Active (Part 1)',
      title: 'Module-to-Package Normalization',
      description:
        'Resolves the critical discrepancy where Python module import names differ from their installable PyPI distribution packages.',
      details: [
        'PIL → Pillow',
        'cv2 → opencv-python',
        'sklearn → scikit-learn',
        'bs4 → beautifulsoup4',
      ],
    },
    {
      step: 3,
      name: 'Verify',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      badge: 'Active (Part 2)',
      title: 'Upstream Registry Verification',
      description:
        'Queries authoritative public registries (PyPI JSON API and npm Registry API) in real time to determine whether each extracted package exists, retrieving live version and metadata.',
      details: [
        'Deterministic verification: PyPI JSON API and npm Registry API',
        'Distinguishes real packages (VERIFIED) from hallucinations (UNVERIFIED 404)',
        'Requires review for normalized aliases and built-in standard libraries',
        'Gracefully handles network timeouts (REGISTRY UNAVAILABLE)',
      ],
    },
    {
      step: 4,
      name: 'Analyze',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      badge: 'Part 3 (Gemini Analysis)',
      title: 'Threat & Health Analysis',
      description:
        'Calculates risk vectors such as package age, typosquatting proximity (e.g. reqeusts vs requests), unverified maintainers, and sudden spikes in artificial downloads.',
      details: [
        'Typosquatting and slopsquatting identification',
        'Telemetry on maintainer reputation and release cadence',
        'Known vulnerability and malware advisory checking',
      ],
    },
    {
      step: 5,
      name: 'Explain',
      icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
      color: 'teal',
      badge: 'Part 3 Pipeline',
      title: 'Actionable Intelligence',
      description:
        'Synthesizes technical registry evidence into clear, developer-friendly warnings and suggestions.',
      details: [
        'Plain-English security verdict for each dependency',
        'Safe replacement recommendations if a hallucination is caught',
        'Summary reports for CI/CD and pull request gates',
      ],
    },
    {
      step: 6,
      name: 'Developer Decides',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      badge: 'Core Philosophy',
      title: 'Informed Execution',
      description:
        'Developers maintain sovereign control over their environment. Armed with transparent evidence, you choose what gets installed.',
      details: [
        'Generates safe install commands for verified packages only',
        'Prevents blind `pip install` copy-pasting from AI chats',
        'Preserves developer velocity without compromising supply-chain security',
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Layers className="w-3.5 h-3.5" />
          <span>The DepGuard AI Architecture</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          How It Works: The 6-Stage Pipeline
        </h1>
        <p className="text-base text-slate-600">
          AI coding assistants are revolutionizing developer velocity, but blind dependency installation exposes teams to supply chain sabotage. Here is how DepGuard AI safeguards your workflow:
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm overflow-x-auto">
        <div className="min-w-[650px] flex items-center justify-between">
          {['Extract', 'Normalize', 'Verify', 'Analyze', 'Explain', 'Developer Decides'].map((item, idx) => (
            <React.Fragment key={item}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-indigo-400 text-sm">
                  0{idx + 1}
                </div>
                <span className="text-xs font-semibold tracking-wide text-slate-200">{item}</span>
              </div>
              {idx < 5 && <ArrowRight className="w-5 h-5 text-slate-600 shrink-0 mx-2" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pipeline Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div
            key={s.step}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-100">{s.icon}</div>
                  <span className="font-mono text-xs text-slate-500 font-bold">STAGE 0{s.step}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {s.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                <h4 className="text-xs font-semibold text-indigo-600 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <ul className="space-y-1.5 text-2xs text-slate-600">
                {s.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start space-x-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Normalization In-Depth Showcase */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">Why Dependency Normalization is Essential</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          In Python, the name used in an <code className="font-mono text-xs bg-slate-100 px-1 py-0.5">import</code> statement frequently does not match the package name on PyPI. Running <code className="font-mono text-xs bg-slate-100 px-1 py-0.5">pip install cv2</code> or <code className="font-mono text-xs bg-slate-100 px-1 py-0.5">pip install PIL</code> will either fail or install an obsolete/counterfeit placeholder.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Code Import Name</th>
                <th className="px-4 py-2.5">Normalized PyPI Package</th>
                <th className="px-4 py-2.5">Why It Matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="px-4 py-3 text-slate-900 font-bold">PIL</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">Pillow</td>
                <td className="px-4 py-3 font-sans text-slate-600">Original PIL was discontinued in 2009; Pillow is the actively maintained fork.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900 font-bold">cv2</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">opencv-python</td>
                <td className="px-4 py-3 font-sans text-slate-600">cv2 is an internal C-extension module; opencv-python is the PyPI distribution.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900 font-bold">sklearn</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">scikit-learn</td>
                <td className="px-4 py-3 font-sans text-slate-600">The historical sklearn package is deprecated and forwards to scikit-learn.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-900 font-bold">bs4</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">beautifulsoup4</td>
                <td className="px-4 py-3 font-sans text-slate-600">BeautifulSoup v3 is obsolete; bs4 module resides in beautifulsoup4 package.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('scanner')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Test these mappings in the Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Security Boundary Enforcement */}
      <SecurityBoundaryPanel />
    </div>
  );
};
