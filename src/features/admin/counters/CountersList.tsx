import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Edit2, Trash2, Power, LayoutPanelLeft, User, MapPin, ArrowRight, Search, Clock } from 'lucide-react';
import { useCounterStore } from '../../../store/useCounterStore';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { Input } from '../../../components/ui/Input';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import type { Counter } from '../../../types';
import { cn } from '../../../utils/cn';
import { PageHeader } from '../../../components/ui/PageHeader';

export default function CountersList() {
  const { counters, addCounter, updateCounter, deleteCounter, toggleStatus } = useCounterStore();
  const { employees } = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [search, setSearch] = useState('');

  const managers = employees.filter(u => u.role === 'counter_manager');

  const filtered = counters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<Partial<Counter>>();

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const openModal = (counter: Counter | null = null) => {
    setEditingCounter(counter);
    reset(counter ?? { name: '', location: '', managerId: '', isActive: true, openTime: '09:00', closeTime: '18:00' });
    setIsModalOpen(true);
  };

  const onSubmit = (data: Partial<Counter>) => {
    if (editingCounter) {
      updateCounter(editingCounter.id, data);
      toast.success('Counter updated successfully');
    } else {
      addCounter({ 
        name: data.name || '', 
        location: data.location || '', 
        managerId: data.managerId || '', 
        isActive: data.isActive ?? true,
        openTime: data.openTime,
        closeTime: data.closeTime
      });
      toast.success('New counter created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCounter(id);
        toast.success('Counter removed');
      }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Counter Management"
        subtitle="Manage and configure sales counters."
        action={
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="h-3.5 w-3.5" /> New Counter
          </Button>
        }
      />

      {isModalOpen && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-5 mb-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-semibold text-foreground">
              {editingCounter ? 'Edit Counter' : 'New Counter'}
            </h3>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] font-bold" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input 
                label="Counter Name" 
                placeholder="e.g. Main Cafe Counter" 
                {...register('name')} 
                required 
                className="h-9 text-xs" 
              />
              <Input 
                label="Location" 
                placeholder="e.g. Ground Floor, North Wing" 
                {...register('location')} 
                required 
                className="h-9 text-xs" 
              />
              
              <div className="space-y-1">
                <label className="text-[12px] font-black text-muted-foreground uppercase tracking-wider">Counter Manager</label>
                <div className="relative group">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10" />
                  <select
                    {...register('managerId')}
                    className="input-field pl-9 appearance-none cursor-pointer pr-8 h-9 text-xs py-0 font-bold"
                  >
                    <option value="">Select Manager</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <ArrowRight className="h-3 w-3 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="w-32">
                <Input 
                  label="Opening Time" 
                  type="time"
                  {...register('openTime')} 
                  required 
                  className="h-9 text-xs" 
                />
              </div>
              <div className="w-32">
                <Input 
                  label="Closing Time" 
                  type="time"
                  {...register('closeTime')} 
                  required 
                  className="h-9 text-xs" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900 mt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer scale-75 origin-left">
                    <input type="checkbox" {...register('isActive')} className="sr-only peer" defaultChecked={editingCounter?.isActive ?? true} />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                  <span className="text-sm font-medium text-muted-foreground">Active</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-900 mt-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  className="h-10 sm:h-8 px-6 text-[12px] font-bold w-full sm:w-auto order-2 sm:order-1" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-10 sm:h-8 px-8 text-[12px] font-black uppercase tracking-widest shadow-indigo-500/10 w-full sm:w-auto order-1 sm:order-2"
                >
                  {editingCounter ? 'Save Changes' : 'Save Counter'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              className="pl-10 h-10 text-sm bg-background border-border/60 placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/30 rounded-lg"
              placeholder="Search by name or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="inline-flex items-center px-3 h-10 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
            {filtered.length} <span className="ml-1 font-normal opacity-60">counters</span>
          </span>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-4 py-2.5 w-10 text-center">#</th>
                <th className="px-4 py-2.5">Counter</th>
                <th className="px-4 py-2.5">Manager</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5 text-center">Hours</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-sm text-muted-foreground">
                    No counters found.
                  </td>
                </tr>
              ) : filtered.map((counter, idx) => {
                const manager = employees.find(u => u.id === counter.managerId);
                const accentCls = idx % 3 === 0 ? 'bg-indigo-600' : idx % 3 === 1 ? 'bg-emerald-600' : 'bg-violet-600';
                return (
                  <tr key={counter.id} className="hover:bg-muted/30 transition-colors group">
                    {/* # */}
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground/50 tabular-nums font-medium">
                      {idx + 1}
                    </td>

                    {/* Counter name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('h-7 w-7 rounded-md flex items-center justify-center shrink-0', accentCls)}>
                          <LayoutPanelLeft className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-none">{counter.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{counter.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        <span className="text-sm text-foreground">{manager?.name || <span className="text-muted-foreground italic">Vacant</span>}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        <span className="text-sm text-foreground truncate max-w-[160px]">{counter.location}</span>
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        <span className="text-sm text-foreground tabular-nums whitespace-nowrap">
                          {counter.openTime ? formatTime(counter.openTime) : '—'} – {counter.closeTime ? formatTime(counter.closeTime) : '—'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                        counter.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      )}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', counter.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                        {counter.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { toggleStatus(counter.id); toast.success(`${counter.name} is now ${!counter.isActive ? 'Active' : 'Closed'}`); }}
                          className={cn('p-1.5 rounded-md text-xs font-medium transition-colors', counter.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50')}
                          title={counter.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => openModal(counter)}
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => handleDelete(counter.id, counter.name)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card fallback */}
        <div className="md:hidden divide-y divide-border/40">
          {filtered.map((counter, idx) => {
            const manager = employees.find(u => u.id === counter.managerId);
            const accentCls = idx % 3 === 0 ? 'bg-indigo-600' : idx % 3 === 1 ? 'bg-emerald-600' : 'bg-violet-600';
            return (
              <div key={counter.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('h-7 w-7 rounded-md flex items-center justify-center shrink-0', accentCls)}>
                      <LayoutPanelLeft className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{counter.name}</p>
                      <p className="text-xs text-muted-foreground">{counter.location}</p>
                    </div>
                  </div>
                  <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', counter.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', counter.isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                    {counter.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border/30 pt-2">
                  <span className="text-xs text-muted-foreground">{manager?.name || 'No manager'}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(counter)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(counter.id, counter.name)} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




