import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  Calendar, 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Bot,
  Menu,
  Bell,
  Search,
  X
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/", badge: null },
  { icon: Calendar, label: "Ajenda & Tach", href: "/agenda", badge: 5 },
  { icon: FolderOpen, label: "Pwojè Mwen", href: "/projects", badge: 3 },
  { icon: Package, label: "Sa M Posede", href: "/assets", badge: null },
  { icon: Users, label: "Relasyon", href: "/contacts", badge: 2 },
  { icon: DollarSign, label: "Finans", href: "/finances", badge: null },
  { icon: FileText, label: "Nòt", href: "/notes", badge: null },
  { icon: BarChart3, label: "Rapò", href: "/reports", badge: null },
  { icon: Bot, label: "Asistan IA", href: "/ai-assistant", badge: "!" }
];

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function MobileLayout({ children, currentPath = "/" }: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) {
    return <>{children}</>;
  }

  const currentItem = menuItems.find(item => item.href === currentPath);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-3 p-0 h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <MobileSidebar currentPath={currentPath} onClose={() => setIsMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">F</span>
              </div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                FLOREAANE
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sticky bottom-0 z-50 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="flex items-center justify-around h-16 px-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate max-w-16">
                  {item.label.split(' ')[0]}
                </span>
                {item.badge && (
                  <Badge 
                    variant={item.badge === "!" ? "destructive" : "secondary"} 
                    className="absolute -top-1 -right-1 h-4 w-4 text-[10px] p-0 flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function MobileSidebar({ currentPath, onClose }: { currentPath: string; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold">F</span>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                FLOREAANE
              </h1>
              <p className="text-xs text-muted-foreground">Pwodiktivite ak Òganizasyon</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechèch isi a..."
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badge === "!" ? "destructive" : "secondary"} 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
            <span className="text-accent-foreground font-bold">JS</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Joe Stark</p>
            <p className="text-sm text-muted-foreground">joe@floreaane.com</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}