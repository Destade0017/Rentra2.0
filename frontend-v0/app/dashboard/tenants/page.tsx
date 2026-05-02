'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Mail } from 'lucide-react';
import { useTenants } from '@/hooks/use-tenants';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

export default function TenantsPage() {
  const { data: tenants = [], isLoading: loading, error, refetch: fetchTenants } = useTenants();
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex-1 space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <Skeleton className="h-4 w-60 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-8 p-8 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            </div>
          ))}
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
        <div className="flex-1 flex items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto border border-slate-100">
              <Users className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No Tenants</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Connect your properties with residents to start generating revenue tracking.
              </p>
            </div>
            <Button 
              onClick={() => setIsTenantModalOpen(true)}
              className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              Add Your First Tenant
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="bg-white border border-slate-200/50 rounded-2xl shadow-sm flex flex-col justify-between p-6 lg:p-8 hover-lift group">
              <div className="space-y-6 lg:space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden text-slate-900 font-bold text-base lg:text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {tenant.profileImage ? (
                      <img src={tenant.profileImage} alt={tenant.name} className="w-full h-full object-cover" />
                    ) : (
                      tenant.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base lg:text-lg text-slate-900 tracking-tight truncate">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <Mail className="h-3 w-3 text-slate-300" />
                       <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium truncate">{tenant.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 lg:space-y-4 pt-5 lg:pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-300 uppercase tracking-wider">Rent</span>
                    <span className="text-base lg:text-lg font-bold text-slate-900 tabular-nums">${(tenant.rentAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-300 uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'paid' ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-wider ${
                        tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 lg:mt-8">
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 rounded-xl h-10 bg-slate-50/50 border border-transparent hover:border-indigo-100/50 transition-all uppercase tracking-wider active:scale-95">
                   History
                 </Button>
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 rounded-xl h-10 bg-slate-50/50 border border-transparent hover:border-slate-200 transition-all uppercase tracking-wider active:scale-95">
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
