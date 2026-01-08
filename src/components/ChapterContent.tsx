import { motion } from "framer-motion";
import { 
  Sun, Snowflake, 
  Brain, Atom, Glasses, Laptop,
  ShoppingCart, Check, Percent
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChapterContentProps {
  scrollProgress: number;
}

// Chapter 1: Spring - Menu Categories
const categories = [
  { id: "neural", label: "Neural Links", icon: Brain, color: "#e879f9", count: 24 },
  { id: "quantum", label: "Quantum Cores", icon: Atom, color: "#a855f7", count: 18 },
  { id: "holo", label: "Holo Displays", icon: Glasses, color: "#06b6d4", count: 32 },
  { id: "cyber", label: "Cyber Decks", icon: Laptop, color: "#10b981", count: 15 },
];

// Chapter 2: Summer - Seasonal Products
const seasonalProducts = [
  { id: "solar-core", name: "Solar Core X", price: "$4,999", icon: Atom, color: "#fbbf24" },
  { id: "beach-deck", name: "Beach Deck Pro", price: "$2,799", icon: Laptop, color: "#f59e0b" },
  { id: "sun-lens", name: "Sun Lens AR", price: "$1,899", icon: Glasses, color: "#facc15" },
  { id: "ray-link", name: "Ray Neural", price: "$3,299", icon: Brain, color: "#eab308" },
];

// Chapter 3: Autumn - Best Selling
const bestSellers = [
  { id: "neural-pro", name: "Neural Link Pro", price: "$2,499", icon: Brain, badge: "🔥 #1", color: "#f97316" },
  { id: "quantum-x", name: "Quantum Core X", price: "$4,999", icon: Atom, badge: "⭐ Top", color: "#ea580c" },
  { id: "holo-7", name: "Holo Display 7", price: "$1,899", icon: Glasses, badge: "📈 Hot", color: "#fb923c" },
  { id: "cyber-alpha", name: "Cyber Core Alpha", price: "$3,299", icon: Laptop, badge: "💎 Pop", color: "#f59e0b" },
];

// Chapter 4: Winter - Sale Items
const saleItems = [
  { id: "frost-deck", name: "Frost Deck", price: "$2,399", original: "$3,599", discount: "33%", icon: Laptop, color: "#38bdf8" },
  { id: "cryo-core", name: "Cryo Core", price: "$4,999", original: "$6,999", discount: "28%", icon: Atom, color: "#0ea5e9" },
  { id: "ice-lens", name: "Ice Lens Pro", price: "$1,299", original: "$1,899", discount: "32%", icon: Glasses, color: "#7dd3fc" },
  { id: "snow-link", name: "Snow Neural", price: "$1,899", original: "$2,799", discount: "32%", icon: Brain, color: "#22d3ee" },
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
  const getCardVisibility = (chapterIndex: number) => {
    const chapterStart = chapterIndex * 0.25;
    const chapterEnd = (chapterIndex + 1) * 0.25;
    
    if (scrollProgress < chapterStart - 0.02 || scrollProgress > chapterEnd + 0.02) {
      return { opacity: 0, scale: 0.85 };
    }
    
    const chapterProgress = (scrollProgress - chapterStart) / 0.25;
    const fadeInProgress = chapterIndex === 0 ? 1 : Math.min(1, chapterProgress / 0.1);
    const fadeOutMultiplier = chapterProgress > 0.9 ? 1 - ((chapterProgress - 0.9) / 0.1) : 1;
    
    return { 
      opacity: Math.max(0, Math.min(1, fadeInProgress * fadeOutMultiplier)), 
      scale: 0.9 + 0.1 * fadeInProgress 
    };
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

  // Check if chapter is in range
  const isChapterVisible = (chapterIndex: number) => {
    const start = chapterIndex * 0.25;
    const end = (chapterIndex + 1) * 0.25;
    return scrollProgress >= start - 0.02 && scrollProgress <= end + 0.02;
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

      {/* Autumn - Best Sellers */}
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
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${product.color}20`, color: product.color }}
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

      {/* Winter - Sale Items */}
      {isChapterVisible(3) && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Render connectors first */}
          {saleItems.map((product, idx) => {
            const pos = getOrbitalPosition(idx, saleItems.length, 200, 3);
            const { opacity } = getCardVisibility(3);
            if (opacity < 0.01) return null;
            return <OrbitalConnector key={`connector-${product.id}`} x={pos.x} y={pos.y} color={product.color} opacity={opacity} />;
          })}
          
          {/* Render trails */}
          {saleItems.map((product, idx) => {
            const trails = getTrailPositions(idx, saleItems.length, 200, 3);
            const { opacity } = getCardVisibility(3);
            if (opacity < 0.01) return null;
            return <OrbitalTrail key={`trail-${product.id}`} trails={trails} color={product.color} baseOpacity={opacity} />;
          })}
          
          {saleItems.map((product, idx) => {
            const pos = getOrbitalPosition(idx, saleItems.length, 200, 3);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(3);

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
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border relative overflow-hidden"
                  style={{ borderColor: `${product.color}30` }}
                >
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                    style={{ backgroundColor: "#ef444420", color: "#ef4444" }}
                  >
                    <Percent className="w-3 h-3" />
                    {product.discount} OFF
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <Snowflake className="w-4 h-4" style={{ color: product.color }} />
                    <span className="text-xs font-medium" style={{ color: product.color }}>Winter Sale</span>
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
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                        <p className="text-muted-foreground text-xs line-through">{product.original}</p>
                      </div>
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
    </div>
  );
};

export default ChapterContent;