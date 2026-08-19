import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Table as TableIcon, Info, HelpCircle } from 'lucide-react';
import { CareerPath } from '../types';

declare global {
  interface Window {
    Handsontable?: any;
  }
}

export interface SpreadsheetConfig {
  headers: string[];
  initialData: (string | number)[][];
  instructions: string;
  hints?: string[];
  columnWidths?: number[];
}

export const SPREADSHEET_CONFIGS: Record<string, SpreadsheetConfig> = {
  'Data Analytics': {
    headers: ['Date', 'Customer Name', 'Amount (UGX)', 'Product'],
    instructions:
      'Clean this data: standardize dates to YYYY-MM-DD, fix amounts to numeric only, fix name typos to Title Case, remove duplicate rows.',
    hints: [
      'Standardize all dates to YYYY-MM-DD format (e.g., 2026-01-12)',
      'Fix all amounts to numeric only without UGX, commas, or "k" (e.g., 50000)',
      'Fix typos in customer names and use Title Case (e.g., John Okello)',
      'Right-click duplicate rows to delete them via the context menu',
      'Verify and correct any obvious outlier amounts',
    ],
    initialData: [
      ['12/1/26', 'john okello', 'UGX 50,000', 'Sugar'],
      ['Jan 12 2026', 'Mary  Nakato', '120000', 'Rice'],
      ['2026-01-14', 'Peter Mugisha', '75k', 'Flour'],
      ['15/01/2026', 'grace auma', 'UGX200,000', 'Cooking Oil'],
      ['Jan 16, 2026', 'David Ssempa', '45,000', 'Sugar'],
      ['2026/01/17', 'Fatuma  Hassan', '90000', 'Rice'],
      ['18-01-26', 'Robert Kato', '60,000', 'Flour'],
      ['Jan 19 2026', 'Jane Nakigozi', '1500000', 'Cooking Oil'],
      ['20/1/26', 'issac wandera', '30000', 'Sugar'],
      ['2026-01-21', 'Sarah Namukasa', '110,000', 'Rice'],
      ['22 Jan 2026', 'Moses Waiswa', 'UGX 85,000', 'Flour'],
      ['2026-01-23', 'Agnes Nakirya', '95k', 'Cooking Oil'],
      ['24/01/26', 'Brian Tumwine', '55,000', 'Sugar'],
      ['Jan 25 2026', 'Diana Achieng', '130000', 'Rice'],
      ['2026-01-26', 'Emmanuel Otim', '70,000', 'Flour'],
      ['27/01/2026', 'Phiona Nakato', '180,000', 'Cooking Oil'],
      ['Jan 28, 2026', 'George Mwesige', '40000', 'Sugar'],
      ['2026-01-29', 'Harriet Achen', '115,000', 'Rice'],
      ['Jan 12 2026', 'Mary  Nakato', '120000', 'Rice'],
      ['20/1/26', 'issac wandera', '30000', 'Sugar'],
    ],
  },
  'Accounting': {
    headers: ['Item', 'Amount (UGX)'],
    instructions: 'Fill in all blank cells. Show your calculations in the Answer column.',
    hints: [
      'Gross Profit = Revenue - Cost of Goods Sold',
      'Operating Profit = Gross Profit - Operating Expenses',
      'Tax (30%) = Operating Profit × 0.30',
      'Net Profit = Operating Profit - Tax',
      'Calculate Net Profit % of Revenue = (Net Profit / Revenue) × 100',
      'Identify the single largest cost eating into overall profits',
    ],
    initialData: [
      ['Revenue', '4500000'],
      ['Cost of Goods Sold', '1800000'],
      ['Gross Profit', ''],
      ['Operating Expenses', '950000'],
      ['Operating Profit', ''],
      ['Tax (30%)', ''],
      ['Net Profit', ''],
      ['', ''],
      ['Is the business profitable?', ''],
      ['Net Profit % of Revenue', ''],
      ['Biggest cost eating into profit', ''],
    ],
  },
  'Finance': {
    headers: ['Item', 'Value'],
    instructions: 'Complete all blank cells. Use formulas or manual calculations.',
    hints: [
      'Calculate Monthly Loan Repayment using loan amount, 18% annual interest over 12 months',
      'Calculate Expected New Monthly Revenue with 40% growth',
      'Determine Net Monthly Profit after accounting for the monthly loan repayment',
      'Assess financial feasibility and provide a clear recommendation (Yes/No) with justification',
    ],
    initialData: [
      ['Monthly Revenue (UGX)', '3200000'],
      ['Monthly Expenses (UGX)', '2600000'],
      ['Current Monthly Profit (UGX)', '600000'],
      ['Loan Amount (UGX)', '10000000'],
      ['Annual Interest Rate', '18%'],
      ['Repayment Period (months)', '12'],
      ['Monthly Repayment (UGX)', ''],
      ['Expected Revenue Increase', '40%'],
      ['New Monthly Revenue (UGX)', ''],
      ['New Monthly Profit before loan (UGX)', ''],
      ['Net Profit after loan repayment (UGX)', ''],
      ['Break-even month', ''],
      ['Recommendation (Take loan? Yes/No)', ''],
      ['Justification', ''],
    ],
  },
  'Inventory & Logistics': {
    headers: [
      'Product',
      'Stock (bags/units)',
      'Daily Sales',
      'Lead Time (days)',
      'Reorder Point',
      'Days Until Stockout',
      'Reorder Today?',
      'Safety Stock Suggestion',
    ],
    instructions:
      'Fill in all blank columns. Reorder Point = Daily Sales x Lead Time. Days Until Stockout = Stock / Daily Sales. Reorder Today = Yes if Days Until Stockout <= Lead Time.',
    hints: [
      'Reorder Point = Daily Sales × Lead Time',
      'Days Until Stockout = Current Stock / Daily Sales',
      'Reorder Today? = Enter "Yes" if Days Until Stockout <= Lead Time, else "No"',
      'Safety Stock Suggestion = Recommended buffer stock based on lead time volatility',
    ],
    initialData: [
      ['Sugar', '200', '15', '3', '', '', '', ''],
      ['Rice', '80', '20', '4', '', '', '', ''],
      ['Flour', '45', '10', '2', '', '', '', ''],
      ['Cooking Oil', '30', '12', '5', '', '', '', ''],
    ],
  },
};

