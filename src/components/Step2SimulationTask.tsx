import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  AlertTriangle,
  Lightbulb,
  Send,
  RotateCcw,
  Table as TableIcon,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SimulationTaskData, CareerPath } from '../types';

interface Step2SimulationTaskProps {
  careerPath: CareerPath;
  applicationId: string;
  candidateName: string;
  simulationTask: SimulationTaskData;
  onSubmitSimulation: (submittedText: string) => Promise<void>;
  isSubmitting: boolean;
  submitProgressText: string;
  errorMessage: string | null;
  onClearError: () => void;
}

interface TableRowData {
  id: string;
  date: string;
  customerName: string;
  amount: string;
  product: string;
  initialDate: string;
  initialCustomerName: string;
  initialAmount: string;
  initialProduct: string;
}

const INITIAL_DATA_CLEANING_ROWS: Omit<
  TableRowData,
  'initialDate' | 'initialCustomerName' | 'initialAmount' | 'initialProduct'
>[] = [
  { id: '1', date: '12/1/26', customerName: 'john okello', amount: 'UGX 50,000', product: 'Sugar' },
  { id: '2', date: 'Jan 12 2026', customerName: 'Mary  Nakato', amount: '120000', product: 'Rice' },
  { id: '3', date: '2026-01-14', customerName: 'Peter Mugisha', amount: '75k', product: 'Flour' },
  { id: '4', date: '15/01/2026', customerName: 'grace auma', amount: 'UGX200,000', product: 'Cooking Oil' },
  { id: '5', date: 'Jan 16, 2026', customerName: 'David Ssempa', amount: '45,000', product: 'Sugar' },
  { id: '6', date: '2026/01/17', customerName: 'Fatuma  Hassan', amount: '90000', product: 'Rice' },
  { id: '7', date: '18-01-26', customerName: 'Robert Kato', amount: '60,000', product: 'Flour' },
  { id: '8', date: 'Jan 19 2026', customerName: 'Jane Nakigozi', amount: '1500000', product: 'Cooking Oil' },
  { id: '9', date: '20/1/26', customerName: 'issac wandera', amount: '30000', product: 'Sugar' },
  { id: '10', date: '2026-01-21', customerName: 'Sarah Namukasa', amount: '110,000', product: 'Rice' },
  { id: '11', date: '22 Jan 2026', customerName: 'Moses Waiswa', amount: 'UGX 85,000', product: 'Flour' },
  { id: '12', date: '2026-01-23', customerName: 'Agnes Nakirya', amount: '95k', product: 'Cooking Oil' },
  { id: '13', date: '24/01/26', customerName: 'Brian Tumwine', amount: '55,000', product: 'Sugar' },
  { id: '14', date: 'Jan 25 2026', customerName: 'Diana Achieng', amount: '130000', product: 'Rice' },
  { id: '15', date: '2026-01-26', customerName: 'Emmanuel Otim', amount: '70,000', product: 'Flour' },
  { id: '16', date: '27/01/2026', customerName: 'Phiona Nakato', amount: '180,000', product: 'Cooking Oil' },
  { id: '17', date: 'Jan 28, 2026', customerName: 'George Mwesige', amount: '40000', product: 'Sugar' },
  { id: '18', date: '2026-01-29', customerName: 'Harriet Achen', amount: '115,000', product: 'Rice' },
  { id: '19', date: 'Jan 12 2026', customerName: 'Mary  Nakato', amount: '120000', product: 'Rice' },
  { id: '20', date: '20/1/26', customerName: 'issac wandera', amount: '30000', product: 'Sugar' },
];

const buildInitialTableData = (): TableRowData[] => {
  return INITIAL_DATA_CLEANING_ROWS.map((row) => ({
    ...row,
    initialDate: row.date,
    initialCustomerName: row.customerName,
    initialAmount: row.amount,
    initialProduct: row.product,
  }));
};

