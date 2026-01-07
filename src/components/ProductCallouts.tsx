import { motion, AnimatePresence } from "framer-motion";
import { Brain, Atom, Glasses, Laptop, ShoppingCart, Check, Flower2, Sun, Leaf, Snowflake } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface ProductCalloutsProps {
  visible: boolean;
  scrollProgress: number;
}

// Products linked to seasons - each product replaces a season category
const products = [
  {
    id: "neural-link",
    name: "Neural Link",
    description: "Direct brain-computer interface for seamless digital integration",
    price: 2499,
    priceDisplay: "$2,499",
    icon: Brain,
    seasonIcon: Flower2,
    emoji: "🧠",
    season: "Spring",
    angle: 45,
    orbitRadius: 260,
    seasonColor: "#22c55e",
  },
  {
    id: "quantum-core",
    name: "Quantum Core",
    description: "Next-gen quantum processing unit for unprecedented computing power",
    price: 4999,
    priceDisplay: "$4,999",
    icon: Atom,
    seasonIcon: Sun,
    emoji: "⚛️",
    season: "Summer",
    angle: 135,
    orbitRadius: 300,
    seasonColor: "#facc15",
  },
  {
    id: "holo-lens",
    name: "Holo Lens",
    description: "AR glasses with holographic projection and spatial computing",
    price: 1799,
    priceDisplay: "$1,799",
    icon: Glasses,
    seasonIcon: Leaf,
    emoji: "👓",
    season: "Autumn",
    angle: 225,
    orbitRadius: 260,
    seasonColor: "#f97316",
  },
  {
    id: "cyber-deck",
    name: "Cyber Deck",
    description: "Portable powerhouse for creators and developers",
    price: 3299,
    priceDisplay: "$3,299",
    icon: Laptop,
    seasonIcon: Snowflake,
    emoji: "💻",
    season: "Winter",
    angle: 315,
    orbitRadius: 300,
    seasonColor: "#00ffff",
  },
];

const ProductCallouts = ({ visible, scrollProgress }: ProductCalloutsProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem, openCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay,
      icon: product.emoji,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Sequential reveal - each product appears as its season fades
  const getOpacity = (index: number) => {
    if (!visible) return 0;
    // Products start appearing as seasons fade (offset by their index)
    const revealStart = 0.08 + index * 0.08;
    const revealEnd = revealStart + 0.15;
    return Math.min(1, Math.max(0, (scrollProgress - revealStart) / (revealEnd - revealStart)));
  };

  // Calculate orbit position with scroll-based movement
  const getPosition = (product: typeof products[0], index: number) => {
    const baseAngle = product.angle;
    // Products orbit slowly as user scrolls
    const scrollOffset = scrollProgress * 45;
    const angle = (baseAngle + scrollOffset) * (Math.PI / 180);
    
    // Expand orbit radius as scroll progresses
    const radiusMultiplier = 1 + scrollProgress * 0.2;
    const radius = product.orbitRadius * radiusMultiplier;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.4; // Flattened ellipse
    
    return { x, y };
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <AnimatePresence>
        {products.map((product, index) => {
          const Icon = product.icon;
          const SeasonIcon = product.seasonIcon;
          const opacity = getOpacity(index);
          const isHovered = hoveredId === product.id;
          const isAdded = addedId === product.id;
          const { x, y } = getPosition(product, index);

          if (opacity < 0.01) return null;

          return (
            <motion.div
              key={product.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 20 : 10,
              }}
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{
                opacity: opacity,
                scale: isHovered ? 1.08 : 0.95 + opacity * 0.05,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(product.id)}
              onBlur={() => setHoveredId(null)}
              tabIndex={opacity > 0.5 ? 0 : -1}
              aria-label={`${product.name} - ${product.season} Collection - ${product.priceDisplay}`}
              role="button"
            >
              <motion.div
                className="product-callout min-w-[200px] relative overflow-hidden"
                style={{
                  boxShadow: isHovered 
                    ? `0 0 30px ${product.seasonColor}40, 0 0 60px ${product.seasonColor}20` 
                    : `0 0 15px ${product.seasonColor}20`,
                  borderColor: isHovered ? product.seasonColor : 'rgba(255,255,255,0.1)',
                }}
                layout
              >
                {/* Season badge */}
                <div 
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ 
                    backgroundColor: `${product.seasonColor}20`,
                    color: product.seasonColor,
                  }}
                >
                  <SeasonIcon className="w-3 h-3" />
                  {product.season}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${product.seasonColor}30, ${product.seasonColor}10)`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: product.seasonColor }} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-sm">
                      {product.name}
                    </h3>
                    <p className="font-bold text-sm" style={{ color: product.seasonColor }}>
                      {product.priceDisplay}
                    </p>
                  </div>
                </div>

                {/* Expanded content on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground text-xs mt-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                            isAdded
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "text-white hover:opacity-90"
                          }`}
                          style={{
                            backgroundColor: isAdded ? undefined : product.seasonColor,
                          }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isAdded}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </motion.button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                            openCart();
                          }}
                          className="px-4 py-2 bg-secondary/50 text-foreground rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ProductCallouts;
