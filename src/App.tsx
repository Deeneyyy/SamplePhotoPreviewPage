/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MoveHorizontal, MoveVertical } from 'lucide-react';
import { PORTFOLIO_ITEMS, PortfolioItem } from './data/portfolioItems';
import { KineticLoopGallery } from './components/KineticLoopGallery';
import { PortfolioLightboxModal } from './components/PortfolioLightboxModal';

export default function App() {
  const [axis, setAxis] = useState<'horizontal' | 'vertical'>('horizontal');
  const [hoveredItem, setHoveredItem] = useState<PortfolioItem | null>(null);
  const [expandedItem, setExpandedItem] = useState<PortfolioItem | null>(null);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between overflow-x-hidden">
      {/* Minimalist Title & Icon-Only Loop Direction Switch */}
      <div className="w-full px-8 sm:px-14 pt-8 pb-2 flex items-center justify-between bg-white">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 select-none">
          Photo Gallery
        </h1>

        <div
          role="group"
          aria-label="Loop Direction"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => setAxis('horizontal')}
            aria-label="Horizontal Loop"
            title="Horizontal Loop"
            className={`p-2 transition-colors cursor-pointer ${
              axis === 'horizontal'
                ? 'text-zinc-900'
                : 'text-zinc-300 hover:text-zinc-600'
            }`}
          >
            <MoveHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setAxis('vertical')}
            aria-label="Vertical Loop"
            title="Vertical Loop"
            className={`p-2 transition-colors cursor-pointer ${
              axis === 'vertical'
                ? 'text-zinc-900'
                : 'text-zinc-300 hover:text-zinc-600'
            }`}
          >
            <MoveVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Centered Pure Image Kinetic Stage */}
      <main className="flex-1 flex flex-col justify-center bg-white">
        <KineticLoopGallery
          items={PORTFOLIO_ITEMS}
          axis={axis}
          hoveredItem={hoveredItem}
          onHoverPlate={(item) => setHoveredItem(item)}
          onLeavePlate={() => setHoveredItem(null)}
          onSelectPlate={(item) => setExpandedItem(item)}
        />
      </main>

      {/* Pure Frameless Fullscreen Image Expansion on Click */}
      <PortfolioLightboxModal
        item={expandedItem}
        allItems={PORTFOLIO_ITEMS}
        onClose={() => setExpandedItem(null)}
        onSelectItem={(item) => setExpandedItem(item)}
      />
    </div>
  );
}
