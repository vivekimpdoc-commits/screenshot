import React, { useState, useRef, useEffect } from 'react';
import { Upload, Clipboard, Sparkles, Loader2, Info } from 'lucide-react';
import { SAMPLE_SCREENSHOTS } from '../data/samples';
import { SampleScreenshot } from '../types';

interface UploadZoneProps {
  onProcessImage: (fileDataUrl: string, fileName: string, mimeType: string) => Promise<void>;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onProcessImage, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Clipboard Paste Listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setPasteNotice(true);
            setTimeout(() => setPasteNotice(false), 2500);

            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onProcessImage(
                  event.target.result as string,
                  `Clipboard_Screenshot_${new Date().toLocaleTimeString()}.png`,
                  blob.type || 'image/png'
                );
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onProcessImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onProcessImage(
              event.target.result as string,
              file.name,
              file.type || 'image/png'
            );
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSampleSelect = (sample: SampleScreenshot) => {
    onProcessImage(sample.imageDataUrl, sample.title, 'image/svg+xml');
  };

  return (
    <div className="glass-panel rounded-[28px] p-6">
      
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-[24px] border-2 border-dashed transition-all duration-300 p-8 sm:p-10 text-center flex flex-col items-center justify-center overflow-hidden group ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : isProcessing
            ? 'border-slate-600 bg-slate-800/40 opacity-90 cursor-wait'
            : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/60 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
        }`}
      >
        {/* Glow effect in background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4 relative z-10">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 animate-spin border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Loader2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-200">Processing Screenshot...</p>
              <p className="text-xs text-indigo-300/80 mt-1.5 font-medium">
                Gemini AI is extracting your data points magically
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 relative z-10">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Drop your screenshot here
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
                Drag &amp; drop, click to browse, or press <span className="bg-slate-700/50 text-indigo-300 border border-slate-600/50 px-2 py-0.5 rounded-md font-mono text-xs shadow-inner">Ctrl + V</span> to paste
              </p>
            </div>

            {pasteNotice && (
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Clipboard className="w-4 h-4 mr-1.5" />
                Clipboard Image Detected! Extracting...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset / Sample Screenshots Bar */}
      <div className="mt-6 pt-5 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center tracking-wider uppercase">
            <Sparkles className="w-4 h-4 mr-1.5 text-indigo-400" />
            Try 1-Click Demo Examples
          </span>
          <span className="text-[11px] text-indigo-400/80 uppercase font-bold tracking-widest">Demos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_SCREENSHOTS.map((sample) => (
            <button
              key={sample.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSampleSelect(sample);
              }}
              disabled={isProcessing}
              className="flex items-center p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/50 text-left transition-all hover:border-indigo-500/50 group disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mr-3 text-slate-500 shrink-0 overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                <img src={sample.imageDataUrl} alt={sample.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                  {sample.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{sample.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Info Helper */}
      <div className="mt-5 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 text-xs text-slate-400 flex items-start space-x-3 backdrop-blur-sm">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-slate-300 font-bold tracking-wide">Auto-Extracted Data Format:</p>
          <div className="mt-2 font-mono-theme text-[11px] text-indigo-300 bg-slate-900/80 px-4 py-2 rounded-xl border border-indigo-500/20 shadow-inner flex flex-wrap gap-2 items-center">
            <span>Phone Number</span>
            <span className="text-slate-600">|</span>
            <span>Date &amp; Time</span>
            <span className="text-slate-600">|</span>
            <span>Link</span>
            <span className="text-slate-600">|</span>
            <span>Content</span>
          </div>
        </div>
      </div>

    </div>
  );
};
