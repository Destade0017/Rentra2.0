'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-12 pb-32 animate-in fade-in duration-700">
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

      {/* Simplified Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your rental workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsPropertyModalOpen(true)} 
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-10 px-6 shadow-sm font-bold transition-all text-xs active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl border border-slate-100" />)}
          </div>
          <Skeleton className="h-48 w-full rounded-2xl border border-slate-100" />
        </div>
      ) : isEmpty ? (
        <Card className="p-16 border-slate-200/60 bg-white text-center rounded-[32px] shadow-none flex flex-col items-center justify-center min-h-[400px]">
          <div className="max-w-[300px] space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ready to start?</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Add your first property to begin managing your tenants and rental payments.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)} 
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-8 font-bold w-full"
            >
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* Intelligence Insight Bar */}
          <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
             <p className="text-sm font-bold text-indigo-900 tracking-tight">
                {tenants.length - paidTenants > 0 
                  ? `${tenants.length - paidTenants} tenants have outstanding payments this month.` 
                  : "All tenant accounts are currently in good standing."
                }
             </p>
          </div>

          {/* Simple Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-6 bg-white border border-slate-200/60 rounded-2xl shadow-none">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{card.label}</p>
                    <div className="text-slate-300">
                      {card.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none tabular-nums">{card.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">{card.subtext}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* History Log */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Recent Activity</h2>
              <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 rounded-lg px-2 group">
                View All <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-[24px] divide-y divide-slate-100 overflow-hidden">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-5 py-5 px-6 hover:bg-slate-50/30 transition-colors">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{activity.title}</p>
                    <p className="text-xs text-slate-400 font-medium truncate tracking-tight">{activity.description}</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tabular-nums">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
