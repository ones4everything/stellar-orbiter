import { motion } from "framer-motion";
import { 
  Sun, Snowflake, Star,
  ShoppingBag, Shirt, Watch, Footprints,
  ShoppingCart, Check, Percent
} from "lucide-react";
import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  clamp, 
  smoothstep, 
  getSeasonIndex,
  getOrbitAngle,
} from "@/lib/orbital-system-spec";

interface ChapterContentProps {
  scrollProgress: number;
}

/**
 * ORBITAL SYSTEM: scroll-driven 360° rotation
 * - scrollProgress 0→1 = orbitAngle 0→2π
 * - Season stations at 25% intervals
 * - Cards orbit around center with 3D flip based on angle
 */

// Chapter 1: Spring (0-25%) - CATEGORIES (6 items for orbit balance)
const categories = [
  { id: "men", label: "Men's Fashion", icon: Shirt, color: "#e879f9", count: 248 },
  { id: "women", label: "Women's Style", icon: ShoppingBag, color: "#a855f7", count: 312 },
  { id: "footwear", label: "Footwear", icon: Footprints, color: "#06b6d4", count: 156 },
  { id: "accessories", label: "Accessories", icon: Watch, color: "#10b981", count: 189 },
  { id: "kids", label: "Kids Collection", icon: Shirt, color: "#f472b6", count: 98 },
  { id: "sports", label: "Sportswear", icon: ShoppingBag, color: "#22d3ee", count: 134 },
];

// Chapter 2: Summer (25-50%) - SEASONAL PRODUCTS (6 items)
const seasonalProducts = [
  { id: "linen-blazer", name: "Linen Summer Blazer", price: "$189", icon: Shirt, color: "#fbbf24" },
  { id: "beach-tote", name: "Canvas Beach Tote", price: "$79", icon: ShoppingBag, color: "#f59e0b" },
  { id: "sun-hat", name: "Wide Brim Sun Hat", price: "$49", icon: Watch, color: "#facc15" },
  { id: "espadrilles", name: "Classic Espadrilles", price: "$95", icon: Footprints, color: "#eab308" },
  { id: "swim-shorts", name: "Tropical Swim Shorts", price: "$65", icon: Shirt, color: "#fcd34d" },
  { id: "sandals", name: "Leather Slide Sandals", price: "$85", icon: Footprints, color: "#fbbf24" },
];

// Chapter 3: Fall (50-75%) - BEST SELLING with badges/ratings (6 items)
const bestSellers = [
  { id: "leather-jacket", name: "Premium Leather Jacket", price: "$349", icon: Shirt, badge: "#1", color: "#f97316", rating: 5 },
  { id: "designer-bag", name: "Designer Crossbody", price: "$275", icon: ShoppingBag, badge: "#2", color: "#ea580c", rating: 4.9 },
  { id: "chelsea-boots", name: "Suede Chelsea Boots", price: "$195", icon: Footprints, badge: "#3", color: "#fb923c", rating: 4.8 },
  { id: "smart-watch", name: "Luxury Smart Watch", price: "$429", icon: Watch, badge: "#4", color: "#f59e0b", rating: 4.7 },
  { id: "wool-sweater", name: "Merino Wool Sweater", price: "$145", icon: Shirt, badge: "#5", color: "#fdba74", rating: 4.6 },
  { id: "leather-belt", name: "Italian Leather Belt", price: "$89", icon: Watch, badge: "#6", color: "#fed7aa", rating: 4.5 },
];

