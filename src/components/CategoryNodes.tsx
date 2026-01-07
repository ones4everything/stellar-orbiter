import { motion } from "framer-motion";
import { Flower2, Sun, Leaf, Snowflake } from "lucide-react";

interface CategoryNodesProps {
  visible: boolean;
  scrollProgress: number;
}

const seasons = [
  { 
    id: "spring", 
    label: "Spring", 
    subtitle: "Renewal Collection",
    icon: Flower2, 
    x: -25, 
    y: -15,
    color: "from-green-400/20 to-pink-400/20",
    glowColor: "#22c55e"
  },
  { 
    id: "summer", 
    label: "Summer", 
    subtitle: "Peak Performance",
    icon: Sun, 
    x: 25, 
    y: -15,
    color: "from-yellow-400/20 to-orange-400/20",
    glowColor: "#facc15"
  },
  { 
    id: "autumn", 
    label: "Autumn", 
    subtitle: "Harvest Tech",
    icon: Leaf, 
    x: -25, 
    y: 15,
    color: "from-orange-400/20 to-red-400/20",
    glowColor: "#f97316"
  },
  { 
    id: "winter", 
    label: "Winter", 
    subtitle: "Crystal Series",
    icon: Snowflake, 
    x: 25, 
    y: 15,
    color: "from-cyan-400/20 to-blue-400/20",
    glowColor: "#00ffff"
  },
];

const CategoryNodes = ({ visible, scrollProgress }: CategoryNodesProps) => {
  // Sequential fade out - each season fades as the next appears
  const getOpacity = (index: number) => {
    if (!visible) return 0;
    const fadeStart = index * 0.06;
    const fadeEnd = fadeStart + 0.12;
    const progress = Math.min(1, Math.max(0, (scrollProgress - fadeStart) / (fadeEnd - fadeStart)));
    return 1 - progress;
  };

  // Get scale based on scroll - shrink as they fade
  const getScale = (index: number) => {
    const opacity = getOpacity(index);
    return 0.7 + opacity * 0.3;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Connection lines to center */}
      <svg
        className="absolute w-full h-full"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {seasons.map((season, index) => (
          <motion.line
            key={`line-${season.id}`}
            x1="0"
            y1="0"
            x2={season.x * 0.7}
            y2={season.y * 0.7}
            stroke={season.glowColor}
            strokeWidth="0.3"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              opacity: getOpacity(index) * 0.4,
              pathLength: getOpacity(index),
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
        
        {/* Central pulse based on current season */}
        <motion.circle
          cx="0"
          cy="0"
          r="3"
          fill="none"
          stroke="#00ffff"
          strokeWidth="0.2"
          animate={{
            r: [3, 5, 3],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Season cards */}
      {seasons.map((season, index) => {
        const Icon = season.icon;
        const opacity = getOpacity(index);
        const scale = getScale(index);

        return (
          <motion.div
            key={season.id}
            className="absolute glass-card rounded-xl p-4 min-w-[160px] pointer-events-auto cursor-pointer border border-white/10"
            style={{
              left: `calc(50% + ${season.x}%)`,
              top: `calc(50% + ${season.y}%)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: opacity,
              scale: scale,
              y: scrollProgress * 30 * (index % 2 === 0 ? 1 : -1),
              x: scrollProgress * 20 * (index < 2 ? -1 : 1),
            }}
            whileHover={opacity > 0.3 ? { scale: scale * 1.08, borderColor: season.glowColor } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            aria-label={`${season.label} - ${season.subtitle}`}
            tabIndex={opacity > 0.3 ? 0 : -1}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${season.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-foreground" style={{ color: season.glowColor }} />
              </div>
              <div>
                <span className="text-foreground font-semibold text-sm block">
                  {season.label}
                </span>
                <span className="text-muted-foreground text-xs">
                  {season.subtitle}
                </span>
              </div>
            </div>

            {/* Glow node */}
            <motion.div
              className="absolute -left-1.5 top-1/2 w-3 h-3 rounded-full"
              style={{ 
                transform: "translateY(-50%)",
                backgroundColor: season.glowColor,
              }}
              animate={{
                boxShadow: [
                  `0 0 8px ${season.glowColor}`,
                  `0 0 16px ${season.glowColor}`,
                  `0 0 8px ${season.glowColor}`,
                ],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            />
          </motion.div>
        );
      })}

      {/* Season indicator text */}
      <motion.div 
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: scrollProgress < 0.3 ? 1 - scrollProgress * 3 : 0 }}
      >
        <p className="text-muted-foreground text-sm">Scroll to explore the seasons</p>
      </motion.div>
    </div>
  );
};

export default CategoryNodes;
