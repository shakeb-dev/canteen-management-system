import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { History, TrendingUp, ShoppingBag } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import { PageHeader } from '../../../components/ui/PageHeader';

export default function OrderHistory() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();

  const myOrders = orders
    .filter((o) => o.employeeName === user?.name || o.employeeId === user?.id)
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

  const completedOrders = myOrders.filter((o) => o.status === 'completed');
  const totalSpent = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  const stats = [
    {
      label: 'Total Orders',
      value: completedOrders.length,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Spent',
      value: `Rs. ${totalSpent.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Order History"
        subtitle="Summary of all your past orders."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-semibold">{s.label}</p>
                <p className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</p>
              </div>
              <div className={cn('p-2.5 rounded-lg', s.bg, s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border/50 bg-muted/10 flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">All Orders</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-4 py-2.5">Order No</th>
                <th className="px-4 py-2.5 hidden md:table-cell">Date</th>
                <th className="px-4 py-2.5 hidden lg:table-cell">Canteen</th>
                <th className="px-4 py-2.5">Food Items</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5">Payment</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-xs">No orders found.</td>
                </tr>
              ) : myOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">REF: {order.id.slice(-5).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{dayjs(order.createdAt).format('DD MMM YYYY, h:mm A')}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-foreground">{order.canteenName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground tabular-nums">Rs. {order.totalAmount}</td>
                  <td className="px-4 py-3 capitalize text-sm text-muted-foreground">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border tracking-widest', {
                      'bg-yellow-500/5 text-yellow-600 border-yellow-500/20': order.status === 'pending',
                      'bg-blue-500/5 text-blue-600 border-blue-500/20': order.status === 'preparing',
                      'bg-green-500/5 text-green-600 border-green-500/20': order.status === 'ready',
                      'bg-muted text-muted-foreground border-border': order.status === 'completed',
                    })}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
