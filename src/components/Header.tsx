import { Menu, Search, Mic, User, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const { openCart, getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border/30"
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Left - Hamburger Menu */}
        <button
          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Center - Logo and Search */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo */}
          <motion.h1
            className="text-2xl font-bold tracking-tight neon-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-primary">ONES</span>
            <span className="text-foreground">4</span>
          </motion.h1>

          {/* Search Bar */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input w-64 lg:w-80 pl-10 pr-10 text-sm"
              aria-label="Search products"
            />
            <button
              className="absolute right-3 p-1 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Right - Profile and Cart */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
          </button>

          <motion.button
            onClick={openCart}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={`Shopping cart with ${itemCount} items`}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            <motion.span
              key={itemCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
            >
              {itemCount}
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
