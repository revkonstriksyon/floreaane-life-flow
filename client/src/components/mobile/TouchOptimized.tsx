import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
  variant?: "default" | "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function TouchOptimizedButton({
  children,
  onClick,
  onLongPress,
  variant = "default",
  size = "md",
  className,
  disabled = false
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleTouchStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true);
        onLongPress();
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    setIsPressed(false);
    setIsLongPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    if (!isLongPressed && onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };

  const variantClasses = {
    default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-accent text-accent-foreground hover:bg-accent/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        isPressed && "scale-95",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 0.95 : 1
      }}
    >
      <AnimatePresence>
        {isLongPressed && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  );
}

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  useEffect(() => {
    if (isRefreshing) {
      setPullDistance(threshold);
    }
  }, [isRefreshing]);

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary/10 text-primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: pullDistance,
              opacity: pullDistance > 20 ? 1 : 0 
            }}
            exit={{ height: 0, opacity: 0 }}
            style={{ zIndex: 50 }}
          >
            <motion.div
              animate={{ 
                rotate: isRefreshing ? 360 : pullDistance >= threshold ? 180 : 0 
              }}
              transition={{ 
                rotate: { duration: isRefreshing ? 1 : 0.3, repeat: isRefreshing ? Infinity : 0 }
              }}
              className="text-sm font-medium"
            >
              {isRefreshing ? "🔄" : pullDistance >= threshold ? "⬆️" : "⬇️"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{ y: pullDistance }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </div>
  );
}