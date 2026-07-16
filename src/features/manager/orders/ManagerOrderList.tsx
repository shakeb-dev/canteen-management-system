import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  Clock, ChefHat, CheckCircle, Package,
  Search, ShoppingBag
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useState } from 'react';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import { useCanteenStore as useCanteenDataStore } from '../../../store/useCanteenStore';

const STATUS_CONFIG: Record<string, { label: string; icon: any; pill: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        pill: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  preparing: { label: 'Preparing', icon: ChefHat,      pill: 'bg-blue-50 text-blue-700 border-blue-200/60' },
  ready:     { label: 'Ready',     icon: CheckCircle,  pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  completed: { label: 'Done',      icon: Package,      pill: 'bg-muted text-muted-foreground border-border/40' },
};

export default function ManagerOrderList() {
  const { orders } = useOrderStore();
  const { user, role } = useAuthStore();
  const { canteens } = useCanteenDataStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange] = useState<string>('all');
  const [selectedCounter, setSelectedCounter] = useState<string>('all');

  const myCanteenIds = role === 'super_admin'
    ? canteens.map(c => c.id)
    : Array.from(new Set([
      ...canteens.filter(c => c.managerId === user?.id).map(c => c.id),
      ...(user?.canteenId ? [user.canteenId] : [])
    ]));

  const availableCounters = Array.from(new Set(
    orders
      .filter(o => myCanteenIds.includes(o.canteenId) && o.counterName)
      .map(o => JSON.stringify({ id: o.counterId, name: o.counterName }))
  )).map(s => JSON.parse(s));

  const filtered = orders.filter(o => {
    const isMine = myCanteenIds.includes(o.canteenId);
    const matchSearch = o.employeeName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    let matchStatus = true;
    if (filterStatus === 'pending') matchStatus = ['pending', 'preparing', 'ready'].includes(o.status);
    else if (filterStatus === 'completed') matchStatus = o.status === 'completed';
    const matchCounter = selectedCounter === 'all' || o.counterId === selectedCounter;
    let matchDate = true;
    const now = dayjs(), orderDate = dayjs(o.createdAt);
    if (dateRange === 'current') matchDate = orderDate.isSame(now, 'day');
    else if (dateRange === 'week') matchDate = orderDate.isSame(now, 'week');
    else if (dateRange === 'month') matchDate = orderDate.isSame(now, 'month');
    return isMine && matchSearch && matchStatus && matchDate && matchCounter;
  });

  // Counts for status summary
  const pending   = filtered.filter(o => o.status === 'pending').length;
  const preparing = filtered.filter(o => o.status === 'preparing').length;
  const ready     = filtered.filter(o => o.status === 'ready').length;
  const done      = filtered.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="Live Orders" subtitle="Monitor all canteen orders in real time." />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending',   value: pending,   cls: 'text-amber-700 bg-amber-50',   dot: 'bg-amber-500' },
          { label: 'Preparing', value: preparing, cls: 'text-blue-700 bg-blue-50',     dot: 'bg-blue-500' },
          { label: 'Ready',     value: ready,     cls: 'text-emerald-700 bg-emerald-50', dot: 'bg-emerald-500' },
          { label: 'Completed', value: done,      cls: 'text-muted-foreground bg-muted', dot: 'bg-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className={cn('h-2 w-2 rounded-full shrink-0', s.dot)} />
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <p className={cn('text-xl font-semibold tabular-nums', s.cls)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-border/50 flex flex-col lg:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <input
              className="w-full h-10 bg-background border border-border/60 rounded-lg pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
              placeholder="Search by name or order ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {availableCounters.length > 0 && (
              <select
                value={selectedCounter}
                onChange={e => setSelectedCounter(e.target.value)}
                className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 flex-1 lg:flex-none"
              >
                <option value="all">All Counters</option>
                {availableCounters.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 flex-1 lg:flex-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Active Orders</option>
              <option value="completed">Completed</option>
            </select>
            <span className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
              <ShoppingBag className="h-3.5 w-3.5 opacity-60" />
              {filtered.length} orders
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-4 py-2.5">Order</th>
                <th className="px-4 py-2.5">Employee</th>
                <th className="px-4 py-2.5">Counter</th>
                <th className="px-4 py-2.5">Items</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="h-8 w-8 opacity-20" />
                      <p className="text-sm">No orders to show</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-mono font-semibold text-foreground">#{order.id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{dayjs(order.createdAt).format('hh:mm A')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                          {order.employeeName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground truncate max-w-[120px]">{order.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.counterName || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{item.quantity}×</span> {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">₹ {order.totalAmount}</p>
                      <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                        cfg.pill
                      )}>
                        <Icon className="h-3 w-3" /> {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
