'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function OfflineIndicator() {
  const { setOnline } = useAppStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); setShow(false); };
    const handleOffline = () => { setOnline(false); setShow(true); };

    setOnline(navigator.onLine);
    if (!navigator.onLine) setShow(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You&apos;re offline</span>
    </div>
  );
}
