import { motion } from "framer-motion";
import { Flower2, Sun, Leaf, Snowflake, Sparkles, TrendingUp, Crown, Star } from "lucide-react";

interface CategoryNodesProps {
  visible: boolean;
  scrollProgress: number;
}

const menuItems = [
  { 
    id: "spring", 
    label: "Spring", 
    subtitle: "New Arrivals",
    icon: Flower2, 
    color: "from-green-400/20 to-pink-400/20",
    glowColor: "#22c55e"
  },
  { 
    id: "summer", 
    label: "Summer", 
    subtitle: "Hot Deals",
    icon: Sun, 
    color: "from-yellow-400/20 to-orange-400/20",
    glowColor: "#facc15"
  },
  { 
    id: "autumn", 
    label: "Autumn", 
    subtitle: "Collection",
    icon: Leaf, 
    color: "from-orange-400/20 to-red-400/20",
    glowColor: "#f97316"
  },
  { 
    id: "winter", 
    label: "Winter", 
    subtitle: "Exclusives",
    icon: Snowflake, 
    color: "from-cyan-400/20 to-blue-400/20",
    glowColor: "#00ffff"
  },
];

const CategoryNodes = ({ visible, scrollProgress }: CategoryNodesProps) => {
  // Menu visible in first section (0 - 0.20)
  const sectionProgress = Math.min(1, scrollProgress / 0.20);
  const menuOpacity = visible ? Math.max(0, 1 - sectionProgress * 1.5) : 0;

  // Mobile-optimized positions - vertical stack on mobile, quad on desktop
  const getPosition = (index: number, isMobile: boolean) => {
    if (isMobile) {
      // Vertical list for mobile
      const yOffset = (index - 1.5) * 22;
      return { x: 0, y: yOffset };
    }
    // Quad layout for desktop
    const positions = [
      { x: -18, y: -12 },
      { x: 18, y: -12 },
      { x: -18, y: 12 },
      { x: 18, y: 12 },
    ];
    return positions[index];
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Section Title */}
      <motion.div
        className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 text-center z-10"
        animate={{ opacity: menuOpacity }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Explore</span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Browse Categories</h2>
      </motion.div>

      {/* Connection lines - hidden on mobile */}
      <svg
        className="absolute w-full h-full hidden md:block"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {menuItems.map((item, index) => {
          const pos = getPosition(index, false);
          return (
            <motion.line
              key={`line-${item.id}`}
              x1="0"
              y1="0"
              x2={pos.x * 0.6}
              y2={pos.y * 0.6}
              stroke={item.glowColor}
              strokeWidth="0.15"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: menuOpacity * 0.3,
                pathLength: menuOpacity,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
        
        {/* Central pulse */}
        <motion.circle
          cx="0"
          cy="0"
          r="2"
          fill="none"
          stroke="#00ffff"
          strokeWidth="0.15"
          animate={{
            r: [2, 4, 2],
            opacity: [menuOpacity * 0.5, menuOpacity * 0.2, menuOpacity * 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Menu items - responsive grid */}
      <div className="flex flex-col md:contents">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const mobilePos = getPosition(index, true);
          const desktopPos = getPosition(index, false);
          
          // Stagger fade for each item
          const itemDelay = index * 0.03;
          const itemOpacity = Math.max(0, menuOpacity - itemDelay);
          const scale = 0.8 + itemOpacity * 0.2;

          return (
            <motion.div
              key={item.id}
              className="absolute glass-card rounded-xl p-3 md:p-4 pointer-events-auto cursor-pointer border border-white/10 w-[140px] md:w-[160px]"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: itemOpacity,
                scale: scale,
                x: `calc(-50% + ${mobilePos.x}vw)`,
                y: `calc(-50% + ${mobilePos.y}vh)`,
              }}
              whileHover={itemOpacity > 0.3 ? { scale: scale * 1.05, borderColor: item.glowColor } : {}}
              transition={{ duration: 0.3, ease: "easeOut" }}
              aria-label={`${item.label} - ${item.subtitle}`}
              tabIndex={itemOpacity > 0.3 ? 0 : -1}
              // Use CSS media query for positioning
              {...(typeof window !== 'undefined' && window.innerWidth >= 768 ? {
                animate: {
                  opacity: itemOpacity,
                  scale: scale,
                  x: `calc(-50% + ${desktopPos.x}vw)`,
                  y: `calc(-50% + ${desktopPos.y}vh)`,
                }
              } : {})}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: item.glowColor }} />
                </div>
                <div className="min-w-0">
                  <span className="text-foreground font-semibold text-sm block truncate">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground text-xs truncate block">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Glow indicator */}
              <motion.div
                className="absolute -left-1 top-1/2 w-2 h-2 rounded-full"
                style={{ 
                  transform: "translateY(-50%)",
                  backgroundColor: item.glowColor,
                }}
                animate={{
                  boxShadow: [
                    `0 0 4px ${item.glowColor}`,
                    `0 0 8px ${item.glowColor}`,
                    `0 0 4px ${item.glowColor}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Scroll hint */}
      <motion.div 
        className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: menuOpacity * 0.8 }}
      >
        <p className="text-muted-foreground text-xs md:text-sm">Scroll to explore</p>
      </motion.div>
    </div>
  );
};

export default CategoryNodes;
