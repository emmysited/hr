import React from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import { ApplicationFormData } from '../types';

interface RejectionViewProps {
  formData: ApplicationFormData;
  rejectionReason?: string;
  onEditApplication: () => void;
  onReset: () => void;
}

export const RejectionView: React.FC<RejectionViewProps> = ({
  formData,
  rejectionReason,
  onEditApplication,
  onReset,
}) => {
  return (
    <div className="w-full max-w-2xl" id="rejection-view-card">
      <div className="card p-8">
        <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-6 text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2 tracking-tight">
          Application Status
        </h2>

        <p className="text-sm text-[#4b5563] mb-6 leading-relaxed">
          Thank you for applying, <strong className="text-slate-800">{formData.fullName}</strong>.
          Based on the initial qualification screening for this role, we are unable to advance your application to the simulation phase at this time.
        </p>

        {rejectionReason && (
          <div className="bg-[#f8fafc] border border-slate-200 rounded-md p-4 mb-6 text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-slate-900 block mb-1">Feedback Note:</span>
            {rejectionReason}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="edit-application-btn"
            onClick={onEditApplication}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Review & Edit Details
          </button>

          <button
            id="start-over-btn"
            onClick={onReset}
            className="btn-primary w-full sm:w-auto text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Start Fresh Application
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <Mail className="w-3.5 h-3.5" />
          <span>Talent Acquisition: support@assessment-portal.io</span>
        </div>
      </div>
    </div>
  );
};
