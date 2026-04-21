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
    <div className="flex-1 space-y-10 pb-20 animate-in fade-in duration-700">
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Overview</h1>
          <p className="text-zinc-500 font-medium">
            Manage your properties and track tenant performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsTenantModalOpen(true)} 
            className="rounded-xl h-11 border-zinc-200 hover:bg-zinc-50 transition-all font-semibold"
          >
            Add Tenant
          </Button>
          <Button 
            onClick={() => setIsPropertyModalOpen(true)} 
            className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-11 px-6 shadow-sm font-semibold transition-all"
          >
            New Property
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <Card className="p-16 border-dashed border-2 border-zinc-200 bg-zinc-50/30 text-center rounded-3xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto">
              <Building2 className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Your portfolio is empty</h2>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Start by adding your first property to manage tenants and track rent payments in one place.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)} 
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-12 px-8 font-bold shadow-md animate-pulse hover:animate-none"
            >
              Add Your First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-8 border-zinc-100 shadow-sm bg-white card-hover rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  {card.icon}
                </div>
                <div className="space-y-4">
                  <div className="p-2.5 bg-zinc-50 rounded-lg w-fit text-zinc-950 border border-zinc-100">
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{card.label}</p>
                    <p className="text-4xl font-extrabold text-zinc-950 tracking-tight">{card.value}</p>
                  </div>
                  {card.subtext && (
                    <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5 pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {card.subtext}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Activity Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-zinc-950">Recent History</h2>
              <Button variant="ghost" className="text-sm font-semibold text-zinc-400 hover:text-zinc-950 gap-2 px-2 hover:bg-transparent transition-colors group">
                Full timeline <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <Card className="border-zinc-100 bg-white rounded-3xl shadow-sm overflow-hidden divide-y divide-zinc-50">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-zinc-50/50 transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-950 border border-zinc-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                        {activity.type === 'property' ? <Building2 className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-950 mb-0.5">{activity.title}</p>
                        <p className="text-sm text-zinc-500 font-medium">{activity.description}</p>
                      </div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-tighter tabular-nums bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-zinc-400 font-medium italic">No recent activity found.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
