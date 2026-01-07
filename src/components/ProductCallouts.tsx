import { motion, AnimatePresence } from "framer-motion";
import { Brain, Atom, Glasses, Laptop, ShoppingCart, Check, Flower2, Sun, Leaf, Snowflake, TrendingUp, Crown, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

interface ProductCalloutsProps {
  visible: boolean;
  scrollProgress: number;
}

// Section 2: Best Selling (0.20 - 0.45)
const bestSellingProducts = [
  {
    id: "neural-link-pro",
    name: "Neural Link Pro",
    description: "Best-selling brain-computer interface",
    price: 2499,
    priceDisplay: "$2,499",
    icon: Brain,
    badge: "🔥 #1 Seller",
    color: "#f43f5e",
  },
  {
    id: "quantum-core-x",
    name: "Quantum Core X",
    description: "Top-rated quantum processor",
    price: 4999,
    priceDisplay: "$4,999",
    icon: Atom,
    badge: "⭐ Top Rated",
    color: "#8b5cf6",
  },
];

// Section 3: Seasonal Collection (0.45 - 0.70)
const seasonalProducts = [
  {
    id: "spring-neural",
    name: "Spring Edition",
    description: "Limited spring collection neural interface",
    price: 2799,
    priceDisplay: "$2,799",
    icon: Brain,
    seasonIcon: Flower2,
    season: "Spring",
    color: "#22c55e",
  },
  {
    id: "summer-quantum",
    name: "Summer Core",
    description: "Summer special quantum processor",
    price: 5499,
    priceDisplay: "$5,499",
    icon: Atom,
    seasonIcon: Sun,
    season: "Summer",
    color: "#facc15",
  },
  {
    id: "autumn-lens",
    name: "Autumn Lens",
    description: "Fall collection AR glasses",
    price: 1999,
    priceDisplay: "$1,999",
    icon: Glasses,
    seasonIcon: Leaf,
    season: "Autumn",
    color: "#f97316",
  },
  {
    id: "winter-deck",
    name: "Winter Deck",
    description: "Holiday edition cyber deck",
    price: 3599,
    priceDisplay: "$3,599",
    icon: Laptop,
    seasonIcon: Snowflake,
    season: "Winter",
    color: "#00ffff",
  },
];

// Section 4: Featured Collection (0.70 - 1.0)
const featuredProducts = [
  {
    id: "holo-lens-ultra",
    name: "Holo Lens Ultra",
    description: "Premium holographic AR experience",
    price: 2999,
    priceDisplay: "$2,999",
    icon: Glasses,
    badge: "✨ Featured",
    color: "#06b6d4",
  },
  {
    id: "cyber-deck-elite",
    name: "Cyber Deck Elite",
    description: "Elite portable computing powerhouse",
    price: 4299,
    priceDisplay: "$4,299",
    icon: Laptop,
    badge: "👑 Premium",
    color: "#d946ef",
  },
  {
    id: "neuro-boost",
    name: "Neuro Boost",
    description: "Neural enhancement accelerator",
    price: 1599,
    priceDisplay: "$1,599",
    icon: Zap,
    badge: "⚡ New",
    color: "#10b981",
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

  // Section visibility calculations
  const getBestSellingOpacity = () => {
    if (scrollProgress < 0.18) return 0;
    if (scrollProgress > 0.42) return Math.max(0, 1 - (scrollProgress - 0.42) / 0.08);
    return Math.min(1, (scrollProgress - 0.18) / 0.1);
  };

  const getSeasonalOpacity = () => {
    if (scrollProgress < 0.40) return 0;
    if (scrollProgress > 0.68) return Math.max(0, 1 - (scrollProgress - 0.68) / 0.08);
    return Math.min(1, (scrollProgress - 0.40) / 0.1);
  };

  const getFeaturedOpacity = () => {
    if (scrollProgress < 0.65) return 0;
    return Math.min(1, (scrollProgress - 0.65) / 0.1);
  };

  const getSectionTitle = () => {
    if (scrollProgress >= 0.65) return { title: "Featured Collection", icon: Crown, color: "#d946ef" };
    if (scrollProgress >= 0.40) return { title: "Seasonal Collection", icon: Star, color: "#f97316" };
    if (scrollProgress >= 0.18) return { title: "Best Selling", icon: TrendingUp, color: "#f43f5e" };
    return null;
  };

  // Mobile-optimized card positions
  const getMobilePosition = (index: number, total: number) => {
    const spacing = Math.min(120, 280 / total);
    const startY = -(total - 1) * spacing / 2;
    return { x: 0, y: startY + index * spacing };
  };

  // Desktop orbit positions
  const getDesktopPosition = (index: number, total: number, baseRadius: number) => {
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep - Math.PI / 2 + scrollProgress * 0.5;
    const radius = baseRadius + scrollProgress * 30;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5,
    };
  };

  const renderProductCard = (product: any, opacity: number, position: { x: number; y: number }, isSeasonal = false) => {
    const Icon = product.icon;
    const SeasonIcon = product.seasonIcon;
    const isHovered = hoveredId === product.id;
    const isAdded = addedId === product.id;

    if (opacity < 0.01) return null;

    return (
      <motion.div
        key={product.id}
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
        return renderProductCard(product, bestSellingOpacity, position);
      })}

      {/* Seasonal Products */}
      {seasonalProducts.map((product, index) => {
        const position = isMobile
          ? getMobilePosition(index, seasonalProducts.length)
          : getDesktopPosition(index, seasonalProducts.length, 200);
        return renderProductCard(product, seasonalOpacity, position, true);
      })}

      {/* Featured Products */}
      {featuredProducts.map((product, index) => {
        const position = isMobile
          ? getMobilePosition(index, featuredProducts.length)
          : getDesktopPosition(index, featuredProducts.length, 190);
        return renderProductCard(product, featuredOpacity, position);
      })}

      {/* Progress indicator */}
      <motion.div 
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2"
        animate={{ opacity: visible ? 0.8 : 0 }}
      >
        {[1, 2, 3, 4].map((section) => {
          const isActive = 
            (section === 1 && scrollProgress < 0.20) ||
            (section === 2 && scrollProgress >= 0.18 && scrollProgress < 0.42) ||
            (section === 3 && scrollProgress >= 0.40 && scrollProgress < 0.68) ||
            (section === 4 && scrollProgress >= 0.65);
          
          return (
            <div
              key={section}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-primary scale-125" : "bg-muted"
              }`}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductCallouts;
