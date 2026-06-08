'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, X, BookOpen, CheckCircle2, Star } from 'lucide-react';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import BadgeBoard from '@/components/gamification/BadgeBoard';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, getTopicsByCategory } from '@/lib/topics';
import { t, getCategoryName } from '@/lib/translations';

const CATEGORY_THEMES: Record<string, { bg: string; border: string; glow: string; badge: string }> = {
  pillars_of_islam: {
    bg: 'from-orange-400 to-amber-500',
    border: 'border-orange-200',
    glow: 'shadow-orange-200/50',
    badge: 'bg-orange-100 text-orange-700',
  },
  core_beliefs: {
    bg: 'from-sky-400 to-blue-500',
    border: 'border-sky-200',
    glow: 'shadow-sky-200/50',
    badge: 'bg-sky-100 text-sky-700',
  },
  daily_practices: {
    bg: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-200/50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  islamic_values: {
    bg: 'from-rose-400 to-pink-500',
    border: 'border-rose-200',
    glow: 'shadow-rose-200/50',
    badge: 'bg-rose-100 text-rose-700',
  },
  stories_history: {
    bg: 'from-amber-400 to-yellow-500',
    border: 'border-amber-200',
    glow: 'shadow-amber-200/50',
    badge: 'bg-amber-100 text-amber-700',
  },
  special_times: {
    bg: 'from-violet-400 to-purple-500',
    border: 'border-violet-200',
    glow: 'shadow-violet-200/50',
    badge: 'bg-violet-100 text-violet-700',
  },
};

export default function TopicsPage() {
  const router = useRouter();
  const { locale, progress } = useAppStore();
  const [showBadges, setShowBadges] = useState(false);

  const topicsRead = progress.topicsRead.length;
  const totalTopics = 26;

  return (
    <main className="min-h-screen">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/50 no-print">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm hidden sm:inline">{t(locale, 'title')}</span>
          </button>
          <div className="flex items-center gap-2">
            <AgeSelector />
            <LanguagePicker />
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-orange-400 to-accent">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl">📖</div>
          <div className="absolute top-8 right-12 text-5xl">🕌</div>
          <div className="absolute bottom-4 left-1/4 text-4xl">🌙</div>
          <div className="absolute bottom-6 right-1/3 text-5xl">✨</div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14 text-center text-white">
          <div className="text-5xl sm:text-6xl mb-3">📚</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            {t(locale, 'title')}
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-lg mx-auto mb-6">
            {t(locale, 'subtitle')}
          </p>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto">
            <div className="flex items-center justify-between text-sm font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                {topicsRead} / {totalTopics}
              </span>
              <span>{Math.round((topicsRead / totalTopics) * 100)}%</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(topicsRead / totalTopics) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {CATEGORIES.map((category) => {
          const topics = getTopicsByCategory(category.id);
          const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;
          const categoryRead = topics.filter(t => progress.topicsRead.includes(t.id)).length;
          const allRead = categoryRead === topics.length;

          return (
            <section key={category.id}>
              {/* Category Header */}
              <div className={`relative rounded-2xl bg-gradient-to-r ${theme.bg} p-5 sm:p-6 mb-5 overflow-hidden`}>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl opacity-15 select-none">
                  {category.emoji}
                </div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">{category.emoji}</span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow">
                        {getCategoryName(category.id, locale)}
                      </h2>
                      <p className="text-white/80 text-sm mt-0.5">
                        {categoryRead}/{topics.length} {t(locale, 'startReading').toLowerCase().includes('read') ? 'explored' : 'explored'}
                      </p>
                    </div>
                  </div>
                  {allRead && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-white/25 rounded-full text-white text-sm font-bold backdrop-blur-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Complete!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic, idx) => {
                  const isRead = progress.topicsRead.includes(topic.id);
                  const titleText = typeof topic.title === 'string' ? topic.title : (topic.title as any)[locale] || topic.title.en;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => router.push(`/topic/${topic.id}`)}
                      className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                        isRead
                          ? 'ring-2 ring-success ring-offset-2'
                          : 'card-shadow hover:shadow-xl'
                      }`}
                    >
                      {/* Image Background */}
                      <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-100">
                        <img
                          src={`/images/${topic.image}`}
                          alt={titleText}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Topic Emoji */}
                        <div className="absolute top-3 left-3 text-2xl bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                          {topic.emoji}
                        </div>

                        {/* Read Badge */}
                        {isRead && (
                          <div className="absolute top-3 right-3 bg-success text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3 h-3" />
                            Read
                          </div>
                        )}

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-base sm:text-lg leading-tight drop-shadow-lg">
                            {titleText}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                              <BookOpen className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white/70 text-xs font-medium">
                              Tap to explore →
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <div className="text-center py-8 text-gray-400 text-sm">
          <p>{t(locale, 'footer')}</p>
        </div>
      </div>

      {/* Badge Modal */}
      {showBadges && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowBadges(false)}>
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text">{t(locale, 'yourBadges')}</h3>
              <button onClick={() => setShowBadges(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <BadgeBoard />
          </div>
        </div>
      )}
    </main>
  );
}
