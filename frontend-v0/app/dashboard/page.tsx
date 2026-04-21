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
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-16 pb-32 animate-in fade-in duration-1000">
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

      {/* 1. OVERVIEW (The Pulse) */}
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Your portfolio at a glance.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[32px] border border-slate-100" />)}
          </div>
        ) : isEmpty ? (
          <Card className="p-20 text-center border-dashed border-2 flex flex-col items-center justify-center min-h-[400px]">
            <div className="max-w-[320px] space-y-8">
              <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto border border-slate-100">
                <Building2 className="h-10 w-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Empty Workspace</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Add your first property to activate your landlord control center.
                </p>
              </div>
              <Button 
                onClick={() => setIsPropertyModalOpen(true)} 
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Add First Property
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-8 border-slate-200/50 hover-lift">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                    <div className="text-slate-300">{card.icon}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-slate-900 tracking-tighter tabular-nums">{card.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">{card.subtext}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {!isEmpty && !loading && (
        <>
          {/* 2. INSIGHTS (The Intelligence) */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase px-1">Insights</h2>
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 tracking-tight leading-none">
                    {tenants.length - paidTenants > 0 
                      ? `${tenants.length - paidTenants} payments need your attention today.` 
                      : "Portfolio hygiene is excellent. All accounts are settled."
                    }
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Auto-generated diagnostic based on latest tenant logs.</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl px-6 h-10 shrink-0">
                View Ledger
              </Button>
            </div>
          </div>

          {/* 3. ACTIONS (The Command) */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase px-1">Command Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-slate-200/50 hover-lift group cursor-pointer" onClick={() => setIsPropertyModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">Add Property</p>
                    <p className="text-xs text-slate-500 font-medium font-medium">Expand your portfolio with new assets.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-slate-200/50 hover-lift group cursor-pointer" onClick={() => setIsTenantModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">Add Resident</p>
                    <p className="text-xs text-slate-500 font-medium">Onboard a new tenant to occupied units.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
