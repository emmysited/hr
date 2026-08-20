import React from 'react';
import { ScoreSubmissionResponse, ApplicationFormData, ScoreBreakdownItem } from '../types';
import { RotateCcw, Printer, Share2, Award, CheckCircle2 } from 'lucide-react';

interface Step3ConfirmationProps {
  scoreData: ScoreSubmissionResponse;
  formData: ApplicationFormData;
  applicationId: string;
  submissionId: string;
  onReset: () => void;
}

function formatCriteriaName(rawCriteria?: string): string {
  if (!rawCriteria) return 'Evaluation Criterion';
  return rawCriteria
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({
  scoreData,
  formData,
  applicationId,
  submissionId: _submissionId,
  onReset,
}) => {
  // Extract scores array dynamically from API response
  const rawScores: any[] = Array.isArray(scoreData)
    ? scoreData
    : Array.isArray(scoreData?.scores)
    ? scoreData.scores
    : Array.isArray(scoreData?.score_breakdown)
    ? scoreData.score_breakdown
    : Array.isArray(scoreData?.breakdown)
    ? scoreData.breakdown
    : [];

  const breakdownList: ScoreBreakdownItem[] = rawScores.map((item: any) => {
    const rawName = item?.criteria || item?.criterion || item?.name || '';
    const pointsNum =
      item?.points !== undefined
        ? Number(item.points)
        : item?.score !== undefined
        ? Number(item.score)
        : 0;
    const maxNum =
      item?.max !== undefined
        ? Number(item.max)
        : item?.max_points !== undefined
        ? Number(item.max_points)
        : item?.max_score !== undefined
        ? Number(item.max_score)
        : 25;
    const justificationText =
      item?.justification ||
      item?.feedback ||
      item?.reason ||
      item?.description ||
      '';

    return {
      criteria: rawName,
      points: isNaN(pointsNum) ? 0 : pointsNum,
      max: isNaN(maxNum) ? 25 : maxNum,
      justification: justificationText,
    };
  });

  // Calculate total score and maximum points dynamically from API response
  const pointsSum = breakdownList.reduce((acc, item) => acc + (item.points || 0), 0);
  const maxPointsSum = breakdownList.reduce((acc, item) => acc + (item.max || 0), 0);

  const totalScore =
    scoreData?.score_total !== undefined
      ? Number(scoreData.score_total)
      : scoreData?.total_score !== undefined
      ? Number(scoreData.total_score)
      : scoreData?.score !== undefined
      ? Number(scoreData.score)
      : pointsSum;

  const totalMax = maxPointsSum > 0 ? maxPointsSum : 100;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    const textToCopy = `Application ID: ${applicationId}\nCandidate: ${formData.fullName}\nCareer Path: ${formData.careerPath}\nScore: ${totalScore}/${totalMax}`;
    navigator.clipboard.writeText(textToCopy);
    alert('Assessment summary copied to clipboard.');
  };

  return (
    <div id="step3" className="w-full max-w-4xl">
      <div className="flex items-center gap-2 mb-2 text-[#1B3A6B]">
        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          Application Complete
        </h2>
      </div>
      <p className="text-sm text-[#4b5563] mb-8 leading-relaxed">
        Your simulation assessment has been scored according to the role evaluation rubric.
      </p>

      {/* Grid: Overall Score & Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Score Badge */}
        <div className="card flex flex-col items-center justify-center text-center p-8">
          <div className="form-label mb-2">Overall Score</div>
          <div
            className="score-badge text-5xl sm:text-6xl font-extrabold text-[#1B3A6B] my-2"
            id="total-score"
          >
            {totalScore}
          </div>
          <div className="text-sm text-[#4b5563]">out of {totalMax} points</div>

          {/* Candidate reference metadata */}
          <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-[#4b5563] text-center">
            <div className="font-semibold text-slate-800">{formData.fullName}</div>
            <div className="text-[11px] text-[#1B3A6B] font-medium mt-0.5">
              {formData.careerPath} Track
            </div>
            <div className="font-mono text-[11px] text-slate-500 mt-1 truncate">
              Ref: {applicationId || 'APP-RECORDED'}
            </div>
          </div>
        </div>

        {/* Card 2: Dynamic Rubric Breakdown List */}
        <div className="card h-80 sm:h-96 overflow-y-auto" id="breakdown-list">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="form-label mb-0">Rubric Evaluation Breakdown</div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#1B3A6B]" />
              <span>{breakdownList.length} criteria</span>
            </div>
          </div>

          {breakdownList.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              Evaluation complete. Overall score recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {breakdownList.map((item, index) => {
                const formattedName = formatCriteriaName(item.criteria);

                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-150 transition-all hover:bg-slate-100/70"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-sm text-[#111827]">
                        {formattedName}
                      </span>
                      <span className="font-bold text-sm text-[#1B3A6B] font-mono">
                        {item.points} / {item.max}
                      </span>
                    </div>
                    {item.justification ? (
                      <p className="text-xs text-[#4b5563] m-0 leading-relaxed">
                        {item.justification}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
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

        <button onClick={onReset} className="btn-primary cursor-pointer text-xs">
          <RotateCcw className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>
    </div>
  );
};
