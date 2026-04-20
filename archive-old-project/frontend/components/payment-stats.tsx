'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export function PaymentStats() {
  const { stats } = useDashboardStore();

  const totalRevenue = stats?.totalRevenue || 0;
  const outstanding = stats?.outstandingRevenue || 0;
  
  // Logic to simulate/derive some overdue stats if not explicitly in the general stats
  const overdueAmount = (stats as any)?.overdueAmount || 0;

  const metrics = [
    {
      label: 'Gross Volume',
      value: `₦${totalRevenue.toLocaleString()}`,
      sub: '+14% from last month',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      trend: 'up'
    },
    {
      label: 'Outstanding',
      value: `₦${outstanding.toLocaleString()}`,
      sub: '4 Pending invoices',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      trend: 'neutral'
    },
    {
      label: 'Overdue Amount',
      value: `₦${overdueAmount.toLocaleString()}`,
      sub: '2 Critical items',
      icon: AlertCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-500/10',
      trend: 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-none shadow-sm rounded-[32px] overflow-hidden p-8 bg-white group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 border-b-4 border-b-transparent hover:border-b-blue-500">
          <div className="flex items-start justify-between">
            <div className={`p-4 rounded-2xl ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform`}>
              <metric.icon size={24} />
            </div>
            {metric.trend === 'up' && (
              <div className="flex items-center text-emerald-500 text-[10px] font-black uppercase bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} className="mr-1" /> Growth
              </div>
            )}
            {metric.trend === 'down' && (
               <div className="flex items-center text-rose-500 text-[10px] font-black uppercase bg-rose-50 px-2 py-1 rounded-lg">
                <ArrowDownRight size={14} className="mr-1" /> Deficit
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{metric.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">{metric.value}</h3>
            <p className="text-[11px] font-bold text-slate-400">{metric.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
