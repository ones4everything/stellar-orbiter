import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      closeCart();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Your Cart</h2>
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                  {items.length} items
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Add products from the hero orbit
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="glass-card p-4 rounded-xl"
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.icon}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-primary font-bold mt-1">
                            {item.priceDisplay}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-foreground">
                    ${getTotalPrice().toLocaleString()}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                  whileTap={{ scale: 0.98 }}
                >
                  {isCheckingOut ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Checkout
                    </>
                  )}
                </motion.button>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-muted-foreground hover:text-destructive transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
