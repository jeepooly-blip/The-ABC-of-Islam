export type AgeLevel = 'starter' | 'explorer' | 'thinker';

export type Locale =
  | 'en' | 'ar' | 'ur' | 'tr' | 'fr' | 'es'
  | 'hi' | 'id' | 'de' | 'ru' | 'bn' | 'pt'
  | 'zh' | 'ja' | 'sw' | 'ko';

export interface Category {
  id: string;
  name: Record<Locale, string> | string;
  emoji: string;
}

export interface Topic {
  id: string;
  emoji: string;
  title: Record<Locale, string> | string;
  image: string;
  category: string;
  content: {
    starter: Record<Locale, string> | string;
    explorer: Record<Locale, string> | string;
    thinker: Record<Locale, string> | string;
  };
  funFact: Record<Locale, string> | string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  q: Record<Locale, string> | string;
  options: (Record<Locale, string> | string)[];
  correct: number;
  explanation: Record<Locale, string> | string;
}

export interface UserProgress {
  topicsRead: string[];
  quizzesCompleted: Record<string, number>;
  badges: string[];
  currentStreak: number;
  lastReadDate: string | null;
}

export interface Badge {
  id: string;
  name: Record<Locale, string> | string;
  description: Record<Locale, string> | string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}
