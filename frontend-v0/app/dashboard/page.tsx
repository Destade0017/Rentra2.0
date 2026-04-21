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
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center mx-auto border border-indigo-100/30">
            <AlertCircle className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sync Delayed</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <span className="group-hover:mr-2 transition-all">Reconnect Terminal</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !loading && properties.length === 0 && tenants.length === 0;

  return (
    <div className="flex-1 max-w-[1020px] mx-auto w-full space-y-20 pb-40 animate-in fade-in duration-1000">
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

      {/* TIER 1: THE ANALYTICS PULSE */}
      <div className="space-y-10">
        <div className="space-y-2 px-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time health of your property portfolio.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-[32px] border border-slate-100" />)}
          </div>
        ) : isEmpty ? (
          <Card className="p-24 text-center border-dashed border-2 flex flex-col items-center justify-center min-h-[440px] animate-in zoom-in-95 duration-700">
            <div className="max-w-[340px] space-y-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto border border-slate-100 shadow-sm">
                <Building2 className="h-10 w-10 text-slate-300" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Activate Portfolio</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Your management controls will activate once your first property is onboarded.
                </p>
              </div>
              <Button 
                onClick={() => setIsPropertyModalOpen(true)} 
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Add Your First Property
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-8 border-slate-200/50 hover-lift bg-white shadow-sm ring-1 ring-slate-100/5">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {card.icon}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">{card.label}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-4xl font-bold text-slate-900 tracking-tighter tabular-nums leading-none">{card.value}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-1 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-200" /> {card.subtext}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {!isEmpty && !loading && (
        <>
          {/* TIER 2: SMART ADVISORY */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">Strategic Insight</h2>
              <span className="text-[10px] font-bold text-slate-300">Updated just now</span>
            </div>
            <div className="bg-white border border-slate-200/50 rounded-[32px] p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:border-slate-300 transition-all shadow-sm">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-indigo-50/50 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-100/30">
                  <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_12px_rgba(79,70,229,0.4)]" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-900 tracking-tight leading-none italic">
                    {tenants.length - paidTenants > 0 
                      ? `${tenants.length - paidTenants} tenants have outstanding balances this cycle.` 
                      : "Portfolio optimization: All accounts are currently balanced."
                    }
                  </p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[500px]">
                    Automatic diagnostic suggests reviewing {tenants.length - paidTenants > 0 ? "collection schedules" : "maintenance requests"} to maintain peak operational efficiency.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="lg" className="rounded-2xl px-8 h-14 shrink-0 font-bold tracking-tight">
                Analyze Ledger
              </Button>
            </div>
          </div>

          {/* TIER 3: COMMAND & CONTROL */}
          <div className="space-y-8">
            <h2 className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase px-1">Primary Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 border-slate-200/50 hover-lift group cursor-pointer bg-white" onClick={() => setIsPropertyModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xl font-bold text-slate-900 tracking-tight">Expand Portfolio</p>
                      <p className="text-sm text-slate-500 font-medium">Acquire and onboard new assets into the system.</p>
                    </div>
                  </div>
                  <Plus className="h-6 w-6 text-slate-200 group-hover:text-indigo-600 group-hover:scale-125 transition-all duration-500" />
                </div>
              </Card>

              <Card className="p-10 border-slate-200/50 hover-lift group cursor-pointer bg-white" onClick={() => setIsTenantModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xl font-bold text-slate-900 tracking-tight">Onboard Resident</p>
                      <p className="text-sm text-slate-500 font-medium">Assign tenants and generate rental contracts.</p>
                    </div>
                  </div>
                  <Plus className="h-6 w-6 text-slate-200 group-hover:text-indigo-600 group-hover:scale-125 transition-all duration-500" />
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
