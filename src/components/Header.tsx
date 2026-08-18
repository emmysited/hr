import React from 'react';
import { Briefcase, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onShowHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs" id="main-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand and Portal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B3A6B] flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Candidate Assessment Portal
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Verified Role
              </span>
            </div>
            <p className="text-xs text-slate-700 hidden sm:block">
              Role Simulation & Assessment Process
            </p>
          </div>
        </div>

        {/* Action / Help */}
        <div className="flex items-center gap-2">
          {onShowHelp && (
            <button
              id="help-toggle-btn"
              onClick={onShowHelp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help & Instructions</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
