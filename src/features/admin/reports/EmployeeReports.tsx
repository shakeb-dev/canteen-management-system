import { useState } from 'react';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { Search, History, X, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { type ReportFilterProps } from './Reports';

export default function EmployeeReports({ timeFilter, fromDate, toDate }: ReportFilterProps) {
  const { employees } = useEmployeeStore();
  const { orders } = useOrderStore();
  const [search, setSearch] = useState('');
  const [viewingOrders, setViewingOrders] = useState<string | null>(null);

  const filterByTime = (dateStr: string) => {
    const d = new Date(dateStr), now = new Date();
    if (timeFilter === 'daily') return d.toDateString() === now.toDateString();
    if (timeFilter === 'weekly') { const w = new Date(); w.setDate(now.getDate() - 7); return d >= w; }
    if (timeFilter === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (timeFilter === 'custom' && fromDate && toDate) return d >= new Date(fromDate) && d <= new Date(toDate + 'T23:59:59');
    return true;
  };

  const filteredOrders = orders.filter(o => filterByTime(o.createdAt));
  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.uniqueNumber.toLowerCase().includes(search.toLowerCase())
  );
  const selectedEmployee = employees.find(e => e.id === viewingOrders);
  const employeeOrders = filteredOrders.filter(o => o.employeeId === viewingOrders);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <input type="text" placeholder="Search by name or Unique No…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 h-10 pr-4 text-sm border border-border/60 rounded-lg bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-5 py-2.5">Employee</th>
                <th className="px-5 py-2.5">Unique No</th>
                <th className="px-5 py-2.5">Mobile</th>
                <th className="px-5 py-2.5">Email</th>
                <th className="px-5 py-2.5 text-right">Wallet</th>
                <th className="px-5 py-2.5 text-center">Orders</th>
                <th className="px-5 py-2.5 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredEmployees.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No employees found.</td></tr>
              ) : filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground tabular-nums">{emp.uniqueNumber || '—'}</td>
                  <td className="px-5 py-3 text-sm text-foreground">
                    {emp.phone ? <a href={`tel:${emp.phone}`} className="hover:text-primary transition-colors">{emp.phone}</a> : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">
                    {emp.email ? <a href={`mailto:${emp.email}`} className="hover:text-primary transition-colors">{emp.email}</a> : '—'}
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-700 tabular-nums">₹ {emp.walletBalance.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-5 min-w-[24px] px-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full tabular-nums">
                      {filteredOrders.filter(o => o.employeeId === emp.id).length}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      className="inline-flex items-center gap-1.5 h-7 px-3 text-xs font-medium text-muted-foreground border border-border/60 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setViewingOrders(emp.id)}
                    >
                      <History className="h-3 w-3" /> History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order History Modal */}
      {viewingOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selectedEmployee?.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEmployee?.uniqueNumber}</p>
                </div>
              </div>
              <button onClick={() => setViewingOrders(null)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 max-h-[55vh] overflow-y-auto space-y-2.5">
              {employeeOrders.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No orders in this period.</div>
              ) : employeeOrders.map(order => (
                <div key={order.id} className="p-3.5 bg-muted/20 border border-border/40 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{order.id.split('-').slice(-1)[0]}</span>
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    )}>{order.status}</span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map(item => (
                      <div key={item.foodItemId} className="flex justify-between text-xs">
                        <span className="text-muted-foreground"><span className="text-foreground font-medium">{item.quantity}×</span> {item.name}</span>
                        <span className="text-muted-foreground tabular-nums">₹ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30 flex justify-between">
                    <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs font-semibold text-foreground tabular-nums">₹ {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-border/40 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => setViewingOrders(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
