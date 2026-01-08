import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Sun, Leaf, Snowflake } from "lucide-react";
import Hero3DScene from "./Hero3DScene";
import ChapterContent from "./ChapterContent";
import SeasonalParticles from "./SeasonalParticles";
import ScrollDebugOverlay from "./ScrollDebugOverlay";
import { useIsMobile } from "@/hooks/use-mobile";

const DEBUG_STORAGE_KEY = "lovable:hero3d:debug-overlay";

// 4 chapters with seasonal themes
export const CHAPTERS = [
  { 
    id: "spring", 
    label: "Menu", 
    season: "Spring", 
    progress: 0, 
    icon: Flower2, 
    accent: "hsl(330, 80%, 65%)",
    description: "Browse Categories"
  },
  { 
    id: "summer", 
    label: "Seasonal", 
    season: "Summer", 
    progress: 0.25, 
    icon: Sun, 
    accent: "hsl(45, 100%, 50%)",
    description: "Limited Edition"
  },
  { 
    id: "autumn", 
    label: "Best Selling", 
    season: "Autumn", 
    progress: 0.5, 
    icon: Leaf, 
    accent: "hsl(25, 90%, 55%)",
    description: "Top Products"
  },
  { 
    id: "winter", 
    label: "Sale", 
    season: "Winter", 
    progress: 0.75, 
    icon: Snowflake, 
    accent: "hsl(200, 80%, 70%)",
    description: "Special Offers"
  },
] as const;

// Seasonal background gradients
const SEASONAL_BACKGROUNDS = {
  spring: "linear-gradient(180deg, hsl(260, 40%, 8%) 0%, hsl(330, 50%, 12%) 50%, hsl(260, 40%, 6%) 100%)",
  summer: "linear-gradient(180deg, hsl(80, 40%, 8%) 0%, hsl(50, 60%, 12%) 50%, hsl(40, 50%, 6%) 100%)",
  autumn: "linear-gradient(180deg, hsl(15, 50%, 8%) 0%, hsl(25, 60%, 14%) 50%, hsl(10, 45%, 6%) 100%)",
  winter: "linear-gradient(180deg, hsl(220, 50%, 6%) 0%, hsl(210, 60%, 12%) 50%, hsl(220, 50%, 4%) 100%)",
};

