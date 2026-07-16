import { useState } from 'react';
import { useCartStore } from '../../../store/useCartStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCanteenStore } from '../../../store/useCanteenStore';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { useCounterStore } from '../../../store/useCounterStore';
import { Button, playClickSound } from '../../../components/ui/Button';
import { ShoppingCart, Plus, Minus, ShoppingBag, IndianRupee, ShieldCheck, ChevronDown, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import type { Order } from '../../../types';
import { cn } from '../../../utils/cn';
import { PageHeader } from '../../../components/ui/PageHeader';

export default function Cart() {
  const { items, canteenId, removeItem, updateQuantity, clearCart, totalAmount: subtotal } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { user } = useAuthStore();
  const { canteens } = useCanteenStore();
  const { employees } = useEmployeeStore();
  const { counters } = useCounterStore();
  const navigate = useNavigate();

  const [selectedCounterId, setSelectedCounterId] = useState<string>('');

  const canteen = canteens.find((c) => c.id === canteenId);
  const employee = employees.find((e) => e.username === user?.username || e.id === user?.id);
  const availableCounters = counters.filter(c => c.isActive);

  const TAX_RATE = 0.05;
  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const grandTotal = subtotal + taxAmount;

  const handlePlaceOrder = (method: 'wallet' | 'cash') => {
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    if (!selectedCounterId) {
      toast.error('Please select a Counter for pickup');
      return;
    }

    playClickSound();

    if (method === 'wallet' && employee && employee.walletBalance < grandTotal) {
      toast.error('Insufficient wallet balance');
      return;
    }

    const selectedCounter = counters.find(c => c.id === selectedCounterId);

    Swal.fire({
      title: 'Confirm Kitchen Order',
      html: `
        <div class="text-left space-y-2 p-2">
          <div class="flex items-center gap-2 text-primary font-black uppercase text-[12px] mb-2">
            <i class="lucide-store h-3 w-3"></i> Pickup at: ${selectedCounter?.name}
          </div>
          <div class="flex justify-between text-sm"><span>Subtotal:</span> <b>Rs. ${subtotal}</b></div>
          <div class="flex justify-between text-sm"><span>Tax (5%):</span> <b>Rs. ${taxAmount}</b></div>
          <div class="flex justify-between text-lg border-t pt-2 mt-2"><span>Grand Total:</span> <b>Rs. ${grandTotal}</b></div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      confirmButtonText: 'Place Order Now',
      cancelButtonText: 'Wait, I need more',
    }).then((res) => {
      if (res.isConfirmed) {
        const orderPayload: Omit<Order, 'id' | 'createdAt'> = {
          employeeId: user?.id ?? '',
          employeeName: user?.name ?? '',
          canteenId: canteenId ?? '',
          canteenName: canteen?.name ?? '',
          counterId: selectedCounterId,
          counterName: selectedCounter?.name ?? '',
          items: items.map((i) => ({ foodItemId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          totalAmount: grandTotal,
          paymentMethod: method,
          status: 'pending',
        };
        const orderId = placeOrder(orderPayload);
        clearCart();
        toast.success(`Order #${orderId.slice(-4)} placed successfully!`);
        navigate('/employee/orders');
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground animate-fade-in">
        <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center border border-dashed border-border/60">
          <ShoppingCart className="h-10 w-10 opacity-20" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter">Your cart is empty</h2>
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-60">Explore our culinary destinations.</p>
        <Button onClick={() => { playClickSound(); navigate('/employee/counters'); }} className="gap-2 mt-4 h-12 px-8">
          <ShoppingBag className="h-4 w-4" /> Start Browsing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in pb-12">
      <PageHeader
        title="Cart Checkout"
        subtitle="Confirm your items, pickup counter and payment before placing the order."
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-xl shadow-sm p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Pickup Counter</p>
                <h3 className="text-sm font-semibold text-foreground mt-1 truncate">Select where you will pick up</h3>
              </div>
              <Button
                variant="secondary"
                onClick={() => { playClickSound(); navigate('/employee/counters'); }}
                className="h-8 px-3 text-[10px] font-semibold uppercase tracking-widest"
              >
                Change Counter
              </Button>
            </div>

            <div className="relative mt-2">
              <select
                value={selectedCounterId}
                onChange={(e) => { playClickSound(); setSelectedCounterId(e.target.value); }}
                className={cn(
                  'w-full h-9 rounded-lg border px-3 text-xs outline-none appearance-none cursor-pointer transition-all bg-background',
                  selectedCounterId ? 'border-primary ring-1 ring-primary/30' : 'border-border/60 hover:border-primary/40'
                )}
              >
                <option value="">Select a counter for pickup</option>
                {availableCounters.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - Active Now</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
            {!selectedCounterId && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 mt-1">Required before checkout</p>
            )}
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Cart Items</p>
              <button
                onClick={() => { playClickSound(); navigate('/employee/menu'); }}
                className="h-7 px-3 rounded-md bg-primary text-white hover:bg-indigo-700 transition-colors text-[10px] font-semibold uppercase tracking-widest inline-flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add More Items
              </button>
            </div>
            <div className="divide-y divide-border/30">
              {items.map((item) => (
                <div key={item.cartItemId} className="p-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">Rs. {item.price} each</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { playClickSound(); removeItem(item.cartItemId); }}
                        className="h-7 px-2 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 p-1 border border-primary/20">
                      <button
                        onClick={() => {
                          playClickSound();
                          if (item.quantity <= 1) {
                            removeItem(item.cartItemId);
                          } else {
                            updateQuantity(item.cartItemId, item.quantity - 1);
                          }
                        }}
                        className="h-7 w-7 rounded-md bg-background flex items-center justify-center text-muted-foreground shadow-sm hover:bg-primary hover:text-white transition-all"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-foreground tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => { playClickSound(); updateQuantity(item.cartItemId, item.quantity + 1); }}
                        className="h-7 w-7 rounded-md bg-primary text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 mt-2 border-t border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Item total</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="bg-card border border-border/50 rounded-xl shadow-sm p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Pickup counter</p>
                <p className="text-sm font-semibold text-foreground truncate max-w-[180px] text-right">{canteen?.name || 'Kitchen Hub'}</p>
              </div>
              <div className="h-px bg-border/40" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Items in cart</p>
                <p className="text-sm font-semibold text-foreground tabular-nums">{items.length}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Subtotal</p>
                <p className="text-sm font-semibold text-foreground tabular-nums">Rs. {subtotal}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl shadow-sm p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
                <span>Tax (5%)</span>
                <span className="tabular-nums">Rs. {taxAmount}</span>
              </div>
            </div>

            <div className="h-px bg-border/40" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-foreground">Total Amount</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Inclusive of taxes</p>
              </div>
              <p className="text-3xl font-bold text-primary tabular-nums">Rs. {grandTotal}</p>
            </div>

            {employee && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
                  <ShieldCheck className="h-4 w-4" /> Wallet Balance
                </div>
                <p className="text-sm font-semibold text-emerald-700 tabular-nums">Rs. {employee.walletBalance}</p>
              </div>
            )}

            <div className="grid gap-3">
              <button
                disabled={!selectedCounterId}
                onClick={() => handlePlaceOrder('cash')}
                className={cn(
                  'flex items-center justify-center gap-2 h-12 rounded-lg border text-sm font-semibold uppercase tracking-widest transition-all active:scale-95',
                  !selectedCounterId ? 'bg-muted cursor-not-allowed border-border/40 text-muted-foreground' : 'border-border/60 hover:border-primary hover:bg-primary/5'
                )}
              >
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Pay Cash
              </button>
              <button
                disabled={!selectedCounterId}
                onClick={() => handlePlaceOrder('wallet')}
                className={cn(
                  'flex items-center justify-center gap-2 h-12 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all active:scale-95',
                  !selectedCounterId ? 'bg-muted cursor-not-allowed text-muted-foreground' : 'bg-primary text-white hover:bg-indigo-700 shadow-primary/20'
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                Pay Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
