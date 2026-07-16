import React, { useState } from 'react';
import { useMenuStore } from '../../../store/useMenuStore';
import { useCartStore } from '../../../store/useCartStore';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Search, Star, ShoppingCart, ImageOff,
  Coffee, UtensilsCrossed, Sunset, Cookie
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';
import type { FoodItem } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { playClickSound } from '../../../components/ui/Button';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Sunset,
  snacks: Cookie,
  tea: Coffee,
};

const CATEGORY_COLORS: Record<string, string> = {
  breakfast: 'bg-yellow-500/10 text-yellow-700 border-yellow-300/30',
  lunch: 'bg-green-500/10 text-green-700 border-green-300/30',
  dinner: 'bg-indigo-500/10 text-indigo-700 border-indigo-300/30',
  snacks: 'bg-orange-500/10 text-orange-700 border-orange-300/30',
  tea: 'bg-blue-500/10 text-blue-700 border-blue-300/30',
};

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'tea'] as const;

export default function EmployeeMenu() {
  const { items } = useMenuStore();
  const { addItem, items: cartItems, canteenId: activeCanteenId } = useCartStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || i.category === category;
    return matchSearch && matchCat && i.isEnabled;
  });

  const addToCart = (item: FoodItem) => {
    if (activeCanteenId && activeCanteenId !== item.canteenId) {
      toast.error('Your cart has items from another canteen. Clear it first.');
      return;
    }
    addItem(
      { ...item, cartItemId: `${item.id}-${Date.now()}`, quantity: 1 },
      item.canteenId
    );
    toast.success(`${item.name} added to cart`);
  };

  const isInCart = (id: string) => cartItems.some((c) => c.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Banswara <span className="text-primary">Syntex</span> Menu</h2>
          <p className="text-[12px] text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Add items to your cart and place an order.</p>
        </div>
        <button
          onClick={() => { playClickSound(); navigate('/employee/cart'); }}
          className="relative h-11 w-11 shrink-0 rounded-xl border border-amber-300/70 bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transition-all flex items-center justify-center shadow-md shadow-amber-500/30"
          aria-label="Go to cart"
          title="Go to cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none border-2 border-background tabular-nums shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input className="pl-9" placeholder="Search dishes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const CatIcon = cat !== 'all' ? CATEGORY_ICONS[cat] : null;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all cursor-pointer',
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {CatIcon && <CatIcon className="h-3 w-3" />} {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food of the Day Banner */}
      {filtered.some((i) => i.isFoodOfTheDay) && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 border border-yellow-300/40 p-4 flex items-center gap-4">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-400 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">Food of the Day</p>
            <p className="font-bold text-lg">{filtered.find((i) => i.isFoodOfTheDay)?.name}</p>
            <p className="text-sm text-muted-foreground">{filtered.find((i) => i.isFoodOfTheDay)?.description}</p>
          </div>
          <span className="ml-auto font-bold text-xl text-yellow-700">
            ₹ {filtered.find((i) => i.isFoodOfTheDay)?.price}
          </span>
        </div>
      )}

      {/* Menu Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <ImageOff className="h-12 w-12 opacity-30" />
          <p>No items available for the selected filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const CatIcon = CATEGORY_ICONS[item.category];
            const inCart = isInCart(item.id);
            return (
              <Card
                key={item.id}
                className={cn('group hover:shadow-lg transition-all hover:-translate-y-0.5 relative', item.isFoodOfTheDay && 'ring-2 ring-yellow-400/50')}
              >
                {item.isFoodOfTheDay && (
                  <div className="absolute top-3 right-3 z-10">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                  </div>
                )}
                <CardContent className="p-5 flex flex-col gap-3 h-full">
                  <div className={cn('inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-semibold border capitalize', CATEGORY_COLORS[item.category])}>
                    <CatIcon className="h-3 w-3" /> {item.category}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <span className="text-lg font-bold">₹ {item.price}</span>
                    <Button
                      size="sm"
                      variant={inCart ? 'secondary' : 'primary'}
                      className="gap-1.5"
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {inCart ? 'Add More' : 'Add'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}




