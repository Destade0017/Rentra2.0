'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Mail } from 'lucide-react';
import api from '@/lib/api';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

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
      <div className="flex-1 space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-[32px] border border-slate-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in duration-700">
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
          <p className="text-sm text-slate-500">Manage your tenants and their rent status.</p>
        </div>
        <Button 
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-6 shadow-md shadow-indigo-100 font-semibold transition-all w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {tenants.length === 0 ? (
        <Card className="p-16 border-dashed border-2 bg-white text-center rounded-2xl">
          <div className="max-w-[300px] mx-auto space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 text-slate-300">
              <Users className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">No Tenants</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add your first tenant to start tracking rent.
              </p>
            </div>
            <Button 
              onClick={() => setIsTenantModalOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-8 font-semibold shadow-md shadow-indigo-100 w-full"
            >
              Add Tenant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="bg-white border border-slate-200/50 rounded-2xl shadow-sm flex flex-col justify-between p-8 hover-lift group">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight truncate">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <Mail className="h-3 w-3 text-slate-300" />
                       <p className="text-[11px] text-slate-400 font-medium truncate">{tenant.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Rent</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">${tenant.rentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'paid' ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 rounded-xl h-10 bg-slate-50/50 border border-transparent hover:border-indigo-100/50 transition-all uppercase tracking-wider">
                   History
                 </Button>
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 rounded-xl h-10 bg-slate-50/50 border border-transparent hover:border-slate-200 transition-all uppercase tracking-wider">
                   Profile
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
