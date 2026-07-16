import { useNavigate } from 'react-router-dom';
import { Button, playHoverSound, playClickSound } from '../../../components/ui/Button';
import {
  Store, TrendingUp, UtensilsCrossed,
  ShieldCheck, Zap, ShoppingBag, Clock
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useCanteenStore } from '../../../store/useCanteenStore';
import { cn } from '../../../utils/cn';
import dayjs from 'dayjs';

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const { canteens } = useCanteenStore();
  const navigate = useNavigate();

  const myCanteens = canteens.filter(c => c.managerId === user?.id);
  const myCanteenIds = myCanteens.map(c => c.id);
  const myOrders = orders.filter(o => myCanteenIds.includes(o.canteenId));

  const stats = [
    {
      label: 'Today Earnings',
      sub: 'Net Revenue',
      value: `₹ ${myOrders.reduce((a, b) => a + b.totalAmount, 0)}`,
      icon: TrendingUp,
      gradient: 'from-emerald-600 to-teal-700',
      href: '/manager/orders'
    },
    {
      label: 'Active Orders',
      sub: 'Live Operations',
      value: myOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-red-600',
      href: '/manager/live-orders'
    },
    {
      label: 'My Canteens',
      sub: 'Hub Control',
      value: myCanteens.length,
      icon: Store,
      gradient: 'from-indigo-600 to-blue-700',
      href: '/manager/menu'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative pb-6">
      {/* Decorative Background Element */}
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-drift" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-primary/20">
            <ShieldCheck className="h-2.5 w-2.5" /> Operations Manager
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase  text-foreground leading-[0.9]">
            Canteen <span className="text-primary underline decoration-accent/30 underline-offset-4">Control</span>
          </h2>
          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-80 pt-2 flex items-center gap-3">
             {user?.name} · Banswara Hub <span className="h-px w-12 bg-border" />
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            onClick={() => navigate('/manager/menu')} 
            className="flex-1 md:flex-none h-11 px-6 text-[12px] gap-2"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" /> Manage Menu
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/manager/live-orders')} 
            className="flex-1 md:flex-none h-11 px-6 text-[12px] gap-2"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Live Orders
          </Button>
        </div>
      </div>

      {/* KPI Grid - Gradient Cards & Clickable */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={i}
            onMouseEnter={playHoverSound}
            onClick={() => { playClickSound(); navigate(s.href); }}
            className={cn(
              "hotel-card group p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[150px] border-none text-white",
              `bg-gradient-to-br ${s.gradient}`
            )}
          >
            {/* Visual Glass Overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.15em] group-hover:text-white transition-colors">{s.label}</p>
            </div>

            <div className="mt-2 relative z-10">
              <p className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left">{s.value}</p>
              <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest mt-0.5">
                {s.sub}
              </p>
            </div>

            <s.icon className="absolute -bottom-2 -right-2 h-20 w-20 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700" />
          </div>
        ))}
      </div>

      {/* Quick Status Info */}
      <div className="hotel-card p-4 bg-muted/20 border-border/40 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <Zap className="h-4 w-4 text-emerald-600 animate-pulse-soft" />
            </div>
            <div>
               <p className="text-[12px] font-black uppercase tracking-tight">System Status: Active</p>
               <p className="text-[12px] font-bold text-muted-foreground uppercase">Everything running smoothly</p>
            </div>
         </div>
         <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground">
            <Clock className="h-3 w-3" />
            {dayjs().format('HH:mm')}
         </div>
      </div>
    </div>
  );
}




