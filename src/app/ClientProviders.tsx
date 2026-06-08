'use client';

import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';

const ServiceWorkerRegistration = dynamic(
  () => import('@/components/ui/ServiceWorkerRegistration'),
  { ssr: false }
);

const OfflineIndicator = dynamic(
  () => import('@/components/ui/OfflineIndicator'),
  { ssr: false }
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  const locale = useAppStore(s => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      <ServiceWorkerRegistration />
      <OfflineIndicator />
      {children}
    </>
  );
}
