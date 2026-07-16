import { useState } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import { useCounterStore } from '../../../store/useCounterStore';
import { Search, FileText, FileSpreadsheet, Printer, TrendingUp, ShoppingBag, Wallet, IndianRupee } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { type ReportFilterProps } from './Reports';

export default function CounterReports({ timeFilter, fromDate, toDate }: ReportFilterProps) {
  const { orders } = useOrderStore();
  const { counters } = useCounterStore();
  const [selectedCounter, setSelectedCounter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filterByTime = (dateStr: string) => {
    const d = new Date(dateStr), now = new Date();
    if (timeFilter === 'daily') return d.toDateString() === now.toDateString();
    if (timeFilter === 'weekly') { const w = new Date(); w.setDate(now.getDate() - 7); return d >= w; }
    if (timeFilter === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (timeFilter === 'custom' && fromDate && toDate) return d >= new Date(fromDate) && d <= new Date(toDate + 'T23:59:59');
    return true;
  };

  const filteredOrders = orders.filter(o => filterByTime(o.createdAt) && (selectedCounter === 'all' || o.counterId === selectedCounter));

  const stats = counters.map(counter => {
    const co = filteredOrders.filter(o => o.counterId === counter.id);
    const cash = co.filter(o => o.paymentMethod === 'cash' && o.status === 'completed').reduce((s, o) => s + o.totalAmount, 0);
    const online = co.filter(o => o.paymentMethod === 'wallet' && o.status === 'completed').reduce((s, o) => s + o.totalAmount, 0);
    const delivered = co.filter(o => o.status === 'completed').length;
    const pending = co.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length;
    return { id: counter.id, name: counter.name, cash, online, total: cash + online, delivered, pending };
  }).filter(s => (selectedCounter === 'all' || s.id === selectedCounter) && s.name.toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { label: 'Total Revenue', value: `₹ ${stats.reduce((a, s) => a + s.total, 0).toLocaleString()}`, icon: Wallet, cls: 'text-emerald-700 bg-emerald-50' },
    { label: 'Cash', value: `₹ ${stats.reduce((a, s) => a + s.cash, 0).toLocaleString()}`, icon: IndianRupee, cls: 'text-orange-600 bg-orange-50' },
    { label: 'Online', value: `₹ ${stats.reduce((a, s) => a + s.online, 0).toLocaleString()}`, icon: Wallet, cls: 'text-indigo-600 bg-indigo-50' },
    { label: 'Completed', value: stats.reduce((a, s) => a + s.delivered, 0), icon: ShoppingBag, cls: 'text-blue-700 bg-blue-50' },
    { label: 'Pending', value: stats.reduce((a, s) => a + s.pending, 0), icon: TrendingUp, cls: 'text-amber-700 bg-amber-50' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', k.cls)}>
              <k.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">{k.label}</p>
              <p className="text-base font-semibold text-foreground tabular-nums mt-0.5">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <input type="text" placeholder="Search counter…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 h-10 pr-4 text-sm border border-border/60 rounded-lg bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <select value={selectedCounter} onChange={e => setSelectedCounter(e.target.value)}
            className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground focus:outline-none shrink-0">
            <option value="all">All Counters</option>
            {counters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-md hover:bg-emerald-100 transition-colors">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 rounded-md hover:bg-blue-100 transition-colors">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200/60 rounded-md hover:bg-red-100 transition-colors">
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-5 py-2.5">Counter</th>
                <th className="px-5 py-2.5">Cash</th>
                <th className="px-5 py-2.5">Online</th>
                <th className="px-5 py-2.5">Total</th>
                <th className="px-5 py-2.5 text-center">Completed</th>
                <th className="px-5 py-2.5 text-center">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {stats.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No data for selected filters.</td></tr>
              ) : stats.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{s.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground tabular-nums">₹ {s.cash.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground tabular-nums">₹ {s.online.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-emerald-700 tabular-nums">₹ {s.total.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-5 min-w-[24px] px-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full tabular-nums">{s.delivered}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-5 min-w-[24px] px-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full tabular-nums">{s.pending}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            {stats.length > 0 && (
              <tfoot className="border-t border-border/60 bg-muted/10 text-xs font-semibold text-foreground">
                <tr>
                  <td className="px-5 py-3">Grand Total</td>
                  <td className="px-5 py-3 text-emerald-700 tabular-nums">₹ {stats.reduce((a, s) => a + s.cash, 0).toFixed(2)}</td>
                  <td className="px-5 py-3 text-indigo-700 tabular-nums">₹ {stats.reduce((a, s) => a + s.online, 0).toFixed(2)}</td>
                  <td className="px-5 py-3 text-primary tabular-nums">₹ {stats.reduce((a, s) => a + s.total, 0).toFixed(2)}</td>
                  <td className="px-5 py-3 text-center tabular-nums">{stats.reduce((a, s) => a + s.delivered, 0)}</td>
                  <td className="px-5 py-3 text-center tabular-nums">{stats.reduce((a, s) => a + s.pending, 0)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
