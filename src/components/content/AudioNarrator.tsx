'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

interface AudioNarratorProps {
  text: string;
}

export default function AudioNarrator({ text }: AudioNarratorProps) {
  const { locale, audioEnabled } = useAppStore();
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setReady(true);
      // Load voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speak = useCallback(() => {
    if (!ready || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(locale));
    if (match) utterance.voice = match;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [text, locale, ready]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => {
    return () => { if (typeof window !== 'undefined') window.speechSynthesis.cancel(); };
  }, []);

  if (!ready || !audioEnabled || !text) return null;

  return (
    <button
      onClick={speaking ? stop : speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
        speaking
          ? 'bg-red-500 text-white'
          : 'bg-cyan-500 text-white hover:bg-cyan-600'
      }`}
    >
      {speaking ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
          </svg>
          Read Aloud
        </>
      )}
    </button>
  );
}
