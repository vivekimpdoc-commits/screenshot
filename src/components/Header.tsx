import React from 'react';
import { Table, FileText, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  totalRows: number;
  onClearAll: () => void;
  onAddManual: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalRows, onClearAll, onAddManual }) => {
  return (
    <header className="glass-panel sticky top-0 z-30 border-b-0 border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="p-3 gradient-bg border border-indigo-400/30 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                  Extracto AI
                </h1>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Premium Edition
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                Screenshot to Data Table &bull; Phone Number, Date &amp; Time, Link, Content
              </p>
            </div>
          </div>

          {/* Action Header Stats & Buttons */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="hidden sm:flex items-center px-3.5 py-2 bg-slate-800/60 rounded-full text-xs font-semibold text-slate-300 border border-slate-700/50">
              <Layers className="w-4 h-4 mr-1.5 text-indigo-400" />
              <span>Table Rows: <strong className="text-white font-bold ml-1">{totalRows}</strong></span>
            </div>

            <button
              onClick={onAddManual}
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-full text-white bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-400/30 transition-all shadow-lg shadow-indigo-500/20"
              title="Add row manually"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              + Add Row
            </button>

            {totalRows > 0 && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-full text-rose-300 bg-rose-900/30 hover:bg-rose-900/50 border border-rose-500/30 transition-all shadow-md shadow-rose-900/20"
                title="Clear table data"
              >
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Clear Table
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
