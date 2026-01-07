import { motion } from "framer-motion";

interface ScrollDebugOverlayProps {
  scrollProgress: number;
}

const ScrollDebugOverlay = ({ scrollProgress }: ScrollDebugOverlayProps) => {
  const percentage = Math.round(scrollProgress * 100);
  
  // Determine current section - using overlapping ranges
  const getCurrentSection = () => {
    if (scrollProgress < 0.22) return { name: "Menu Categories", range: "0% - 28%" };
    if (scrollProgress < 0.50) return { name: "Best Selling", range: "18% - 55%" };
    if (scrollProgress < 0.75) return { name: "Seasonal Collection", range: "45% - 80%" };
    return { name: "Featured Collection", range: "70% - 100%" };
  };

  // Get active effects - updated for overlapping transitions
  const getActiveEffects = () => {
    const effects: string[] = [];
    
    // Menu effects
    if (scrollProgress < 0.15) effects.push("📂 Categories expanding");
    if (scrollProgress >= 0.15 && scrollProgress < 0.28) effects.push("📂 Categories fading out");
    
    // Best Selling effects (overlap with Menu & Seasonal)
    if (scrollProgress >= 0.18 && scrollProgress < 0.28) effects.push("🔥 Best Selling fading in");
    if (scrollProgress >= 0.28 && scrollProgress < 0.45) effects.push("🔥 Best Selling visible");
    if (scrollProgress >= 0.45 && scrollProgress < 0.55) effects.push("🔥 Best Selling fading out");
    
    // Seasonal effects (overlap with Best Selling & Featured)
    if (scrollProgress >= 0.45 && scrollProgress < 0.55) effects.push("🌿 Seasonal fading in");
    if (scrollProgress >= 0.55 && scrollProgress < 0.70) effects.push("🌿 Seasonal visible");
    if (scrollProgress >= 0.70 && scrollProgress < 0.80) effects.push("🌿 Seasonal fading out");
    
    // Seasonal particles
    if (scrollProgress >= 0.50 && scrollProgress < 0.625) effects.push("🌸 Spring particles");
    if (scrollProgress >= 0.625 && scrollProgress < 0.75) effects.push("☀️ Summer particles");
    if (scrollProgress >= 0.75 && scrollProgress < 0.875) effects.push("🍂 Autumn particles");
    if (scrollProgress >= 0.875) effects.push("❄️ Winter particles");
    
    // Featured effects (overlap with Seasonal)
    if (scrollProgress >= 0.70 && scrollProgress < 0.80) effects.push("👑 Featured fading in");
    if (scrollProgress >= 0.80) effects.push("👑 Featured visible");
    
    return effects;
  };

  const currentSection = getCurrentSection();
  const activeEffects = getActiveEffects();

  // Updated sections to show overlapping ranges
  const sections = [
    { name: "Menu", start: 0, end: 0.28, color: "bg-primary" },
    { name: "Best Selling", start: 0.18, end: 0.55, color: "bg-accent" },
    { name: "Seasonal", start: 0.45, end: 0.80, color: "bg-green-500" },
    { name: "Featured", start: 0.70, end: 1, color: "bg-purple-500" },
  ];

  return (
    <motion.div
      className="fixed top-20 left-4 z-50 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 w-72 text-sm font-mono"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">Scroll Logic Demo</span>
        <span className="text-primary font-bold">{percentage}%</span>
      </div>

      {/* Progress bar with sections */}
      <div className="relative h-3 bg-muted rounded-full mb-4 overflow-hidden">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`absolute top-0 h-full ${section.color} opacity-30`}
            style={{
              left: `${section.start * 100}%`,
              width: `${(section.end - section.start) * 100}%`,
            }}
          />
        ))}
        <motion.div
          className="absolute top-0 h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
        {/* Section markers */}
        {[0.25, 0.50, 0.75].map((marker) => (
          <div
            key={marker}
            className="absolute top-0 h-full w-px bg-border"
            style={{ left: `${marker * 100}%` }}
          />
        ))}
      </div>

      {/* Current section */}
      <div className="mb-3 p-2 bg-muted/50 rounded">
        <div className="text-xs text-muted-foreground mb-1">Current Section</div>
        <div className="text-foreground font-semibold">{currentSection.name}</div>
        <div className="text-xs text-muted-foreground">{currentSection.range}</div>
      </div>

      {/* Active effects */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground mb-2">Active Effects</div>
        {activeEffects.map((effect, index) => (
          <motion.div
            key={effect}
            className="text-xs text-foreground/80 pl-2 border-l-2 border-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {effect}
          </motion.div>
        ))}
      </div>

      {/* Section legend */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Sections</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {sections.map((section) => (
            <div key={section.name} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${section.color}`} />
              <span className="text-muted-foreground">{section.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollDebugOverlay;
