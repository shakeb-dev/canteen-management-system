import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Zap, Hotel,
  TrendingUp, ChefHat
} from 'lucide-react';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { useCanteenStore } from '../../../store/useCanteenStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMenuStore } from '../../../store/useMenuStore';
import { cn } from '../../../utils/cn';
import { playHoverSound, playClickSound } from '../../../components/ui/Button';

export default function AdminDashboard() {
  const { employees = [] } = useEmployeeStore();
  const { canteens = [] } = useCanteenStore();
  const { orders = [] } = useOrderStore();
  const { items: menuItems = [] } = useMenuStore();
  const { role } = useAuthStore();
  const navigate = useNavigate();

  const isSupervisor = role === 'canteen_supervisor';

  // Statistics Calculations
  const totalEmployees = employees.filter(e => e.role === 'employee').length;
  const totalCanteens = canteens.length;
  const totalCounters = employees.filter(e => e.role === 'counter_manager').length;
  const totalMenuItems = menuItems.length;

  const cashRevenue = orders
    .filter(o => o.status === 'completed' && o.paymentMethod === 'cash')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const onlineRevenue = orders
    .filter(o => o.status === 'completed' && o.paymentMethod === 'wallet')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  const pendingOrders = todayOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length;
  const deliveredOrders = todayOrders.filter(o => o.status === 'completed').length;

  const stats = [
    {
      label: isSupervisor ? 'Food Items' : 'Employees',
      value: isSupervisor ? totalMenuItems : totalEmployees,
      sub: isSupervisor ? 'Total Food Items' : 'Total Employees',
      icon: isSupervisor ? ChefHat : Users,
      gradient: 'from-indigo-600 to-blue-700',
      href: isSupervisor ? '/admin/food-inventory' : '/admin/manage-employees'
    },
    {
      label: isSupervisor ? 'Pending Orders' : 'Canteens',
      value: isSupervisor ? pendingOrders : totalCanteens,
      sub: isSupervisor ? 'Today Pending Orders' : 'Total Canteens',
      icon: isSupervisor ? ShoppingBag : Hotel,
      gradient: 'from-red-600 to-red-700',
      href: isSupervisor ? '/manager/live-orders' : '/admin/manage-canteen'
    },
    {
      label: isSupervisor ? 'Completed Orders ' : '  Counters',
      value: isSupervisor ? deliveredOrders : totalCounters,
      sub: isSupervisor ? 'Today Completed Orders' : 'Total Counters',
      icon: isSupervisor ? TrendingUp : Zap,
      gradient: 'from-emerald-600 to-teal-700',
      href: isSupervisor ? '/manager/live-orders' : '/admin/manage-counters'
    },
    {
      label: "Total Orders",
      value: todayOrders.length,
      sub: isSupervisor ? 'Today Orders' : `${pendingOrders} Pending | ${deliveredOrders} Completed`,
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-red-600',
      href: '/admin/analytics-reports'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative pb-6">
      {/* Decorative Floating Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-drift" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {isSupervisor ? 'Canteen Supervisor' : 'Administrator'}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            {isSupervisor ? 'Supervisor' : 'Admin'} <span className="text-primary">Dashboard</span>
          </h2>
        </div>

        <div
          onClick={() => { playClickSound(); navigate('/admin/analytics-reports'); }}
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

      {/* Main KPI Grid - Gradient Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            onMouseEnter={playHoverSound}
            onClick={() => { playClickSound(); navigate(s.href); }}
            className={cn(
              "hotel-card group p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[140px] border-none text-white",
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
    </div>
  );
}




