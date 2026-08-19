import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Loader2,
  AlertTriangle,
  Send,
  Table as TableIcon,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SimulationTaskData, CareerPath } from '../types';
import {
  HandsontableSpreadsheet,
  isSpreadsheetCareerPath,
} from './HandsontableSpreadsheet';

interface Step2SimulationTaskProps {
  careerPath: CareerPath | string;
  applicationId: string;
  candidateName: string;
  simulationTask: SimulationTaskData;
  onSubmitSimulation: (submittedText: string) => Promise<void>;
  isSubmitting: boolean;
  submitProgressText: string;
  errorMessage: string | null;
  onClearError: () => void;
}

export const Step2SimulationTask: React.FC<Step2SimulationTaskProps> = ({
  careerPath,
  applicationId,
  candidateName: _candidateName,
  simulationTask,
  onSubmitSimulation,
  isSubmitting,
  submitProgressText,
  errorMessage,
  onClearError,
}) => {
  // Normalize career path
  const selectedPath = (careerPath || 'Data Analytics').toString().trim();
  const isSpreadsheet = isSpreadsheetCareerPath(selectedPath);

  // 20 minutes countdown timer (1200 seconds)
  const initialSeconds = 20 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [timeExpiredAlert, setTimeExpiredAlert] = useState<boolean>(false);

  // CSV content from spreadsheet
  const [spreadsheetCsv, setSpreadsheetCsv] = useState<string>('');

  // Text response state (for non-spreadsheet career paths)
  const [textResponse, setTextResponse] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`text_response_${applicationId}`);
      return saved || '';
    } catch {
      return '';
    }
  });

  const timerRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(isSubmitting);
  isSubmittingRef.current = isSubmitting;
  const spreadsheetCsvRef = useRef(spreadsheetCsv);
  spreadsheetCsvRef.current = spreadsheetCsv;
  const textResponseRef = useRef(textResponse);
  textResponseRef.current = textResponse;

  // Persist text response draft
  useEffect(() => {
    if (!isSpreadsheet) {
      try {
        localStorage.setItem(`text_response_${applicationId}`, textResponse);
      } catch {
        // ignore
      }
    }
  }, [textResponse, isSpreadsheet, applicationId]);

  // Submit trigger
  const triggerSubmit = async () => {
    if (isSubmittingRef.current) return;
    if (isSpreadsheet) {
      await onSubmitSimulation(spreadsheetCsvRef.current);
    } else {
      await onSubmitSimulation(textResponseRef.current);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitting) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeExpiredAlert(true);
          setTimeout(() => {
            triggerSubmit();
          }, 1200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitting]);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isUnder5Minutes = timeLeft < 300; // < 5 mins turns red

  // Word and character count for text response
  const { wordCount, charCount } = useMemo(() => {
    const trimmed = textResponse.trim();
    if (!trimmed) return { wordCount: 0, charCount: 0 };
    const words = trimmed.split(/\s+/).filter(Boolean);
    return {
      wordCount: words.length,
      charCount: textResponse.length,
    };
  }, [textResponse]);

  const taskPrompt =
    simulationTask.task_prompt ||
    simulationTask.prompt ||
    simulationTask.instructions ||
    'Please review the workplace scenario provided and draft your detailed, structured professional response.';

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (!isSpreadsheet && !textResponse.trim()) {
      alert('Please enter your response before submitting.');
      return;
    }

    if (isSpreadsheet && !spreadsheetCsv.trim()) {
      alert('Please ensure spreadsheet data is present before submitting.');
      return;
    }

    triggerSubmit();
  };

  return (
    <div id="step2" className="w-full max-w-5xl">
      {/* Time Expired Notice */}
      {timeExpiredAlert && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Time has concluded (20:00). Automatically submitting your assessment for scoring...</span>
          </div>
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
        </div>
      )}

      {/* Global Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-start justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={onClearError}
            className="text-xs text-red-800 underline font-semibold ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar with Task Title & Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3A6B] bg-blue-50 px-2.5 py-1 rounded-full mb-1.5 border border-blue-100">
            {isSpreadsheet ? <TableIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{selectedPath} Track</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight" id="step2-title">
            {selectedPath} Simulation Assessment
          </h2>
          <p className="text-sm font-medium text-[#1B3A6B] mt-0.5">
            {isSpreadsheet
              ? 'Complete the interactive spreadsheet simulation below, then click Submit Assessment.'
              : 'Read the scenario guidelines below carefully and submit your structured response.'}
          </p>
        </div>

        {/* 20-minute countdown timer (red when under 5 minutes) */}
        <div
          id="countdown-timer-box"
          className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
            isUnder5Minutes
              ? 'bg-red-50 border-red-300 text-red-600 shadow-sm'
              : 'bg-white border-slate-200 text-[#1B3A6B] shadow-xs'
          }`}
        >
          <Clock className={`w-5 h-5 ${isUnder5Minutes ? 'text-red-600 animate-pulse' : 'text-[#1B3A6B]'}`} />
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Time Remaining
            </div>
            <div
              id="countdown"
              className={`timer text-2xl sm:text-3xl font-mono font-bold tracking-tight ${
                isUnder5Minutes ? 'text-red-600' : 'text-[#1B3A6B]'
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* CONDITIONAL RENDERING BASED ON CAREER PATH */}
      {isSpreadsheet ? (
        /* PATH 1: SPREADSHEET SIMULATION (Data Analytics, Accounting, Finance, Inventory & Logistics) */
        <div className="mb-6">
          <HandsontableSpreadsheet
            careerPath={selectedPath}
            applicationId={applicationId}
            onDataChange={(csv) => setSpreadsheetCsv(csv)}
            disabled={isSubmitting}
          />
        </div>
      ) : (
        /* PATH 2: ALL OTHER CAREER PATHS - FORMATTED PROMPT BOX & TEXTAREA */
        <div className="space-y-6 mb-6">
          {/* Formatted Instruction Box */}
          <div className="card bg-[#f8fafc] border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#1B3A6B]">
              <Sparkles className="w-4 h-4 text-[#1B3A6B]" />
              <span>Simulation Prompt & Scenario Guidelines</span>
            </div>
            <div className="text-sm leading-relaxed text-[#4b5563] whitespace-pre-line">
              {taskPrompt}
            </div>
          </div>

          {/* Large Textarea for Candidate Response */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="text_response_textarea" className="form-label mb-0">
                Your Response / Solution
              </label>
              <span className="text-xs font-mono text-[#4b5563]">
                {wordCount} words | {charCount} characters
              </span>
            </div>

            <textarea
              id="text_response_textarea"
              name="textResponse"
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              placeholder="Type your structured solution, email response, action steps, or analysis here..."
              className="form-textarea h-64 resize-y leading-relaxed"
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Submission Actions (Common to both) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Tip: Your progress is preserved. Review your work before submitting for scoring.
        </div>

        <button
          type="button"
          id="submit-simulation-task-btn"
          onClick={handleManualSubmit}
          disabled={isSubmitting || (isSpreadsheet ? !spreadsheetCsv.trim() : !textResponse.trim())}
          className="btn-primary w-full sm:w-auto cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{submitProgressText || 'Evaluating Submission...'}</span>
            </>
          ) : (
            <>
              <span>{isSpreadsheet ? 'Submit Spreadsheet' : 'Submit Response'}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
