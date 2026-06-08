'use client';

import { useRouter } from 'next/navigation';
import { Globe, Volume2, Download, Sparkles, BookOpen, ArrowRight, Star, Shield, Heart } from 'lucide-react';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';

export default function Home() {
  const router = useRouter();
  const { locale } = useAppStore();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/50 no-print">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-extrabold text-sm gradient-text">{t(locale, 'title')}</span>
          </div>
          <LanguagePicker />
        </div>
      </nav>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[10%] text-6xl opacity-20 float-animation" style={{ animationDelay: '0s' }}>📖</div>
          <div className="absolute top-20 right-[15%] text-5xl opacity-15 float-animation" style={{ animationDelay: '1s' }}>🕌</div>
          <div className="absolute bottom-20 left-[20%] text-5xl opacity-15 float-animation" style={{ animationDelay: '0.5s' }}>🌙</div>
          <div className="absolute bottom-16 right-[10%] text-6xl opacity-20 float-animation" style={{ animationDelay: '1.5s' }}>✨</div>
        </div>

        <div className="relative text-center max-w-2xl">
          {/* Hero Icon */}
          <div className="text-7xl sm:text-8xl mb-6">📚</div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text mb-4 leading-tight">
            {t(locale, 'title')}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            {t(locale, 'subtitle')}
          </p>

          {/* Age Selector */}
          <div className="flex justify-center mb-8">
            <AgeSelector />
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/topics')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-orange-400 text-white rounded-2xl font-extrabold text-lg card-shadow hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/30"
          >
            <Sparkles className="w-6 h-6" />
            {t(locale, 'startReading')}
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Feature Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl card-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-bold text-gray-700">{t(locale, 'languages')}</span>
              <span className="text-xs text-gray-500">Choose your language</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl card-shadow">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-success" />
              </div>
              <span className="text-sm font-bold text-gray-700">{t(locale, 'audioNarration')}</span>
              <span className="text-xs text-gray-500">Listen as you learn</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl card-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm font-bold text-gray-700">{t(locale, 'pdfEbook')}</span>
              <span className="text-xs text-gray-500">Download to read offline</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-gray-400 text-xs font-medium">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Safe for kids</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> 26 topics</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Made with love</span>
          </div>
        </div>
      </div>
    </main>
  );
}
