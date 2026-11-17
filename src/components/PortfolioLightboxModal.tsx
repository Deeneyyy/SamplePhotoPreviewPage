import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { PortfolioItem } from '../data/portfolioItems';

interface PortfolioLightboxModalProps {
  item: PortfolioItem | null;
  allItems: PortfolioItem[];
  onClose: () => void;
  onSelectItem: (item: PortfolioItem) => void;
}

export const PortfolioLightboxModal: React.FC<PortfolioLightboxModalProps> = ({
  item,
  allItems,
  onClose,
  onSelectItem,
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allItems.findIndex((i) => i.id === item.id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % allItems.length;
          onSelectItem(allItems[nextIndex]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allItems.findIndex((i) => i.id === item.id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
          onSelectItem(allItems[prevIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, allItems, onClose, onSelectItem]);

  if (!item) return null;

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const prevItem =
    currentIndex !== -1
      ? allItems[(currentIndex - 1 + allItems.length) % allItems.length]
      : null;
  const nextItem =
    currentIndex !== -1
      ? allItems[(currentIndex + 1) % allItems.length]
      : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6 sm:p-12 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded 1080p Image"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="fixed top-6 right-6 z-20 p-2.5 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {prevItem && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectItem(prevItem);
          }}
          aria-label="Previous image"
          className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {nextItem && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectItem(nextItem);
          }}
          aria-label="Next image"
          className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Expanded 1080p Height Uncropped Image */}
      <div
        style={{
          aspectRatio: `${item.widthAt1080p} / 1080`,
          height: 'min(1080px, 86vh)',
        }}
        className="relative max-w-[90vw] overflow-hidden bg-white flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          width={item.widthAt1080p}
          height={1080}
          referrerPolicy="no-referrer"
          style={{
            transform: item.mirrorX ? 'scaleX(-1)' : 'none',
            filter: item.cssFilter,
          }}
          className="w-full h-full object-contain block"
        />
      </div>
    </div>
  );
};
