'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, ArrowLeft, Brain, Trophy, Lightbulb, ArrowRight, RotateCcw, CheckCircle, XCircle, Download } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTopicById, getCategoryById } from '@/lib/topics';
import { getContent } from '@/lib/content';
import { t, getCategoryName } from '@/lib/translations';
import { isRTL } from '@/components/layout/LanguagePicker';
import AudioNarrator from '@/components/content/AudioNarrator';
import ImageCard from '@/components/content/ImageCard';
import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import ExportModal from '@/components/export/ExportModal';
import type { Topic, AgeLevel } from '@/types';

function getText(val: any, locale?: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return (locale && val[locale]) || val.en || Object.values(val)[0] || '';
  return String(val);
}

function getLevelContent(content: any, level: AgeLevel, locale: string): string {
  if (!content) return '';
  const levelData = content[level];
  if (!levelData) return '';
  if (typeof levelData === 'string') return levelData;
  if (typeof levelData === 'object') return levelData[locale] || levelData.en || Object.values(levelData)[0] || '';
  return String(levelData);
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const { locale, ageLevel, markTopicRead, setQuizScore, addBadge } = useAppStore();
  const rtl = isRTL(locale);

  const allContent = useMemo(() => getContent(locale), [locale]);
  const topicMeta = useMemo(() => getTopicById(topicId), [topicId]);
  const topicData = useMemo(() => allContent.find(t => t.id === topicId), [allContent, topicId]);

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (topicId) markTopicRead(topicId);
  }, [topicId, markTopicRead]);

  if (!topicData || !topicMeta) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">{t(locale, 'letterNotFound')}</p>
        </div>
      </main>
    );
  }

  const category = getCategoryById(topicMeta.category);
  const content = getLevelContent(topicData.content, ageLevel, locale);
  const title = getText(topicData.title, locale);
  const funFact = getText(topicData.funFact, locale);

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  const startQuiz = () => {
    resetQuiz();
    setShowQuiz(true);
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === topicData.quiz[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < topicData.quiz.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const finalScore = score;
      setQuizScore(topicId, finalScore);
      if (finalScore === topicData.quiz.length) {
        addBadge(`${topicId}-master`);
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/50 no-print">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/topics')} className="p-2 hover:bg-white/80 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <span className="font-bold text-sm gradient-text hidden sm:block">{t(locale, 'title')}</span>
          </div>
          <div className="flex items-center gap-2">
            <AgeSelector />
            <LanguagePicker />
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={`/images/${topicData.image}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          {category && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-3">
              <span>{category.emoji}</span>
              <span>{getCategoryName(category.id, locale)}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            {title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Audio + Content Card */}
          <div className="mt-6 p-6 bg-white/80 rounded-2xl card-shadow">
            <div className="flex items-center justify-between mb-4">
              <AudioNarrator text={content} />
              <ExportModal content={topicData ? [topicData] : []} currentTopicId={topicId} />
            </div>
            <p className="text-lg leading-relaxed whitespace-pre-line">{content}</p>
          </div>

          {/* Fun Fact */}
          <div className="mt-4 p-5 bg-gradient-to-r from-accent/10 to-amber-50 border-2 border-accent/20 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">💡</div>
              <div>
                <span className="font-bold text-accent text-sm uppercase tracking-wide">{t(locale, 'funFact')}</span>
                <p className="mt-1 text-gray-700 leading-relaxed">{funFact}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center no-print">
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-success to-emerald-400 text-white rounded-2xl font-bold card-shadow hover:scale-105 active:scale-95 transition-transform"
            >
              <Brain className="w-5 h-5" />
              {t(locale, 'takeQuiz')}
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={resetQuiz}>
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-lg card-shadow max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {finished ? (
              <div className={`${rtl ? 'rtl-content' : 'ltr-content'}`}>
                <div className="flex justify-end mb-2">
                  <button onClick={resetQuiz} className="p-2 hover:bg-gray-100 rounded-xl">
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="text-center p-8">
                  <Trophy className={`w-16 h-16 mx-auto ${score === topicData.quiz.length ? 'text-accent' : 'text-gray-400'}`} />
                  <h2 className="text-2xl font-bold mt-4 gradient-text">
                    {score === topicData.quiz.length ? t(locale, 'perfectScore') : score >= 2 ? t(locale, 'greatJob') : t(locale, 'keepTrying')}
                  </h2>
                  <p className="text-4xl font-extrabold mt-2 text-primary">{score}/{topicData.quiz.length}</p>
                  <div className="flex gap-3 justify-center mt-6">
                    <button onClick={startQuiz} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">
                      <RotateCcw className="w-4 h-4" /> {t(locale, 'tryAgain')}
                    </button>
                    <button onClick={resetQuiz} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors">
                      {t(locale, 'continueBtn')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${rtl ? 'rtl-content' : 'ltr-content'}`}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-500">
                    {t(locale, 'questionOf').replace('{current}', String(currentQ + 1)).replace('{total}', String(topicData.quiz.length))}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {topicData.quiz.map((_: any, i: number) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? 'bg-primary' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                    <button onClick={resetQuiz} className="p-2 hover:bg-gray-100 rounded-xl ml-2">
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div key={currentQ}>
                  <h3 className="text-xl font-bold mb-4">
                    {getText(topicData.quiz[currentQ].q, locale)}
                  </h3>

                  <div className="space-y-3">
                    {topicData.quiz[currentQ].options.map((opt: any, idx: number) => {
                      const optText = getText(opt, locale);
                      const isSelected = selected === idx;
                      const isAnswer = idx === topicData.quiz[currentQ].correct;
                      let style = 'bg-white border-2 border-gray-200 hover:border-primary';
                      if (showResult) {
                        if (isAnswer) style = 'bg-success/10 border-2 border-success';
                        else if (isSelected && !isAnswer) style = 'bg-danger/10 border-2 border-danger';
                        else style = 'bg-gray-50 border-2 border-gray-200 opacity-50';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl text-left transition-all duration-150 ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{optText}</span>
                            {showResult && isAnswer && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
                            {showResult && isSelected && !isAnswer && <XCircle className="w-5 h-5 text-danger flex-shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700">
                        {getText(topicData.quiz[currentQ].explanation, locale)}
                      </p>
                      <button
                        onClick={handleNext}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors mx-auto font-medium"
                      >
                        {currentQ < topicData.quiz.length - 1 ? t(locale, 'nextQuestion') : t(locale, 'seeResults')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
