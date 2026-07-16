import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, LogOut,
  ShoppingCart, ClipboardList, ChefHat, History,
  ShoppingBag, ChevronLeft, ChevronRight, X, LayoutPanelLeft, FileText,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import { BrandLogo } from '../ui/BrandLogo';
import { cn } from '../../utils/cn';
import { playHoverSound, playClickSound } from '../ui/Button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { role, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isActuallyCollapsed = sidebarCollapsed && !isHovered;
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  let navItems: NavItem[] = [];

  if (role === 'super_admin') {
    navItems = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Employees', href: '/admin/manage-employees', icon: Users },
      { name: 'Counters', href: '/admin/manage-counters', icon: LayoutPanelLeft },
      { name: 'Reports', href: '/admin/analytics-reports', icon: FileText },
    ];
  } else if (role === 'canteen_supervisor') {
    navItems = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Manage Menu', href: '/admin/food-inventory', icon: ChefHat },
      { name: 'Live Orders', href: '/manager/live-orders', icon: ShoppingBag },
      { name: 'Reports', href: '/admin/analytics-reports', icon: FileText },
    ];
  } else if (role === 'counter_manager') {
    navItems = [
      { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Today Orders', href: '/manager/live-orders', icon: ShoppingBag },
      { name: 'Reports', href: '/manager/reports', icon: FileText },
    ];
  } else if (role === 'employee') {
    navItems = [
      { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
      { name: 'Counters', href: '/employee/counters', icon: Store },
      { name: 'My Cart', href: '/employee/cart', icon: ShoppingCart, badge: cartCount },
      { name: 'My Orders', href: '/employee/orders', icon: ClipboardList },
      { name: 'History', href: '/employee/history', icon: History },
    ];
  }

  const handleLogout = () => {
    playClickSound();
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    playClickSound();
    if (mobileOpen) {
      setMobileOpen?.(false);
    }
  };

  const handleToggleSidebar = () => {
    playClickSound();
    toggleSidebar();
  };

  return (
    <>
      <aside
        onMouseEnter={() => { setIsHovered(true); playHoverSound(); }}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300 ease-in-out lg:static shadow-[4px_0_24px_rgba(0,0,0,0.05)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isActuallyCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Mobile Header - Keep close button */}
        <div className="lg:hidden flex h-16 items-center justify-end px-6 border-b border-border/40">
          <button
            onClick={() => { setMobileOpen?.(false); playClickSound(); }}
            onMouseEnter={playHoverSound}
            className="p-2 hover:bg-accent rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        {isActuallyCollapsed ? (
          /* Collapsed: just the centered avatar */
          <div className="px-4 py-4 flex justify-center">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0) || <User className="h-4 w-4" />}
            </div>
          </div>
        ) : (
          /* Expanded: full profile card */
          <div className="px-4 py-5">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-none text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1 capitalize">{role?.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Enhanced Font Size & Spacing */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onMouseEnter={playHoverSound}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-lg transition-all duration-200 py-2.5 px-3 relative overflow-hidden',
                  isActuallyCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive ? "" : "group-hover:text-primary"
                  )} />
                  {!isActuallyCollapsed && (
                    <>
                      <span className={cn(
                        "flex-1 text-sm font-medium animate-fade-in transition-all",
                        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                      )}>
                        {item.name}
                      </span>
                      {item.badge != null && item.badge > 0 && (
                        <span className={cn(
                          "text-[12px] font-black h-5 min-w-[20px] px-1 flex items-center justify-center rounded-lg border transition-all",
                          isActive 
                            ? "bg-white text-primary border-white" 
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions - Premium Design */}
        <div className="p-4 border-t border-border/40 space-y-4 bg-muted/5">
          <div className="flex justify-center py-6 overflow-hidden">
            <BrandLogo collapsed={isActuallyCollapsed} className={cn(!isActuallyCollapsed && "scale-[1.5]")} />
          </div>

          {!isActuallyCollapsed && (
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                onMouseEnter={playHoverSound}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive hover:text-white border border-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}

          {isActuallyCollapsed && (
            <div className="flex flex-col gap-2 items-center">
              <button onClick={handleLogout} onMouseEnter={playHoverSound} className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-all border border-transparent hover:border-destructive/20"><LogOut className="h-4 w-4" /></button>
            </div>
          )}

          <button
            onClick={handleToggleSidebar}
            onMouseEnter={playHoverSound}
            className="hidden lg:flex w-full items-center justify-center h-8 rounded-xl border border-border/40 bg-card hover:bg-muted text-muted-foreground/50 hover:text-foreground transition-all shadow-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}




