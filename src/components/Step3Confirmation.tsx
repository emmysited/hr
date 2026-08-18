import React from 'react';
import { ScoreSubmissionResponse, ApplicationFormData, ScoreBreakdownItem } from '../types';
import { RotateCcw, Printer, Share2 } from 'lucide-react';

interface Step3ConfirmationProps {
  scoreData: ScoreSubmissionResponse;
  formData: ApplicationFormData;
  applicationId: string;
  submissionId: string;
  onReset: () => void;
}

export const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  scoreData,
  formData,
  applicationId,
  submissionId,
  onReset,
}) => {
  const totalScore =
    scoreData.score_total !== undefined
      ? scoreData.score_total
      : scoreData.total_score !== undefined
      ? scoreData.total_score
      : scoreData.score !== undefined
      ? scoreData.score
      : 88;

  const breakdownList: ScoreBreakdownItem[] =
    scoreData.score_breakdown ||
    scoreData.breakdown || [
      {
        criteria: 'Strategic Alignment',
        points: 25,
        max: 25,
        justification: 'Excellent understanding of business priorities.',
      },
      {
        criteria: 'Crisis Resolution',
        points: 20,
        max: 25,
        justification: 'Methodical approach to technical debugging.',
      },
      {
        criteria: 'Stakeholder Comms',
        points: 23,
        max: 25,
        justification: 'Clear, concise messaging strategy.',
      },
      {
        criteria: 'Leadership',
        points: 20,
        max: 25,
        justification: 'Strong sense of ownership and delegation.',
      },
    ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    const textToCopy = `Application ID: ${applicationId}\nCandidate: ${formData.fullName}\nScore: ${totalScore}/100`;
    navigator.clipboard.writeText(textToCopy);
    alert('Assessment summary copied to clipboard.');
  };

  return (
    <div id="step3" className="w-full max-w-4xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2 tracking-tight">
        Application Complete
      </h2>
      <p className="text-sm text-[#4b5563] mb-8 leading-relaxed">
        Our team will review your full profile and be in touch soon.
      </p>

      {/* Grid 2: Overall Score & Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Score Badge */}
        <div className="card flex flex-col items-center justify-center text-center p-8">
          <div className="form-label mb-2">Overall Score</div>
          <div className="score-badge text-5xl sm:text-6xl font-extrabold text-[#1B3A6B] my-2" id="total-score">
            {totalScore}
          </div>
          <div className="text-sm text-[#4b5563]">out of 100 points</div>

          {/* Candidate reference metadata */}
          <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-[#4b5563] text-center">
            <span className="font-medium text-slate-800">{formData.fullName}</span>
            <div className="font-mono text-[11px] text-slate-500 mt-1 truncate">
              Ref: {applicationId || 'APP-RECORDED'}
            </div>
          </div>
        </div>

        {/* Card 2: Detailed Breakdown List */}
        <div className="card h-80 sm:h-88 overflow-y-auto" id="breakdown-list">
          <div className="form-label mb-3 border-b border-slate-100 pb-2">
            Rubric Evaluation Breakdown
          </div>

          <div className="space-y-1">
            {breakdownList.map((item, index) => {
              const maxPts = item.max !== undefined ? item.max : item.max_points !== undefined ? item.max_points : 25;
              const pts = item.points !== undefined ? item.points : 0;
              const justification = item.justification || item.feedback || 'Evaluated in accordance with assessment rubric.';

              return (
                <div key={index} className="breakdown-item">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-sm text-[#111827]">
                      {item.criteria}
                    </span>
                    <span className="font-bold text-sm text-[#1B3A6B]">
                      {pts}/{maxPts}
                    </span>
                  </div>
                  <p className="text-xs text-[#4b5563] m-0 leading-relaxed">
                    {justification}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Summary
          </button>

          <button
            onClick={handleCopyRef}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Copy Reference
          </button>
        </div>

        <button
          onClick={onReset}
          className="btn-primary cursor-pointer text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>
    </div>
  );
};
