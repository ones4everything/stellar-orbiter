import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Flower2, Sun, Leaf, Snowflake } from "lucide-react";
import Hero3DScene from "./Hero3DScene";
import CategoryNodes from "./CategoryNodes";
import ProductCallouts from "./ProductCallouts";
import SeasonalParticles from "./SeasonalParticles";
import ScrollDebugOverlay from "./ScrollDebugOverlay";
import { useIsMobile } from "@/hooks/use-mobile";

const DEBUG_STORAGE_KEY = "lovable:hero3d:debug-overlay";

// 4 chapters with seasonal themes
const CHAPTERS = [
  { id: "spring", label: "Menu", season: "Spring", progress: 0, icon: Flower2, accent: "hsl(330, 80%, 65%)" },
  { id: "summer", label: "Seasonal", season: "Summer", progress: 0.25, icon: Sun, accent: "hsl(45, 100%, 50%)" },
  { id: "autumn", label: "Best Selling", season: "Autumn", progress: 0.5, icon: Leaf, accent: "hsl(25, 90%, 55%)" },
  { id: "winter", label: "Sale", season: "Winter", progress: 0.75, icon: Snowflake, accent: "hsl(200, 80%, 70%)" },
] as const;

// Seasonal background gradients inspired by reference images
const SEASONAL_BACKGROUNDS = {
  spring: "linear-gradient(180deg, hsl(260, 40%, 12%) 0%, hsl(330, 50%, 15%) 50%, hsl(260, 40%, 8%) 100%)",
  summer: "linear-gradient(180deg, hsl(120, 40%, 10%) 0%, hsl(80, 60%, 18%) 50%, hsl(40, 50%, 10%) 100%)",
  autumn: "linear-gradient(180deg, hsl(15, 60%, 10%) 0%, hsl(25, 70%, 18%) 50%, hsl(10, 50%, 8%) 100%)",
  winter: "linear-gradient(180deg, hsl(220, 50%, 8%) 0%, hsl(210, 60%, 15%) 50%, hsl(220, 50%, 5%) 100%)",
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

      const rect = el.getBoundingClientRect();
      const scrollableHeight = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollValue(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Visibility states
  const showCategories = scrollValue < 0.30;
  const showProducts = scrollValue > 0.20;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        // 4 chapters × 100vh each
        height: "400vh",
        scrollSnapType: "y mandatory",
      }}
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
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-3xl"
            animate={{
              background:
                activeChapterIndex === 0
                  ? "radial-gradient(circle, hsla(330, 80%, 60%, 0.2), hsla(280, 60%, 40%, 0.1), transparent)"
                  : activeChapterIndex === 1
                    ? "radial-gradient(circle, hsla(50, 100%, 50%, 0.25), hsla(30, 80%, 40%, 0.12), transparent)"
                    : activeChapterIndex === 2
                      ? "radial-gradient(circle, hsla(25, 90%, 50%, 0.2), hsla(10, 70%, 30%, 0.1), transparent)"
                      : "radial-gradient(circle, hsla(200, 80%, 60%, 0.2), hsla(220, 60%, 40%, 0.1), transparent)",
            }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* 3D Scene - Sphere stays centered */}
        <div className="absolute inset-0">
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
            className="absolute top-24 right-4 z-50 pointer-events-auto rounded-md border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-xs text-foreground hover:bg-background"
            onClick={() => setDebugEnabled((v) => !v)}
            aria-pressed={debugEnabled}
            aria-label={debugEnabled ? "Hide debug overlay" : "Show debug overlay"}
          >
            {debugEnabled ? "Hide debug" : "Show debug"}
          </button>
        )}

        {/* Category nodes */}
        <CategoryNodes visible={showCategories} scrollProgress={scrollValue} />

        {/* Product callouts */}
        <ProductCallouts visible={showProducts} scrollProgress={scrollValue} />

        {/* Chapter title overlay */}
        <motion.div
          className="absolute top-20 md:top-24 left-0 right-0 text-center pointer-events-none z-20"
          key={activeChapterIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground/70 mb-2 block">
            {CHAPTERS[activeChapterIndex].season}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            {CHAPTERS[activeChapterIndex].label}
          </h2>
        </motion.div>

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
          className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 pointer-events-auto bg-background/60 backdrop-blur-md rounded-full px-4 py-2 border border-border/50"
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
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                  animate={{
                    borderColor: isActive ? chapter.accent : "hsl(var(--border) / 0.5)",
                    backgroundColor: isActive ? `${chapter.accent.replace(")", " / 0.2)")}` : "transparent",
                    boxShadow: isActive ? `0 0 16px ${chapter.accent.replace(")", " / 0.6)")}` : "none",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isActive ? chapter.accent : "hsl(var(--muted-foreground))" }}
                  />
                </motion.div>
                {/* Label */}
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? chapter.accent : "hsl(var(--muted-foreground))" }}
                >
                  {chapter.season}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Scroll indicator (only at start) */}
        <motion.div
          className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
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

      {/* Scroll-snap chapter sections (invisible, just for snap points) */}
      {CHAPTERS.map((chapter) => (
        <div
          key={chapter.id}
          className="h-screen"
          style={{ scrollSnapAlign: "start" }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default Hero3D;