const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);
  const isMobile = useIsMobile();

  const isDev = import.meta.env.DEV;
  const defaultDebugEnabled = useMemo(() => {
    if (!isDev) return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("debug") === "1") return true;
      return localStorage.getItem(DEBUG_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }, [isDev]);

  const [debugEnabled, setDebugEnabled] = useState(defaultDebugEnabled);

  useEffect(() => {
    if (!isDev) return;
    try {
      localStorage.setItem(DEBUG_STORAGE_KEY, String(debugEnabled));
    } catch {
      // ignore
    }
  }, [debugEnabled, isDev]);

  // Calculate scroll progress within the hero container
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      // Use page coordinates (reliable even with positioned parents)
      const startY = el.getBoundingClientRect().top + window.scrollY;
      const height = el.getBoundingClientRect().height;
      const endY = startY + height - window.innerHeight;
      const range = Math.max(1, endY - startY);

      const raw = (window.scrollY - startY) / range;
      const progress = Math.max(0, Math.min(1, raw));
      setScrollValue(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Jump to a specific chapter
  const jumpToChapter = useCallback((targetProgress: number) => {
    const el = containerRef.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollableHeight = el.scrollHeight - window.innerHeight;
    const targetScroll = top + scrollableHeight * targetProgress;

    window.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
  }, []);

  // Determine active chapter (0-3)
  const activeChapterIndex = useMemo(() => {
    if (scrollValue < 0.25) return 0;
    if (scrollValue < 0.5) return 1;
    if (scrollValue < 0.75) return 2;
    return 3;
  }, [scrollValue]);

  // Current seasonal background
  const currentBackground = useMemo(() => {
    if (scrollValue < 0.25) return SEASONAL_BACKGROUNDS.spring;
    if (scrollValue < 0.5) return SEASONAL_BACKGROUNDS.summer;
    if (scrollValue < 0.75) return SEASONAL_BACKGROUNDS.autumn;
    return SEASONAL_BACKGROUNDS.winter;
  }, [scrollValue]);

  const activeChapter = CHAPTERS[activeChapterIndex];

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "400vh" }}
    >
      {/* Sticky container - sphere stays fixed in center */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Seasonal background */}
        <motion.div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: currentBackground }}
        />

        {/* Radial glow behind planet */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-3xl"
            animate={{
              background:
                activeChapterIndex === 0
                  ? "radial-gradient(circle, hsla(330, 80%, 60%, 0.25), hsla(280, 60%, 40%, 0.12), transparent)"
                  : activeChapterIndex === 1
                    ? "radial-gradient(circle, hsla(50, 100%, 50%, 0.3), hsla(30, 80%, 40%, 0.15), transparent)"
                    : activeChapterIndex === 2
                      ? "radial-gradient(circle, hsla(25, 90%, 50%, 0.25), hsla(10, 70%, 30%, 0.12), transparent)"
                      : "radial-gradient(circle, hsla(200, 80%, 60%, 0.25), hsla(220, 60%, 40%, 0.12), transparent)",
            }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* 3D Scene - Sphere stays centered (pointer-events-none so cards are clickable) */}
        <div className="absolute inset-0 pointer-events-none">
          <Hero3DScene scrollProgress={scrollValue} />
        </div>

        {/* Seasonal Particles */}
        <SeasonalParticles scrollProgress={scrollValue} />

        {/* Debug Overlay */}
        {debugEnabled && <ScrollDebugOverlay scrollProgress={scrollValue} />}

        {/* Debug toggle */}
        {isDev && (
          <button
            type="button"
            className="absolute top-20 right-4 z-50 pointer-events-auto rounded-md border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-xs text-foreground hover:bg-background"
            onClick={() => setDebugEnabled((v) => !v)}
            aria-pressed={debugEnabled}
            aria-label={debugEnabled ? "Hide debug overlay" : "Show debug overlay"}
          >
            {debugEnabled ? "Hide debug" : "Show debug"}
          </button>
        )}

        {/* Chapter title overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapterIndex}
            className="absolute top-16 md:top-20 left-0 right-0 text-center pointer-events-none z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <activeChapter.icon 
                className="w-4 h-4" 
                style={{ color: activeChapter.accent }} 
              />
              <span 
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: activeChapter.accent }}
              >
                {activeChapter.season}
              </span>
              <activeChapter.icon 
                className="w-4 h-4" 
                style={{ color: activeChapter.accent }} 
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {activeChapter.label}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {activeChapter.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Chapter-specific content */}
        <ChapterContent scrollProgress={scrollValue} />

        {/* Desktop chapter markers (right side) */}
        <nav
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-auto"
          aria-label="Jump to section"
        >
          {CHAPTERS.map((chapter, idx) => {
            const Icon = chapter.icon;
            const isActive = idx === activeChapterIndex;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => jumpToChapter(chapter.progress)}
                aria-label={`Jump to ${chapter.label} (${chapter.season})`}
                aria-current={isActive ? "step" : undefined}
                className="group relative flex items-center"
              >
                {/* Tooltip */}
                <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-background/95 border border-border px-3 py-1.5 text-sm font-medium text-foreground opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 shadow-lg">
                  <span className="block text-xs text-muted-foreground">{chapter.season}</span>
                  {chapter.label}
                </span>
                {/* Marker */}
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors backdrop-blur-sm"
                  animate={{
                    borderColor: isActive ? chapter.accent : "hsl(var(--border))",
                    backgroundColor: isActive ? `${chapter.accent.replace(")", " / 0.15)")}` : "hsl(var(--background) / 0.5)",
                    boxShadow: isActive ? `0 0 20px ${chapter.accent.replace(")", " / 0.5)")}` : "none",
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors"
                    style={{ color: isActive ? chapter.accent : "hsl(var(--muted-foreground))" }}
                  />
                </motion.div>
              </button>
            );
          })}
        </nav>

        {/* Mobile chapter markers (bottom horizontal) */}
        <nav
          className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-auto bg-background/70 backdrop-blur-md rounded-full px-3 py-2 border border-border/50"
          aria-label="Jump to section"
        >
          {CHAPTERS.map((chapter, idx) => {
            const Icon = chapter.icon;
            const isActive = idx === activeChapterIndex;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => jumpToChapter(chapter.progress)}
                aria-label={`Jump to ${chapter.label} (${chapter.season})`}
                aria-current={isActive ? "step" : undefined}
                className="flex flex-col items-center gap-0.5"
              >
                <motion.div
                  className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors"
                  animate={{
                    borderColor: isActive ? chapter.accent : "hsl(var(--border) / 0.5)",
                    backgroundColor: isActive ? `${chapter.accent.replace(")", " / 0.2)")}` : "transparent",
                    boxShadow: isActive ? `0 0 12px ${chapter.accent.replace(")", " / 0.5)")}` : "none",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? chapter.accent : "hsl(var(--muted-foreground))" }}
                  />
                </motion.div>
              </button>
            );
          })}
        </nav>

        {/* Scroll indicator (only at start) */}
        <motion.div
          className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          animate={{ opacity: scrollValue < 0.05 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 rounded-full bg-primary"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero3D;
