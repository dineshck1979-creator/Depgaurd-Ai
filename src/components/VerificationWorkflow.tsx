import React from 'react';
import {
  FileSearch,
  Sliders,
  ShieldCheck,
  BrainCircuit,
  MessageSquareQuote,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface VerificationWorkflowProps {
  currentStage?: 'idle' | 'extracting' | 'verifying' | 'analyzing' | 'completed';
  compact?: boolean;
}

export const VerificationWorkflow: React.FC<VerificationWorkflowProps> = ({
  currentStage = 'completed',
  compact = false,
}) => {
  const steps = [
    {
      id: 'extract',
      name: 'Extract',
      desc: 'Static AST & Regex',
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      id: 'normalize',
      name: 'Normalize',
      desc: 'Distribution Mapping',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'verify',
      name: 'Verify',
      desc: 'Live PyPI / npm APIs',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'analyze',
      name: 'Analyze',
      desc: 'Gemini Threat Signals',
      icon: <BrainCircuit className="w-4 h-4" />,
    },
    {
      id: 'explain',
      name: 'Explain',
      desc: 'Developer Intelligence',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      id: 'decide',
      name: 'Developer Decides',
      desc: 'Zero Auto-Install',
      icon: <UserCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            End-to-End Verification Workflow
          </h2>
        </div>
        <span className="text-2xs text-slate-500 font-medium">
          Zero Code Execution • Zero Package Installation • Human-in-the-Loop
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="relative flex flex-col justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-md bg-white text-indigo-700 font-bold text-2xs flex items-center justify-center border border-slate-200 shadow-2xs">
                  {idx + 1}
                </span>
                <span className="text-slate-500">{step.icon}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">{step.name}</h3>
              <p className="text-3xs text-slate-700 mt-0.5 leading-normal">{step.desc}</p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
