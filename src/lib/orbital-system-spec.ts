/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              SCROLL-DRIVEN 3D ORBITAL ROTATION SYSTEM SPEC                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * BEHAVIOR SPECIFICATION
 * ══════════════════════
 *
 * ORBIT + SCROLL MAPPING:
 * - scrollProgress = clamp(scrollY / scrollMax, 0, 1)
 * - orbitAngle = scrollProgress * 2π (360°)
 * - Scrolling DOWN rotates camera/product group clockwise
 * - Scrolling UP reverses direction
 * - Constant orbit radius maintained throughout
 * - Hero product (sphere) stays centered
 * - All transitions use lerp for smooth easing (no jitter)
 *
 * STATION STATE MACHINE:
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ Station    │ Scroll Range │ Angle Range │ Content Type        │ UI Layer  │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ SPRING     │ 0-25%        │ 0°-90°      │ CATEGORIES          │ Minimal   │
 * │ SUMMER     │ 25-50%       │ 90°-180°    │ SEASONAL PRODUCTS   │ Cards     │
 * │ FALL       │ 50-75%       │ 180°-270°   │ BEST SELLING        │ Badges    │
 * │ WINTER     │ 75-100%      │ 270°-360°   │ FEATURED PRODUCTS   │ Hero CTA  │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * UI RULES:
 * - Station content ONLY visible within its scroll range
 * - Crossfade window: ~2% before and after station boundaries
 * - Cards orbit around center synchronized with sphere rotation
 * - Desktop: True orbital motion with 3D flip based on angle
 * - Mobile: Vertical stack with horizontal sway
 *
 * SEASONAL LOOK (continuous interpolation):
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ Season     │ Light Color   │ Saturation │ Fog         │ Particles        │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ SPRING     │ Soft warm     │ Medium     │ None        │ Cherry blossoms  │
 * │ SUMMER     │ Bright warm   │ High       │ None        │ Sun sparkles     │
 * │ FALL       │ Golden hour   │ Medium     │ Light haze  │ Falling leaves   │
 * │ WINTER     │ Cool blue     │ Low        │ Soft fog    │ Snowflakes       │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// PSEUDOCODE
// ============================================================================

/**
 * SCROLL TRACKING:
 * ```
 * function handleScroll():
 *   rect = container.getBoundingClientRect()
 *   containerHeight = container.offsetHeight
 *   viewportHeight = window.innerHeight
 *   scrollStart = -rect.top
 *   scrollRange = containerHeight - viewportHeight
 *   scrollProgress = clamp(scrollStart / scrollRange, 0, 1)
 * ```
 *
 * ORBITAL ANGLE:
 * ```
 * orbitAngle = scrollProgress * 2 * PI  // 0 → 2π (360°)
 * ```
 *
 * SEASON DETECTION:
 * ```
 * seasonIndex = floor(scrollProgress * 4)  // 0=Spring, 1=Summer, 2=Fall, 3=Winter
 * seasonBlend = fract(scrollProgress * 4)  // 0-1 within each season for crossfade
 * ```
 *
 * CROSSFADE OPACITY:
 * ```
 * function getStationOpacity(stationIndex, scrollProgress):
 *   stationStart = stationIndex * 0.25
 *   stationEnd = (stationIndex + 1) * 0.25
 *   blendWindow = 0.02  // 2% crossfade
 *   
 *   if scrollProgress < stationStart - blendWindow:
 *     return 0
 *   if scrollProgress > stationEnd + blendWindow:
 *     return 0
 *   
 *   fadeIn = smoothstep(stationStart - blendWindow, stationStart + blendWindow, scrollProgress)
 *   fadeOut = 1 - smoothstep(stationEnd - blendWindow, stationEnd + blendWindow, scrollProgress)
 *   
 *   return fadeIn * fadeOut
 * ```
 *
 * CARD ORBITAL POSITION:
 * ```
 * function getCardPosition(index, total, radius, chapterProgress):
 *   baseAngle = (index / total) * 2π - π/2  // Evenly distributed, start at top
 *   rotationOffset = chapterProgress * π/2   // 90° rotation per chapter
 *   angle = baseAngle + rotationOffset
 *   
 *   x = cos(angle) * radius
 *   y = sin(angle) * radius * 0.55  // Elliptical for perspective
 *   rotateY = (cos(angle) / radius) * radius * 8  // 3D flip effect
 *   
 *   return { x, y, rotateY, angle }
 * ```
 *
 * LERP SMOOTHING:
 * ```
 * function lerp(current, target, factor):
 *   return current + (target - current) * factor
 * ```
 */

