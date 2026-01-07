import { motion, useTransform, MotionValue } from "framer-motion";

interface ParallaxTextProps {
  scrollProgress: MotionValue<number>;
}

const phrases = [
  { text: "Immersive commerce hardware", startY: 0.1, endY: 0.4, x: -200 },
  { text: "AI-driven shopping", startY: 0.25, endY: 0.6, x: 250 },
  { text: "Classical meets quantum", startY: 0.4, endY: 0.75, x: -150 },
  { text: "Future is now", startY: 0.55, endY: 0.9, x: 200 },
];

const ParallaxText = ({ scrollProgress }: ParallaxTextProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {phrases.map((phrase, index) => {
        // Calculate opacity based on scroll position
        const opacity = useTransform(
          scrollProgress,
          [phrase.startY - 0.1, phrase.startY, phrase.endY, phrase.endY + 0.1],
          [0, 1, 1, 0]
        );

        // Parallax X movement
        const x = useTransform(
          scrollProgress,
          [phrase.startY, phrase.endY],
          [phrase.x, phrase.x * -1]
        );

        return (
          <motion.p
            key={index}
            className="absolute left-1/2 parallax-text text-lg md:text-xl lg:text-2xl whitespace-nowrap"
            style={{
              opacity,
              x,
              top: `${20 + index * 18}%`,
            }}
          >
            {phrase.text}
          </motion.p>
        );
      })}
    </div>
  );
};

export default ParallaxText;
