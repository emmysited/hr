import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" id="help-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1B3A6B]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assessment Portal Guide</h3>
            <p className="text-xs text-slate-500">How the 3-step candidate evaluation works</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A6B] text-white text-xs flex items-center justify-center font-bold">1</span>
              Step 1: Screening Application
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Submit your basic contact details, highest degree of education, years of experience, and current location. The automated qualification filter verifies fit for this role.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A6B] text-white text-xs flex items-center justify-center font-bold">2</span>
              Step 2: Real-World Simulation Task
            </h4>
            <p className="text-slate-600 leading-relaxed">
              You will be presented with a realistic workplace prompt. A countdown timer will track your allotted time limit. When ready, click Submit, or the system will automatically submit when the timer expires.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A6B] text-white text-xs flex items-center justify-center font-bold">3</span>
              Step 3: Instant Score & Breakdown
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Receive your score out of 100 alongside clear justifications and rubric dimensions. Our talent team receives your full submission for review.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1B3A6B] hover:bg-[#142d54] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Got it, let's continue
          </button>
        </div>
      </div>
    </div>
  );
};
