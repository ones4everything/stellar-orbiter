import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Seasonal background gradients
const SEASONAL_BACKGROUNDS = {
  spring: "linear-gradient(180deg, hsl(260, 40%, 8%) 0%, hsl(330, 50%, 12%) 50%, hsl(260, 40%, 6%) 100%)",
  summer: "linear-gradient(180deg, hsl(80, 40%, 8%) 0%, hsl(50, 60%, 12%) 50%, hsl(40, 50%, 6%) 100%)",
  autumn: "linear-gradient(180deg, hsl(15, 50%, 8%) 0%, hsl(25, 60%, 14%) 50%, hsl(10, 45%, 6%) 100%)",
  winter: "linear-gradient(180deg, hsl(220, 50%, 6%) 0%, hsl(210, 60%, 12%) 50%, hsl(220, 50%, 4%) 100%)",
};

const SeasonalBackground = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Find the Hero3D container
      const heroContainer = document.querySelector('[data-hero-container]');
      if (!heroContainer) return;

      const rect = heroContainer.getBoundingClientRect();
      const containerHeight = (heroContainer as HTMLElement).offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollStart = -rect.top;
      const scrollRange = containerHeight - viewportHeight;

      const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Current seasonal background with smooth interpolation
  const currentBackground = useMemo(() => {
    if (scrollProgress < 0.25) return SEASONAL_BACKGROUNDS.spring;
    if (scrollProgress < 0.5) return SEASONAL_BACKGROUNDS.summer;
    if (scrollProgress < 0.75) return SEASONAL_BACKGROUNDS.autumn;
    return SEASONAL_BACKGROUNDS.winter;
  }, [scrollProgress]);

  // Get the active season index for the glow effect
  const activeSeasonIndex = useMemo(() => {
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress < 0.5) return 1;
    if (scrollProgress < 0.75) return 2;
    return 3;
  }, [scrollProgress]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Main seasonal gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: currentBackground }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Radial glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-3xl opacity-60"
          animate={{
            background:
              activeSeasonIndex === 0
                ? "radial-gradient(circle, hsla(330, 80%, 60%, 0.3), hsla(280, 60%, 40%, 0.15), transparent)"
                : activeSeasonIndex === 1
                  ? "radial-gradient(circle, hsla(50, 100%, 50%, 0.35), hsla(30, 80%, 40%, 0.18), transparent)"
                  : activeSeasonIndex === 2
                    ? "radial-gradient(circle, hsla(25, 90%, 50%, 0.3), hsla(10, 70%, 30%, 0.15), transparent)"
                    : "radial-gradient(circle, hsla(200, 80%, 60%, 0.3), hsla(220, 60%, 40%, 0.15), transparent)",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsla(0, 0%, 0%, 0.4) 100%)"
        }}
      />
    </div>
  );
};

export default SeasonalBackground;