'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  Home,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { AddPropertyModal } from '@/components/modals/add-property-modal';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
}

interface ActivityItem {
  id: string;
  type: 'property' | 'tenant';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  date: Date;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [propRes, tenantRes] = await Promise.all([
        api.get('/properties'),
        api.get('/tenants')
      ]);

      setProperties(propRes.data.data || []);
      setTenants(tenantRes.data.data || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized Calculations for Performance
  const { totalProperties, totalTenants, paidTenants, totalRentAmount } = useMemo(() => ({
    totalProperties: properties.length,
    totalTenants: tenants.length,
    paidTenants: tenants.filter(t => t.status === 'paid').length,
    totalRentAmount: tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0)
  }), [properties, tenants]);

  const summaryCards = useMemo(() => [
    {
      label: 'Portfolio Count',
      value: totalProperties.toString(),
      icon: <Building2 className="h-4 w-4" />,
      subtext: 'Active Property Listings',
    },
    {
      label: 'Tenant Population',
      value: totalTenants.toString(),
      icon: <Users className="h-4 w-4" />,
      subtext: 'Current Occupied Units',
    },
    {
      label: 'Collection Status',
      value: `${paidTenants}/${totalTenants}`,
      icon: <DollarSign className="h-4 w-4" />,
      subtext: `Volume: $${totalRentAmount.toLocaleString()}`,
    },
  ], [totalProperties, totalTenants, paidTenants, totalRentAmount]);

  const recentActivity = useMemo(() => [
    ...properties.map(p => ({
      id: p._id,
      type: 'property' as const,
      title: 'Listing Onboarded',
      description: p.name,
      timestamp: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
      icon: <Home className="h-4 w-4" />,
      date: new Date(p.createdAt)
    })),
    ...tenants.map(t => ({
      id: t._id,
      type: 'tenant' as const,
      title: 'Tenant Contracted',
      description: `${t.name} Assignment`,
      timestamp: formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }),
      icon: <UserIcon className="h-4 w-4" />,
      date: new Date(t.createdAt)
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5), [properties, tenants]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-8 max-w-[320px] mx-auto">
          <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center mx-auto ring-1 ring-zinc-100 shadow-sm">
            <AlertCircle className="h-8 w-8 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-950 tracking-tight">System Synchronizing</h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} className="rounded-xl h-12 w-full font-bold shadow-lg shadow-zinc-100 transition-all active:scale-95">
            Reconnect Terminal
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !loading && properties.length === 0 && tenants.length === 0;

  return (
    <div className="flex-1 max-w-[1240px] mx-auto w-full space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-1000">Workspace</h1>
          <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">
            Portfolio Analytics • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsTenantModalOpen(true)} 
            className="rounded-xl h-11 border-zinc-100 bg-white hover:bg-zinc-50 transition-all font-bold text-[11px] px-6 uppercase tracking-widest"
          >
            Add Tenant
          </Button>
          <Button 
            onClick={() => setIsPropertyModalOpen(true)} 
            className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-11 px-8 shadow-md font-bold transition-all text-[11px] uppercase tracking-widest active:scale-95"
          >
            New Property
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-16 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-[24px] border border-zinc-50" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-2xl border border-zinc-50" />)}
              </div>
            </div>
             <div className="space-y-6">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      ) : isEmpty ? (
        <Card className="p-24 border-dashed border-2 border-zinc-100 bg-white/50 text-center rounded-[40px] shadow-none flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in-95 duration-700">
          <div className="max-w-[340px] space-y-8">
            <div className="w-20 h-20 bg-zinc-50 rounded-[28px] flex items-center justify-center mx-auto ring-8 ring-zinc-50/50">
              <Building2 className="h-10 w-10 text-zinc-300" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Portfolio Launch</h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                Your workspace is initialized. Strategic property and tenant tracking begins here.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)} 
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-14 px-10 font-black shadow-xl shadow-zinc-100 w-full uppercase tracking-widest text-[11px]"
            >
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-20">
          {/* Summary Intelligence Grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-8 bg-white border border-zinc-100/50 rounded-[24px] shadow-sm relative group hover:shadow-md transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] leading-none">{card.label}</p>
                    <div className="p-2.5 bg-zinc-50 rounded-xl text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                      {card.icon}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-4xl font-extrabold text-zinc-950 tracking-tighter leading-none tabular-nums">{card.value}</p>
                    {card.subtext && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{card.subtext}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Operational Timeline & Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-3 space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-100/80 pb-6">
                <div>
                   <h2 className="text-sm font-black tracking-[0.15em] text-zinc-950 uppercase">Recent History</h2>
                   <p className="text-xs text-zinc-400 font-medium mt-1">Audit log of portfolio modifications</p>
                </div>
                <Button variant="ghost" className="text-[10px] font-black text-zinc-300 hover:text-zinc-950 gap-2 px-4 hover:bg-zinc-50 rounded-lg transition-all uppercase tracking-widest group">
                  Full Archive <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="group flex items-center gap-6 py-6 px-4 rounded-2xl hover:bg-zinc-50/50 border border-transparent transition-all duration-300 cursor-default">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-zinc-100 group-hover:border-zinc-950">
                      {activity.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-zinc-950 leading-none tracking-tight">{activity.title}</p>
                      <p className="text-xs text-zinc-400 font-medium tracking-tight truncate max-w-[200px] sm:max-w-none">{activity.description}</p>
                    </div>
                    <div className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter tabular-nums bg-white border border-zinc-100 px-3 py-1.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-zinc-200 transition-colors">
                      {activity.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workplace Health Diagnostics */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Live Health</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-white border border-zinc-100 rounded-[24px] shadow-sm flex flex-col gap-3">
                     <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Revenue Stability</span>
                     <div className="flex items-center justify-between">
                       <span className="text-lg font-extrabold text-zinc-950">Normal</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
                     </div>
                  </div>
                   <div className="p-6 bg-white border border-zinc-100 rounded-[24px] shadow-sm flex flex-col gap-3">
                     <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Occupancy Rate</span>
                     <div className="flex items-center justify-between">
                       <span className="text-lg font-extrabold text-zinc-950">100%</span>
                       <span className="text-[10px] font-extrabold text-zinc-300 pb-0.5">PEERING</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
