import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sprout } from 'lucide-react';

interface FooterBarProps {
  currentTitle: string;
  currentPage: number;
  totalPages?: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectPage?: (page: number) => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  currentTitle,
  currentPage,
  totalPages = 12,
  onPrevPage,
  onNextPage,
  onSelectPage,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 px-4 lg:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 shadow-xs select-none">
      {/* Left status info */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-800 tracking-tight">COOPS-CA NKUL</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-700 font-medium">{currentTitle}</span>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Dernière mise à jour : 14/04/2025 10:24</span>
        </div>
      </div>

      {/* Right pager controls */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="hidden md:flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold pr-2">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span className="italic">Ensemble pour une agriculture durable</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors"
            title="Page précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-xs font-bold text-slate-800 font-mono">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors"
            title="Page suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
