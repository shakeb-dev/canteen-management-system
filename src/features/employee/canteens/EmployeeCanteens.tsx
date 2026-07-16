import { Button, playHoverSound, playClickSound } from '../../../components/ui/Button';
import { MapPin, Clock, ArrowRight, User, Grid3x3, List } from 'lucide-react';
import { useCounterStore } from '../../../store/useCounterStore';
import { useEmployeeStore } from '../../../store/useEmployeeStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { useState } from 'react';

export default function EmployeeCanteens() {
  const { counters } = useCounterStore();
  const { employees } = useEmployeeStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleSelectCounter = () => {
    navigate(`/employee/menu`);
  };

  const formatTime = (time: string) => {
    return time; // Simplified for now
  };

  // Calculate stats
  const activeCounters = counters.filter(c => c.isActive).length;
  const totalCounters = counters.length;


  return (
    <div className="space-y-6 animate-fade-in relative pb-6">
      {/* Decorative Floating Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-drift" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Select Counter
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Available <span className="text-primary">Counters</span>
          </h2>
        </div>

        <div
          onClick={() => { playClickSound(); navigate('/employee/menu'); }}
          className="flex items-stretch gap-0 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden w-full md:w-auto shrink-0"
        >
          <div className="px-5 py-3 flex flex-col justify-center">
            <p className="text-xs font-medium text-muted-foreground">Total Counters</p>
            <p className="text-xl font-semibold text-foreground mt-0.5 tabular-nums">{totalCounters}</p>
          </div>
          <div className="w-px bg-border/60 shrink-0" />
          <div className="px-4 py-3 flex flex-col justify-center gap-1.5 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs text-muted-foreground">Active</span>
              <span className="text-xs font-medium text-foreground ml-auto tabular-nums">{activeCounters} Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2 border-l-4 border-accent pl-4">
          <div>
            <h3 className="text-2xl font-semibold text-foreground">All <span className="text-primary">Counters</span></h3>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5">Browse and select</p>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => { playClickSound(); setViewMode('grid'); }}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'grid' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => { playClickSound(); setViewMode('list'); }}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'list' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* GRID VIEW - Compact Cards */}
        {viewMode === 'grid' && (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {counters.map((counter, idx) => {
              const isActive = counter.isActive;
              const manager = employees.find(u => u.id === counter.managerId);

              return (
                <div
                  key={counter.id}
                  onMouseEnter={playHoverSound}
                  onClick={() => { if (isActive) { playClickSound(); handleSelectCounter(); } }}
                  className={cn(
                    "hotel-card group relative overflow-hidden rounded-lg border border-border/50 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer",
                    !isActive && "opacity-60 grayscale cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "h-12 relative overflow-hidden",
                    idx % 4 === 0 ? "bg-indigo-500" :
                      idx % 4 === 1 ? "bg-emerald-500" :
                        idx % 4 === 2 ? "bg-violet-500" :
                          "bg-orange-500"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 px-3 py-2 flex items-center justify-between">
                      <h4 className="text-white font-bold text-sm truncate">{counter.name}</h4>
                      <div className={cn(
                        "px-1.5 py-0.5 rounded-full text-[8px] font-medium uppercase border backdrop-blur-md shrink-0 ml-2",
                        isActive ? "bg-emerald-500/20 text-white border-emerald-500/30" : "bg-red-500/20 text-white border-red-500/30"
                      )}>
                        {isActive ? "✓" : "✕"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-muted-foreground truncate">{manager?.name || 'Vacant'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-muted-foreground truncate">{counter.location}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-muted-foreground">{formatTime(counter.openTime || '09:00')} - {formatTime(counter.closeTime || '20:00')}</p>
                    </div>

                    <Button
                      disabled={!isActive}
                      onClick={(e) => { e.stopPropagation(); playClickSound(); handleSelectCounter(); }}
                      className={cn(
                        "w-full h-8 text-xs font-medium gap-1.5 mt-2 transition-all",
                        isActive 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-muted cursor-not-allowed text-muted-foreground"
                      )}
                    >
                      {isActive ? (
                        <>Order<ArrowRight className="h-3 w-3" /></>
                      ) : (
                        "Closed"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW - Table Style */}
        {viewMode === 'list' && (
          <div className="hotel-card overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Counter Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Manager</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Hours</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {counters.map((counter, idx) => {
                    const isActive = counter.isActive;
                    const manager = employees.find(u => u.id === counter.managerId);
                    const bgColor = idx % 2 === 0 ? 'bg-white' : 'bg-muted/5';

                    return (
                      <tr
                        key={counter.id}
                        onMouseEnter={playHoverSound}
                        onClick={() => { if (isActive) { playClickSound(); handleSelectCounter(); } }}
                        className={cn(
                          "border-b border-border/30 hover:bg-primary/5 transition-colors cursor-pointer",
                          bgColor,
                          !isActive && "opacity-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isActive ? "bg-emerald-500" : "bg-red-500"
                            )} />
                            <span className="font-medium text-foreground">{counter.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{manager?.name || 'Vacant'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-sm truncate max-w-xs">{counter.location}</td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">{formatTime(counter.openTime || '09:00')} - {formatTime(counter.closeTime || '20:00')}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            isActive 
                              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-200" 
                              : "bg-red-500/10 text-red-700 border border-red-200"
                          )}>
                            {isActive ? "Online" : "Offline"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            disabled={!isActive}
                            onClick={(e) => { e.stopPropagation(); playClickSound(); handleSelectCounter(); }}
                            className={cn(
                              "h-7 px-3 text-xs font-medium gap-1 transition-all",
                              isActive 
                                ? "bg-primary text-white hover:bg-primary/90" 
                                : "bg-muted cursor-not-allowed text-muted-foreground"
                            )}
                          >
                            {isActive ? "Order" : "Closed"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Support Section */}
      <div
        onMouseEnter={playHoverSound}
        onClick={() => { playClickSound(); }}
        className="hotel-card px-6 py-2 bg-gradient-to-r from-accent to-orange-500 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border-none shadow-2xl group cursor-pointer"
      >
        <div className="absolute left-[-10%] top-[-50%] h-[150px] w-[150px] bg-white/10 rounded-full blur-2xl transition-transform duration-1000" />
        <div className="relative z-10">
          <h3 className="text-xl font-semibold leading-none">Need assistance?</h3>
          <p className="text-sm font-medium opacity-80 mt-1 uppercase tracking-wider">Call at 555-2655</p>
        </div>
        <Button
          onClick={(e) => { e.stopPropagation(); playClickSound(); }}
          className="relative z-10 h-11 px-8 bg-white text-accent hover:bg-accent hover:text-white border-none shadow-xl text-sm font-medium uppercase tracking-widest"
        >
          Contact Concierge
        </Button>
      </div>
    </div>
  );
}