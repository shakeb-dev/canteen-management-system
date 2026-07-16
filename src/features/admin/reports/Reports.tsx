import { useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import CounterReports from './CounterReports';
import EmployeeReports from './EmployeeReports';
import FoodReports from './FoodReports';
import { BarChart3, Users, UtensilsCrossed, Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';

type TabType = 'counters' | 'employees' | 'food';

export interface ReportFilterProps {
  timeFilter: 'daily' | 'weekly' | 'monthly' | 'custom';
  fromDate: string;
  toDate: string;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabType>('counters');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'counters', label: 'Counter Reports', icon: BarChart3 },
    { id: 'employees', label: 'Employee Reports', icon: Users },
    { id: 'food', label: 'Food Products', icon: UtensilsCrossed },
  ];

  const filterProps: ReportFilterProps = { timeFilter, fromDate, toDate };

  return (
    <div className="space-y-5 animate-fade-in mb-10">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Revenue and order reports across counters and employees"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border/60 bg-background shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="bg-transparent border-none text-sm text-foreground focus:ring-0 cursor-pointer outline-none"
              >
                <option value="daily">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {timeFilter === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground outline-none focus:ring-1 focus:ring-primary/30"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-10 px-3 text-sm border border-border/60 rounded-lg bg-background text-foreground outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            )}
          </div>
        }
      />

      {/* Tab Bar */}
      <div className="flex gap-1 bg-muted/20 p-1 rounded-lg border border-border/40 w-full md:w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-card text-primary shadow-sm border border-border/40"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <tab.icon className={cn("h-3.5 w-3.5 shrink-0", activeTab === tab.id ? "text-primary" : "opacity-50")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'counters' && <CounterReports {...filterProps} />}
        {activeTab === 'employees' && <EmployeeReports {...filterProps} />}
        {activeTab === 'food' && <FoodReports {...filterProps} />}
      </div>
    </div>
  );
}
