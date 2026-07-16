import { useState } from 'react';
import { useMenuStore } from '../../../store/useMenuStore';
import { Search, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { type ReportFilterProps } from './Reports';

const CATEGORY_COLORS: Record<string, string> = {
  breakfast: 'bg-yellow-50 text-yellow-700',
  lunch:     'bg-green-50 text-green-700',
  dinner:    'bg-indigo-50 text-indigo-700',
  snacks:    'bg-orange-50 text-orange-700',
  tea:       'bg-blue-50 text-blue-700',
};

export default function FoodReports(_props: ReportFilterProps) {
  const { items } = useMenuStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(items.map(i => i.category)));

  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <input type="text" placeholder="Search food products…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 h-10 pr-4 text-sm border border-border/60 rounded-lg bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground focus:outline-none shrink-0">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
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
                <th className="px-5 py-2.5">#</th>
                <th className="px-5 py-2.5">Product</th>
                <th className="px-5 py-2.5">Category</th>
                <th className="px-5 py-2.5">Unit</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No food products found.</td></tr>
              ) : filteredItems.map((product, idx) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-xs text-muted-foreground/50 tabular-nums">{idx + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{product.name}</td>
                  <td className="px-5 py-3">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize', CATEGORY_COLORS[product.category] ?? 'bg-muted text-muted-foreground')}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground capitalize">{product.unitName}</td>
                  <td className="px-5 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                      product.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', product.isEnabled ? 'bg-emerald-500' : 'bg-red-500')} />
                      {product.isEnabled ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-foreground tabular-nums">₹ {product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
