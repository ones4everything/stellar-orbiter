import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

interface SeasonalParticlesProps {
  scrollProgress: number;
}

type Season = "spring" | "summer" | "autumn" | "winter";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

const SeasonalParticles = ({ scrollProgress }: SeasonalParticlesProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Determine current season based on scroll
  const getCurrentSeason = (): Season => {
    if (scrollProgress < 0.25) return "spring";
    if (scrollProgress < 0.50) return "summer";
    if (scrollProgress < 0.75) return "autumn";
    return "winter";
  };

  const season = getCurrentSeason();

  // Generate particles for each season
  const particles = useMemo((): Particle[] => {
    const count = prefersReducedMotion ? 8 : 20;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 16,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, [prefersReducedMotion]);

  const getSeasonColor = (season: Season) => {
    switch (season) {
      case "spring": return "#f9a8d4"; // Pink cherry blossom
      case "summer": return "#fbbf24"; // Golden sun
      case "autumn": return "#f97316"; // Orange leaf
      case "winter": return "#ffffff"; // White snow
    }
  };

  const renderParticle = (particle: Particle, season: Season) => {
    const color = getSeasonColor(season);

    switch (season) {
      case "spring":
        // Cherry blossom petal
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 16 12 16C12 16 16 14 16 10C16 6 12 2 12 2Z"
              fill={color}
              opacity="0.8"
            />
            <circle cx="12" cy="10" r="2" fill="#fce7f3" />
          </svg>
        );
      case "summer":
        // Sun ray / sparkle
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <circle cx="12" cy="12" r="4" fill={color} opacity="0.9" />
            <path d="M12 2L13 6L12 5L11 6L12 2Z" fill={color} opacity="0.6" />
            <path d="M12 22L13 18L12 19L11 18L12 22Z" fill={color} opacity="0.6" />
            <path d="M2 12L6 11L5 12L6 13L2 12Z" fill={color} opacity="0.6" />
            <path d="M22 12L18 11L19 12L18 13L22 12Z" fill={color} opacity="0.6" />
          </svg>
        );
      case "autumn":
        // Falling leaf
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <path
              d="M12 2C6 8 4 12 6 16C8 20 12 22 12 22C12 22 16 20 18 16C20 12 18 8 12 2Z"
              fill={color}
              opacity="0.85"
            />
            <path d="M12 8V18" stroke="#92400e" strokeWidth="1" opacity="0.5" />
            <path d="M9 11L12 14L15 11" stroke="#92400e" strokeWidth="0.5" opacity="0.4" fill="none" />
          </svg>
        );
      case "winter":
        // Snowflake
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: `drop-shadow(0 0 6px #67e8f9)` }}>
            <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" 
              stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
            <circle cx="12" cy="12" r="2" fill="#67e8f9" opacity="0.8" />
            <circle cx="12" cy="4" r="1" fill={color} opacity="0.6" />
            <circle cx="12" cy="20" r="1" fill={color} opacity="0.6" />
            <circle cx="4" cy="12" r="1" fill={color} opacity="0.6" />
            <circle cx="20" cy="12" r="1" fill={color} opacity="0.6" />
          </svg>
        );
    }
  };

  // Calculate opacity for smooth transition
  const getOpacity = () => {
    const segmentProgress = scrollProgress % 0.25;
    const fadeIn = Math.min(1, segmentProgress / 0.05);
    const fadeOut = Math.max(0, 1 - (segmentProgress - 0.20) / 0.05);
    return Math.min(fadeIn, fadeOut) * 0.7;
  };

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.slice(0, 5).map((particle) => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: 0.4,
            }}
          >
            {renderParticle(particle, season)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: getOpacity() }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.x}%`,
                width: particle.size,
                height: particle.size,
              }}
              initial={{ 
                y: "-10%", 
                rotate: particle.rotation,
                opacity: 0 
              }}
              animate={{
                y: "110vh",
                rotate: particle.rotation + (season === "autumn" ? 720 : 360),
                opacity: [0, 0.8, 0.8, 0],
                x: season === "autumn" 
                  ? [0, 30, -20, 40, 0] 
                  : season === "winter"
                  ? [0, 15, -15, 10, -10]
                  : [0, 10, -10, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {renderParticle(particle, season)}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Season indicator glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{
          background: `radial-gradient(circle, ${getSeasonColor(season)}15 0%, transparent 70%)`,
        }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default SeasonalParticles;
