'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Mail, Building2, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { format } from 'date-fns';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenants');
      setTenants(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  if (loading) {
    return (
      <div className="flex-1 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-3xl border border-zinc-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950">Tenants</h1>
          <p className="text-sm lg:text-base text-zinc-500 font-medium">
            Manage your resident records and lease configurations.
          </p>
        </div>
        <Button 
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-12 lg:h-11 px-6 shadow-sm font-semibold transition-all w-full md:w-auto"
        >
          <Plus className="h-5 w-5 lg:h-4 lg:w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {tenants.length === 0 ? (
        <Card className="p-10 lg:p-16 border-dashed border-2 border-zinc-200 bg-white text-center rounded-[24px] lg:rounded-3xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-zinc-50 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 lg:h-10 lg:w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 tracking-tight">No tenants yet</h2>
              <p className="text-sm lg:text-base text-zinc-500 leading-relaxed font-medium px-4">
                Your resident list is empty. Add your first tenant to start tracking.
              </p>
            </div>
            <Button 
              onClick={() => setIsTenantModalOpen(true)}
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-14 lg:h-12 px-8 font-bold shadow-md w-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add First Tenant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="bg-white border border-slate-200/50 rounded-[32px] shadow-sm flex flex-col justify-between p-10 hover-lift group">
              <div className="space-y-10">
                {/* Institutional Header */}
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-[20px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg shrink-0 shadow-inner">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight leading-none">{tenant.name}</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-tight mt-2 truncate">{tenant.email}</p>
                  </div>
                </div>

                {/* Structured Financials */}
                <div className="space-y-4 pt-10 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">Monthly Flow</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">${tenant.rentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">Health</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'paid' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="ghost" className="w-full mt-10 text-xs font-bold text-slate-400 hover:text-indigo-600 rounded-2xl h-12 bg-slate-50/50 border border-transparent hover:border-indigo-100/50">
                Manage Profile
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
