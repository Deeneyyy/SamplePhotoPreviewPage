import React, { useEffect, useMemo, useRef } from 'react';
import { PortfolioItem } from '../data/portfolioItems';
import { PortfolioPlateCard } from './PortfolioPlateCard';

interface KineticLoopGalleryProps {
  items: PortfolioItem[];
  axis: 'horizontal' | 'vertical';
  hoveredItem: PortfolioItem | null;
  onHoverPlate: (item: PortfolioItem, trackIndex: number) => void;
  onLeavePlate: () => void;
  onSelectPlate: (item: PortfolioItem) => void;
}

const TRACK_COUNT = 3;
const BASE_TRACK_SPEEDS = [34, 26, 38];

export const KineticLoopGallery: React.FC<KineticLoopGalleryProps> = ({
  items,
  axis,
  hoveredItem,
  onHoverPlate,
  onLeavePlate,
  onSelectPlate,
}) => {
  const tracks = useMemo(() => {
    const buckets: PortfolioItem[][] = Array.from({ length: TRACK_COUNT }, () => []);
    items.forEach((item, idx) => {
      buckets[idx % TRACK_COUNT].push(item);
    });
    return buckets;
  }, [items]);

  const trackRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const offsetsRef = useRef<number[]>([0, 0, 0]);
  const currentVelocitiesRef = useRef<number[]>([1, 1, 1]);

  useEffect(() => {
    offsetsRef.current = [0, 0, 0];
    trackRefs.current.forEach((el) => {
      if (el) {
        el.style.transform = 'translate3d(0px, 0px, 0px)';
      }
    });
  }, [axis, items]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.064);
      lastTimestamp = now;

      for (let i = 0; i < TRACK_COUNT; i++) {
        const el = trackRefs.current[i];
        if (!el) continue;

        const isTrackPaused = hoveredItem !== null;

        const targetFactor = isTrackPaused ? 0 : 1;
        const smoothing = 1 - Math.exp(-18 * dt);
        currentVelocitiesRef.current[i] +=
          (targetFactor - currentVelocitiesRef.current[i]) * smoothing;

        if (Math.abs(currentVelocitiesRef.current[i]) < 0.001) {
          currentVelocitiesRef.current[i] = 0;
        }

        const direction = i % 2 === 0 ? -1 : 1;
        const speedPxPerSec = BASE_TRACK_SPEEDS[i] * currentVelocitiesRef.current[i];

        if (axis === 'horizontal') {
          const halfWidth = el.scrollWidth / 2;
          if (halfWidth > 0) {
            if (direction === 1 && offsetsRef.current[i] >= 0) {
              offsetsRef.current[i] = -halfWidth;
            }
            offsetsRef.current[i] += direction * speedPxPerSec * dt;

            if (direction === -1 && offsetsRef.current[i] <= -halfWidth) {
              offsetsRef.current[i] += halfWidth;
            } else if (direction === 1 && offsetsRef.current[i] >= 0) {
              offsetsRef.current[i] -= halfWidth;
            }

            el.style.transform = `translate3d(${offsetsRef.current[i].toFixed(2)}px, 0px, 0px)`;
          }
        } else {
          const halfHeight = el.scrollHeight / 2;
          if (halfHeight > 0) {
            if (direction === 1 && offsetsRef.current[i] >= 0) {
              offsetsRef.current[i] = -halfHeight;
            }
            offsetsRef.current[i] += direction * speedPxPerSec * dt;

            if (direction === -1 && offsetsRef.current[i] <= -halfHeight) {
              offsetsRef.current[i] += halfHeight;
            } else if (direction === 1 && offsetsRef.current[i] >= 0) {
              offsetsRef.current[i] -= halfHeight;
            }

            el.style.transform = `translate3d(0px, ${offsetsRef.current[i].toFixed(2)}px, 0px)`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [axis, hoveredItem]);

  if (axis === 'horizontal') {
    return (
      <section
        aria-label="Photo Gallery"
        className="w-full bg-white py-6 space-y-10 sm:space-y-12 overflow-x-hidden select-none flex flex-col justify-center"
      >
        {tracks.map((trackItems, trackIndex) => {
          const loopedItems = [...trackItems, ...trackItems];
          return (
            <div key={`h-track-${trackIndex}`} className="relative w-full py-3">
              <div
                ref={(el) => {
                  trackRefs.current[trackIndex] = el;
                }}
                className="flex items-center gap-10 sm:gap-14 w-max px-8 will-change-transform"
              >
                {loopedItems.map((item, idx) => (
                  <PortfolioPlateCard
                    key={`h-${trackIndex}-${item.id}-${idx}`}
                    item={item}
                    isHovered={hoveredItem?.id === item.id}
                    onMouseEnterPlate={(it) => onHoverPlate(it, trackIndex)}
                    onMouseLeavePlate={onLeavePlate}
                    onSelectPlate={onSelectPlate}
                    layoutMode="horizontal"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <section
      aria-label="Photo Gallery"
      className="w-full max-w-[1360px] mx-auto px-8 sm:px-14 bg-white select-none"
    >
      <div className="relative h-[84vh] min-h-[600px] overflow-hidden bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 h-full">
          {tracks.map((trackItems, trackIndex) => {
            const loopedItems = [...trackItems, ...trackItems];
            return (
              <div
                key={`v-track-${trackIndex}`}
                className={`relative h-full px-4 ${
                  trackIndex === 1 ? 'hidden sm:block' : ''
                } ${trackIndex === 2 ? 'hidden lg:block' : ''}`}
              >
                <div
                  ref={(el) => {
                    trackRefs.current[trackIndex] = el;
                  }}
                  className="flex flex-col items-center gap-12 pb-12 will-change-transform"
                >
                  {loopedItems.map((item, idx) => (
                    <PortfolioPlateCard
                      key={`v-${trackIndex}-${item.id}-${idx}`}
                      item={item}
                      isHovered={hoveredItem?.id === item.id}
                      onMouseEnterPlate={(it) => onHoverPlate(it, trackIndex)}
                      onMouseLeavePlate={onLeavePlate}
                      onSelectPlate={onSelectPlate}
                      layoutMode="vertical"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
