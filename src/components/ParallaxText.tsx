import { motion, useTransform, MotionValue } from "framer-motion";

interface ParallaxTextProps {
  scrollProgress: MotionValue<number>;
}

const phrases = [
  { text: "Browse Categories", startY: 0, endY: 0.18, x: -120 },
  { text: "Best Selling Products", startY: 0.18, endY: 0.40, x: 150 },
  { text: "Seasonal Collection", startY: 0.40, endY: 0.65, x: -100 },
  { text: "Featured Collection", startY: 0.65, endY: 0.95, x: 120 },
];

const ParallaxText = ({ scrollProgress }: ParallaxTextProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {phrases.map((phrase, index) => {
        const opacity = useTransform(
          scrollProgress,
          [phrase.startY, phrase.startY + 0.05, phrase.endY - 0.05, phrase.endY],
          [0, 0.6, 0.6, 0]
        );

        const x = useTransform(
          scrollProgress,
          [phrase.startY, phrase.endY],
          [phrase.x, phrase.x * -0.5]
        );

        const y = useTransform(
          scrollProgress,
          [phrase.startY, phrase.endY],
          [0, -30]
        );

        return (
          <motion.p
            key={index}
            className="absolute left-1/2 parallax-text text-sm md:text-lg lg:text-xl whitespace-nowrap hidden md:block"
            style={{
              opacity,
              x,
              y,
              top: `${35 + (index % 2) * 30}%`,
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
