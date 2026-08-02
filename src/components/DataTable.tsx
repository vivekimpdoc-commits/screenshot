import React, { useState } from 'react';
import { ExtractedRow } from '../types';
import {
  Copy,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Download,
  Phone,
  Calendar,
  Link as LinkIcon,
  FileText,
  Eye,
  X
} from 'lucide-react';

interface DataTableProps {
  rows: ExtractedRow[];
  onEditRow: (row: ExtractedRow) => void;
  onDeleteRow: (id: string) => void;
  onClearAll: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  rows,
  onEditRow,
  onDeleteRow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedRowId, setCopiedRowId] = useState<string | null>(null);
  const [copiedTable, setCopiedTable] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter rows
  const filteredRows = rows.filter((row) => {
    const q = searchTerm.toLowerCase();
    return (
      row.phoneNumber.toLowerCase().includes(q) ||
      row.dateTime.toLowerCase().includes(q) ||
      row.link.toLowerCase().includes(q) ||
      row.content.toLowerCase().includes(q)
    );
  });

  // Copy individual row
  const handleCopyRow = (row: ExtractedRow) => {
    const text = `${row.phoneNumber}\t${row.dateTime}\t${row.link}\t${row.content}`;
    navigator.clipboard.writeText(text);
    setCopiedRowId(row.id);
    setTimeout(() => setCopiedRowId(null), 2000);
  };

  // Copy Table as TSV (Excel / Google Sheets compatible)
  const handleCopyTableTSV = () => {
    const header = "Phone Number\tDate & Time\tLink\tContent\n";
    const body = rows
      .map((r) => `${r.phoneNumber}\t${r.dateTime}\t${r.link}\t${r.content}`)
      .join("\n");
    navigator.clipboard.writeText(header + body);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2000);
  };

  // Copy Markdown Table
  const handleCopyMarkdown = () => {
    const header = "| Phone Number | Date & Time | Link | Content |\n|---|---|---|---|\n";
    const body = rows
      .map(
        (r) =>
          `| ${r.phoneNumber || '-'} | ${r.dateTime || '-'} | ${r.link || '-'} | ${
            r.content.replace(/\n/g, ' ') || '-'
          } |`
      )
      .join("\n");
    navigator.clipboard.writeText(header + body);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    const header = "Phone Number,Date & Time,Link,Content\n";
    const body = rows
      .map((r) => `${escapeCsv(r.phoneNumber)},${escapeCsv(r.dateTime)},${escapeCsv(r.link)},${escapeCsv(r.content)}`)
      .join("\n");

    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Screenshot_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (rows.length === 0) {
    return (
      <div className="glass-panel rounded-[24px] p-10 text-center shadow-lg">
        <div className="max-w-md mx-auto py-6">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-5 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-200">No Data Extracted Yet</h3>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Upload or paste a screenshot above. The extracted phone number, date/time, link, and content will beautifully appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-white tracking-wide">Extracted Data Table</h3>
        <span className="text-xs text-slate-400 font-semibold bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
          Format: Phone Number &bull; Date &amp; Time &bull; Link &bull; Content
        </span>
      </div>

      <div className="glass-panel rounded-[24px] overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-md group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search phone number, link, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 text-xs">
            
            <button
              onClick={handleCopyTableTSV}
              className="inline-flex items-center px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium rounded-full shadow-lg shadow-indigo-500/20 border border-indigo-500/30 transition-all"
              title="Copy table to Excel/Sheets format"
            >
              {copiedTable ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copiedTable ? "Copied Table!" : "Copy Table"}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 font-medium rounded-full border border-slate-600/50 transition-all"
              title="Copy as Markdown table"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              Markdown
            </button>

            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 font-medium rounded-full border border-slate-600/50 transition-all"
              title="Download CSV Spreadsheet"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Export CSV
            </button>

          </div>

        </div>

        {/* Main Extracted Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-xs font-bold tracking-wider uppercase bg-slate-900/20">
                <th className="py-4 px-5 w-12 text-center border-b-0">Img</th>
                <th className="py-4 px-5 min-w-[150px] border-b-0">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    Phone Number
                  </div>
                </th>
                <th className="py-4 px-5 min-w-[160px] border-b-0">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Date &amp; Time
                  </div>
                </th>
                <th className="py-4 px-5 min-w-[180px] border-b-0">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Link
                  </div>
                </th>
                <th className="py-4 px-5 border-b-0">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Content
                  </div>
                </th>
                <th className="py-4 px-5 w-28 text-right border-b-0">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/30 text-xs sm:text-sm text-slate-300">
              {filteredRows.map((row, index) => {
                const hasPhone = row.phoneNumber && row.phoneNumber !== 'Not found';
                const hasLink = row.link && row.link !== 'Not found';

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Thumbnail / Image Preview */}
                    <td className="py-4 px-5 text-center">
                      {row.sourceImage ? (
                        <button
                          onClick={() => setPreviewImage(row.sourceImage || null)}
                          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden hover:ring-2 hover:ring-indigo-500/50 transition-all inline-block shadow-md"
                          title="View screenshot"
                        >
                          <img
                            src={row.sourceImage}
                            alt="Screenshot"
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                          />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-600 font-mono-theme bg-slate-800/50 px-2 py-1 rounded-md">#{index + 1}</span>
                      )}
                    </td>

                    {/* Phone Number Column */}
                    <td className="py-4 px-5 font-mono-theme font-medium text-slate-200">
                      {hasPhone ? (
                        <a
                          href={`tel:${row.phoneNumber.replace(/[^0-9+]/g, '')}`}
                          className="text-indigo-300 hover:text-indigo-200 hover:underline font-semibold flex items-center gap-1 transition-colors"
                        >
                          {row.phoneNumber}
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">Not found</span>
                      )}
                    </td>

                    {/* Date & Time Column */}
                    <td className="py-4 px-5 font-mono-theme text-xs text-slate-300">
                      {row.dateTime && row.dateTime !== 'Not found' ? (
                        <span className="bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/50">{row.dateTime}</span>
                      ) : (
                        <span className="text-slate-600 italic">Not found</span>
                      )}
                    </td>

                    {/* Link Column */}
                    <td className="py-4 px-5 max-w-[220px]">
                      {hasLink ? (
                        <a
                          href={row.link.startsWith('http') ? row.link : `https://${row.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline font-mono-theme text-xs flex items-center gap-1.5 truncate transition-colors"
                          title={row.link}
                        >
                          <span className="truncate">{row.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">Not found</span>
                      )}
                    </td>

                    {/* Content Column */}
                    <td className="py-4 px-5 text-slate-300">
                      <p className="whitespace-pre-wrap line-clamp-2 text-xs sm:text-sm leading-relaxed">
                        {row.content || <span className="text-slate-600 italic">No content text</span>}
                      </p>
                    </td>

                    {/* Row Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        
                        <button
                          onClick={() => handleCopyRow(row)}
                          className="p-2 rounded-lg hover:bg-slate-700/80 text-slate-400 hover:text-indigo-300 transition-colors"
                          title="Copy row text"
                        >
                          {copiedRowId === row.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => onEditRow(row)}
                          className="p-2 rounded-lg hover:bg-slate-700/80 text-slate-400 hover:text-indigo-300 transition-colors"
                          title="Edit entry"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteRow(row.id)}
                          className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-700/50 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing <strong className="text-white">{filteredRows.length}</strong> of {rows.length} entries</span>
          <span className="font-mono-theme text-[11px] text-slate-500 uppercase tracking-widest">Premium Data Grid</span>
        </div>

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative glass-panel rounded-[24px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-slate-700">
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50">
              <span className="text-sm font-bold text-slate-200 flex items-center tracking-wide">
                <Eye className="w-4 h-4 mr-2 text-indigo-400" /> Original Screenshot Preview
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-auto flex items-center justify-center bg-slate-900/20">
              <img src={previewImage} alt="Original Screenshot" className="max-w-full max-h-[70vh] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-700/50" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
