import { motion, AnimatePresence } from "framer-motion";
import { Brain, Atom, Glasses, Laptop, ShoppingCart, Check, Flower2, Sun, Leaf, Snowflake, TrendingUp, Crown, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

interface ProductCalloutsProps {
  visible: boolean;
  scrollProgress: number;
}

// Section 2: Best Selling (0.25 - 0.50)
const bestSellingProducts = [
  {
    id: "neural-link-pro",
    name: "Neural Link Pro",
    description: "Best-selling brain-computer interface with 99.9% accuracy",
    price: 2499,
    priceDisplay: "$2,499",
    icon: Brain,
    badge: "🔥 #1 Seller",
    color: "#f43f5e",
  },
  {
    id: "quantum-core-x",
    name: "Quantum Core X",
    description: "Top-rated quantum processor with 1000 qubits",
    price: 4999,
    priceDisplay: "$4,999",
    icon: Atom,
    badge: "⭐ Top Rated",
    color: "#8b5cf6",
  },
  {
    id: "holo-display-7",
    name: "Holo Display 7",
    description: "Crystal clear holographic display system",
    price: 1899,
    priceDisplay: "$1,899",
    icon: Glasses,
    badge: "📈 Trending",
    color: "#06b6d4",
  },
  {
    id: "cyber-core-alpha",
    name: "Cyber Core Alpha",
    description: "Portable quantum computing powerhouse",
    price: 3299,
    priceDisplay: "$3,299",
    icon: Laptop,
    badge: "💎 Popular",
    color: "#a855f7",
  },
];

// Section 3: Seasonal Collection (0.50 - 0.75)
const seasonalProducts = [
  {
    id: "spring-neural",
    name: "Spring Bloom",
    description: "Limited spring collection neural interface with nature-inspired design",
    price: 2799,
    priceDisplay: "$2,799",
    icon: Brain,
    seasonIcon: Flower2,
    season: "Spring",
    color: "#22c55e",
  },
  {
    id: "spring-lens",
    name: "Petal Vision",
    description: "AR glasses with spring floral overlays",
    price: 1699,
    priceDisplay: "$1,699",
    icon: Glasses,
    seasonIcon: Flower2,
    season: "Spring",
    color: "#4ade80",
  },
  {
    id: "summer-quantum",
    name: "Solar Core",
    description: "Summer special quantum processor with solar efficiency",
    price: 5499,
    priceDisplay: "$5,499",
    icon: Atom,
    seasonIcon: Sun,
    season: "Summer",
    color: "#facc15",
  },
  {
    id: "summer-deck",
    name: "Beach Deck",
    description: "Water-resistant cyber deck for summer adventures",
    price: 2999,
    priceDisplay: "$2,999",
    icon: Laptop,
    seasonIcon: Sun,
    season: "Summer",
    color: "#fbbf24",
  },
  {
    id: "autumn-lens",
    name: "Harvest Lens",
    description: "Fall collection AR glasses with warm amber tones",
    price: 1999,
    priceDisplay: "$1,999",
    icon: Glasses,
    seasonIcon: Leaf,
    season: "Autumn",
    color: "#f97316",
  },
  {
    id: "autumn-neural",
    name: "Ember Link",
    description: "Autumn edition neural interface with cozy aesthetics",
    price: 2599,
    priceDisplay: "$2,599",
    icon: Brain,
    seasonIcon: Leaf,
    season: "Autumn",
    color: "#ea580c",
  },
  {
    id: "winter-deck",
    name: "Frost Deck",
    description: "Holiday edition cyber deck with ice-cool design",
    price: 3599,
    priceDisplay: "$3,599",
    icon: Laptop,
    seasonIcon: Snowflake,
    season: "Winter",
    color: "#00ffff",
  },
  {
    id: "winter-quantum",
    name: "Cryo Core",
    description: "Supercooled quantum processor for peak performance",
    price: 6999,
    priceDisplay: "$6,999",
    icon: Atom,
    seasonIcon: Snowflake,
    season: "Winter",
    color: "#38bdf8",
  },
];

// Section 4: Featured Collection (0.75 - 1.0)
const featuredProducts = [
  {
    id: "holo-lens-ultra",
    name: "Holo Lens Ultra",
    description: "Premium holographic AR experience with 8K resolution",
    price: 2999,
    priceDisplay: "$2,999",
    icon: Glasses,
    badge: "✨ Featured",
    color: "#06b6d4",
  },
  {
    id: "cyber-deck-elite",
    name: "Cyber Deck Elite",
    description: "Elite portable computing with quantum acceleration",
    price: 4299,
    priceDisplay: "$4,299",
    icon: Laptop,
    badge: "👑 Premium",
    color: "#d946ef",
  },
  {
    id: "neuro-boost",
    name: "Neuro Boost X",
    description: "Neural enhancement accelerator with AI assist",
    price: 1599,
    priceDisplay: "$1,599",
    icon: Zap,
    badge: "⚡ New",
    color: "#10b981",
  },
  {
    id: "quantum-vision",
    name: "Quantum Vision",
    description: "See the quantum realm with enhanced perception",
    price: 3799,
    priceDisplay: "$3,799",
    icon: Glasses,
    badge: "🌟 Exclusive",
    color: "#ec4899",
  },
  {
    id: "apex-neural",
    name: "Apex Neural",
    description: "Ultimate brain-computer interface for professionals",
    price: 5999,
    priceDisplay: "$5,999",
    icon: Brain,
    badge: "🏆 Best",
    color: "#f59e0b",
  },
  {
    id: "infinity-core",
    name: "Infinity Core",
    description: "Unlimited quantum processing power in your hands",
    price: 8999,
    priceDisplay: "$8,999",
    icon: Atom,
    badge: "♾️ Ultimate",
    color: "#7c3aed",
  },
];

const ProductCallouts = ({ visible, scrollProgress }: ProductCalloutsProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = (product: { id: string; name: string; price: number; priceDisplay: string }) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay,
      icon: "🛒",
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Section visibility calculations - OVERLAPPING transitions for smooth crossfades
  // Section 1: Menu (0 - 0.28) - overlaps with Best Selling
  // Section 2: Best Selling (0.18 - 0.55) - overlaps with Menu & Seasonal  
  // Section 3: Seasonal (0.45 - 0.80) - overlaps with Best Selling & Featured
  // Section 4: Featured (0.70 - 1.0) - overlaps with Seasonal
  
  const getBestSellingOpacity = () => {
    const fadeIn = 0.18;   // Start fading in while Menu still visible
    const peakStart = 0.28;
    const peakEnd = 0.45;
    const fadeOut = 0.55;  // Fade out as Seasonal fades in
    
    if (scrollProgress < fadeIn) return 0;
    if (scrollProgress < peakStart) return (scrollProgress - fadeIn) / (peakStart - fadeIn);
    if (scrollProgress < peakEnd) return 1;
    if (scrollProgress < fadeOut) return 1 - (scrollProgress - peakEnd) / (fadeOut - peakEnd);
    return 0;
  };

  const getSeasonalOpacity = () => {
    const fadeIn = 0.45;   // Start while Best Selling still visible
    const peakStart = 0.55;
    const peakEnd = 0.70;
    const fadeOut = 0.80;  // Fade out as Featured fades in
    
    if (scrollProgress < fadeIn) return 0;
    if (scrollProgress < peakStart) return (scrollProgress - fadeIn) / (peakStart - fadeIn);
    if (scrollProgress < peakEnd) return 1;
    if (scrollProgress < fadeOut) return 1 - (scrollProgress - peakEnd) / (fadeOut - peakEnd);
    return 0;
  };

  const getFeaturedOpacity = () => {
    const fadeIn = 0.70;   // Start while Seasonal still visible
    const peakStart = 0.80;
    
    if (scrollProgress < fadeIn) return 0;
    if (scrollProgress < peakStart) return (scrollProgress - fadeIn) / (peakStart - fadeIn);
    return 1;
  };

  const getSectionTitle = () => {
    if (scrollProgress >= 0.70) return { title: "Featured Collection", icon: Crown, color: "#d946ef", section: 4 };
    if (scrollProgress >= 0.45) return { title: "Seasonal Collection", icon: Star, color: "#f97316", section: 3 };
    if (scrollProgress >= 0.18) return { title: "Best Selling", icon: TrendingUp, color: "#f43f5e", section: 2 };
    return null;
  };

  // Mobile-optimized card positions - 2 column grid for more products
  const getMobilePosition = (index: number, total: number) => {
    const columns = total > 4 ? 2 : 1;
    const rows = Math.ceil(total / columns);
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    const spacingY = Math.min(100, 240 / rows);
    const spacingX = columns > 1 ? 160 : 0;
    
    const startY = -(rows - 1) * spacingY / 2;
    const startX = -(columns - 1) * spacingX / 2;
    
    return { 
      x: startX + col * spacingX, 
      y: startY + row * spacingY 
    };
  };

  // Desktop orbit positions - dynamic radius based on product count
  const getDesktopPosition = (index: number, total: number, baseRadius: number) => {
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep - Math.PI / 2 + scrollProgress * Math.PI * 0.3;
    const radius = baseRadius + (total > 4 ? 20 : 0);
    const verticalScale = total > 6 ? 0.6 : 0.5;
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * verticalScale,
    };
  };

  const ProductCard = ({ product, opacity, position, isSeasonal = false }: {
    product: any;
    opacity: number;
    position: { x: number; y: number };
    isSeasonal?: boolean;
  }) => {
    const Icon = product.icon;
    const SeasonIcon = product.seasonIcon;
    const isHovered = hoveredId === product.id;
    const isAdded = addedId === product.id;

    if (opacity < 0.01) return null;

    return (
      <motion.div
        className="absolute pointer-events-auto cursor-pointer"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
          transform: "translate(-50%, -50%)",
          zIndex: isHovered ? 20 : 10,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: opacity,
          scale: isHovered ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setHoveredId(product.id)}
        onMouseLeave={() => setHoveredId(null)}
        onTouchStart={() => setHoveredId(product.id)}
        tabIndex={opacity > 0.5 ? 0 : -1}
        aria-label={`${product.name} - ${product.priceDisplay}`}
      >
        <motion.div
          className="product-callout w-[160px] md:w-[200px] relative overflow-hidden"
          style={{
            boxShadow: isHovered 
              ? `0 0 30px ${product.color}40, 0 0 60px ${product.color}20` 
              : `0 0 15px ${product.color}20`,
            borderColor: isHovered ? product.color : 'rgba(255,255,255,0.1)',
          }}
        >
          {/* Badge */}
          <div 
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
            style={{ 
              backgroundColor: `${product.color}20`,
              color: product.color,
            }}
          >
            {isSeasonal && SeasonIcon && <SeasonIcon className="w-3 h-3" />}
            {isSeasonal ? product.season : product.badge}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)`,
              }}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: product.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground font-semibold text-xs md:text-sm truncate">
                {product.name}
              </h3>
              <p className="font-bold text-xs md:text-sm" style={{ color: product.color }}>
                {product.priceDisplay}
              </p>
            </div>
          </div>

          {/* Expanded content on hover/touch */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-muted-foreground text-[10px] md:text-xs mt-2 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-1 mt-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className={`flex-1 px-2 py-1.5 rounded-md text-[10px] md:text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                      isAdded
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "text-white hover:opacity-90"
                    }`}
                    style={{
                      backgroundColor: isAdded ? undefined : product.color,
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isAdded}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        Add
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                      openCart();
                    }}
                    className="px-2 py-1.5 bg-secondary/50 text-foreground rounded-md text-[10px] md:text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    Buy
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };

  const sectionInfo = getSectionTitle();
  const bestSellingOpacity = getBestSellingOpacity();
  const seasonalOpacity = getSeasonalOpacity();
  const featuredOpacity = getFeaturedOpacity();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Section Title */}
      <AnimatePresence mode="wait">
        {sectionInfo && (
          <motion.div
            key={sectionInfo.title}
            className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 text-center z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <sectionInfo.icon className="w-4 h-4" style={{ color: sectionInfo.color }} />
              <span className="text-xs uppercase tracking-widest font-medium" style={{ color: sectionInfo.color }}>
                {scrollProgress >= 0.65 ? "Section 4" : scrollProgress >= 0.40 ? "Section 3" : "Section 2"}
              </span>
              <sectionInfo.icon className="w-4 h-4" style={{ color: sectionInfo.color }} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{sectionInfo.title}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Selling Products */}
      {bestSellingProducts.map((product, index) => {
        const position = isMobile
          ? getMobilePosition(index, bestSellingProducts.length)
          : getDesktopPosition(index, bestSellingProducts.length, 180);
        return <ProductCard key={product.id} product={product} opacity={bestSellingOpacity} position={position} />;
      })}

      {/* Seasonal Products */}
      {seasonalProducts.map((product, index) => {
        const position = isMobile
          ? getMobilePosition(index, seasonalProducts.length)
          : getDesktopPosition(index, seasonalProducts.length, 200);
        return <ProductCard key={product.id} product={product} opacity={seasonalOpacity} position={position} isSeasonal />;
      })}

      {/* Featured Products */}
      {featuredProducts.map((product, index) => {
        const position = isMobile
          ? getMobilePosition(index, featuredProducts.length)
          : getDesktopPosition(index, featuredProducts.length, 190);
        return <ProductCard key={product.id} product={product} opacity={featuredOpacity} position={position} />;
      })}

      {/* Progress indicator */}
      <motion.div 
        className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex gap-3">
          {[
            { section: 1, label: "Menu", range: [0, 0.25] },
            { section: 2, label: "Best", range: [0.22, 0.52] },
            { section: 3, label: "Season", range: [0.47, 0.77] },
            { section: 4, label: "Featured", range: [0.72, 1.0] },
          ].map(({ section, label, range }) => {
            const isActive = scrollProgress >= range[0] && scrollProgress < range[1];
            const isPast = scrollProgress >= range[1];
            
            return (
              <div key={section} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "bg-primary scale-150 shadow-lg shadow-primary/50" : 
                    isPast ? "bg-primary/60" : "bg-muted/50"
                  }`}
                />
                <span className={`text-[9px] uppercase tracking-wide transition-colors duration-300 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground/50"
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCallouts;
