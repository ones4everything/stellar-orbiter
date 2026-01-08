import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Seasonal background gradients
const SEASONAL_BACKGROUNDS = {
  spring: "linear-gradient(180deg, hsl(260, 40%, 8%) 0%, hsl(330, 50%, 12%) 50%, hsl(260, 40%, 6%) 100%)",
  summer: "linear-gradient(180deg, hsl(80, 40%, 8%) 0%, hsl(50, 60%, 12%) 50%, hsl(40, 50%, 6%) 100%)",
  autumn: "linear-gradient(180deg, hsl(15, 50%, 8%) 0%, hsl(25, 60%, 14%) 50%, hsl(10, 45%, 6%) 100%)",
  winter: "linear-gradient(180deg, hsl(220, 50%, 6%) 0%, hsl(210, 60%, 12%) 50%, hsl(220, 50%, 4%) 100%)",
};

// Parallax layer configurations - each moves at different speeds
const PARALLAX_LAYERS = [
  { speed: 0.1, opacity: 0.15, scale: 1.2, blur: 80 },  // Slowest, furthest back
  { speed: 0.25, opacity: 0.2, scale: 1.1, blur: 50 },  // Mid-back
  { speed: 0.4, opacity: 0.25, scale: 1.05, blur: 30 }, // Mid-front
  { speed: 0.6, opacity: 0.3, scale: 1, blur: 15 },     // Fastest, closest
];

// Seasonal accent colors for parallax orbs
const SEASONAL_ORBS = {
  spring: [
    "hsla(330, 80%, 65%, VAR)",
    "hsla(280, 60%, 50%, VAR)",
    "hsla(300, 70%, 55%, VAR)",
    "hsla(320, 75%, 60%, VAR)",
  ],
  summer: [
    "hsla(45, 100%, 55%, VAR)",
    "hsla(30, 90%, 50%, VAR)",
    "hsla(60, 80%, 50%, VAR)",
    "hsla(20, 85%, 55%, VAR)",
  ],
  autumn: [
    "hsla(25, 90%, 50%, VAR)",
    "hsla(10, 80%, 45%, VAR)",
    "hsla(35, 85%, 55%, VAR)",
    "hsla(15, 75%, 40%, VAR)",
  ],
  winter: [
    "hsla(200, 80%, 65%, VAR)",
    "hsla(220, 70%, 55%, VAR)",
    "hsla(190, 75%, 60%, VAR)",
    "hsla(210, 85%, 70%, VAR)",
  ],
};

const SeasonalBackground = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
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

  const currentBackground = useMemo(() => {
    if (scrollProgress < 0.25) return SEASONAL_BACKGROUNDS.spring;
    if (scrollProgress < 0.5) return SEASONAL_BACKGROUNDS.summer;
    if (scrollProgress < 0.75) return SEASONAL_BACKGROUNDS.autumn;
    return SEASONAL_BACKGROUNDS.winter;
  }, [scrollProgress]);

  const activeSeasonIndex = useMemo(() => {
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress < 0.5) return 1;
    if (scrollProgress < 0.75) return 2;
    return 3;
  }, [scrollProgress]);

  const currentSeason = useMemo(() => {
    if (scrollProgress < 0.25) return "spring";
    if (scrollProgress < 0.5) return "summer";
    if (scrollProgress < 0.75) return "autumn";
    return "winter";
  }, [scrollProgress]);

  // Calculate parallax positions for each layer
  const parallaxOffsets = useMemo(() => {
    return PARALLAX_LAYERS.map((layer) => ({
      y: scrollProgress * layer.speed * 200, // Vertical offset based on scroll
      ...layer,
    }));
  }, [scrollProgress]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Main seasonal gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: currentBackground }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Parallax depth layers */}
      {parallaxOffsets.map((layer, index) => {
        const orbColor = SEASONAL_ORBS[currentSeason][index].replace("VAR", String(layer.opacity));
        // Position orbs in different corners/positions
        const positions = [
          { left: "15%", top: "20%" },
          { right: "10%", top: "35%" },
          { left: "25%", bottom: "25%" },
          { right: "20%", bottom: "15%" },
        ];
        const pos = positions[index];

        return (
          <motion.div
            key={index}
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
            style={{
              ...pos,
              filter: `blur(${layer.blur}px)`,
              transform: `translateY(${-layer.y}px) scale(${layer.scale})`,
            }}
            animate={{
              background: `radial-gradient(circle, ${orbColor}, transparent 70%)`,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}

      {/* Central radial glow - moves slower for depth */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateY(${-scrollProgress * 30}px)`,
        }}
      >
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

      {/* Floating ambient shapes - parallax movement */}
      <motion.div
        className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full opacity-10"
        style={{
          left: "5%",
          top: "60%",
          filter: "blur(40px)",
          transform: `translateY(${-scrollProgress * 150}px)`,
        }}
        animate={{
          background: activeSeasonIndex === 0
            ? "hsla(330, 80%, 60%, 0.5)"
            : activeSeasonIndex === 1
              ? "hsla(50, 100%, 50%, 0.5)"
              : activeSeasonIndex === 2
                ? "hsla(25, 90%, 50%, 0.5)"
                : "hsla(200, 80%, 60%, 0.5)",
        }}
        transition={{ duration: 0.6 }}
      />

      <motion.div
        className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full opacity-10"
        style={{
          right: "8%",
          top: "70%",
          filter: "blur(35px)",
          transform: `translateY(${-scrollProgress * 120}px)`,
        }}
        animate={{
          background: activeSeasonIndex === 0
            ? "hsla(280, 70%, 55%, 0.5)"
            : activeSeasonIndex === 1
              ? "hsla(30, 90%, 55%, 0.5)"
              : activeSeasonIndex === 2
                ? "hsla(15, 85%, 45%, 0.5)"
                : "hsla(210, 75%, 65%, 0.5)",
        }}
        transition={{ duration: 0.6 }}
      />

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