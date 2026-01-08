import { motion } from "framer-motion";

interface ScrollDebugOverlayProps {
  scrollProgress: number;
}

const ScrollDebugOverlay = ({ scrollProgress }: ScrollDebugOverlayProps) => {
  const percentage = Math.round(scrollProgress * 100);
  
  // 4 Chapter structure
  const chapters = [
    { id: "spring", name: "🌸 Spring - Menu", start: 0, end: 0.25 },
    { id: "summer", name: "☀️ Summer - Seasonal", start: 0.25, end: 0.50 },
    { id: "autumn", name: "🍂 Autumn - Best Sellers", start: 0.50, end: 0.75 },
    { id: "winter", name: "❄️ Winter - Sale", start: 0.75, end: 1.0 },
  ];

  // Determine current chapter
  const getCurrentChapter = () => {
    if (scrollProgress < 0.25) return chapters[0];
    if (scrollProgress < 0.50) return chapters[1];
    if (scrollProgress < 0.75) return chapters[2];
    return chapters[3];
  };

  // Get active effects
  const getActiveEffects = () => {
    const effects: string[] = [];
    
    // Chapter transitions
    if (scrollProgress < 0.20) effects.push("📂 Categories visible");
    if (scrollProgress >= 0.20 && scrollProgress < 0.25) effects.push("📂 Categories fading out");
    
    if (scrollProgress >= 0.25 && scrollProgress < 0.30) effects.push("☀️ Summer fading in");
    if (scrollProgress >= 0.30 && scrollProgress < 0.45) effects.push("☀️ Summer products visible");
    if (scrollProgress >= 0.45 && scrollProgress < 0.50) effects.push("☀️ Summer fading out");
    
    if (scrollProgress >= 0.50 && scrollProgress < 0.55) effects.push("🍂 Autumn fading in");
    if (scrollProgress >= 0.55 && scrollProgress < 0.70) effects.push("🍂 Best sellers visible");
    if (scrollProgress >= 0.70 && scrollProgress < 0.75) effects.push("🍂 Autumn fading out");
    
    if (scrollProgress >= 0.75 && scrollProgress < 0.80) effects.push("❄️ Winter fading in");
    if (scrollProgress >= 0.80) effects.push("❄️ Sale items visible");
    
    // Seasonal particles
    if (scrollProgress < 0.25) effects.push("🌸 Spring particles");
    if (scrollProgress >= 0.25 && scrollProgress < 0.50) effects.push("☀️ Summer particles");
    if (scrollProgress >= 0.50 && scrollProgress < 0.75) effects.push("🍂 Autumn particles");
    if (scrollProgress >= 0.75) effects.push("❄️ Winter particles");
    
    return effects;
  };

  const currentChapter = getCurrentChapter();
  const activeEffects = getActiveEffects();

  const sectionColors = [
    "bg-pink-500",
    "bg-yellow-500", 
    "bg-orange-500",
    "bg-cyan-500",
  ];

  return (
    <motion.div
      className="fixed top-20 left-4 z-50 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 w-72 text-sm font-mono"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">4-Chapter Scroll</span>
        <span className="text-primary font-bold">{percentage}%</span>
      </div>

      {/* Progress bar with chapters */}
      <div className="relative h-3 bg-muted rounded-full mb-4 overflow-hidden">
        {chapters.map((chapter, idx) => (
          <div
            key={chapter.id}
            className={`absolute top-0 h-full ${sectionColors[idx]} opacity-30`}
            style={{
              left: `${chapter.start * 100}%`,
              width: `${(chapter.end - chapter.start) * 100}%`,
            }}
          />
        ))}
        <motion.div
          className="absolute top-0 h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
        {/* Chapter markers */}
        {[0.25, 0.50, 0.75].map((marker) => (
          <div
            key={marker}
            className="absolute top-0 h-full w-0.5 bg-foreground/30"
            style={{ left: `${marker * 100}%` }}
          />
        ))}
      </div>

      {/* Current chapter */}
      <div className="mb-3 p-2 bg-muted/50 rounded">
        <div className="text-xs text-muted-foreground mb-1">Current Chapter</div>
        <div className="text-foreground font-semibold">{currentChapter.name}</div>
        <div className="text-xs text-muted-foreground">
          {Math.round(currentChapter.start * 100)}% - {Math.round(currentChapter.end * 100)}%
        </div>
      </div>

      {/* Active effects */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground mb-2">Active Effects</div>
        {activeEffects.length === 0 ? (
          <div className="text-xs text-muted-foreground/50 italic">None</div>
        ) : (
          activeEffects.map((effect, index) => (
            <motion.div
              key={effect}
              className="text-xs text-foreground/80 pl-2 border-l-2 border-primary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {effect}
            </motion.div>
          ))
        )}
      </div>

      {/* Chapter legend */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Chapters</div>
        <div className="space-y-1 text-xs">
          {chapters.map((chapter, idx) => (
            <div 
              key={chapter.id} 
              className={`flex items-center gap-2 ${currentChapter.id === chapter.id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
            >
              <div className={`w-2 h-2 rounded-full ${sectionColors[idx]}`} />
              <span>{chapter.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollDebugOverlay;
