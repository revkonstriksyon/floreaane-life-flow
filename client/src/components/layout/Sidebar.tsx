import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Settings,
  HelpCircle,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Target,
  Star,
  Bot
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/", active: false },
  { icon: Calendar, label: "Ajenda & Tach", href: "/agenda", badge: 5, active: false },
  { icon: FolderOpen, label: "Pwojè Mwen", href: "/projects", badge: 3, active: false },
  { icon: Package, label: "Sa M Posede", href: "/assets" },
  { icon: Users, label: "Relasyon", href: "/contacts", badge: 2 },
  { icon: DollarSign, label: "Finans", href: "/finances" },
  { icon: FileText, label: "Nòt", href: "/notes" },
  { icon: BarChart3, label: "Rapò", href: "/reports" },
  { icon: MessageSquare, label: "Asistan IA", href: "/chat", badge: "!" }
];

const preferences = [
  { icon: Settings, label: "Paramèt", href: "/settings" },
  { icon: HelpCircle, label: "Èd & Sipò", href: "/help" }
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  currentPath?: string;
}

export function Sidebar({ collapsed = false, onToggle, currentPath = "/" }: SidebarProps) {
  return (
    <div className={cn(
      "flex flex-col h-screen bg-card/30 backdrop-blur-sm border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                FLOREAANE
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {!collapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechèch isi a..."
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {!collapsed && (
            <h2 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              MAIN MENU
            </h2>
          )}

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-primary/10 text-primary border border-primary/20"
                  )}
                  asChild
                >
                  <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === "!" ? "destructive" : "secondary"} 
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  </a>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Preferences */}
        <div className="p-2 border-t border-border/50 mt-4">
          {!collapsed && (
            <h2 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              PREFERANS
            </h2>
          )}

          <nav className="space-y-1">
            {preferences.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-3"
                )}
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </a>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
            <span className="text-accent-foreground font-medium text-sm">JS</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Joe Stark</p>
              <p className="text-xs text-muted-foreground truncate">joe@floreaane.com</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}