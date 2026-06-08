'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, ArrowRight, Globe, Volume2, Download, Sparkles } from 'lucide-react';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';

export default function Home() {
  const router = useRouter();
  const { locale } = useAppStore();

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="p-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-extrabold text-lg gradient-text">{t(locale, 'title')}</span>
        </div>
        <LanguagePicker />
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6 float-animation">
            📖
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold gradient-text mb-4">
            {t(locale, 'title')}
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            {t(locale, 'subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <AgeSelector />
          </div>

          <button
            onClick={() => router.push('/topics')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-xl card-shadow hover:bg-primary/90 transition-colors hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-6 h-6" />
            {t(locale, 'startReading')}
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
            <div className="p-4">
              <Globe className="w-8 h-8 text-secondary mx-auto mb-2" />
              <span className="text-sm font-bold text-gray-600">{t(locale, 'languages')}</span>
            </div>
            <div className="p-4">
              <Volume2 className="w-8 h-8 text-success mx-auto mb-2" />
              <span className="text-sm font-bold text-gray-600">{t(locale, 'audioNarration')}</span>
            </div>
            <div className="p-4">
              <Download className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-sm font-bold text-gray-600">{t(locale, 'pdfEbook')}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: '🕌', label: 'Pillars of Islam', count: '5' },
              { emoji: '📖', label: 'Core Beliefs', count: '5' },
              { emoji: '✨', label: 'Daily Practices', count: '5' },
              { emoji: '💚', label: 'Islamic Values', count: '5' },
              { emoji: '📜', label: 'Stories & History', count: '3' },
              { emoji: '🌙', label: 'Special Times', count: '3' },
            ].map((cat) => (
              <div
                key={cat.label}
                className="bg-white/80 card-shadow rounded-2xl p-4 text-center"
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="font-bold text-sm text-gray-700 block">{cat.label}</span>
                <span className="text-xs text-gray-500">{cat.count} topics</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="p-4 text-center text-sm text-gray-400 no-print">
        {t(locale, 'footer')}
      </footer>
    </main>
  );
}
