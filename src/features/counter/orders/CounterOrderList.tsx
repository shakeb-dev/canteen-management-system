import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCounterStore } from '../../../store/useCounterStore';
import {
  Clock, ChefHat, CheckCircle, Package,
  Search, ShoppingBag, ArrowRight, RotateCcw, X, ShieldCheck
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useState } from 'react';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';
import { Button, playHoverSound, playClickSound } from '../../../components/ui/Button';
import { toast } from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; icon: any; pill: string; next?: string; prev?: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        pill: 'bg-amber-50 text-amber-700 border-amber-200/60',    next: 'preparing' },
  preparing: { label: 'Cooking',   icon: ChefHat,      pill: 'bg-blue-50 text-blue-700 border-blue-200/60',       next: 'ready',     prev: 'pending' },
  ready:     { label: 'Ready',     icon: CheckCircle,  pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', next: 'completed', prev: 'preparing' },
  completed: { label: 'Delivered', icon: Package,      pill: 'bg-muted text-muted-foreground border-border/40',   prev: 'ready' },
};

const NEXT_LABEL: Record<string, string> = {
  preparing: 'Start Cooking',
  ready: 'Mark Ready',
  completed: 'Deliver',
};

export default function CounterOrderList() {
  const { orders, updateStatus } = useOrderStore();
  const { user } = useAuthStore();
  const { counters } = useCounterStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [otpModalOrder, setOtpModalOrder] = useState<{ id: string; employeeName: string } | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  const myCounter = counters.find(c => c.managerId === user?.id || c.managerId === user?.username);

  const filtered = orders.filter(o => {
    const isToday = dayjs(o.createdAt).isSame(dayjs(), 'day');
    const isMyCounter = o.counterId === myCounter?.id;
    const matchSearch = o.employeeName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return isToday && isMyCounter && matchSearch && matchStatus;
  });

  const handleUpdate = (id: string, current: string) => {
    const next = STATUS_CONFIG[current].next;
    if (!next) return;
    if (next === 'completed') {
      const order = orders.find(o => o.id === id);
      setOtpModalOrder({ id, employeeName: order?.employeeName || 'Employee' });
      setOtpInput('');
      setOtpError(false);
      playClickSound();
      return;
    }
    playClickSound();
    updateStatus(id, next as any);
    toast.success(`Order #${id.slice(-4)} → ${next}`);
  };

  const handleVerifyOTP = () => {
    if (otpInput === '1234') {
      if (otpModalOrder) {
        updateStatus(otpModalOrder.id, 'completed');
        toast.success(`Delivered to ${otpModalOrder.employeeName}`);
        setOtpModalOrder(null);
        playClickSound();
      }
    } else {
      setOtpError(true);
      toast.error('Invalid OTP. Try again.');
    }
  };

  const handleRevert = (id: string, current: string) => {
    const prev = STATUS_CONFIG[current].prev;
    if (prev) {
      playClickSound();
      updateStatus(id, prev as any);
      toast.error(`Reverted to ${prev}`);
    }
  };

  // Summary counts
  const pending   = filtered.filter(o => o.status === 'pending').length;
  const preparing = filtered.filter(o => o.status === 'preparing').length;
  const ready     = filtered.filter(o => o.status === 'ready').length;
  const done      = filtered.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Order Management"
        subtitle={`Live operations — ${myCounter?.name || 'Assigned Counter'}`}
      />

      {/* Status summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending',   value: pending,   dot: 'bg-amber-500',            text: 'text-amber-700' },
          { label: 'Cooking',   value: preparing, dot: 'bg-blue-500',             text: 'text-blue-700' },
          { label: 'Ready',     value: ready,     dot: 'bg-emerald-500',          text: 'text-emerald-700' },
          { label: 'Delivered', value: done,      dot: 'bg-muted-foreground/40',  text: 'text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className={cn('h-2 w-2 rounded-full shrink-0', s.dot)} />
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <p className={cn('text-xl font-semibold tabular-nums', s.text)}>{s.value}</p>
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
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground focus:outline-none flex-1 lg:flex-none"
            >
              <option value="all">All Orders</option>
              {Object.entries(STATUS_CONFIG).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
            <span className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
              <ShoppingBag className="h-3.5 w-3.5 opacity-60" />
              {filtered.length} today
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-5 py-2.5">Order</th>
                <th className="px-5 py-2.5">Employee</th>
                <th className="px-5 py-2.5">Items</th>
                <th className="px-5 py-2.5 text-right">Amount</th>
                <th className="px-5 py-2.5 text-center">Status</th>
                <th className="px-5 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="h-8 w-8 opacity-20" />
                      <p className="text-sm">No orders for today yet</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} onMouseEnter={playHoverSound} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-sm font-mono font-semibold text-foreground">#{order.id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{dayjs(order.createdAt).format('hh:mm A')}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          {order.employeeName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground truncate max-w-[140px]">{order.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{item.quantity}×</span> {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">₹ {order.totalAmount}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{order.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                        cfg.pill
                      )}>
                        <Icon className="h-3 w-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {cfg.prev && (
                          <button
                            onMouseEnter={playHoverSound}
                            onClick={() => handleRevert(order.id, order.status)}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                            title="Revert"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {cfg.next ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdate(order.id, order.status)}
                            className="h-8 px-3 text-xs font-medium gap-1.5"
                          >
                            {NEXT_LABEL[cfg.next] ?? cfg.next} <ArrowRight className="h-3 w-3" />
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle className="h-3 w-3" /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Verify Delivery</h3>
                  <p className="text-xs text-muted-foreground">{otpModalOrder.employeeName}</p>
                </div>
              </div>
              <button
                onClick={() => setOtpModalOrder(null)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground text-center">Enter the OTP provided by the employee to confirm pickup.</p>
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={e => { setOtpInput(e.target.value.replace(/\D/g, '')); setOtpError(false); }}
                placeholder="• • • •"
                className={cn(
                  "w-full h-16 text-center text-3xl font-semibold tracking-[0.5em] rounded-xl border-2 bg-muted/20 outline-none transition-colors",
                  otpError
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-border focus:border-primary focus:bg-background"
                )}
              />
              <p className="text-xs text-center text-muted-foreground/50">Demo OTP: <span className="text-primary font-medium select-all">1234</span></p>
              <Button
                onClick={handleVerifyOTP}
                disabled={otpInput.length !== 4}
                className="w-full h-10 text-sm font-medium"
              >
                Confirm Delivery
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
