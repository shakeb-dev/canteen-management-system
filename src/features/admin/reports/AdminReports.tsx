import { useOrderStore } from '../../../store/useOrderStore';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  ShoppingBag, TrendingUp, Wallet,
  CheckCircle, Clock, ChefHat, Package, IndianRupee,
  Calendar, Layers, Filter, FileText, FileSpreadsheet, Printer
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-500/10 text-yellow-700',
  preparing: 'bg-blue-500/10 text-blue-700',
  ready:     'bg-emerald-500/10 text-emerald-600',
  completed: 'bg-muted text-muted-foreground',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:   Clock,
  preparing: ChefHat,
  ready:     CheckCircle,
  completed: Package,
};

export default function AdminReports() {
  const { orders, updateStatus } = useOrderStore();

  const todayOrders = orders.filter((o) => dayjs(o.createdAt).isSame(dayjs(), 'day'));
  const totalRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const walletRevenue = todayOrders.filter((o) => o.paymentMethod === 'wallet').reduce((acc, o) => acc + o.totalAmount, 0);
  const cashRevenue = totalRevenue - walletRevenue;

  const stats = [
    { label: "Revenue", sub: "Today's Gross", value: `₹ ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
    { label: 'Wallet Payments', sub: 'Digital Volume', value: `₹ ${walletRevenue.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Cash Flow', sub: 'Liquid Revenue', value: `₹ ${cashRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Total Volume', sub: 'Processed Orders', value: todayOrders.length, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Intelligence & Reports</h2>
          <p className="text-muted-foreground mt-2 font-medium">Real-time oversight of financial and operational performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" className="rounded-2xl h-11 px-5 border-none bg-muted/60 hover:bg-muted font-bold text-xs uppercase tracking-widest gap-2">
            <Calendar className="h-4 w-4" /> Today
          </Button>
          <div className="flex items-center gap-2">
            <button 
              title="Export to Excel" 
              className="flex items-center gap-2 px-4 h-11 bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 rounded-2xl hover:bg-emerald-500/20 transition-all shadow-sm text-[11px] font-black uppercase tracking-widest"
            >
              <FileSpreadsheet className="h-4 w-4" /> <span>Excel</span>
            </button>
            <button 
              title="Print Report" 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 h-11 bg-blue-500/10 text-blue-600 border border-blue-500/10 rounded-2xl hover:bg-blue-500/20 transition-all shadow-sm text-[11px] font-black uppercase tracking-widest"
            >
              <Printer className="h-4 w-4" /> <span>Print</span>
            </button>
            <button 
              title="Export to PDF" 
              className="flex items-center gap-2 px-4 h-11 bg-red-500/10 text-red-600 border border-red-500/10 rounded-2xl hover:bg-red-500/20 transition-all shadow-sm text-[11px] font-black uppercase tracking-widest"
            >
              <FileText className="h-4 w-4" /> <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-xl shadow-black/5 hover:shadow-black/10 transition-all rounded-[2rem]">
            <CardContent className="p-8">
              <div className={cn('p-4 rounded-2xl w-fit mb-6 shadow-sm', s.bg, s.color)}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{s.label}</p>
                <p className="text-3xl font-black tracking-tighter mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Visualization Section (Placeholder for Tables) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Layers className="h-6 w-6 text-primary" /> Live Order Stream
           </h3>
           <div className="flex items-center gap-2">
              <div className="bg-muted/50 p-1.5 rounded-xl border border-border/50 flex gap-1">
                 <button className="px-4 py-1.5 rounded-lg bg-background shadow-sm text-xs font-bold text-primary cursor-pointer">Live</button>
                 <button className="px-4 py-1.5 rounded-lg hover:bg-background/50 text-xs font-bold text-muted-foreground cursor-pointer transition-all">Historical</button>
              </div>
              <Button variant="secondary" size="sm" className="rounded-xl h-10 w-10 p-0 border-none bg-muted/50">
                 <Filter className="h-4 w-4" />
              </Button>
           </div>
        </div>

        <Card className="border-none shadow-xl shadow-black/5 rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-[14px] text-muted-foreground uppercase bg-muted/30 border-b border-border/50 font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">System ID</th>
                    <th className="px-8 py-5">Personnel</th>
                    <th className="px-8 py-5">Source Node</th>
                    <th className="px-8 py-5">Items Manifest</th>
                    <th className="px-8 py-5">Fiscal Impact</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Lifecycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-20 opacity-30  font-medium">No order data available for processing.</td>
                    </tr>
                  ) : orders.map((order) => {
                    const StatusIcon = STATUS_ICONS[order.status] || Package;
                    const nextStatusMap: Record<string, string> = {
                      pending: 'preparing',
                      preparing: 'ready',
                      ready: 'completed',
                      completed: '',
                    };
                    const next = nextStatusMap[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                        <td className="px-8 py-5 font-mono text-[14px] font-black tracking-widest text-primary/70">#{order.id.split('-').slice(-1)[0]}</td>
                        <td className="px-8 py-5">
                           <p className="font-bold text-foreground group-hover:text-primary transition-colors">{order.employeeName}</p>
                           <p className="text-[14px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{dayjs(order.createdAt).format('HH:mm')}</p>
                        </td>
                        <td className="px-8 py-5 text-sm font-black uppercase text-muted-foreground">{order.canteenName}</td>
                        <td className="px-8 py-5">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {order.items.map((i, idx) => (
                              <span key={idx} className="bg-muted/50 rounded-lg px-2 py-1 text-[14px] font-bold border border-border/30 whitespace-nowrap">
                                {i.name} <span className="text-primary">×{i.quantity}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-black text-lg  tracking-tighter text-foreground">₹ {order.totalAmount}</td>
                        <td className="px-8 py-5">
                          <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[14px] font-black uppercase tracking-wider', STATUS_STYLES[order.status])}>
                            <StatusIcon className="h-3 w-3" /> {order.status}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {next ? (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="rounded-xl h-9 px-4 font-black uppercase text-[14px] tracking-widest hover:bg-primary hover:text-white border-transparent"
                              onClick={(e) => { e.stopPropagation(); updateStatus(order.id, next as any); }}
                            >
                              Fulfill {next}
                            </Button>
                          ) : (
                            <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto opacity-50" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




