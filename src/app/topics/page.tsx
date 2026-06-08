'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, getTopicsByCategory } from '@/lib/topics';
import { t } from '@/lib/translations';

export default function TopicsPage() {
  const router = useRouter();
  const { locale } = useAppStore();

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
                    {typeof category.name === 'string' ? category.name : (category.name as any)[locale] || category.name.en}
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
    </main>
  );
}
