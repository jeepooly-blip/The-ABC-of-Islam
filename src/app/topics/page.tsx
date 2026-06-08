'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, X } from 'lucide-react';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import BadgeBoard from '@/components/gamification/BadgeBoard';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, getTopicsByCategory } from '@/lib/topics';
import { t, getCategoryName } from '@/lib/translations';

export default function TopicsPage() {
  const router = useRouter();
  const { locale } = useAppStore();
  const [showBadges, setShowBadges] = useState(false);

  return (
    <main className="min-h-screen">
      <nav className="p-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-white/80 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <span className="font-bold text-sm gradient-text hidden sm:block">{t(locale, 'title')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBadges(true)}
            className="flex items-center gap-1 px-3 py-2 bg-accent/10 text-accent rounded-xl font-medium text-sm hover:bg-accent/20 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">{t(locale, 'badges')}</span>
          </button>
          <AgeSelector />
          <LanguagePicker />
        </div>
      </nav>

      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
              {t(locale, 'title')}
            </h1>
            <p className="text-gray-600">{t(locale, 'subtitle')}</p>
          </div>

          {CATEGORIES.map((category) => {
            const topics = getTopicsByCategory(category.id);
            return (
              <div key={category.id} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.emoji}</span>
                  <h2 className="text-xl font-bold gradient-text">
                    {getCategoryName(category.id, locale)}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => router.push(`/topic/${topic.id}`)}
                      className="bg-white/80 card-shadow rounded-2xl p-4 text-left hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">{topic.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm leading-tight">
                            {typeof topic.title === 'string' ? topic.title : (topic.title as any)[locale] || topic.title.en}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={`/images/${topic.image}`}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showBadges && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text">{t(locale, 'yourBadges')}</h3>
              <button onClick={() => setShowBadges(false)} className="p-1 hover:bg-gray-100 rounded-lg">
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
