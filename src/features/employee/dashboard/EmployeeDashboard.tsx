import { playHoverSound, playClickSound } from '../../../components/ui/Button';
import {
  Wallet, Utensils, Package, Sparkles, ArrowRight, ShoppingCart,
  Coffee, UtensilsCrossed, Sunset, Cookie, Star, Clock, CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { useMenuStore } from '../../../store/useMenuStore';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '../../../utils/cn';
dayjs.extend(relativeTime);

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  preparing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  ready: 'bg-green-500/10 text-green-600 border-green-500/20',
  completed: 'bg-muted text-muted-foreground border-border/20',
};

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All', icon: Star },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: UtensilsCrossed },
  { id: 'snacks', label: 'Snacks', icon: Cookie },
  { id: 'dinner', label: 'Dinner', icon: Sunset },
  { id: 'tea', label: 'Tea', icon: Coffee },
] as const;

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const { employees } = useEmployeeStore();
  const { items: menuItems } = useMenuStore();
  const navigate = useNavigate();

  const employee = employees.find((e) => e.username === user?.username || e.id === user?.id);
  const myOrders = orders
    .filter((o) => o.employeeId === user?.id || o.employeeName === user?.name)
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

  const activeOrders = myOrders.filter((o) => o.status !== 'completed');
  const recentOrders = myOrders.slice(0, 4);
  const completedOrders = myOrders.filter((o) => o.status === 'completed').length;

  const recommendedItem =
    menuItems.find((i) => i.isEnabled && i.isFoodOfTheDay) ||
    menuItems.find((i) => i.isEnabled) ||
    null;

  const stats = [
    {
      label: 'My Wallet',
      value: employee?.walletBalance?.toFixed(0) ?? '0',
      sub: `Rs. ${employee?.walletBalance?.toFixed(2) ?? '0.00'}`,
      icon: Wallet,
      gradient: 'from-indigo-600 to-blue-700',
      href: '/employee/history',
    },
    {
      label: 'Active Orders',
      value: activeOrders.length,
      sub: 'Orders in progress',
      icon: Clock,
      gradient: 'from-red-600 to-red-700',
      href: '/employee/orders',
    },
    {
      label: 'Completed Orders',
      value: completedOrders,
      sub: 'Delivered orders',
      icon: CheckCircle,
      gradient: 'from-emerald-600 to-teal-700',
      href: '/employee/history',
    },
    {
      label: 'Total Orders',
      value: myOrders.length,
      sub: `${activeOrders.length} Active | ${completedOrders} Completed`,
      icon: Package,
      gradient: 'from-orange-500 to-red-600',
      href: '/employee/orders',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative pb-6">
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-drift" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Employee Portal</p>
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome, <span className="text-primary">{user?.firstName || user?.name?.split(' ')[0] || 'Employee'}</span>
          </h2>
        </div>

        <div
          onClick={() => { playClickSound(); navigate('/employee/history'); }}
          className="flex items-stretch gap-0 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden w-full md:w-auto shrink-0"
        >
          <div className="px-5 py-3 flex flex-col justify-center">
            <p className="text-xs font-medium text-muted-foreground">Wallet Balance</p>
            <p className="text-xl font-semibold text-foreground mt-0.5 tabular-nums">Rs. {employee?.walletBalance?.toFixed(0) ?? '0'}</p>
          </div>
          <div className="w-px bg-border/60 shrink-0" />
          <div className="px-4 py-3 flex flex-col justify-center gap-1.5 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-xs text-muted-foreground">Active</span>
              <span className="text-xs font-medium text-foreground ml-auto tabular-nums">{activeOrders.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs text-muted-foreground">Completed</span>
              <span className="text-xs font-medium text-foreground ml-auto tabular-nums">{completedOrders}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            onMouseEnter={playHoverSound}
            onClick={() => { playClickSound(); navigate(s.href); }}
            className={cn(
              'hotel-card group p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[140px] border-none text-white',
              `bg-gradient-to-br ${s.gradient}`
            )}
          >
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

      <div className="grid gap-4">
        <div className="bg-card border border-border/50 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-500 flex items-center gap-1.5 shrink-0">
                <Sparkles className="h-3.5 w-3.5" /> Recommended For You
              </p>
              <div className="min-w-0 w-full sm:flex-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 w-max pr-1">
                  {QUICK_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={playHoverSound}
                        onClick={() => { playClickSound(); navigate('/employee/menu'); }}
                        className="h-8 px-3 rounded-lg border border-border/60 bg-background hover:bg-muted/40 text-foreground text-[10px] font-semibold uppercase tracking-widest inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mt-1 sm:mt-2 uppercase leading-tight break-words">
                {recommendedItem?.name || 'Fresh Meal'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 sm:mt-2 break-words">
                {recommendedItem?.description || 'Fresh and healthy meal prepared daily'}
              </p>
            </div>
            <div className="self-start sm:self-auto w-full sm:w-auto shrink-0 rounded-lg border border-border/60 bg-muted/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xl sm:text-2xl font-semibold text-primary tabular-nums text-left sm:text-right">
              Rs. {recommendedItem?.price ?? 0}
            </div>
          </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] sm:flex sm:items-center gap-2 sm:gap-3">
            <button
              onMouseEnter={playHoverSound}
              onClick={() => { playClickSound(); navigate('/employee/menu'); }}
              className="w-full h-10 sm:h-11 rounded-lg bg-primary text-white text-[11px] sm:text-sm font-semibold uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              Order Now <ArrowRight className="inline h-4 w-4 ml-1" />
            </button>
            <button
              onMouseEnter={playHoverSound}
              onClick={() => { playClickSound(); navigate('/employee/cart'); }}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 transition-all"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end px-2 border-l-4 border-accent pl-4">
          <div>
            <h3 className="text-2xl font-semibold text-foreground leading-none">
              Recent <span className="text-primary">Orders</span>
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Order History</p>
          </div>
          <button
            className="text-sm font-medium text-primary hover:text-accent transition-all"
            onClick={() => { playClickSound(); navigate('/employee/history'); }}
          >
            View All
          </button>
        </div>

        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          {recentOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground">
              <Package className="h-8 w-8 opacity-20" />
              <p className="text-xs font-medium uppercase tracking-widest opacity-40">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onMouseEnter={playHoverSound}
                  className="p-4 flex items-center justify-between hover:bg-muted/20 transition-all cursor-pointer group"
                  onClick={() => { playClickSound(); navigate('/employee/orders'); }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                      <Utensils className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-semibold text-sm text-foreground">Order #{order.id.slice(-4)}</span>
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest', STATUS_STYLES[order.status])}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium opacity-60 leading-none truncate max-w-[230px]">
                        {order.items.map((i) => i.name).join(' | ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-semibold text-lg tracking-tight text-primary group-hover:scale-105 transition-transform tabular-nums">
                      Rs. {order.totalAmount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase font-medium opacity-60 tracking-widest">
                      {dayjs(order.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
