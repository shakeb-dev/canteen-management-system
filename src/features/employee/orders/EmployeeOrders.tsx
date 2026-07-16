import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Button, playClickSound, playHoverSound } from '../../../components/ui/Button';
import { ClipboardList, ChefHat, CheckCircle, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '../../../utils/cn';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { PageHeader } from '../../../components/ui/PageHeader';

dayjs.extend(relativeTime);

const STATUS_STEPS = [
  { id: 'pending', label: 'Ordered', icon: ShoppingBag, color: 'text-yellow-600' },
  { id: 'preparing', label: 'Cooking', icon: ChefHat, color: 'text-blue-600' },
  { id: 'ready', label: 'Ready', icon: CheckCircle, color: 'text-green-600' },
  { id: 'completed', label: 'Delivered', icon: Package, color: 'text-muted-foreground' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-300/30',
  preparing: 'bg-blue-500/10 text-blue-700 border-blue-300/30',
  ready: 'bg-green-500/10 text-green-600 border-green-300/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

export default function EmployeeOrders() {
  const { orders, cancelOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const myOrders = orders
    .filter((o) => o.employeeName === user?.name || o.employeeId === user?.id)
    .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

  if (myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground animate-fade-in">
        <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center border border-dashed border-border/60">
          <ClipboardList className="h-10 w-10 opacity-20" />
        </div>
        <h2 className="text-xl font-semibold uppercase tracking-widest">No orders yet</h2>
        <p className="text-[11px] font-medium uppercase tracking-widest opacity-70">Your kitchen journey starts here.</p>
        <Button onClick={() => { playClickSound(); navigate('/employee/menu'); }} className="gap-2 mt-4 h-10 px-6">
          <ShoppingBag className="h-4 w-4" /> Start Ordering
        </Button>
      </div>
    );
  }

  const handleCancel = (id: string) => {
    playClickSound();
    Swal.fire({
      title: 'Cancel Order?',
      text: 'Funds will be returned to your wallet.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, cancel it',
    }).then((res) => {
      if (res.isConfirmed) {
        cancelOrder(id);
        toast.success('Order cancelled successfully');
      }
    });
  };

  const getStepIndex = (status: string) => STATUS_STEPS.findIndex((s) => s.id === status);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Order Tracking"
        subtitle={`${myOrders.length} recent orders`}
      />

      <div className="space-y-4">
        {myOrders.map((order) => {
          const currentIndex = getStepIndex(order.status);

          return (
            <div
              key={order.id}
              onMouseEnter={playHoverSound}
              className={cn(
                'bg-card border rounded-xl shadow-sm overflow-hidden transition-colors hover:bg-muted/10',
                order.status === 'ready' ? 'border-green-300/60' : 'border-border/50'
              )}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-foreground uppercase tracking-widest">Ref: #{order.id.slice(-6).toUpperCase()}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border tracking-widest leading-none', STATUS_STYLES[order.status])}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                        {order.canteenName} | {dayjs(order.createdAt).format('hh:mm A')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Amount</p>
                      <p className="text-xl font-semibold text-foreground tabular-nums">Rs. {order.totalAmount}</p>
                    </div>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="h-9 px-3 text-[10px] font-semibold uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all active:scale-95 border border-red-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative mb-7 max-w-2xl mx-auto">
                  <div className="absolute top-[18px] left-[18px] right-[18px] -translate-y-1/2 z-0">
                    <div className="relative w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-start">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPast = idx < currentIndex;
                      const isCurrent = idx === currentIndex;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <div
                            className={cn(
                              'h-9 w-9 rounded-full flex items-center justify-center transition-all duration-500 border-2 relative z-20',
                              isPast ? 'bg-primary border-primary text-white' :
                              isCurrent ? 'bg-white border-primary text-primary shadow-[0_0_20px_rgba(0,75,141,0.2)]' :
                              'bg-white border-muted/60 text-muted-foreground/40'
                            )}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <div className="mt-3 flex flex-col items-center">
                            <span
                              className={cn(
                                'text-[10px] font-semibold uppercase tracking-widest transition-all duration-500 text-center',
                                isCurrent ? 'text-primary' : isPast ? 'text-foreground opacity-60' : 'text-muted-foreground opacity-40'
                              )}
                            >
                              {step.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-muted/20 rounded-xl p-3 flex flex-wrap gap-2 border border-border/30">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-border/40 shadow-sm">
                      <span className="text-[11px] font-semibold text-foreground uppercase tracking-widest">{item.name}</span>
                      <span className="h-1 w-1 bg-border rounded-full" />
                      <span className="text-[11px] font-semibold text-primary">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.status === 'ready' && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest block opacity-90">Your order is ready for pickup</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold uppercase opacity-70">Pickup OTP:</span>
                          <span className="px-3 py-0.5 bg-white text-emerald-600 rounded-md text-sm font-bold tracking-[0.2em] shadow-sm">1234</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 opacity-40" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
