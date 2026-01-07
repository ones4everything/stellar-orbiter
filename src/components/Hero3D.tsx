import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero3DScene from "./Hero3DScene";
import CategoryNodes from "./CategoryNodes";
import ProductCallouts from "./ProductCallouts";
import ParallaxText from "./ParallaxText";
import SeasonalParticles from "./SeasonalParticles";

const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);

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

  // Determine visibility states - 4 section transitions
  // Section 1: Menu (0 - 0.20)
  // Section 2: Best Selling (0.20 - 0.45)
  // Section 3: Seasonal (0.45 - 0.70)
  // Section 4: Featured (0.70 - 1.0)
  const showCategories = scrollValue < 0.25;
  const showProducts = scrollValue > 0.15;

  // Transform for sticky container scale
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh]">
      {/* Sticky container */}
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ scale }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-navy-dark to-background" />
        
        {/* Radial glow behind planet */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.3], [0.3, 0.6]),
          }}
        >
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/10 via-accent/5 to-transparent blur-3xl" />
        </motion.div>

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Hero3DScene scrollProgress={scrollValue} />
        </div>

        {/* Seasonal Particles */}
        <SeasonalParticles scrollProgress={scrollValue} />

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
      </motion.div>
    </div>
  );
};

export default Hero3D;
