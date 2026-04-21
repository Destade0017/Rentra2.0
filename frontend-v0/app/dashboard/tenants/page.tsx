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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="p-6 lg:p-8 bg-white border-zinc-100 rounded-[24px] lg:rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-950 font-black text-lg lg:text-xl shrink-0">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base lg:text-lg text-zinc-950 truncate tracking-tight leading-none">{tenant.name}</h3>
                    <p className="text-[10px] lg:text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> <span className="truncate">{tenant.email}</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 pt-6 border-t border-zinc-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-zinc-300" /> Rent
                    </span>
                    <span className="font-extrabold text-zinc-950 tabular-nums">${tenant.rentAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-zinc-300" /> Due Date
                    </span>
                    <span className="text-xs font-bold text-zinc-600">{format(new Date(tenant.dueDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      tenant.status === 'paid' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-10 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl h-12 lg:h-12 border border-zinc-50 lg:border-transparent transition-all">
                Manage Tenant
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
