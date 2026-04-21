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

  // Calculations
  const totalProperties = properties.length;
  const totalTenants = tenants.length;
  const paidTenants = tenants.filter(t => t.status === 'paid').length;
  const totalRentAmount = tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

  const summaryCards: SummaryCard[] = [
    {
      label: 'Total Properties',
      value: totalProperties.toString(),
      icon: <Building2 className="h-6 w-6" />,
      subtext: 'Active listings',
    },
    {
      label: 'Total Tenants',
      value: totalTenants.toString(),
      icon: <Users className="h-6 w-6" />,
      subtext: 'Occupied units',
    },
    {
      label: 'Rent Collected',
      value: `${paidTenants}/${totalTenants}`,
      icon: <DollarSign className="h-6 w-6" />,
      subtext: `Total: $${totalRentAmount.toLocaleString()}`,
    },
  ];

  // Combine and sort activities
  const recentActivity: ActivityItem[] = [
    ...properties.map(p => ({
      id: p._id,
      type: 'property' as const,
      title: 'Property Added',
      description: p.name,
      timestamp: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
      icon: <Home className="h-4 w-4" />,
      date: new Date(p.createdAt)
    })),
    ...tenants.map(t => ({
      id: t._id,
      type: 'tenant' as const,
      title: 'Tenant Added',
      description: `${t.name} - ${t.email}`,
      timestamp: formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }),
      icon: <UserIcon className="h-4 w-4" />,
      date: new Date(t.createdAt)
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);

  const isEmpty = !loading && properties.length === 0 && tenants.length === 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-10 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg opacity-60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl border border-zinc-100" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl border border-zinc-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-950">System unavailable</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline" className="rounded-xl px-10">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Modals */}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Workspace Overview</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor your rental performance and property health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsTenantModalOpen(true)} 
            className="rounded-lg h-9 border-zinc-200 bg-white hover:bg-zinc-50 transition-all font-semibold text-xs py-0"
          >
            Add Tenant
          </Button>
          <Button 
            onClick={() => setIsPropertyModalOpen(true)} 
            className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg h-9 px-4 shadow-sm font-semibold transition-all text-xs py-0"
          >
            New Property
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <Card className="p-20 border-dashed border-2 border-zinc-100 bg-white text-center rounded-[32px] shadow-none">
          <div className="max-w-[320px] mx-auto space-y-8">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-zinc-100">
              <Building2 className="h-8 w-8 text-zinc-300" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Empty Workspace</h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                Your property management dashboard is ready. Add your first property to begin tracking tenants.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)} 
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-11 px-8 font-bold shadow-md w-full"
            >
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-14">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-7 border-[#f1f1f1] bg-white rounded-2xl shadow-none relative group transition-all hover:border-zinc-200">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{card.label}</p>
                    <div className="text-zinc-300 group-hover:text-zinc-900 transition-colors">
                      {card.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-zinc-950 tracking-tight leading-none">{card.value}</p>
                    {card.subtext && (
                      <p className="text-[11px] font-bold text-zinc-400 flex items-center gap-2 pt-1 uppercase">
                        <span className="w-1 h-1 rounded-full bg-zinc-950" />
                        {card.subtext}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-4">
                <h2 className="text-sm font-bold tracking-tight text-zinc-900 uppercase tracking-[0.1em]">Recent Activity</h2>
                <Button variant="ghost" className="text-xs font-bold text-zinc-400 hover:text-zinc-950 gap-2 px-0 hover:bg-transparent transition-colors group uppercase tracking-widest">
                  View Logs <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="space-y-px">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="group flex items-center gap-6 py-5 px-4 rounded-xl hover:bg-white border border-transparent hover:border-[#f1f1f1] transition-all duration-300">
                      <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-sm">
                        {activity.type === 'property' ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-bold text-zinc-900 leading-none">{activity.title}</p>
                        <p className="text-xs text-zinc-500 font-medium">{activity.description}</p>
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter tabular-nums bg-white px-2 py-1 rounded border border-[#f1f1f1]">
                        {activity.timestamp}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-100">
                    <p className="text-zinc-400 text-sm font-medium">Clear activity log.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Stats Area */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-[#f1f1f1] rounded-2xl shadow-none flex items-center justify-between">
                     <span className="text-xs font-bold text-zinc-500">Rent Health</span>
                     <span className="text-xs font-black text-green-600 uppercase tracking-tighter">Stability Low</span>
                  </div>
                   <div className="p-4 bg-white border border-[#f1f1f1] rounded-2xl shadow-none flex items-center justify-between">
                     <span className="text-xs font-bold text-zinc-500">Occupancy</span>
                     <span className="text-xs font-black text-zinc-950 uppercase tracking-tighter">100%</span>
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
