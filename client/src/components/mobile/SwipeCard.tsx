import { useState, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ReactNode;
    label: string;
    color: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    label: string;
    color: string;
  };
  className?: string;
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setDragOffset(0);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    setDragOffset(info.offset.x);
  };

  return (
    <div className="relative overflow-hidden" ref={constraintsRef}>
      {/* Background Actions */}
      {leftAction && (
        <div 
          className={cn(
            "absolute left-0 top-0 h-full w-24 flex flex-col items-center justify-center transition-opacity",
            leftAction.color,
            dragOffset < -50 ? "opacity-100" : "opacity-0"
          )}
        >
          {leftAction.icon}
          <span className="text-xs font-medium mt-1 text-white">{leftAction.label}</span>
        </div>
      )}
      
      {rightAction && (
        <div 
          className={cn(
            "absolute right-0 top-0 h-full w-24 flex flex-col items-center justify-center transition-opacity",
            rightAction.color,
            dragOffset > 50 ? "opacity-100" : "opacity-0"
          )}
        >
          {rightAction.icon}
          <span className="text-xs font-medium mt-1 text-white">{rightAction.label}</span>
        </div>
      )}

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className={cn(
          "bg-card border border-border rounded-lg relative z-10",
          className
        )}
        whileDrag={{ scale: 0.98 }}
        style={{
          backgroundColor: dragOffset > 50 
            ? 'rgba(34, 197, 94, 0.1)' 
            : dragOffset < -50 
            ? 'rgba(239, 68, 68, 0.1)' 
            : undefined
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}