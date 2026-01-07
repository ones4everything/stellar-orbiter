import { motion } from "framer-motion";

interface ScrollDebugOverlayProps {
  scrollProgress: number;
}

const ScrollDebugOverlay = ({ scrollProgress }: ScrollDebugOverlayProps) => {
  const percentage = Math.round(scrollProgress * 100);
  
  // Determine current section
  const getCurrentSection = () => {
    if (scrollProgress < 0.25) return { name: "Menu Categories", range: "0% - 25%" };
    if (scrollProgress < 0.50) return { name: "Best Selling", range: "25% - 50%" };
    if (scrollProgress < 0.75) return { name: "Seasonal Collection", range: "50% - 75%" };
    return { name: "Featured Collection", range: "75% - 100%" };
  };

  // Get active effects
  const getActiveEffects = () => {
    const effects: string[] = [];
    
    if (scrollProgress < 0.15) effects.push("Categories expanding outward");
    if (scrollProgress >= 0.15 && scrollProgress < 0.25) effects.push("Categories fading out");
    if (scrollProgress >= 0.25 && scrollProgress < 0.50) effects.push("Best Selling products visible");
    if (scrollProgress >= 0.50 && scrollProgress < 0.625) effects.push("🌸 Cherry blossoms (Spring)");
    if (scrollProgress >= 0.625 && scrollProgress < 0.75) effects.push("☀️ Sun sparkles (Summer)");
    if (scrollProgress >= 0.75 && scrollProgress < 0.875) effects.push("🍂 Falling leaves (Autumn)");
    if (scrollProgress >= 0.875) effects.push("❄️ Snowflakes (Winter)");
    if (scrollProgress >= 0.50 && scrollProgress < 0.75) effects.push("Seasonal products visible");
    if (scrollProgress >= 0.75) effects.push("Featured products visible");
    
    return effects;
  };

  const currentSection = getCurrentSection();
  const activeEffects = getActiveEffects();

  const sections = [
    { name: "Menu", start: 0, end: 0.25, color: "bg-primary" },
    { name: "Best Selling", start: 0.25, end: 0.50, color: "bg-accent" },
    { name: "Seasonal", start: 0.50, end: 0.75, color: "bg-green-500" },
    { name: "Featured", start: 0.75, end: 1, color: "bg-purple-500" },
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
