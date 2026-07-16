import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCounterStore } from '../../../store/useCounterStore';
import {
  FileText, FileSpreadsheet, Printer, TrendingUp, Users, ShoppingBag
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { cn } from '../../../utils/cn';
import { playHoverSound, playClickSound } from '../../../components/ui/Button';

export default function CounterReports() {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const { counters } = useCounterStore();
  const [activeTab, setActiveTab] = useState<'sales' | 'staff' | 'items'>('sales');

  const myCounter = counters.find(c => c.managerId === user?.id);
  const myOrders = orders.filter(o => o.counterId === myCounter?.id);

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type.toUpperCase()} report...`);
  };

  // Staff who bought at this counter
  const customers = Array.from(new Set(myOrders.map(o => o.employeeId))).map(empId => {
    const empOrders = myOrders.filter(o => o.employeeId === empId);
    return {
      id: empId,
      name: empOrders[0].employeeName,
      totalOrders: empOrders.length,
      totalSpent: empOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      lastOrderDate: Math.max(...empOrders.map(o => dayjs(o.createdAt).valueOf())),
    };
  }).sort((a, b) => b.totalSpent - a.totalSpent); // Sort by highest spend

  // Items sold at this counter
  const soldItems = myOrders.flatMap(o => o.items).reduce((acc: any, item) => {
    if (!acc[item.foodItemId]) {
      acc[item.foodItemId] = { name: item.name, quantity: 0, revenue: 0 };
    }
    acc[item.foodItemId].quantity += item.quantity;
    acc[item.foodItemId].revenue += (item.quantity * item.price);
    return acc;
  }, {});

  const itemStats = Object.values(soldItems).sort((a: any, b: any) => b.quantity - a.quantity); // Sort by highest quantity

  const tabs = [
    { id: 'sales', label: 'Counter Sales', icon: TrendingUp },
    { id: 'staff', label: 'Staff Purchase', icon: Users },
    { id: 'items', label: 'Food Analytics', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6 animate-fade-in mb-10">
      <PageHeader
        title={`${myCounter?.name || 'Counter'} Analysis`}
        subtitle="Detailed reports of sales, employee purchases, and popular items."
      />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-muted/20 p-1.5 rounded-xl border border-border/40 w-full sm:w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { playClickSound(); setActiveTab(tab.id as any); }}
              onMouseEnter={playHoverSound}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-4 w-4 shrink-0", activeTab === tab.id ? "text-primary" : "opacity-50")} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <button 
            onClick={() => handleExport('excel')} 
            onMouseEnter={playHoverSound}
            title="Export to Excel"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors whitespace-nowrap shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </button>
          <button 
            onClick={() => window.print()} 
            onMouseEnter={playHoverSound}
            title="Print Report"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors whitespace-nowrap shadow-sm"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          <button 
            onClick={() => handleExport('pdf')} 
            onMouseEnter={playHoverSound}
            title="Export to PDF"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/60 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors whitespace-nowrap shadow-sm"
          >
            <FileText className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        {activeTab === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
                <tr>
                  <th className="px-5 py-3">Order Detail</th>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Payment Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {myOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-muted-foreground">No orders found.</td>
                  </tr>
                ) : myOrders.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()).map(o => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors group" onMouseEnter={playHoverSound}>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-sm font-mono font-semibold text-foreground">#{o.id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{dayjs(o.createdAt).format('DD MMM, YYYY · hh:mm A')}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {o.employeeName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{o.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize",
                        o.paymentMethod === 'cash' ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-blue-50 text-blue-700 border border-blue-200/50"
                      )}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-semibold tabular-nums text-foreground">₹ {o.totalAmount}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
                <tr>
                  <th className="px-5 py-3">Staff Member</th>
                  <th className="px-5 py-3">Last Order</th>
                  <th className="px-5 py-3 text-center">Total Orders</th>
                  <th className="px-5 py-3 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-muted-foreground">No customer data.</td>
                  </tr>
                ) : customers.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors group" onMouseEnter={playHoverSound}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-semibold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {dayjs(c.lastOrderDate).format('DD MMM, YYYY')}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-muted/50 text-xs font-semibold text-muted-foreground border border-border/60">
                        {c.totalOrders}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-semibold tabular-nums text-emerald-700">₹ {c.totalSpent}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
                <tr>
                  <th className="px-5 py-3">Food Product</th>
                  <th className="px-5 py-3 text-center">Qty Sold</th>
                  <th className="px-5 py-3 text-right">Net Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {itemStats.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-sm text-muted-foreground">No item analytics available.</td>
                  </tr>
                ) : itemStats.map((item: any, idx) => (
                  <tr key={item.name} className="hover:bg-muted/30 transition-colors" onMouseEnter={playHoverSound}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground/50 w-4">{idx + 1}.</span>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded bg-muted/50 text-xs font-semibold text-muted-foreground border border-border/60">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-semibold tabular-nums text-foreground">₹ {item.revenue}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