// ============================================================================
// DATA STRUCTURE
// ============================================================================

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  icon: string;
  color: string;
  badge?: string;
  rating?: number;
  featured?: boolean;
}

export interface SeasonStation {
  id: 'spring' | 'summer' | 'fall' | 'winter';
  name: string;
  scrollRange: [number, number];
  angleRange: [number, number];
  contentType: 'categories' | 'seasonal' | 'bestselling' | 'featured';
  lighting: {
    color: string;
    intensity: number;
    saturation: number;
  };
  fog: {
    enabled: boolean;
    density: number;
    color: string;
  };
  particles: {
    type: 'blossoms' | 'sparkles' | 'leaves' | 'snow';
    count: number;
  };
}

// Station definitions
export const SEASON_STATIONS: SeasonStation[] = [
  {
    id: 'spring',
    name: 'Spring',
    scrollRange: [0, 0.25],
    angleRange: [0, 90],
    contentType: 'categories',
    lighting: { color: '#f0abfc', intensity: 0.8, saturation: 0.7 },
    fog: { enabled: false, density: 0, color: '#ffffff' },
    particles: { type: 'blossoms', count: 30 },
  },
  {
    id: 'summer',
    name: 'Summer',
    scrollRange: [0.25, 0.5],
    angleRange: [90, 180],
    contentType: 'seasonal',
    lighting: { color: '#fde047', intensity: 1.0, saturation: 0.9 },
    fog: { enabled: false, density: 0, color: '#ffffff' },
    particles: { type: 'sparkles', count: 25 },
  },
  {
    id: 'fall',
    name: 'Fall',
    scrollRange: [0.5, 0.75],
    angleRange: [180, 270],
    contentType: 'bestselling',
    lighting: { color: '#fb923c', intensity: 0.9, saturation: 0.75 },
    fog: { enabled: true, density: 0.3, color: '#fbbf24' },
    particles: { type: 'leaves', count: 20 },
  },
  {
    id: 'winter',
    name: 'Winter',
    scrollRange: [0.75, 1.0],
    angleRange: [270, 360],
    contentType: 'featured',
    lighting: { color: '#7dd3fc', intensity: 0.7, saturation: 0.5 },
    fog: { enabled: true, density: 0.5, color: '#e0f2fe' },
    particles: { type: 'snow', count: 40 },
  },
];

// Categories (Spring station)
export const CATEGORIES_DATA: Category[] = [
  { id: 'neural', label: 'Neural Links', icon: 'Brain', color: '#e879f9', count: 24 },
  { id: 'quantum', label: 'Quantum Cores', icon: 'Atom', color: '#a855f7', count: 18 },
  { id: 'holo', label: 'Holo Displays', icon: 'Glasses', color: '#06b6d4', count: 32 },
  { id: 'cyber', label: 'Cyber Decks', icon: 'Laptop', color: '#10b981', count: 15 },
];

// Seasonal Products (Summer station)
export const SEASONAL_PRODUCTS_DATA: Product[] = [
  { id: 'solar-core', name: 'Solar Core X', price: '$4,999', icon: 'Atom', color: '#fbbf24' },
  { id: 'beach-deck', name: 'Beach Deck Pro', price: '$2,799', icon: 'Laptop', color: '#f59e0b' },
  { id: 'sun-lens', name: 'Sun Lens AR', price: '$1,899', icon: 'Glasses', color: '#facc15' },
  { id: 'ray-link', name: 'Ray Neural', price: '$3,299', icon: 'Brain', color: '#eab308' },
];

