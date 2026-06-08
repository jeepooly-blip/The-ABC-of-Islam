'use client';

import { useAppStore } from '@/lib/store';
import type { AgeLevel } from '@/types';
import { Baby, BookOpen, Brain } from 'lucide-react';

const LEVELS: { key: AgeLevel; label: string; age: string; icon: typeof Baby; color: string }[] = [
  { key: 'starter', label: 'Starter', age: '5-7', icon: Baby, color: 'bg-success' },
  { key: 'explorer', label: 'Explorer', age: '8-11', icon: BookOpen, color: 'bg-secondary' },
  { key: 'thinker', label: 'Thinker', age: '12-14', icon: Brain, color: 'bg-primary' },
];

export default function AgeSelector() {
  const { ageLevel, setAgeLevel } = useAppStore();

  return (
    <div className="flex gap-2">
      {LEVELS.map(level => {
        const Icon = level.icon;
        const isActive = ageLevel === level.key;
        return (
          <button
            key={level.key}
            onClick={() => setAgeLevel(level.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
              isActive
                ? `${level.color} text-white shadow-lg`
                : 'bg-white/60 text-gray-600 hover:bg-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{level.label}</span>
            <span className="text-xs opacity-80">({level.age})</span>
          </button>
        );
      })}
    </div>
  );
}
