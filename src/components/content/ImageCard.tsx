'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  icon: string;
}

export default function ImageCard({ src, alt, icon }: ImageCardProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <div
        className="relative rounded-3xl overflow-hidden card-shadow cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
        onClick={() => setZoomed(true)}
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-cream to-sky flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${src}`}
            alt={alt}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-2 bg-white/90 rounded-full">
            <ZoomIn className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 text-3xl">{icon}</div>
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/${src}`}
                alt={alt}
                className="w-full h-auto rounded-2xl"
              />
              <button
                onClick={() => setZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
