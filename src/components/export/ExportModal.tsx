'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Download, FileText, BookOpen, Printer, X, Loader2 } from 'lucide-react';
import type { Topic } from '@/types';

interface ExportModalProps {
  content: Topic[];
  currentTopicId?: string;
}

export default function ExportModal({ content, currentTopicId }: ExportModalProps) {
  const { locale, ageLevel } = useAppStore();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
    setOpen(false);
  };

  const handleExportPDF = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, ageLevel, topicId: currentTopicId }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `abc-of-islam-${locale}${currentTopicId ? `-${currentTopicId}` : ''}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF export failed:', e);
    }
    setGenerating(false);
    setOpen(false);
  };

  const handleExportEPUB = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/epub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, ageLevel }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `abc-of-islam-${locale}.epub`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('EPUB export failed:', e);
    }
    setGenerating(false);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all"
      >
        <Download className="w-4 h-4" />
        <span>{t(locale, 'exportTitle')}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm card-shadow"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text">{t(locale, 'exportTitle')}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExportPDF}
                disabled={generating}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-danger/10 hover:bg-danger/20 transition-colors text-left"
              >
                <FileText className="w-6 h-6 text-danger" />
                <div>
                  <div className="font-bold">{t(locale, 'exportPdf')}</div>
                  <div className="text-sm text-gray-500">PDF</div>
                </div>
              </button>

              <button
                onClick={handleExportEPUB}
                disabled={generating}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors text-left"
              >
                <BookOpen className="w-6 h-6 text-secondary" />
                <div>
                  <div className="font-bold">{t(locale, 'exportEpub')}</div>
                  <div className="text-sm text-gray-500">EPUB</div>
                </div>
              </button>

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-success/10 hover:bg-success/20 transition-colors text-left"
              >
                <Printer className="w-6 h-6 text-success" />
                <div>
                  <div className="font-bold">{t(locale, 'exportPrint')}</div>
                  <div className="text-sm text-gray-500">{t(locale, 'exportPrint')}</div>
                </div>
              </button>
            </div>

            {generating && (
              <div className="flex items-center justify-center gap-2 mt-4 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
