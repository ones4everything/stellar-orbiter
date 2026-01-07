import { motion, AnimatePresence } from "framer-motion";
import { Brain, Atom, Glasses, Laptop } from "lucide-react";
import { useState } from "react";

interface ProductCalloutsProps {
  visible: boolean;
  scrollProgress: number;
}

const products = [
  {
    id: "neural-link",
    name: "Neural Link",
    description: "Direct brain-computer interface for seamless digital integration",
    price: "$2,499",
    icon: Brain,
    angle: 45,
    orbitRadius: 280,
  },
  {
    id: "quantum-core",
    name: "Quantum Core",
    description: "Next-gen quantum processing unit for unprecedented computing power",
    price: "$4,999",
    icon: Atom,
    angle: 135,
    orbitRadius: 320,
  },
  {
    id: "holo-lens",
    name: "Holo Lens",
    description: "AR glasses with holographic projection and spatial computing",
    price: "$1,799",
    icon: Glasses,
    angle: 225,
    orbitRadius: 280,
  },
  {
    id: "cyber-deck",
    name: "Cyber Deck",
    description: "Portable powerhouse for creators and developers",
    price: "$3,299",
    icon: Laptop,
    angle: 315,
    orbitRadius: 320,
  },
];

const ProductCallouts = ({ visible, scrollProgress }: ProductCalloutsProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
              aria-label={`${product.name} - ${product.price}`}
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
                      {product.price}
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
                      <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors w-full">
                        Learn More
                      </button>
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
