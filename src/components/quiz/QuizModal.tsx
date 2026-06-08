'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { isRTL } from '@/components/layout/LanguagePicker';
import { t } from '@/lib/translations';
import type { QuizQuestion } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, X } from 'lucide-react';

interface QuizModalProps {
  questions: QuizQuestion[];
  letter: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

function getLocalisedText(val: any, locale: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val[locale] || val.en || Object.values(val)[0] || '';
  return String(val);
}

function getLocalisedArray(arr: any, locale: string): string[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(item => getLocalisedText(item, locale));
}

export default function QuizModal({ questions, letter, onComplete, onClose }: QuizModalProps) {
  const { locale } = useAppStore();
  const rtl = isRTL(locale);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const qText = getLocalisedText(q.q, locale);
  const options = getLocalisedArray(q.options, locale);
  const explanation = getLocalisedText(q.explanation, locale);
  const isCorrect = selected === q.correct;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const lastCorrect = answers[current] === questions[current].correct ? 1 : 0;
      const finalScore = score + lastCorrect;
      onComplete(finalScore);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(questions.length).fill(null));
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const perfect = score === questions.length;
    return (
      <div className={`${rtl ? 'rtl-content' : 'ltr-content'}`}>
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <motion.div
            animate={{ rotate: perfect ? [0, 10, -10, 0] : 0 }}
            transition={{ repeat: perfect ? Infinity : 0, duration: 2 }}
          >
            <Trophy className={`w-16 h-16 mx-auto ${perfect ? 'text-accent' : 'text-gray-400'}`} />
          </motion.div>
          <h2 className="text-2xl font-bold mt-4 gradient-text">
            {perfect ? t(locale, 'perfectScore') : percent >= 60 ? t(locale, 'greatJob') : t(locale, 'keepTrying')}
          </h2>
          <p className="text-4xl font-extrabold mt-2 text-primary">{score}/{questions.length}</p>
          <p className="text-gray-600 mt-2">{percent}% {t(locale, 'correct')}</p>
          {perfect && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-success font-bold text-lg"
            >
              {t(locale, 'youEarned').replace('{letter}', letter)}
            </motion.p>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">
              <RotateCcw className="w-4 h-4" /> {t(locale, 'tryAgain')}
            </button>
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors">
              {t(locale, 'continueBtn')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${rtl ? 'rtl-content' : 'ltr-content'}`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500">
          {t(locale, 'questionOf').replace('{current}', String(current + 1)).replace('{total}', String(questions.length))}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= current ? 'bg-primary' : 'bg-gray-300'}`} />
            ))}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg ml-2">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-xl font-bold mb-4">{qText}</h3>

          <div className="space-y-3">
            {options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isAnswer = idx === q.correct;
              let style = 'bg-white border-2 border-gray-200 hover:border-primary';
              if (showResult) {
                if (isAnswer) style = 'bg-success/10 border-2 border-success';
                else if (isSelected && !isCorrect) style = 'bg-danger/10 border-2 border-danger';
                else style = 'bg-gray-50 border-2 border-gray-200 opacity-50';
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showResult && isAnswer && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
                    {showResult && isSelected && !isAnswer && <XCircle className="w-5 h-5 text-danger flex-shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-xl"
            >
              <p className="text-sm text-gray-700">{explanation}</p>
              <button
                onClick={handleNext}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors mx-auto font-medium"
              >
                {current < questions.length - 1 ? t(locale, 'nextQuestion') : t(locale, 'seeResults')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
