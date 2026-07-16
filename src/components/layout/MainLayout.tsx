import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

import { BrandLogo } from '../ui/BrandLogo';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const isEmployee = role === 'employee';
  const hasItems = items.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Sidebar Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b bg-card px-4 lg:hidden">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 hover:bg-accent rounded-md transition-colors"
                aria-label="Open menu"
             >
               <Menu className="h-5 w-5 text-muted-foreground" />
             </button>
             <BrandLogo />
          </div>
          
          {/* Mobile Cart Quick Access */}
          {isEmployee && hasItems && (
            <button 
              onClick={() => navigate('/employee/cart')}
              className="relative p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20 animate-bounce-subtle"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-lg border border-white">
                {items.length}
              </span>
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main 
          id="main-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-5 custom-scrollbar bg-muted/20"
        >
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Mobile Cart for Employees (Bottom Corner) */}
      {isEmployee && hasItems && (
        <button 
          onClick={() => navigate('/employee/cart')}
          className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center gap-3 bg-primary text-white p-4 rounded-2xl shadow-2xl shadow-primary/40 active:scale-95 transition-all animate-fade-in border border-white/20"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-accent text-white text-[12px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
              {items.length}
            </span>
          </div>
          <span className="text-xs font-black uppercase tracking-widest pr-1">My Cart</span>
        </button>
      )}
    </div>
  );
}




