import { motion, AnimatePresence } from "framer-motion";
import { Brain, Atom, Glasses, Laptop, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface ProductCalloutsProps {
  visible: boolean;
  scrollProgress: number;
}

const products = [
  {
    id: "neural-link",
    name: "Neural Link",
    description: "Direct brain-computer interface for seamless digital integration",
    price: 2499,
    priceDisplay: "$2,499",
    icon: Brain,
    emoji: "🧠",
    angle: 45,
    orbitRadius: 280,
  },
  {
    id: "quantum-core",
    name: "Quantum Core",
    description: "Next-gen quantum processing unit for unprecedented computing power",
    price: 4999,
    priceDisplay: "$4,999",
    icon: Atom,
    emoji: "⚛️",
    angle: 135,
    orbitRadius: 320,
  },
  {
    id: "holo-lens",
    name: "Holo Lens",
    description: "AR glasses with holographic projection and spatial computing",
    price: 1799,
    priceDisplay: "$1,799",
    icon: Glasses,
    emoji: "👓",
    angle: 225,
    orbitRadius: 280,
  },
  {
    id: "cyber-deck",
    name: "Cyber Deck",
    description: "Portable powerhouse for creators and developers",
    price: 3299,
    priceDisplay: "$3,299",
    icon: Laptop,
    emoji: "💻",
    angle: 315,
    orbitRadius: 320,
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

  // Stagger reveal based on scroll
  const getOpacity = (index: number) => {
    if (!visible) return 0;
    const revealStart = 0.15 + index * 0.08;
    const revealEnd = revealStart + 0.2;
    return Math.min(1, Math.max(0, (scrollProgress - revealStart) / (revealEnd - revealStart)));
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <AnimatePresence>
        {products.map((product, index) => {
          const Icon = product.icon;
          const opacity = getOpacity(index);
          const isHovered = hoveredId === product.id;
          const isAdded = addedId === product.id;

          // Calculate position on orbit
          const angle = (product.angle + scrollProgress * 30) * (Math.PI / 180);
          const x = Math.cos(angle) * product.orbitRadius;
          const y = Math.sin(angle) * product.orbitRadius * 0.4; // Flattened for perspective

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
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: opacity,
                scale: isHovered ? 1.1 : 1,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(product.id)}
              onBlur={() => setHoveredId(null)}
              tabIndex={opacity > 0.5 ? 0 : -1}
              aria-label={`${product.name} - ${product.priceDisplay}`}
              role="button"
            >
              <motion.div
                className={`product-callout min-w-[200px] ${
                  isHovered ? "neon-glow-cyan" : ""
                }`}
                layout
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-sm">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">
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
                          className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                            isAdded
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
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