export const Step2SimulationTask: React.FC<Step2SimulationTaskProps> = ({
  careerPath,
  applicationId,
  candidateName,
  simulationTask,
  onSubmitSimulation,
  isSubmitting,
  submitProgressText,
  errorMessage,
  onClearError,
}) => {
  const isDataAnalytics = careerPath === 'Data Analytics';

  // 20 minutes countdown timer (1200 seconds)
  const initialSeconds = 20 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isHintsOpen, setIsHintsOpen] = useState<boolean>(true);
  const [timeExpiredAlert, setTimeExpiredAlert] = useState<boolean>(false);

  // Table rows state (for Data Analytics)
  const [rows, setRows] = useState<TableRowData[]>(() => {
    try {
      const saved = localStorage.getItem(`cleaning_data_${applicationId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return buildInitialTableData();
  });

  // Text response state (for other career paths)
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
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const textResponseRef = useRef(textResponse);
  textResponseRef.current = textResponse;

  // Persist draft
  useEffect(() => {
    try {
      if (isDataAnalytics) {
        localStorage.setItem(`cleaning_data_${applicationId}`, JSON.stringify(rows));
      } else {
        localStorage.setItem(`text_response_${applicationId}`, textResponse);
      }
    } catch {
      // ignore
    }
  }, [rows, textResponse, isDataAnalytics, applicationId]);

  // Convert table to CSV text representation
  const serializeToCsv = (dataRows: TableRowData[]): string => {
    const headers = ['Date', 'Customer Name', 'Amount (UGX)', 'Product'];
    const lines = [headers.join(',')];

    dataRows.forEach((r) => {
      const escape = (val: string) => {
        const str = (val || '').trim();
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      lines.push(
        [escape(r.date), escape(r.customerName), escape(r.amount), escape(r.product)].join(',')
      );
    });

    return lines.join('\n');
  };

  // Submit trigger
  const triggerSubmit = async () => {
    if (isSubmittingRef.current) return;
    if (isDataAnalytics) {
      const csvContent = serializeToCsv(rowsRef.current);
      await onSubmitSimulation(csvContent);
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

  // Table handlers (Data Analytics)
  const handleCellBlur = (
    rowId: string,
    field: 'date' | 'customerName' | 'amount' | 'product',
    newValue: string
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            [field]: newValue.trim(),
          };
        }
        return row;
      })
    );
  };

  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleResetTable = () => {
    if (window.confirm('Reset all table rows back to original raw data?')) {
      const initial = buildInitialTableData();
      setRows(initial);
      try {
        localStorage.removeItem(`cleaning_data_${applicationId}`);
      } catch {
        // ignore
      }
    }
  };

  const modifiedCellsCount = rows.reduce((acc, row) => {
    let count = 0;
    if (row.date !== row.initialDate) count++;
    if (row.customerName !== row.initialCustomerName) count++;
    if (row.amount !== row.initialAmount) count++;
    if (row.product !== row.initialProduct) count++;
    return acc + count;
  }, 0);

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

  const taskTitle =
    simulationTask.task_title ||
    simulationTask.title ||
    `${careerPath} Simulation Assessment`;

  const taskPrompt =
    simulationTask.task_prompt ||
    simulationTask.prompt ||
    simulationTask.instructions ||
    'Please review the workplace scenario provided and draft your detailed, structured professional response.';

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (!isDataAnalytics && !textResponse.trim()) {
      alert('Please enter your response before submitting.');
      return;
    }

    if (isDataAnalytics && rows.length === 0) {
      alert('Your table has no rows remaining. Please reset data or add entries.');
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
            <span>Time has concluded (20:00). Automatically compiling your response for scoring...</span>
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
            {isDataAnalytics ? <TableIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{careerPath} Simulation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            {isDataAnalytics ? 'Data Cleaning Task' : taskTitle}
          </h2>
          <p className="text-sm font-medium text-[#1B3A6B] mt-0.5">
            {isDataAnalytics
              ? 'Clean the data below directly in the table. Fix all errors you find, then click Submit when done.'
              : 'Read the prompt below carefully and submit your detailed response.'}
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

      {/* PATH 1: DATA ANALYTICS INTERACTIVE CLEANING TABLE */}
      {isDataAnalytics ? (
        <>
          {/* Collapsible Hints Section */}
          <div className="mb-6 border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
            <button
              type="button"
              id="toggle-hints-btn"
              onClick={() => setIsHintsOpen(!isHintsOpen)}
              className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                  Data Cleaning Guidelines & Hints
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{isHintsOpen ? 'Hide Hints' : 'Show Hints'}</span>
                {isHintsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isHintsOpen && (
              <div className="p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-2">
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-slate-900">Dates:</strong> Standardize all dates to{' '}
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[#1B3A6B] font-semibold">
                      YYYY-MM-DD
                    </span>{' '}
                    format.
                  </li>
                  <li>
                    <strong className="text-slate-900">Amounts:</strong> Fix all amounts to numeric only (no UGX, no commas, no k).
                  </li>
                  <li>
                    <strong className="text-slate-900">Customer Names:</strong> Fix typos in customer names and use{' '}
                    <strong className="text-slate-900">Title Case</strong> (e.g. <em>John Okello</em>, <em>Mary Nakato</em>).
                  </li>
                  <li>
                    <strong className="text-slate-900">Duplicates:</strong> Remove any duplicate rows using the red delete button on the right.
                  </li>
                  <li>
                    <strong className="text-slate-900">Outliers / Typos:</strong> Fix any obviously wrong amounts (e.g. accidental extra zeros).
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Live Table Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                {rows.length} rows remaining
              </span>
              <span className="text-slate-500">
                {modifiedCellsCount > 0 ? (
                  <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                    {modifiedCellsCount} cell{modifiedCellsCount === 1 ? '' : 's'} modified (highlighted in yellow)
                  </span>
                ) : (
                  'Click any cell to edit directly'
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetTable}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Reset data back to raw initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {/* Interactive Editable HTML Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white mb-6">
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto relative">
              <table className="w-full text-left border-collapse text-xs sm:text-sm" id="data-cleaning-table">
                <thead className="sticky top-0 bg-[#1B3A6B] text-white z-10 select-none shadow-xs">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-12 text-center border-r border-blue-800/40">
                      #
                    </th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-r border-blue-800/40 min-w-[140px]">
                      Date
                    </th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-r border-blue-800/40 min-w-[180px]">
                      Customer Name
                    </th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-r border-blue-800/40 min-w-[140px]">
                      Amount (UGX)
                    </th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-r border-blue-800/40 min-w-[140px]">
                      Product
                    </th>
                    <th className="py-3 px-3 font-semibold text-xs uppercase tracking-wider w-16 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No rows remaining. Click &quot;Reset Data&quot; to restore the initial table.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => {
                      const isDateEdited = row.date !== row.initialDate;
                      const isNameEdited = row.customerName !== row.initialCustomerName;
                      const isAmountEdited = row.amount !== row.initialAmount;
                      const isProductEdited = row.product !== row.initialProduct;

                      return (
                        <tr
                          key={row.id}
                          className="even:bg-slate-50/60 hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="py-2.5 px-3 text-center text-slate-600 font-mono text-xs border-r border-slate-200 select-none">
                            {index + 1}
                          </td>

                          <td
                            contentEditable={!isSubmitting}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleCellBlur(row.id, 'date', e.currentTarget.innerText)
                            }
                            className={`py-2.5 px-4 border-r border-slate-200 font-mono text-slate-800 cursor-text focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:bg-white transition-colors ${
                              isDateEdited ? 'bg-[#fef9c3] font-semibold text-amber-900' : ''
                            }`}
                          >
                            {row.date}
                          </td>

                          <td
                            contentEditable={!isSubmitting}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleCellBlur(row.id, 'customerName', e.currentTarget.innerText)
                            }
                            className={`py-2.5 px-4 border-r border-slate-200 text-slate-800 cursor-text focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:bg-white transition-colors ${
                              isNameEdited ? 'bg-[#fef9c3] font-semibold text-amber-900' : ''
                            }`}
                          >
                            {row.customerName}
                          </td>

                          <td
                            contentEditable={!isSubmitting}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleCellBlur(row.id, 'amount', e.currentTarget.innerText)
                            }
                            className={`py-2.5 px-4 border-r border-slate-200 font-mono text-slate-800 cursor-text focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:bg-white transition-colors ${
                              isAmountEdited ? 'bg-[#fef9c3] font-semibold text-amber-900' : ''
                            }`}
                          >
                            {row.amount}
                          </td>

                          <td
                            contentEditable={!isSubmitting}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleCellBlur(row.id, 'product', e.currentTarget.innerText)
                            }
                            className={`py-2.5 px-4 border-r border-slate-200 text-slate-800 cursor-text focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:bg-white transition-colors ${
                              isProductEdited ? 'bg-[#fef9c3] font-semibold text-amber-900' : ''
                            }`}
                          >
                            {row.product}
                          </td>

                          <td className="py-2 px-3 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.id)}
                              disabled={isSubmitting}
                              title="Delete this duplicate or invalid row"
                              className="inline-flex items-center justify-center w-7 h-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
          Tip: Edits save automatically. Review your answer before submitting for scoring.
        </div>

        <button
          type="button"
          id="submit-simulation-task-btn"
          onClick={handleManualSubmit}
          disabled={isSubmitting || (isDataAnalytics ? rows.length === 0 : !textResponse.trim())}
          className="btn-primary w-full sm:w-auto cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{submitProgressText || 'Evaluating Submission...'}</span>
            </>
          ) : (
            <>
              <span>{isDataAnalytics ? 'Submit Cleaned Table' : 'Submit Response'}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
