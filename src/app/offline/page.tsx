'use client';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <span className="text-6xl block mb-4">📡</span>
        <h1 className="text-3xl font-bold gradient-text mb-4">You&apos;re Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you&apos;re not connected to the internet. 
          Don&apos;t worry — if you&apos;ve visited pages before, they should still be available!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
