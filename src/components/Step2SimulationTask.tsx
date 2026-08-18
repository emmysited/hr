import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Loader2, AlertTriangle, Send } from 'lucide-react';
import { SimulationTaskData } from '../types';

interface Step2SimulationTaskProps {
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
  applicationId,
  candidateName,
  simulationTask,
  onSubmitSimulation,
  isSubmitting,
  submitProgressText,
  errorMessage,
  onClearError,
}) => {
  const totalMinutes = simulationTask.time_limit_minutes || 15;
  const initialSeconds = totalMinutes * 60;

  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [submittedText, setSubmittedText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`draft_${applicationId}`);
      return saved || '';
    } catch {
      return '';
    }
  });

  const [timeExpiredAlert, setTimeExpiredAlert] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(isSubmitting);
  isSubmittingRef.current = isSubmitting;
  const submittedTextRef = useRef(submittedText);
  submittedTextRef.current = submittedText;

  const { wordCount, charCount } = useMemo(() => {
    const trimmed = submittedText.trim();
    if (!trimmed) return { wordCount: 0, charCount: 0 };
    const words = trimmed.split(/\s+/).filter(Boolean);
    return {
      wordCount: words.length,
      charCount: submittedText.length,
    };
  }, [submittedText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSubmittedText(val);
    try {
      localStorage.setItem(`draft_${applicationId}`, val);
    } catch {
      // ignore
    }
  };

  const triggerSubmit = async (textToSubmit?: string) => {
    if (isSubmittingRef.current) return;
    const finalContent = textToSubmit !== undefined ? textToSubmit : submittedTextRef.current;
    await onSubmitSimulation(finalContent);
  };

  useEffect(() => {
    if (isSubmitting) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeExpiredAlert(true);
          setTimeout(() => {
            triggerSubmit(submittedTextRef.current);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const taskTitle =
    simulationTask.task_title ||
    simulationTask.title ||
    'Crisis Management Scenario';

  const taskPrompt =
    simulationTask.task_prompt ||
    simulationTask.prompt ||
    simulationTask.instructions ||
    'A critical server has gone down during a high-traffic release window. Your lead engineer is unavailable. Detail the specific steps you would take to coordinate the response, communicate with stakeholders, and ensure a resolution.';

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (!submittedText.trim()) {
      alert('Please enter your response before submitting.');
      return;
    }

    triggerSubmit();
  };

  return (
    <div id="step2" className="w-full max-w-4xl">
      {/* Time Expired Notice */}
      {timeExpiredAlert && (
        <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">Time is up! Submitting your simulation response now...</span>
          </div>
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
        </div>
      )}

      {/* Error banner if any */}
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

      {/* Header with Title and Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1 tracking-tight">
            Simulation Task
          </h2>
          <p id="task-title" className="font-bold text-[#1B3A6B] text-base">
            {taskTitle}
          </p>
        </div>
        <div className="timer text-3xl font-mono font-bold text-[#1B3A6B]" id="countdown">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Task Prompt Card */}
      <div className="card mb-6 bg-[#f8fafc]">
        <p id="task-prompt" className="text-sm leading-relaxed text-[#4b5563] whitespace-pre-line">
          {taskPrompt}
        </p>
      </div>

      {/* Response Form */}
      <form onSubmit={handleManualSubmit} id="simulation-submission-form">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="submitted_text" className="form-label mb-0">
            Your Response
          </label>
          <span className="text-xs text-[#4b5563]">
            {wordCount} words | {charCount} chars
          </span>
        </div>

        <textarea
          id="submitted_text"
          name="submittedText"
          value={submittedText}
          onChange={handleTextChange}
          placeholder="Type your response here..."
          className="form-textarea h-60 resize-none"
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-[#4b5563]">
            Draft automatically preserved locally
          </span>

          <button
            type="submit"
            id="submit-step2-btn"
            disabled={isSubmitting || !submittedText.trim()}
            className="btn-primary cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{submitProgressText || 'Submitting...'}</span>
              </>
            ) : (
              <>
                <span>Submit Response</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
