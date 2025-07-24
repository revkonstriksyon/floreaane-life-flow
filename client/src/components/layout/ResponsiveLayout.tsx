import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "./MobileLayout";
import { Sidebar } from "./Sidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function ResponsiveLayout({ children, currentPath = "/" }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isMobile) {
    return (
      <MobileLayout currentPath={currentPath}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath={currentPath}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}