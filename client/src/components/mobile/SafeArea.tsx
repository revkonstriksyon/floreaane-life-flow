import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export function SafeArea({ 
  children, 
  className,
  top = true,
  bottom = true,
  left = true,
  right = true
}: SafeAreaProps) {
  return (
    <div 
      className={cn(
        "w-full h-full",
        top && "pt-[var(--safe-area-inset-top)]",
        bottom && "pb-[var(--safe-area-inset-bottom)]",
        left && "pl-[var(--safe-area-inset-left)]",
        right && "pr-[var(--safe-area-inset-right)]",
        className
      )}
    >
      {children}
    </div>
  );
}