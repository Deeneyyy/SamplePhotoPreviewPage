export type Discipline =
  | 'Architecture'
  | 'Editorial & Fashion'
  | 'Still Life & Form'
  | 'Landscapes & Fog'
  | 'Portraiture';

export type AspectPreset = '3:4' | '4:3' | '1:1' | '16:9';

export interface PortfolioItem {
  id: number;
  catalogNumber: string;
  title: string;
  discipline: Discipline;
  imageUrl: string;
  aspectRatio: AspectPreset;
  widthAt1080p: number;
  heightAt1080p: 1080;
  mirrorX: boolean;
  cssFilter: string;
}

export const MASTER_PLATES: Record<
  Discipline,
  { url: string; aspect: AspectPreset; widthAt1080p: number }
> = {
  'Architecture': {
    url: '/src/assets/images/editorial_architecture_monolith_1794919021525.jpg',
    aspect: '3:4',
    widthAt1080p: 810,
  },
  'Editorial & Fashion': {
    url: '/src/assets/images/editorial_fashion_silhouette_1794919023840.jpg',
    aspect: '4:3',
    widthAt1080p: 1440,
  },
  'Still Life & Form': {
    url: '/src/assets/images/still_life_travertine_vessels_1794919024643.jpg',
    aspect: '1:1',
    widthAt1080p: 1080,
  },
  'Landscapes & Fog': {
    url: '/src/assets/images/cinematic_coastal_fog_horizon_1794919026310.jpg',
    aspect: '16:9',
    widthAt1080p: 1920,
  },
  'Portraiture': {
    url: '/src/assets/images/portrait_sculptural_light_1794919026383.jpg',
    aspect: '3:4',
    widthAt1080p: 810,
  },
};

const DISCIPLINES: Discipline[] = [
  'Architecture',
  'Editorial & Fashion',
  'Still Life & Form',
  'Landscapes & Fog',
  'Portraiture',
];

const FILM_FILTERS: string[] = [
  'none',
  'grayscale(1) contrast(1.12)',
  'contrast(1.04) saturate(0.92)',
  'grayscale(0.85) sepia(0.15) contrast(1.06)',
  'contrast(0.97) saturate(0.85) brightness(1.03)',
  'grayscale(1) contrast(1.22) brightness(0.98)',
  'grayscale(0.9) hue-rotate(190deg) saturate(0.28) contrast(1.08)',
  'contrast(1.08) saturate(1.06)',
];

function buildPortfolioCatalog(): PortfolioItem[] {
  const items: PortfolioItem[] = [];
  let idCounter = 1;

  for (let variantIdx = 0; variantIdx < 24; variantIdx++) {
    for (let discIdx = 0; discIdx < DISCIPLINES.length; discIdx++) {
      const discipline = DISCIPLINES[discIdx];
      const master = MASTER_PLATES[discipline];
      const catalogNumber = String(idCounter).padStart(3, '0');
      const cssFilter =
        FILM_FILTERS[(variantIdx + discIdx * 2) % FILM_FILTERS.length];
      const mirrorX = variantIdx % 4 === 2;

      items.push({
        id: idCounter,
        catalogNumber,
        title: `${discipline} — Plate ${catalogNumber}`,
        discipline,
        imageUrl: master.url,
        aspectRatio: master.aspect,
        widthAt1080p: master.widthAt1080p,
        heightAt1080p: 1080,
        mirrorX,
        cssFilter,
      });

      idCounter++;
    }
  }

  return items;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = buildPortfolioCatalog();
