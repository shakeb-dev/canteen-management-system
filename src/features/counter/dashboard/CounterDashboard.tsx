import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCounterStore } from '../../../store/useCounterStore';
import {
  ShoppingBag, CheckCircle, Clock, TrendingUp, AlertCircle, ArrowRight
} from 'lucide-react';
import { playHoverSound, playClickSound } from '../../../components/ui/Button';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import { useNavigate } from 'react-router-dom';

export default function CounterDashboard() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const { counters } = useCounterStore();
  const navigate = useNavigate();

  const myCounter = counters.find(c => c.managerId === user?.id || c.managerId === user?.username);
  const myOrders = orders.filter(o => o.counterId === myCounter?.id);

  const todayOrders = myOrders.filter(o => dayjs(o.createdAt).isSame(dayjs(), 'day'));
  const completed = todayOrders.filter(o => o.status === 'completed');
  const pending = todayOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));

  const cashRevenue = todayOrders
    .filter(o => o.status === 'completed' && o.paymentMethod === 'cash')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const onlineRevenue = todayOrders
    .filter(o => o.status === 'completed' && o.paymentMethod === 'wallet')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      sub: "Total orders today",
      icon: ShoppingBag,
      gradient: 'from-indigo-600 to-blue-700',
      href: '/manager/live-orders'
    },
    {
      label: "Completed",
      value: completed.length,
      sub: "Orders delivered",
      icon: CheckCircle,
      gradient: 'from-emerald-600 to-teal-700',
      href: '/manager/live-orders'
    },
    {
      label: "Pending",
      value: pending.length,
      sub: "Needs attention",
      icon: Clock,
      gradient: 'from-orange-500 to-red-600',
      href: '/manager/live-orders'
    },
    {
      label: "Total Sales",
      value: `₹ ${(cashRevenue + onlineRevenue).toLocaleString()}`,
      sub: "Revenue today",
      icon: TrendingUp,
      gradient: 'from-purple-600 to-indigo-800',
      href: '/manager/reports'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative pb-6">
      {/* Decorative Floating Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-drift" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Counter Manager
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Counter <span className="text-primary">Dashboard</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {user?.name} · {myCounter?.name || 'Counter Terminal'}
          </p>
        </div>

        <div
          onClick={() => { playClickSound(); navigate('/manager/reports'); }}
          className="flex items-stretch gap-0 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden w-full md:w-auto shrink-0"
        >
          <div className="px-5 py-3 flex flex-col justify-center">
            <p className="text-xs font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold text-foreground mt-0.5 tabular-nums">₹ {(cashRevenue + onlineRevenue).toLocaleString()}</p>
          </div>
          <div className="w-px bg-border/60 shrink-0" />
          <div className="px-4 py-3 flex flex-col justify-center gap-1.5 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs text-muted-foreground">Cash</span>
              <span className="text-xs font-medium text-foreground ml-auto tabular-nums">₹ {cashRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-xs text-muted-foreground">Online</span>
              <span className="text-xs font-medium text-foreground ml-auto tabular-nums">₹ {onlineRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Grid - Gradient Cards (Admin Match) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            onMouseEnter={playHoverSound}
            onClick={() => { playClickSound(); navigate(s.href); }}
            className={cn(
              "hotel-card group p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[140px] border-none text-white shadow-sm",
              `bg-gradient-to-br ${s.gradient}`
            )}
          >
            {/* Visual Glass Overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between relative z-10">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 shadow-sm">
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors text-right max-w-[100px]">{s.label}</p>
            </div>

            <div className="mt-2 relative z-10">
              <p className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left tabular-nums">{s.value}</p>
              <p className="text-xs font-normal text-white/60 mt-0.5">{s.sub}</p>
            </div>

            <s.icon className="absolute -bottom-2 -right-2 h-20 w-20 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Pending Orders */}
        <div className="bg-card border border-border/50 rounded-xl flex flex-col justify-between shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Pending Orders</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Needs Attention</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                Action Needed
              </span>
            </div>

            <div className="max-h-[320px] overflow-y-auto border border-border/40 rounded-lg bg-background/50">
              {pending.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No pending orders</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {pending.map(order => (
                    <div 
                      key={order.id} 
                      onMouseEnter={playHoverSound}
                      onClick={() => { playClickSound(); navigate('/manager/live-orders'); }}
                      className="flex items-center gap-3 p-3.5 hover:bg-muted/50 transition-colors border-b last:border-0 border-border/40 cursor-pointer group"
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        order.status === 'pending' ? "bg-amber-500" :
                        order.status === 'preparing' ? "bg-blue-500" : "bg-emerald-500"
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-foreground truncate">{order.employeeName}</p>
                          <span className="text-xs font-mono font-medium text-muted-foreground">#{order.id.slice(-6)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground truncate">
                            {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                          </p>
                          <span className={cn(
                            "text-[10px] font-medium uppercase tracking-wider",
                            order.status === 'pending' ? "text-amber-600" :
                            order.status === 'preparing' ? "text-blue-600" : "text-emerald-600"
                          )}>{order.status}</span>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border/40 bg-muted/10">
            <button
              onClick={() => { playClickSound(); navigate('/manager/live-orders'); }}
              className="w-full bg-background border border-border/60 hover:bg-muted h-9 rounded-lg text-sm font-medium transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
