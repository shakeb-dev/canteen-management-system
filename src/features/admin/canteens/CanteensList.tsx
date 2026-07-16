import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Edit2, Power, Store, User, MapPin, ArrowRight, Search } from 'lucide-react';
import { useCanteenStore } from '../../../store/useCanteenStore';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { Input } from '../../../components/ui/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { Canteen } from '../../../types';
import { cn } from '../../../utils/cn';

import { PageHeader } from '../../../components/ui/PageHeader';

export default function CanteensList() {
  const { canteens, updateCanteen, toggleStatus } = useCanteenStore();
  const { employees } = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCanteen, setEditingCanteen] = useState<Canteen | null>(null);
  const [search, setSearch] = useState('');

  const managers = employees.filter(u => u.role === 'canteen_supervisor');

  const filtered = canteens.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<Partial<Canteen>>();

  const openModal = (canteen: Canteen | null = null) => {
    setEditingCanteen(canteen);
    reset(canteen ?? { name: '', managerId: managers[0]?.id || '', isActive: true, location: '' });
    setIsModalOpen(true);
  };

  const onSubmit = (data: Partial<Canteen>) => {
    if (editingCanteen) {
      updateCanteen(editingCanteen.id, data);
      toast.success('Canteen updated');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Canteen Management"
        subtitle="Manage your Canteen location and supervisor."
      />

      {isModalOpen && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-5 mb-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-semibold text-foreground">
              Update Canteen
            </h3>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] font-bold" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-1">
                <Input label="Canteen Name" placeholder="e.g. Skyline" {...register('name')} required className="h-8.5 text-xs" />
              </div>
              <div className="lg:col-span-1">
                <Input label="Location" placeholder="e.g. 4th Floor" {...register('location')} className="h-8.5 text-xs" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Canteen Supervisor</label>
                <div className="relative group">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground z-10" />
                  <select
                    {...register('managerId')}
                    className="input-field pl-8 appearance-none cursor-pointer pr-7 h-[34px] text-xs py-0"
                  >
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    {managers.length === 0 && <option value="">No Managers</option>}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground rotate-90" />
                  </div>
                </div>
              </div>


            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer scale-75 origin-left">
                    <input type="checkbox" {...register('isActive')} className="sr-only peer" defaultChecked={editingCanteen?.isActive ?? true} />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                  <span className="text-sm font-medium text-muted-foreground">Active</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
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
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              className="pl-10 h-10 text-sm bg-background border-border/60 placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/30 rounded-lg"
              placeholder="Search by name or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Count badge */}
          <span className="inline-flex items-center px-3 h-10 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
            {filtered.length} <span className="ml-1 font-normal opacity-60">canteens</span>
          </span>
        </div>

        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No matching canteens found.</div>
          ) : filtered.map((canteen, idx) => {
            const manager = employees.find(u => u.id === canteen.managerId);
            const accentColors = [
              'bg-indigo-600',
              'bg-emerald-600',
              'bg-orange-500',
            ];
            const accent = accentColors[idx % accentColors.length];
            return (
              <div key={canteen.id} className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

                {/* Slim accent strip */}
                <div className={cn('h-1.5 w-full shrink-0', accent)} />

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1 gap-4">

                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('h-8 w-8 rounded-md flex items-center justify-center shrink-0', accent)}>
                        <Store className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground leading-none">{canteen.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{canteen.location || 'No location set'}</p>
                      </div>
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => openModal(canteen)}
                      className="h-7 w-7 flex items-center justify-center rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      title="Edit canteen"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Meta rows */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest leading-none mb-0.5">Supervisor</p>
                        <p className="text-sm text-foreground font-medium leading-none">{manager?.name || <span className="text-muted-foreground italic">Unassigned</span>}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest leading-none mb-0.5">Location</p>
                        <p className="text-sm text-foreground font-medium leading-none truncate max-w-[200px]">{canteen.location || 'Central Wing'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
                    {/* Status pill */}
                    <span className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                      canteen.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    )}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', canteen.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                      {canteen.isActive ? 'Active' : 'Closed'}
                    </span>

                    {/* Toggle */}
                    <button
                      onClick={() => {
                        toggleStatus(canteen.id);
                        toast.success(`${canteen.name} is now ${!canteen.isActive ? 'Active' : 'Closed'}`);
                      }}
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium transition-colors',
                        canteen.isActive ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'
                      )}
                    >
                      <Power className="h-3 w-3" />
                      {canteen.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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




