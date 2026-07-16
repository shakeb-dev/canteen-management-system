import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  Plus, Search, Edit2, Trash2, Star,
  Eye, EyeOff, Coffee, UtensilsCrossed, Sunset, Cookie, Package, 
} from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { useMenuStore } from '../../../store/useMenuStore';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import type { FoodItem } from '../../../types';
import { cn } from '../../../utils/cn';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useAuthStore } from '../../../store/useAuthStore';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Sunset,
  snacks: Cookie,
  tea: Coffee,
};

const CATEGORY_COLORS: Record<string, string> = {
  breakfast: 'bg-yellow-500/10 text-yellow-700',
  lunch: 'bg-green-500/10 text-green-700',
  dinner: 'bg-indigo-500/10 text-indigo-700',
  snacks: 'bg-orange-500/10 text-orange-700',
  tea: 'bg-blue-500/10 text-blue-700',
};

export default function MenuList() {
  const { items, addItem, updateItem, deleteItem, toggleEnabled, toggleFoodOfDay } = useMenuStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { register, handleSubmit, reset } = useForm<Partial<FoodItem>>();

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.shortCode.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || i.category === filterCategory;
    return matchSearch && matchCat;
  });

  const openModal = (item: FoodItem | null = null) => {
    setEditingItem(item);
    reset(item ?? {
      name: '',
      price: 0,
      category: 'lunch',
      unitName: 'Plate',
      shortCode: '',
      isFoodOfTheDay: false,
      isEnabled: true,
      canteenId: user?.canteenId || '1'
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: Partial<FoodItem>) => {
    const finalData = {
      ...data,
      price: Number(data.price),
      canteenId: user?.canteenId || '1' // Force user's canteen or default
    };

    if (editingItem) {
      updateItem(editingItem.id, finalData);
      toast.success('Product updated');
    } else {
      addItem({ ...finalData, isFoodOfTheDay: false, isEnabled: true } as Omit<FoodItem, 'id'>);
      toast.success('Product added to inventory');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Remove Item?',
      text: 'This item will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete!',
    }).then((res) => {
      if (res.isConfirmed) {
        deleteItem(id);
        toast.success('Product deleted');
      }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Manage Food Items"
        subtitle="Manage food items available in the canteen."
        action={
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="h-3.5 w-3.5" /> Add Item
          </Button>
        }
      />

      {isModalOpen && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">
                {editingItem ? 'Update Item Details' : 'Add New Item'}
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Item Name" placeholder="e.g. Masala Dosa" {...register('name')} required />
              <Input label="Short Code" placeholder="e.g. MD-101" {...register('shortCode')} required />

              <div className="space-y-1.5">
                <label className="label-text text-[12px] uppercase font-black text-muted-foreground tracking-widest">Category Name</label>
                <select
                  {...register('category')}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                  <option value="tea">Tea & Coffee</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Unit Name" placeholder="e.g. Plate, Bowl, Glass" {...register('unitName')} required />
              <Input label="Sale Price" type="number" step="0.01" placeholder="0.00" {...register('price', { valueAsNumber: true })} required />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Discard</Button>
              <Button type="submit" className="shadow-indigo-500/20 px-8">
                {editingItem ? 'Save Changes' : 'Confirm Registration'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border/50 flex flex-col lg:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              className="pl-10 h-10 text-sm bg-background border-border/60 placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/30 rounded-lg"
              placeholder="Search by name or short code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 text-sm bg-background border border-border/60 rounded-lg px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORY_ICONS).map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <span className="inline-flex items-center px-3 h-10 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
              {filtered.length} <span className="ml-1 font-normal opacity-60">items</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-5 py-2.5">Item</th>
                <th className="px-5 py-2.5">Code</th>
                <th className="px-5 py-2.5">Category</th>
                <th className="px-5 py-2.5 text-center">Unit</th>
                <th className="px-5 py-2.5 text-right">Price</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground  text-xs">The inventory is currently empty.</td>
                </tr>
              ) : filtered.map((item) => {
                const CatIcon = CATEGORY_ICONS[item.category] || Package;
                return (
                  <tr key={item.id} className={cn('transition-colors group hover:bg-muted/30', !item.isEnabled && 'opacity-50')}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                          item.isFoodOfTheDay ? "bg-yellow-50 text-yellow-600" : "bg-muted text-muted-foreground"
                        )}>
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            {item.name}
                            {item.isFoodOfTheDay && <Star className="h-3 w-3 fill-current text-yellow-500" />}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-mono text-foreground tabular-nums">{item.shortCode}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize', CATEGORY_COLORS[item.category])}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-sm text-foreground capitalize">{item.unitName}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-foreground tabular-nums">₹ {item.price.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                        item.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      )}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', item.isEnabled ? 'bg-emerald-500' : 'bg-red-500')} />
                        {item.isEnabled ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className={cn("p-1.5 rounded-lg transition-all", item.isFoodOfTheDay ? "text-yellow-600 bg-yellow-500/10 shadow-inner" : "text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-600")}
                          title="Set Special Choice"
                          onClick={() => { toggleFoodOfDay(item.id); toast.success(item.isFoodOfTheDay ? 'Removed special status' : 'Set as special choice'); }}
                        >
                          <Star className={cn("h-4 w-4", item.isFoodOfTheDay && "fill-current")} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-all active:scale-95"
                          title={item.isEnabled ? 'Hide Product' : 'Show Product'}
                          onClick={() => { toggleEnabled(item.id); toast.success(item.isEnabled ? 'Hidden from users' : 'Now live for users'); }}
                        >
                          {item.isEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-all active:scale-95" title="Edit Product" onClick={() => openModal(item)}>
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all active:scale-95"
                          title="Delete Product" onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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




