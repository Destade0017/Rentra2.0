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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex-1 space-y-10 animate-in fade-in duration-700">
      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Tenants</h1>
          <p className="text-zinc-500 font-medium">
            Manage your resident records and lease configurations.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-11 px-6 shadow-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {tenants.length === 0 ? (
        <Card className="p-16 border-dashed border-2 border-zinc-200 bg-zinc-50/30 text-center rounded-3xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">No tenants yet</h2>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Your resident list is empty. Add your first tenant to start tracking lease payments.
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-12 px-8 font-bold shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add First Tenant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="p-8 bg-white border-zinc-100 rounded-3xl shadow-sm card-hover flex flex-col justify-between group">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-950 font-extrabold text-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-lg text-zinc-950 tracking-tight leading-none">{tenant.name}</h3>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 pt-1">
                      <Mail className="h-3 w-3" /> {tenant.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-zinc-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-300" /> Rent
                    </span>
                    <span className="font-extrabold text-zinc-950 tabular-nums">${tenant.rentAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-300" /> Due Date
                    </span>
                    <span className="text-sm font-bold text-zinc-950 italic">{format(new Date(tenant.dueDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Payment Status</span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                      tenant.status === 'paid' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl py-6 border border-transparent hover:border-zinc-100 transition-all">
                Manage Agreement
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
