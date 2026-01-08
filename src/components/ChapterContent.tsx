import { motion } from "framer-motion";
import { 
  Sun, Snowflake, 
  Brain, Atom, Glasses, Laptop,
  ShoppingCart, Check, Percent
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChapterContentProps {
  scrollProgress: number;
}

// Chapter 1: Spring - Menu Categories
const categories = [
  { id: "neural", label: "Neural Links", icon: Brain, color: "#e879f9", count: 24 },
  { id: "quantum", label: "Quantum Cores", icon: Atom, color: "#a855f7", count: 18 },
  { id: "holo", label: "Holo Displays", icon: Glasses, color: "#06b6d4", count: 32 },
  { id: "cyber", label: "Cyber Decks", icon: Laptop, color: "#10b981", count: 15 },
];

// Chapter 2: Summer - Seasonal Products
const seasonalProducts = [
  { id: "solar-core", name: "Solar Core X", price: "$4,999", icon: Atom, color: "#fbbf24" },
  { id: "beach-deck", name: "Beach Deck Pro", price: "$2,799", icon: Laptop, color: "#f59e0b" },
  { id: "sun-lens", name: "Sun Lens AR", price: "$1,899", icon: Glasses, color: "#facc15" },
  { id: "ray-link", name: "Ray Neural", price: "$3,299", icon: Brain, color: "#eab308" },
];

// Chapter 3: Autumn - Best Selling
const bestSellers = [
  { id: "neural-pro", name: "Neural Link Pro", price: "$2,499", icon: Brain, badge: "🔥 #1", color: "#f97316" },
  { id: "quantum-x", name: "Quantum Core X", price: "$4,999", icon: Atom, badge: "⭐ Top", color: "#ea580c" },
  { id: "holo-7", name: "Holo Display 7", price: "$1,899", icon: Glasses, badge: "📈 Hot", color: "#fb923c" },
  { id: "cyber-alpha", name: "Cyber Core Alpha", price: "$3,299", icon: Laptop, badge: "💎 Pop", color: "#f59e0b" },
];

// Chapter 4: Winter - Sale Items
const saleItems = [
  { id: "frost-deck", name: "Frost Deck", price: "$2,399", original: "$3,599", discount: "33%", icon: Laptop, color: "#38bdf8" },
  { id: "cryo-core", name: "Cryo Core", price: "$4,999", original: "$6,999", discount: "28%", icon: Atom, color: "#0ea5e9" },
  { id: "ice-lens", name: "Ice Lens Pro", price: "$1,299", original: "$1,899", discount: "32%", icon: Glasses, color: "#7dd3fc" },
  { id: "snow-link", name: "Snow Neural", price: "$1,899", original: "$2,799", discount: "32%", icon: Brain, color: "#22d3ee" },
];

const ChapterContent = ({ scrollProgress }: ChapterContentProps) => {
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  const handleAddToCart = (item: { id: string; name: string; price: string }) => {
    const numericPrice = parseInt(item.price.replace(/\D/g, ""));
    addItem({
      id: item.id,
      name: item.name,
      price: numericPrice,
      priceDisplay: item.price,
      icon: "🛒",
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Get individual card visibility based on scroll within its chapter
  // Each chapter is 25% of scroll, and cards appear sequentially within that range
  const getCardVisibility = (chapterIndex: number, cardIndex: number, totalCards: number) => {
    const chapterStart = chapterIndex * 0.25;
    const chapterEnd = (chapterIndex + 1) * 0.25;
    const chapterProgress = (scrollProgress - chapterStart) / 0.25; // 0-1 within chapter
    
    // Chapter not active
    if (scrollProgress < chapterStart - 0.02 || scrollProgress > chapterEnd + 0.02) {
      return { opacity: 0, scale: 0.8 };
    }
    
    // Calculate when this specific card should appear
    const cardAppearStart = cardIndex / totalCards;
    const cardAppearDuration = 0.25; // Each card takes 25% of chapter to fully appear
    const cardLocalProgress = (chapterProgress - cardAppearStart) / cardAppearDuration;
    
    // Fade out at chapter end
    const fadeOutStart = 0.85;
    const fadeOutProgress = (chapterProgress - fadeOutStart) / (1 - fadeOutStart);
    
    let opacity = 0;
    let scale = 0.8;
    
    if (chapterProgress >= cardAppearStart) {
      opacity = Math.min(1, cardLocalProgress);
      scale = 0.8 + Math.min(0.2, cardLocalProgress * 0.2);
    }
    
    // Apply fade out at chapter end
    if (chapterProgress > fadeOutStart) {
      const fadeOut = 1 - Math.min(1, fadeOutProgress);
      opacity *= fadeOut;
      scale = 0.8 + 0.2 * fadeOut;
    }
    
    return { opacity: Math.max(0, Math.min(1, opacity)), scale };
  };

  // Card positioning - orbit around center
  const getCardPosition = (index: number, total: number, radius: number) => {
    if (isMobile) {
      const spacing = 85;
      const startY = -((total - 1) * spacing) / 2;
      return { x: 0, y: startY + index * spacing + 20 };
    }
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
    };
  };

  // Check if chapter is in range
  const isChapterVisible = (chapterIndex: number) => {
    const start = chapterIndex * 0.25;
    const end = (chapterIndex + 1) * 0.25;
    return scrollProgress >= start - 0.02 && scrollProgress <= end + 0.02;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {/* Spring - Categories (sequential appearance) */}
      {isChapterVisible(0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {categories.map((cat, idx) => {
            const pos = getCardPosition(idx, categories.length, 220);
            const Icon = cat.icon;
            const { opacity, scale } = getCardVisibility(0, idx, categories.length);
            
            if (opacity < 0.01) return null;
            
            return (
              <motion.div
                key={cat.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                  opacity,
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                <div 
                  className="glass-card rounded-xl p-4 w-[140px] md:w-[160px] border"
                  style={{ borderColor: `${cat.color}30` }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `linear-gradient(135deg, ${cat.color}30, ${cat.color}10)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-foreground font-semibold text-sm">{cat.label}</h3>
                  <p className="text-muted-foreground text-xs">{cat.count} products</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summer - Seasonal Products (sequential appearance) */}
      {isChapterVisible(1) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {seasonalProducts.map((product, idx) => {
            const pos = getCardPosition(idx, seasonalProducts.length, 200);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(1, idx, seasonalProducts.length);
            
            if (opacity < 0.01) return null;
            
            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                  opacity,
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                <div 
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border"
                  style={{ borderColor: `${product.color}30` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Summer Edition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{product.name}</h3>
                      <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-background"
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Autumn - Best Sellers (sequential appearance) */}
      {isChapterVisible(2) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {bestSellers.map((product, idx) => {
            const pos = getCardPosition(idx, bestSellers.length, 210);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(2, idx, bestSellers.length);
            
            if (opacity < 0.01) return null;
            
            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                  opacity,
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                <div 
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border relative overflow-hidden"
                  style={{ borderColor: `${product.color}30` }}
                >
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${product.color}20`, color: product.color }}
                  >
                    {product.badge}
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{product.name}</h3>
                      <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-background"
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Winter - Sale Items (sequential appearance) */}
      {isChapterVisible(3) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {saleItems.map((product, idx) => {
            const pos = getCardPosition(idx, saleItems.length, 200);
            const Icon = product.icon;
            const { opacity, scale } = getCardVisibility(3, idx, saleItems.length);
            
            if (opacity < 0.01) return null;
            
            return (
              <motion.div
                key={product.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                  opacity,
                }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: scale * 1.05 }}
              >
                <div 
                  className="glass-card rounded-xl p-4 w-[150px] md:w-[180px] border relative overflow-hidden"
                  style={{ borderColor: `${product.color}30` }}
                >
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                    style={{ backgroundColor: "#ef444420", color: "#ef4444" }}
                  >
                    <Percent className="w-3 h-3" />
                    {product.discount} OFF
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <Snowflake className="w-4 h-4" style={{ color: product.color }} />
                    <span className="text-xs font-medium" style={{ color: product.color }}>Winter Sale</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.color}30, ${product.color}10)` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm" style={{ color: product.color }}>{product.price}</p>
                        <p className="text-muted-foreground text-xs line-through">{product.original}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-background"
                    style={{ backgroundColor: product.color }}
                  >
                    {addedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChapterContent;
