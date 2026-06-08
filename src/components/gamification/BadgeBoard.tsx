'use client';

import { useAppStore } from '@/lib/store';

const BADGES = [
  { id: 'first-topic', name: 'First Topic', icon: '🌟', condition: (p: any) => p.topicsRead?.length >= 1 },
  { id: 'five-topics', name: '5 Topics', icon: '📚', condition: (p: any) => p.topicsRead?.length >= 5 },
  { id: 'ten-topics', name: '10 Topics', icon: '🏅', condition: (p: any) => p.topicsRead?.length >= 10 },
  { id: 'half-book', name: 'Half Way!', icon: '🏆', condition: (p: any) => p.topicsRead?.length >= 13 },
  { id: 'full-book', name: 'Book Master!', icon: '👑', condition: (p: any) => p.topicsRead?.length >= 26 },
  { id: 'quiz-ace', name: 'Quiz Ace', icon: '🎯', condition: (p: any) => Object.values(p.quizzesCompleted || {}).some((s: any) => s === 3) },
];

export default function BadgeBoard() {
  const { progress } = useAppStore();

  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => {
        const earned = badge.condition(progress);
        return (
          <div
            key={badge.id}
            className={`p-3 rounded-2xl text-center ${
              earned
                ? 'bg-accent/20 card-shadow'
                : 'bg-gray-100 opacity-50'
            }`}
          >
            <span className="text-3xl block">{badge.icon}</span>
            <span className="text-xs font-bold mt-1 block">{badge.name}</span>
            {earned && (
              <div className="text-success text-xs mt-1 font-bold">
                ✓ Earned
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