// Chapter 4: Winter (75-100%) - FEATURED PRODUCTS with hero CTA (6 items)
const featuredProducts = [
  { id: "cashmere-coat", name: "Cashmere Wool Coat", price: "$459", original: "$699", discount: "34%", icon: Shirt, color: "#38bdf8", featured: true },
  { id: "winter-boots", name: "Shearling Snow Boots", price: "$289", original: "$399", discount: "28%", icon: Footprints, color: "#0ea5e9", featured: true },
  { id: "knit-scarf", name: "Merino Knit Scarf", price: "$89", original: "$129", discount: "31%", icon: Watch, color: "#7dd3fc", featured: false },
  { id: "tote-bag", name: "Quilted Tote Bag", price: "$159", original: "$229", discount: "30%", icon: ShoppingBag, color: "#22d3ee", featured: false },
  { id: "puffer-jacket", name: "Down Puffer Jacket", price: "$329", original: "$449", discount: "27%", icon: Shirt, color: "#67e8f9", featured: false },
  { id: "fleece-gloves", name: "Tech Fleece Gloves", price: "$49", original: "$69", discount: "29%", icon: Watch, color: "#a5f3fc", featured: false },
];

const ChapterContent = ({ scrollProgress }: ChapterContentProps) => {
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  const handleAddToCart = (item: { id: string; name: string; price: string }) => {
    const numericPrice = parseInt(item.price.replace(/\D/g, ""));
    addItem({
      id: item.id,
      name: item.name,
      price: numericPrice,
      priceDisplay: item.price,
      icon: "🛒",
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Get card visibility - show cards when chapter is active
  // Improved crossfade: uses seasonBlend approach from spec (fade out 80-100%, fade in 0-20%)
  const getCardVisibility = (chapterIndex: number) => {
    const chapterStart = chapterIndex * 0.25;
    const chapterEnd = chapterIndex === 3 ? 1.0 : (chapterIndex + 1) * 0.25;
    
    // Completely outside this chapter's range
    if (scrollProgress < chapterStart - 0.05 || scrollProgress > chapterEnd + 0.05) {
      return { opacity: 0, scale: 0.85 };
    }
    
    // Calculate progress within this chapter (0-1)
    const chapterProgress = Math.max(0, Math.min(1, (scrollProgress - chapterStart) / 0.25));
    
    // Fade-in at start of chapter (0% to 15%)
    let fadeIn = 1;
    if (chapterIndex > 0 && chapterProgress < 0.15) {
      fadeIn = chapterProgress / 0.15;
    }
    
    // Fade-out at end of chapter (85% to 100%) - but not for Winter (last chapter)
    let fadeOut = 1;
    if (chapterIndex < 3 && chapterProgress > 0.85) {
      fadeOut = 1 - (chapterProgress - 0.85) / 0.15;
    }
    
    const opacity = Math.max(0, Math.min(1, fadeIn * fadeOut));
    const scale = 0.85 + 0.15 * Math.min(1, opacity);
    
    return { opacity, scale };
  };

  // ORBITAL ROTATION: Cards orbit around center following the sphere's rotation
  const getOrbitalPosition = (
    index: number, 
    total: number, 
    radius: number, 
    chapterIndex: number
  ) => {
    // Base angle for this card (evenly distributed)
    const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    
    // Calculate rotation based on scroll within this chapter
    const chapterStart = chapterIndex * 0.25;
    const chapterProgress = Math.max(0, Math.min(1, (scrollProgress - chapterStart) / 0.25));
    
    // Rotate cards as user scrolls (half turn per chapter for visible orbit effect)
    const rotationOffset = chapterProgress * Math.PI * 0.5;
    const angle = baseAngle + rotationOffset;
    
    if (isMobile) {
      // Mobile: vertical stack with subtle horizontal sway
      const spacing = 85;
      const startY = -((total - 1) * spacing) / 2;
      const baseY = startY + index * spacing + 20;
      const swayX = Math.sin(rotationOffset + index * 0.8) * 20;
      
      return { 
        x: swayX, 
        y: baseY,
        rotateY: chapterProgress * 12 * (index % 2 === 0 ? 1 : -1),
        angle,
        chapterProgress,
      };
    }
    
    // Desktop: true orbital motion around center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      rotateY: (Math.cos(angle) / radius) * radius * 8,
      angle,
      chapterProgress,
    };
  };

  // Generate trail positions (previous positions for comet effect)
  const getTrailPositions = (
    index: number,
    total: number,
    radius: number,
    chapterIndex: number,
    trailCount: number = 5
  ) => {
    const trails = [];
    const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const chapterStart = chapterIndex * 0.25;
    const chapterProgress = Math.max(0, Math.min(1, (scrollProgress - chapterStart) / 0.25));
    const rotationOffset = chapterProgress * Math.PI * 0.5;
    
    for (let i = 1; i <= trailCount; i++) {
      // Trail follows behind the card (negative offset)
      const trailAngle = baseAngle + rotationOffset - (i * 0.08);
      const trailOpacity = (1 - i / (trailCount + 1)) * 0.4;
      const trailScale = 1 - (i * 0.1);
      
      if (isMobile) {
        const swayX = Math.sin(rotationOffset - (i * 0.1) + index * 0.8) * 20;
        trails.push({
          x: swayX - (i * 3),
          y: 0,
          opacity: trailOpacity * 0.5,
          scale: trailScale,
        });
      } else {
        trails.push({
          x: Math.cos(trailAngle) * radius,
          y: Math.sin(trailAngle) * radius * 0.55,
          opacity: trailOpacity,
          scale: trailScale,
        });
      }
    }
    return trails;
  };

  // Check if chapter is in range - extended visibility for smooth transitions
  const isChapterVisible = (chapterIndex: number) => {
    const start = chapterIndex * 0.25;
    const end = chapterIndex === 3 ? 1.05 : (chapterIndex + 1) * 0.25;
    // Extend visibility window for crossfade overlap
    return scrollProgress >= start - 0.05 && scrollProgress <= end + 0.05;
  };

  // Trail component for glow effect
  const OrbitalTrail = ({ 
    trails, 
    color, 
    baseOpacity 
  }: { 
    trails: { x: number; y: number; opacity: number; scale: number }[];
    color: string;
    baseOpacity: number;
  }) => {
    if (isMobile) return null; // Skip trails on mobile for performance
    
    return (
      <>
        {trails.map((trail, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `calc(50% + ${trail.x}px)`,
              top: `calc(50% + ${trail.y}px)`,
              transform: `translate(-50%, -50%) scale(${trail.scale})`,
              width: "80px",
              height: "80px",
              background: `radial-gradient(circle, ${color}${Math.round(trail.opacity * baseOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
              filter: `blur(${8 + i * 4}px)`,
            }}
          />
        ))}
      </>
    );
  };

  // Connector line from sphere center to card
  const OrbitalConnector = ({
    x,
    y,
    color,
    opacity,
  }: {
    x: number;
    y: number;
    color: string;
    opacity: number;
  }) => {
    if (isMobile) return null; // Skip connectors on mobile
    
    return (
      <svg
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: Math.abs(x) * 2 + 100,
          height: Math.abs(y) * 2 + 100,
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id={`connector-grad-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.8} />
            <stop offset="50%" stopColor={color} stopOpacity={opacity * 0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.1} />
          </linearGradient>
          <filter id={`glow-${x}-${y}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1={Math.abs(x) + 50}
          y1={Math.abs(y) + 50}
          x2={Math.abs(x) + 50 + x}
          y2={Math.abs(y) + 50 + y}
          stroke={`url(#connector-grad-${x}-${y})`}
          strokeWidth="2"
          filter={`url(#glow-${x}-${y})`}
          strokeLinecap="round"
        />
        {/* Glow orb at card end */}
        <circle
          cx={Math.abs(x) + 50 + x}
          cy={Math.abs(y) + 50 + y}
          r="6"
          fill={color}
          opacity={opacity * 0.6}
          filter={`url(#glow-${x}-${y})`}
        />
      </svg>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {/* Spring - Categories */}
      {isChapterVisible(0) && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Render connectors first (behind everything) */}
          {categories.map((cat, idx) => {
            const pos = getOrbitalPosition(idx, categories.length, 220, 0);
            const { opacity } = getCardVisibility(0);
            if (opacity < 0.01) return null;
            return <OrbitalConnector key={`connector-${cat.id}`} x={pos.x} y={pos.y} color={cat.color} opacity={opacity} />;
          })}
          
          {/* Render trails (behind cards) */}
          {categories.map((cat, idx) => {
            const trails = getTrailPositions(idx, categories.length, 220, 0);
            const { opacity } = getCardVisibility(0);
            if (opacity < 0.01) return null;
            return <OrbitalTrail key={`trail-${cat.id}`} trails={trails} color={cat.color} baseOpacity={opacity} />;
          })}
          
          {/* Render cards */}
          {categories.map((cat, idx) => {
            const pos = getOrbitalPosition(idx, categories.length, 220, 0);
            const Icon = cat.icon;
            const { opacity, scale } = getCardVisibility(0);

            if (opacity < 0.01) return null;

            return (
              <motion.div
                key={cat.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  opacity,
                  transform: `translate(-50%, -50%) rotateY(${pos.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                {/* Card glow */}
                <div 
                  className="absolute inset-0 rounded-xl blur-xl opacity-40"
                  style={{ background: `radial-gradient(circle, ${cat.color}60, transparent 70%)` }}
                />
                <div 
                  className="glass-card rounded-xl p-4 w-[140px] md:w-[160px] border relative"
                  style={{ borderColor: `${cat.color}30` }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `linear-gradient(135deg, ${cat.color}30, ${cat.color}10)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-foreground font-semibold text-sm">{cat.label}</h3>
                  <p className="text-muted-foreground text-xs">{cat.count} products</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summer - Seasonal Products */}
      {isChapterVisible(1) && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Render connectors first */}
          {seasonalProducts.map((product, idx) => {
            const pos = getOrbitalPosition(idx, seasonalProducts.length, 200, 1);
            const { opacity } = getCardVisibility(1);
            if (opacity < 0.01) return null;
            return <OrbitalConnector key={`connector-${product.id}`} x={pos.x} y={pos.y} color={product.color} opacity={opacity} />;
          })}
          
          {/* Render trails */}
          {seasonalProducts.map((product, idx) => {
            const trails = getTrailPositions(idx, seasonalProducts.length, 200, 1);
            const { opacity } = getCardVisibility(1);
            if (opacity < 0.01) return null;
            return <OrbitalTrail key={`trail-${product.id}`} trails={trails} color={product.color} baseOpacity={opacity} />;
          })}
          
          {seasonalProducts.map((product, idx) => {
            const pos = getOrbitalPosition(idx, seasonalProducts.length, 200, 1);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(1);

            if (opacity < 0.01) return null;

            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  opacity,
                  transform: `translate(-50%, -50%) rotateY(${pos.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                {/* Card glow */}
                <div 
                  className="absolute inset-0 rounded-xl blur-xl opacity-40"
                  style={{ background: `radial-gradient(circle, ${product.color}60, transparent 70%)` }}
                />
                <div 
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border relative"
                  style={{ borderColor: `${product.color}30` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Summer Edition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{product.name}</h3>
                      <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-background"
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Fall - BEST SELLING with badges and ratings */}
      {isChapterVisible(2) && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Render connectors first */}
          {bestSellers.map((product, idx) => {
            const pos = getOrbitalPosition(idx, bestSellers.length, 210, 2);
            const { opacity } = getCardVisibility(2);
            if (opacity < 0.01) return null;
            return <OrbitalConnector key={`connector-${product.id}`} x={pos.x} y={pos.y} color={product.color} opacity={opacity} />;
          })}
          
          {/* Render trails */}
          {bestSellers.map((product, idx) => {
            const trails = getTrailPositions(idx, bestSellers.length, 210, 2);
            const { opacity } = getCardVisibility(2);
            if (opacity < 0.01) return null;
            return <OrbitalTrail key={`trail-${product.id}`} trails={trails} color={product.color} baseOpacity={opacity} />;
          })}
          
          {bestSellers.map((product, idx) => {
            const pos = getOrbitalPosition(idx, bestSellers.length, 210, 2);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(2);

            if (opacity < 0.01) return null;

            // Render rating stars
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.5;

            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  opacity,
                  transform: `translate(-50%, -50%) rotateY(${pos.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                {/* Card glow */}
                <div 
                  className="absolute inset-0 rounded-xl blur-xl opacity-40"
                  style={{ background: `radial-gradient(circle, ${product.color}60, transparent 70%)` }}
                />
                <div 
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border relative overflow-hidden"
                  style={{ borderColor: `${product.color}30` }}
                >
                  {/* Rank badge */}
                  <div 
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${product.color}`, color: '#000' }}
                  >
                    {product.badge}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{product.name}</h3>
                      <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                    </div>
                  </div>
                  
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < fullStars || (i === fullStars && hasHalfStar) ? 'fill-current' : ''}`}
                        style={{ color: i < fullStars || (i === fullStars && hasHalfStar) ? product.color : 'hsl(var(--muted))' }}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-background"
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Winter - FEATURED PRODUCTS with hero CTA */}
      {isChapterVisible(3) && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Render connectors first */}
          {featuredProducts.map((product, idx) => {
            const pos = getOrbitalPosition(idx, featuredProducts.length, 200, 3);
            const { opacity } = getCardVisibility(3);
            if (opacity < 0.01) return null;
            return <OrbitalConnector key={`connector-${product.id}`} x={pos.x} y={pos.y} color={product.color} opacity={opacity} />;
          })}
          
          {/* Render trails */}
          {featuredProducts.map((product, idx) => {
            const trails = getTrailPositions(idx, featuredProducts.length, 200, 3);
            const { opacity } = getCardVisibility(3);
            if (opacity < 0.01) return null;
            return <OrbitalTrail key={`trail-${product.id}`} trails={trails} color={product.color} baseOpacity={opacity} />;
          })}
          
          {featuredProducts.map((product, idx) => {
            const pos = getOrbitalPosition(idx, featuredProducts.length, 200, 3);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(3);
            const isFeaturedHero = product.featured;

            if (opacity < 0.01) return null;

            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  opacity,
                  transform: `translate(-50%, -50%) rotateY(${pos.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                  zIndex: isFeaturedHero ? 10 : 1,
                }}
                animate={{ scale: isFeaturedHero ? scale * 1.15 : scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: (isFeaturedHero ? scale * 1.15 : scale) * 1.05 }}
              >
                {/* Card glow - enhanced for featured */}
                <div 
                  className="absolute inset-0 rounded-xl blur-xl"
                  style={{ 
                    background: `radial-gradient(circle, ${product.color}${isFeaturedHero ? '80' : '60'}, transparent 70%)`,
                    opacity: isFeaturedHero ? 0.6 : 0.4,
                  }}
                />
                <div 
                  className={`glass-card rounded-xl p-4 border relative overflow-hidden ${isFeaturedHero ? 'w-[180px] md:w-[220px]' : 'w-[150px] md:w-[180px]'}`}
                  style={{ borderColor: `${product.color}${isFeaturedHero ? '50' : '30'}` }}
                >
                  {/* Discount badge */}
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                    style={{ backgroundColor: "#ef444420", color: "#ef4444" }}
                  >
                    <Percent className="w-3 h-3" />
                    {product.discount} OFF
                  </div>
                  
                  {/* Featured badge */}
                  {isFeaturedHero && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2 mt-6">
                    <Snowflake className="w-4 h-4" style={{ color: product.color }} />
                    <span className="text-xs font-medium" style={{ color: product.color }}>Winter Collection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className={`rounded-lg flex items-center justify-center shrink-0 ${isFeaturedHero ? 'w-12 h-12' : 'w-10 h-10'}`}
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className={isFeaturedHero ? "w-6 h-6" : "w-5 h-5"} style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className={`text-foreground font-semibold ${isFeaturedHero ? 'text-base' : 'text-sm'}`}>{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold ${isFeaturedHero ? 'text-base' : 'text-sm'}`} style={{ color: product.color }}>{product.price}</p>
                        <p className="text-muted-foreground text-xs line-through">{product.original}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full mt-3 rounded-md font-medium flex items-center justify-center gap-1 text-background ${isFeaturedHero ? 'py-2 text-sm' : 'py-1.5 text-xs'}`}
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : isFeaturedHero ? "Shop Now" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChapterContent;