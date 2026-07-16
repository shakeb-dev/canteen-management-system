import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  Search, Wallet, PlusCircle
} from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import toast from 'react-hot-toast';
import type { Employee } from '../../../types';
import { PageHeader } from '../../../components/ui/PageHeader';

export default function EmployeesList() {
  const { employees, rechargeWallet } = useEmployeeStore();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletEmp, setWalletEmp] = useState<Employee | null>(null);
  const [rechargeAmt, setRechargeAmt] = useState('');
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const walletPanelRef = useRef<HTMLDivElement>(null);

  const openWalletPanel = (emp: Employee) => {
    setWalletEmp(emp);
    setIsWalletOpen(true);
    setTimeout(() => {
      walletPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const filtered = employees.filter(
    (e) =>
      (e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase())) &&
      (genderFilter === 'all' || e.gender === genderFilter)
  );

  const handleWalletRecharge = () => {
    const amt = Number(rechargeAmt);
    if (!walletEmp || isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    rechargeWallet(walletEmp.id, amt);
    toast.success(`₹ ${amt} added to ${walletEmp.name}'s wallet`);
    setIsWalletOpen(false);
    setRechargeAmt('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Employees List"
        subtitle="Manage Employees and their wallet balances."
      />

      {isWalletOpen && (
        <div ref={walletPanelRef} className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl shadow-lg p-6 mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-50 leading-none">Recharge Wallet</h3>
                <p className="text-xs text-emerald-700/60 font-medium mt-1">Adding funds for {walletEmp?.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-emerald-500/10" onClick={() => setIsWalletOpen(false)}>
              Close
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full space-y-4">
              <Input
                label="Amount to Add (₹ )"
                type="number"
                placeholder="0.00"
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
                min={1}
                className="text-lg font-bold tracking-tight h-12"
              />
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmt(String(amt))}
                    className="py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-[12px] font-bold bg-white dark:bg-emerald-900/40 hover:bg-emerald-500 hover:text-white transition-all uppercase"
                  >
                    +₹ {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button type="button" variant="secondary" onClick={() => setIsWalletOpen(false)}>Cancel</Button>
              <Button onClick={handleWalletRecharge} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 px-8">
                Confirm Recharge
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row items-center gap-3 bg-muted/10">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              className="pl-10 h-10 text-sm bg-background border-border/60 placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/30 rounded-lg"
              placeholder="Search by name, department or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="h-10 text-sm bg-background border border-border/60 rounded-lg px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <span className="inline-flex items-center px-3 h-10 rounded-lg bg-muted/50 border border-border/40 text-sm font-medium text-muted-foreground whitespace-nowrap tabular-nums">
              {filtered.length} <span className="ml-1 font-normal opacity-60">employees</span>
            </span>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-muted-foreground/70 uppercase tracking-widest bg-muted/20 border-b border-border/40 font-semibold">
              <tr>
                <th className="px-4 py-2.5 text-center w-10">#</th>
                <th className="px-4 py-2.5">Employee</th>
                <th className="px-4 py-2.5">Unique No</th>
                <th className="px-4 py-2.5">Date of Birth</th>
                <th className="px-4 py-2.5 text-center">Gender</th>
                <th className="px-4 py-2.5">Mobile</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5 text-right">Wallet</th>
                <th className="px-4 py-2.5 text-center">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground ">No staff members found.</td></tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                    {/* Sr No */}
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground/50 font-medium tabular-nums">
                      {filtered.indexOf(emp) + 1}
                    </td>

                    {/* Employee Name + Role */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-none">{emp.name}</p>
                          <span className={`mt-1 inline-block px-1.5 py-px rounded text-[10px] font-medium ${
                            emp.role === 'super_admin' ? 'text-blue-600 bg-blue-50' :
                            emp.role === 'canteen_supervisor' ? 'text-orange-600 bg-orange-50' :
                            emp.role === 'counter_manager' ? 'text-violet-600 bg-violet-50' :
                            'text-slate-500 bg-slate-100'
                          }`}>{emp.role.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </td>

                    {/* Unique Number */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-foreground tabular-nums">{emp.uniqueNumber || '—'}</span>
                    </td>

                    {/* DOB */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground tabular-nums">
                      {emp.dob ? new Date(emp.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>

                    {/* Gender */}
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-foreground capitalize">{emp.gender || '—'}</span>
                    </td>

                    {/* Mobile No */}
                    <td className="px-4 py-3">
                      {emp.phone
                        ? <a href={`tel:${emp.phone}`} className="text-sm text-foreground hover:underline tabular-nums">{emp.phone}</a>
                        : <span className="text-sm text-muted-foreground/40">—</span>
                      }
                    </td>

                    {/* Email ID */}
                    <td className="px-4 py-3">
                      <a href={`mailto:${emp.email}`} className="text-sm text-foreground hover:underline truncate max-w-[180px] block">{emp.email}</a>
                    </td>

                    {/* Wallet */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-emerald-600 tabular-nums">₹ {emp.walletBalance.toFixed(2)}</span>
                    </td>

                    {/* Credit Button */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openWalletPanel(emp)}
                        title="Credit Wallet"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors"
                      >
                        <PlusCircle className="h-3 w-3" /> Credit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border/40">
          {filtered.map((emp) => (
            <div key={emp.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{emp.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{emp.name}</p>
                    <div className="flex items-center flex-wrap gap-2 text-[12px] font-medium mt-0.5">
                      <a href={`mailto:${emp.email}`} className="text-muted-foreground hover:underline">{emp.email}</a>
                      {emp.phone && (
                        <>
                          <span className="text-muted-foreground/30">|</span>
                          <a href={`tel:${emp.phone}`} className="text-indigo-600 font-bold hover:underline">{emp.phone}</a>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground uppercase font-black tracking-tighter opacity-50 mt-1">{emp.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">₹ {emp.walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/20 mt-2">
                <Button variant="secondary" size="sm" onClick={() => openWalletPanel(emp)}>Recharge</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
