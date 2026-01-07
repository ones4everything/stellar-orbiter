import { motion } from "framer-motion";
import { Watch, Cpu, Monitor, Layers } from "lucide-react";

interface CategoryNodesProps {
  visible: boolean;
  scrollProgress: number;
}

const categories = [
  { id: "wearables", label: "Wearables", icon: Watch, x: -25, y: -15 },
  { id: "computing", label: "Computing", icon: Cpu, x: 25, y: -15 },
  { id: "displays", label: "Displays", icon: Monitor, x: -25, y: 15 },
  { id: "components", label: "Components", icon: Layers, x: 25, y: 15 },
];

const CategoryNodes = ({ visible, scrollProgress }: CategoryNodesProps) => {
  // Stagger fade out based on scroll
  const getOpacity = (index: number) => {
    if (!visible) return 0;
    const fadeStart = index * 0.05;
    const fadeEnd = fadeStart + 0.15;
    const progress = Math.min(1, Math.max(0, (scrollProgress - fadeStart) / (fadeEnd - fadeStart)));
    return 1 - progress;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Connection lines to center */}
      <svg
        className="absolute w-full h-full"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {categories.map((cat, index) => (
          <motion.line
            key={`line-${cat.id}`}
            x1="0"
            y1="0"
            x2={cat.x * 0.7}
            y2={cat.y * 0.7}
            stroke="url(#lineGradient)"
            strokeWidth="0.3"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              opacity: getOpacity(index) * 0.5,
              pathLength: 1 - scrollProgress * 2,
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Category cards */}
      {categories.map((category, index) => {
        const Icon = category.icon;
        const opacity = getOpacity(index);

        return (
          <motion.div
            key={category.id}
            className="absolute glass-card rounded-xl p-4 min-w-[140px] pointer-events-auto cursor-pointer"
            style={{
              left: `calc(50% + ${category.x}%)`,
              top: `calc(50% + ${category.y}%)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: opacity,
              scale: 0.8 + opacity * 0.2,
              y: scrollProgress * 20,
            }}
            whileHover={opacity > 0.3 ? { scale: 1.05 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            aria-label={`Browse ${category.label}`}
            tabIndex={opacity > 0.3 ? 0 : -1}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium text-sm">
                {category.label}
              </span>
            </div>

            {/* Glow node */}
            <motion.div
              className="absolute -left-2 top-1/2 w-3 h-3 rounded-full bg-primary"
              style={{ transform: "translateY(-50%)" }}
              animate={{
                boxShadow: [
                  "0 0 10px hsl(var(--neon-cyan))",
                  "0 0 20px hsl(var(--neon-cyan))",
                  "0 0 10px hsl(var(--neon-cyan))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryNodes;
