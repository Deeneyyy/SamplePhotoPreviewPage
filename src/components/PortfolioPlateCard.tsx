import React, { useState } from 'react';
import { PortfolioItem } from '../data/portfolioItems';

interface PortfolioPlateCardProps {
  item: PortfolioItem;
  isHovered: boolean;
  onMouseEnterPlate: (item: PortfolioItem) => void;
  onMouseLeavePlate: () => void;
  onSelectPlate: (item: PortfolioItem) => void;
  layoutMode: 'horizontal' | 'vertical';
}

export const PortfolioPlateCard: React.FC<PortfolioPlateCardProps> = ({
  item,
  isHovered,
  onMouseEnterPlate,
  onMouseLeavePlate,
  onSelectPlate,
  layoutMode,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative select-none cursor-pointer transition-transform duration-300 ease-out will-change-transform ${
        layoutMode === 'horizontal' ? 'shrink-0' : 'w-full'
      } ${isHovered ? 'z-20 scale-[1.08]' : 'z-0 scale-100'}`}
      onMouseEnter={() => onMouseEnterPlate(item)}
      onMouseLeave={onMouseLeavePlate}
      onClick={() => onSelectPlate(item)}
      role="button"
      tabIndex={0}
      aria-label={item.title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectPlate(item);
        }
      }}
    >
      <div
        style={{
          aspectRatio: `${item.widthAt1080p} / 1080`,
        }}
        className={
          layoutMode === 'horizontal'
            ? 'relative h-[190px] sm:h-[220px] lg:h-[240px] w-auto overflow-hidden bg-white'
            : 'relative w-full h-auto overflow-hidden bg-white'
        }
      >
        {!imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            width={item.widthAt1080p}
            height={1080}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            style={{
              transform: item.mirrorX ? 'scaleX(-1)' : 'none',
              filter: item.cssFilter,
            }}
            className="w-full h-full object-cover block pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100" />
        )}
      </div>
    </div>
  );
};