// Best Sellers (Fall station)
export const BESTSELLERS_DATA: Product[] = [
  { id: 'neural-pro', name: 'Neural Link Pro', price: '$2,499', icon: 'Brain', badge: '#1', color: '#f97316', rating: 5 },
  { id: 'quantum-x', name: 'Quantum Core X', price: '$4,999', icon: 'Atom', badge: '#2', color: '#ea580c', rating: 4.8 },
  { id: 'holo-7', name: 'Holo Display 7', price: '$1,899', icon: 'Glasses', badge: '#3', color: '#fb923c', rating: 4.7 },
  { id: 'cyber-alpha', name: 'Cyber Core Alpha', price: '$3,299', icon: 'Laptop', badge: '#4', color: '#f59e0b', rating: 4.6 },
];

// Featured Products (Winter station)
export const FEATURED_PRODUCTS_DATA: Product[] = [
  { id: 'frost-deck', name: 'Frost Deck', price: '$2,399', originalPrice: '$3,599', discount: '33%', icon: 'Laptop', color: '#38bdf8', featured: true },
  { id: 'cryo-core', name: 'Cryo Core', price: '$4,999', originalPrice: '$6,999', discount: '28%', icon: 'Atom', color: '#0ea5e9', featured: true },
  { id: 'ice-lens', name: 'Ice Lens Pro', price: '$1,299', originalPrice: '$1,899', discount: '32%', icon: 'Glasses', color: '#7dd3fc', featured: true },
  { id: 'snow-link', name: 'Snow Neural', price: '$1,899', originalPrice: '$2,799', discount: '32%', icon: 'Brain', color: '#22d3ee', featured: true },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * Smooth step function for easing
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Get current season index from scroll progress
 */
export function getSeasonIndex(scrollProgress: number): number {
  return Math.min(3, Math.floor(scrollProgress * 4));
}

/**
 * Get blend factor within current season (0-1)
 */
export function getSeasonBlend(scrollProgress: number): number {
  return (scrollProgress * 4) % 1;
}

/**
 * Get orbital angle from scroll progress (radians)
 */
export function getOrbitAngle(scrollProgress: number): number {
  return scrollProgress * Math.PI * 2;
}

/**
 * Get station opacity with crossfade
 */
export function getStationOpacity(stationIndex: number, scrollProgress: number): number {
  const stationStart = stationIndex * 0.25;
  const stationEnd = (stationIndex + 1) * 0.25;
  const blendWindow = 0.02;

  if (scrollProgress < stationStart - blendWindow) return 0;
  if (scrollProgress > stationEnd + blendWindow) return 0;

  const fadeIn = stationIndex === 0 ? 1 : smoothstep(stationStart - blendWindow, stationStart + blendWindow, scrollProgress);
  const fadeOut = 1 - smoothstep(stationEnd - blendWindow, stationEnd + blendWindow, scrollProgress);

  return fadeIn * fadeOut;
}

/**
 * Calculate orbital position for a card
 */
export function getOrbitalCardPosition(
  index: number,
  total: number,
  radius: number,
  chapterProgress: number,
  isMobile: boolean = false
): { x: number; y: number; rotateY: number; angle: number } {
  const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const rotationOffset = chapterProgress * Math.PI * 0.5;
  const angle = baseAngle + rotationOffset;

  if (isMobile) {
    const spacing = 85;
    const startY = -((total - 1) * spacing) / 2;
    const baseY = startY + index * spacing + 20;
    const swayX = Math.sin(rotationOffset + index * 0.8) * 20;
    return { x: swayX, y: baseY, rotateY: chapterProgress * 12 * (index % 2 === 0 ? 1 : -1), angle };
  }

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.55,
    rotateY: (Math.cos(angle) / radius) * radius * 8,
    angle,
  };
}
