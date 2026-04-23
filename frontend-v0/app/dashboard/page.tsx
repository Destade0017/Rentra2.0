'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Users,
  DollarSign,
  Plus,
} from 'lucide-react';
import api from '@/lib/api';
import { AddPropertyModal } from '@/components/modals/add-property-modal';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
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
      label: 'Properties',
      value: totalProperties.toString(),
      icon: <Building2 className="h-4 w-4" />,
      subtext: 'Active properties',
    },
    {
      label: 'Tenants',
      value: totalTenants.toString(),
      icon: <Users className="h-4 w-4" />,
      subtext: 'Occupied units',
    },
    {
      label: 'Rent',
      value: `${paidTenants}/${totalTenants}`,
      icon: <DollarSign className="h-4 w-4" />,
      subtext: `Total: $${totalRentAmount.toLocaleString()}`,
    },
  ], [totalProperties, totalTenants, paidTenants, totalRentAmount]);


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
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-700">
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

      <div className="space-y-8">
        <div className="px-1">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your properties and rent.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl border border-slate-100" />)}
          </div>
        ) : isEmpty ? (
          <Card className="p-16 text-center border-dashed border-2 flex flex-col items-center justify-center min-h-[300px]">
            <div className="max-w-[300px] space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                <Building2 className="h-8 w-8 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Get Started</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Add your first property to start tracking rent.
                </p>
              </div>
              <Button 
                onClick={() => setIsPropertyModalOpen(true)} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 shadow-md shadow-indigo-100 font-semibold"
              >
                Add Property
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-6 border-slate-200/50 hover-lift bg-white shadow-sm ring-1 ring-slate-100/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    {card.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {!isEmpty && !loading && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 border-slate-200/50 hover-lift group cursor-pointer bg-white rounded-2xl" onClick={() => setIsPropertyModalOpen(true)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Add Property</p>
                    <p className="text-sm text-slate-500">Register a new property.</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
              </div>
            </Card>

            <Card className="p-8 border-slate-200/50 hover-lift group cursor-pointer bg-white rounded-2xl" onClick={() => setIsTenantModalOpen(true)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Add Tenant</p>
                    <p className="text-sm text-slate-500">Add a tenant to a unit.</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
