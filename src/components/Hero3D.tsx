import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, TrendingUp, Leaf, Crown } from "lucide-react";
import Hero3DScene from "./Hero3DScene";
import CategoryNodes from "./CategoryNodes";
import ProductCallouts from "./ProductCallouts";
import ParallaxText from "./ParallaxText";
import SeasonalParticles from "./SeasonalParticles";
import ScrollDebugOverlay from "./ScrollDebugOverlay";

const DEBUG_STORAGE_KEY = "lovable:hero3d:debug-overlay";

const CHAPTERS = [
  { id: "menu", label: "Menu", progress: 0, icon: Sparkles, color: "#00ffff" },
  { id: "best", label: "Best Selling", progress: 0.25, icon: TrendingUp, color: "#f43f5e" },
  { id: "seasonal", label: "Seasonal", progress: 0.50, icon: Leaf, color: "#22c55e" },
  { id: "featured", label: "Featured", progress: 0.75, icon: Crown, color: "#d946ef" },
];

const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Subscribe to scroll changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScrollValue(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Jump to a specific scroll chapter
  const jumpToChapter = useCallback((targetProgress: number) => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = containerRef.current.offsetTop + containerHeight * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  // Determine which chapter is active
  const activeChapterIndex = useMemo(() => {
    if (scrollValue < 0.25) return 0;
    if (scrollValue < 0.50) return 1;
    if (scrollValue < 0.75) return 2;
    return 3;
  }, [scrollValue]);

  // Determine visibility states - 4 section transitions
  // Section 1: Menu (0 - 0.25)
  // Section 2: Best Selling (0.25 - 0.50)
  // Section 3: Seasonal (0.50 - 0.75)
  // Section 4: Featured (0.75 - 1.0)
  const showCategories = scrollValue < 0.30;
  const showProducts = scrollValue > 0.20;

  // Transform for sticky container scale
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh]">
      {/* Sticky container */}
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ scale }}
      >
        {/* Seasonal background gradient */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background:
              scrollValue < 0.50
                ? "linear-gradient(to bottom, hsl(222, 47%, 3%), hsl(222, 60%, 8%), hsl(222, 47%, 3%))"
                : scrollValue < 0.625
                  ? "linear-gradient(to bottom, hsl(350, 30%, 5%), hsl(330, 40%, 10%), hsl(350, 30%, 5%))" // Spring - pink tint
                  : scrollValue < 0.75
                    ? "linear-gradient(to bottom, hsl(40, 30%, 5%), hsl(30, 50%, 8%), hsl(40, 30%, 5%))" // Summer - warm gold
                    : scrollValue < 0.875
                      ? "linear-gradient(to bottom, hsl(25, 40%, 5%), hsl(15, 50%, 8%), hsl(25, 40%, 5%))" // Autumn - orange/brown
                      : "linear-gradient(to bottom, hsl(210, 50%, 5%), hsl(220, 60%, 10%), hsl(210, 50%, 5%))", // Winter - cool blue
          }}
        />

        {/* Radial glow behind planet - seasonal color */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.3], [0.3, 0.6]),
          }}
        >
          <div
            className="w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-1000"
            style={{
              background:
                scrollValue < 0.50
                  ? "radial-gradient(circle, hsla(180, 100%, 50%, 0.1), hsla(300, 100%, 50%, 0.05), transparent)"
                  : scrollValue < 0.625
                    ? "radial-gradient(circle, hsla(330, 80%, 70%, 0.15), hsla(350, 60%, 50%, 0.08), transparent)" // Spring
                    : scrollValue < 0.75
                      ? "radial-gradient(circle, hsla(45, 100%, 50%, 0.15), hsla(30, 80%, 40%, 0.08), transparent)" // Summer
                      : scrollValue < 0.875
                        ? "radial-gradient(circle, hsla(25, 90%, 50%, 0.15), hsla(15, 70%, 30%, 0.08), transparent)" // Autumn
                        : "radial-gradient(circle, hsla(200, 80%, 60%, 0.15), hsla(220, 70%, 40%, 0.08), transparent)", // Winter
            }}
          />
        </motion.div>

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Hero3DScene scrollProgress={scrollValue} />
        </div>

        {/* Seasonal Particles */}
        <SeasonalParticles scrollProgress={scrollValue} />

        {/* Debug Overlay (dev-only; hidden by default) */}
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

        {/* Category nodes (initial state) */}
        <CategoryNodes visible={showCategories} scrollProgress={scrollValue} />

        {/* Product callouts (appear on scroll) */}
        <ProductCallouts visible={showProducts} scrollProgress={scrollValue} />

        {/* Parallax text */}
        <ParallaxText scrollProgress={scrollYProgress} />

        {/* Hero headline */}
        <motion.div
          className="absolute bottom-24 left-0 right-0 text-center pointer-events-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
              y: useTransform(scrollYProgress, [0, 0.2], [0, -50]),
            }}
          >
            <span className="text-primary neon-text">Future</span> Technology
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            }}
          >
            Explore the next generation of hardware innovation
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          }}
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

        {/* Chapter jump markers */}
        <nav
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-auto"
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
                aria-label={`Jump to ${chapter.label}`}
                aria-current={isActive ? "step" : undefined}
                className="group relative flex items-center"
              >
                {/* Tooltip */}
                <span className="absolute right-full mr-2 whitespace-nowrap rounded bg-background/90 border border-border px-2 py-1 text-xs text-foreground opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {chapter.label}
                </span>
                {/* Marker */}
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
                  animate={{
                    borderColor: isActive ? chapter.color : "hsl(var(--border))",
                    backgroundColor: isActive ? `${chapter.color}20` : "hsl(var(--background) / 0.6)",
                    boxShadow: isActive ? `0 0 10px ${chapter.color}40` : "none",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon
                    className="w-4 h-4 transition-colors"
                    style={{ color: isActive ? chapter.color : "hsl(var(--muted-foreground))" }}
                  />
                </motion.div>
              </button>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
};

export default Hero3D;