export const SPREADSHEET_CAREER_PATHS: CareerPath[] = [
  'Data Analytics',
  'Accounting',
  'Finance',
  'Inventory & Logistics',
];

export const isSpreadsheetCareerPath = (careerPath: string): boolean => {
  const normalized = (careerPath || '').trim();
  return SPREADSHEET_CAREER_PATHS.some(
    (p) => p.toLowerCase() === normalized.toLowerCase()
  );
};

export const getSpreadsheetConfig = (careerPath: string): SpreadsheetConfig => {
  const normalized = (careerPath || '').trim();
  const matchedKey = Object.keys(SPREADSHEET_CONFIGS).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  return matchedKey ? SPREADSHEET_CONFIGS[matchedKey] : SPREADSHEET_CONFIGS['Data Analytics'];
};

interface HandsontableSpreadsheetProps {
  careerPath: string;
  applicationId: string;
  onDataChange: (csvData: string) => void;
  disabled?: boolean;
}

export const HandsontableSpreadsheet: React.FC<HandsontableSpreadsheetProps> = ({
  careerPath,
  applicationId,
  onDataChange,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hotInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isHintsOpen, setIsHintsOpen] = useState<boolean>(true);

  const config = getSpreadsheetConfig(careerPath);
  const storageKey = `hot_data_${careerPath.replace(/\s+/g, '_')}_${applicationId}`;

  // Helper to serialize Handsontable grid data to CSV string
  const serializeGridToCsv = (gridData: any[][]): string => {
    const escape = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val).trim();
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = config.headers.map(escape).join(',');
    const dataLines = (gridData || [])
      .filter((row) => row && row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== ''))
      .map((row) => row.map(escape).join(','));

    return [headerLine, ...dataLines].join('\n');
  };

  // Load Handsontable library if not already present
  useEffect(() => {
    if (window.Handsontable) {
      setIsLoaded(true);
      return;
    }

    // Load stylesheet
    if (!document.getElementById('handsontable-css')) {
      const link = document.createElement('link');
      link.id = 'handsontable-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css';
      document.head.appendChild(link);
    }

    // Load script
    if (!document.getElementById('handsontable-js')) {
      const script = document.createElement('script');
      script.id = 'handsontable-js';
      script.src = 'https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.Handsontable) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize and update Handsontable instance
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.Handsontable) return;

    // Retrieve saved draft or fallback to config initialData
    let initialGridData = config.initialData.map((row) => [...row]);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialGridData = parsed;
        }
      }
    } catch {
      // ignore
    }

    // Destroy existing instance if any
    if (hotInstanceRef.current) {
      hotInstanceRef.current.destroy();
      hotInstanceRef.current = null;
    }

    // Initial CSV sync
    const initialCsv = serializeGridToCsv(initialGridData);
    onDataChange(initialCsv);

    const hot = new window.Handsontable(containerRef.current, {
      data: initialGridData,
      colHeaders: config.headers,
      rowHeaders: true,
      height: 440,
      width: '100%',
      stretchH: 'all',
      contextMenu: true,
      readOnly: disabled,
      autoWrapRow: true,
      autoWrapCol: true,
      manualColumnResize: true,
      manualRowResize: true,
      columnHeaderHeight: 38,
      rowHeights: 32,
      minSpareRows: 0,
      licenseKey: 'non-commercial-and-evaluation',
      afterChange: (_changes: any, source: string) => {
        if (source === 'loadData') return;
        if (hot) {
          const currentData = hot.getData();
          try {
            localStorage.setItem(storageKey, JSON.stringify(currentData));
          } catch {
            // ignore
          }
          const csv = serializeGridToCsv(currentData);
          onDataChange(csv);
        }
      },
      afterRemoveRow: () => {
        if (hot) {
          const currentData = hot.getData();
          try {
            localStorage.setItem(storageKey, JSON.stringify(currentData));
          } catch {
            // ignore
          }
          const csv = serializeGridToCsv(currentData);
          onDataChange(csv);
        }
      },
      afterCreateRow: () => {
        if (hot) {
          const currentData = hot.getData();
          try {
            localStorage.setItem(storageKey, JSON.stringify(currentData));
          } catch {
            // ignore
          }
          const csv = serializeGridToCsv(currentData);
          onDataChange(csv);
        }
      },
    });

    hotInstanceRef.current = hot;

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, [isLoaded, careerPath, applicationId]);

  // Handle Reset data back to initial template
  const handleResetToTemplate = () => {
    if (window.confirm('Reset this spreadsheet back to original template data?')) {
      const freshData = config.initialData.map((row) => [...row]);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
      if (hotInstanceRef.current) {
        hotInstanceRef.current.loadData(freshData);
      }
      const csv = serializeGridToCsv(freshData);
      onDataChange(csv);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Instructions Card */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#1B3A6B] mb-1">
              Spreadsheet Instructions
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {config.instructions}
            </p>
          </div>
        </div>
      </div>

      {/* Hints (Collapsible) */}
      {config.hints && config.hints.length > 0 && (
        <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsHintsOpen(!isHintsOpen)}
            className="w-full px-5 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Assessment Guidelines & Calculation Rules</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">
              {isHintsOpen ? 'Hide Guidelines' : 'Show Guidelines'}
            </span>
          </button>

          {isHintsOpen && (
            <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700">
              <ul className="space-y-1.5 list-disc list-inside">
                {config.hints.map((hint, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Spreadsheet Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <TableIcon className="w-4 h-4 text-[#1B3A6B]" />
          <span>Interactive Handsontable Spreadsheet</span>
          <span className="text-slate-400">• Right-click for row options (insert/remove)</span>
        </div>

        <button
          type="button"
          onClick={handleResetToTemplate}
          disabled={disabled}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title="Reset spreadsheet to original data template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Template</span>
        </button>
      </div>

      {/* Handsontable Container */}
      <div className="handsontable-container shadow-xs bg-white">
        <div ref={containerRef} className="w-full" style={{ minHeight: '440px' }} />
      </div>
    </div>
  );
};
