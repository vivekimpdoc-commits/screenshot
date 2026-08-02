import React, { useState, useEffect } from 'react';
import { ExtractedRow } from '../types';
import { X, Save, Phone, Calendar, Link as LinkIcon, FileText } from 'lucide-react';

interface RowEditModalProps {
  row: ExtractedRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRow: ExtractedRow) => void;
}

export const RowEditModal: React.FC<RowEditModalProps> = ({
  row,
  isOpen,
  onClose,
  onSave,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (row) {
      setPhoneNumber(row.phoneNumber || '');
      setDateTime(row.dateTime || '');
      setLink(row.link || '');
      setContent(row.content || '');
    } else {
      setPhoneNumber('');
      setDateTime('');
      setLink('');
      setContent('');
    }
  }, [row, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ExtractedRow = {
      id: row?.id || `manual-${Date.now()}`,
      phoneNumber: phoneNumber.trim() || 'Not found',
      dateTime: dateTime.trim() || 'Not found',
      link: link.trim() || 'Not found',
      content: content.trim() || '',
      sourceImage: row?.sourceImage,
      imageName: row?.imageName || 'Manual Entry',
      createdAt: row?.createdAt || new Date().toISOString(),
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel border border-slate-700/50 rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-500/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {row ? 'Edit Table Row' : 'Add New Table Row'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. 98XXXXXXXX or +91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-mono-theme shadow-inner transition-all"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Date &amp; Time
            </label>
            <input
              type="text"
              placeholder="e.g. 24-07-2026 10:30 AM"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-mono-theme shadow-inner transition-all"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
              Link
            </label>
            <input
              type="text"
              placeholder="e.g. https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-mono-theme shadow-inner transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Content
            </label>
            <textarea
              rows={4}
              placeholder="Enter context, message text, or description..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm shadow-inner transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-slate-700/50 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center shadow-lg shadow-indigo-500/20 transition-all border border-indigo-500/30"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
