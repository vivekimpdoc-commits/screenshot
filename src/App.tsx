import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { DataTable } from './components/DataTable';
import { RowEditModal } from './components/RowEditModal';
import { ExtractedRow } from './types';
import { SAMPLE_SCREENSHOTS } from './data/samples';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'extracted_screenshot_rows_v1';

export default function App() {
  const [rows, setRows] = useState<ExtractedRow[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved rows', e);
    }
    // Default initial row for quick demonstration
    return [
      {
        id: 'initial-sample-1',
        phoneNumber: SAMPLE_SCREENSHOTS[0].expectedData.phoneNumber,
        dateTime: SAMPLE_SCREENSHOTS[0].expectedData.dateTime,
        link: SAMPLE_SCREENSHOTS[0].expectedData.link,
        content: SAMPLE_SCREENSHOTS[0].expectedData.content,
        sourceImage: SAMPLE_SCREENSHOTS[0].imageDataUrl,
        imageName: 'WhatsApp_Sample.png',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [editingRow, setEditingRow] = useState<ExtractedRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rows));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [rows]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleProcessImage = async (
    fileDataUrl: string,
    fileName: string,
    mimeType: string
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: fileDataUrl,
          mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze screenshot.');
      }

      const extractedItems = data.items || [];

      if (extractedItems.length === 0) {
        showToast('Screenshot uploaded, but no text or details could be detected.', 'error');
        setIsProcessing(false);
        return;
      }

      const newRows: ExtractedRow[] = extractedItems.map((item: any, idx: number) => ({
        id: `row-${Date.now()}-${idx}`,
        phoneNumber: item.phoneNumber || 'Not found',
        dateTime: item.dateTime || 'Not found',
        link: item.link || 'Not found',
        content: item.content || '',
        sourceImage: fileDataUrl,
        imageName: fileName,
        createdAt: new Date().toISOString(),
      }));

      setRows((prev) => [...newRows, ...prev]);
      showToast(`Successfully extracted ${newRows.length} entry/entries from "${fileName}"!`, 'success');
    } catch (error: any) {
      console.error('Extraction Error:', error);
      showToast(error.message || 'Error parsing screenshot. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditRow = (row: ExtractedRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleAddManualRow = () => {
    setEditingRow(null);
    setIsModalOpen(true);
  };

  const handleSaveRow = (updatedRow: ExtractedRow) => {
    setRows((prev) => {
      const index = prev.findIndex((r) => r.id === updatedRow.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedRow;
        return next;
      } else {
        return [updatedRow, ...prev];
      }
    });
    showToast('Row saved successfully!', 'success');
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    showToast('Row deleted from table.', 'success');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all extracted data from the table?')) {
      setRows([]);
      showToast('All rows cleared.', 'success');
    }
  };

  return (
    <div className="min-h-screen mesh-bg text-slate-200 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Header */}
      <Header
        totalRows={rows.length}
        onClearAll={handleClearAll}
        onAddManual={handleAddManualRow}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Notification Alert */}
        {notification && (
          <div
            className={`p-4 rounded-2xl glass-panel flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 ${
              notification.type === 'success'
                ? 'border-emerald-500/20 text-emerald-100'
                : 'border-rose-500/20 text-rose-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs text-slate-400 hover:text-white underline ml-4 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Zone Section */}
        <section>
          <UploadZone
            onProcessImage={handleProcessImage}
            isProcessing={isProcessing}
          />
        </section>

        {/* Format Quick Helper Banner */}
        <section className="glass-panel rounded-2xl p-4 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-medium">
              <strong className="text-indigo-300">Auto Extracted Columns:</strong> Phone Number &bull; Date &amp; Time &bull; Link &bull; Content
            </span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono-theme bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            1-Click "Copy Table" &rarr; Paste directly into Excel or Google Sheets
          </div>
        </section>

        {/* Data Table Section */}
        <section>
          <DataTable
            rows={rows}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            onClearAll={handleClearAll}
          />
        </section>

      </main>

      {/* Row Edit / Add Modal */}
      <RowEditModal
        row={editingRow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRow}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-md py-8 text-center text-xs text-slate-500 font-medium">
        <p className="text-slate-400 text-sm font-bold mb-1 tracking-wide">
          <span className="gradient-text">Extracto AI</span> &bull; Premium Edition
        </p>
        <p>Extract Phone Number, Date &amp; Time, Link, and Content from screenshots with Gemini AI</p>
      </footer>

    </div>
  );
}
