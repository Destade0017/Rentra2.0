'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useTenants, Tenant } from '@/hooks/use-tenants';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { formatCurrency } from '@/lib/utils';

export default function TenantsPage() {
  const { 
    data: tenants = [], 
    isLoading: loading, 
    error, 
    refetch: fetchTenants 
  } = useTenants();
  
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center mx-auto border border-indigo-100/30">
            <AlertCircle className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sync Fault</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Failed to retrieve resident records.</p>
          </div>
          <Button onClick={() => fetchTenants()} className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <span className="group-hover:mr-2 transition-all">Retry Connection</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-8 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
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
    <div className="flex-1 space-y-10 lg:space-y-12 pb-24 animate-in fade-in duration-700">
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Tenants</h1>
          <p className="text-[10px] lg:text-sm text-slate-400 font-bold uppercase tracking-widest">Resident Portfolio</p>
        </div>
        <Button 
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 lg:h-12 px-8 shadow-xl shadow-indigo-100 font-bold transition-all w-full md:w-auto active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col justify-between p-6 lg:p-8 hover:shadow-md transition-all group">
              <div className="space-y-6 lg:space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden text-slate-900 font-black text-xl shrink-0 transition-transform group-hover:rotate-3 shadow-sm">
                    {tenant.profileImage ? (
                      <img src={tenant.profileImage} alt={tenant.name} className="w-full h-full object-cover" />
                    ) : (
                      (tenant.name || '?').charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg text-slate-900 tracking-tight truncate">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                       <Mail className="h-3 w-3 text-slate-300" />
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{tenant.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 lg:space-y-5 pt-6 lg:pt-8 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Monthly Rent</span>
                    <span className="text-xl font-black text-slate-900 tabular-nums tracking-tighter">₦{formatCurrency(tenant.rentAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Payment Status</span>
                    <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                      tenant.status === 'paid' ? 'bg-green-50' : 'bg-amber-50'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${tenant.status === 'paid' ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 lg:mt-10">
                 <Button variant="ghost" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 rounded-2xl h-12 bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all uppercase tracking-[0.2em] active:scale-95">
                   History
                 </Button>
                 <Button variant="ghost" className="text-[10px] font-black text-slate-400 hover:text-slate-900 rounded-2xl h-12 bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all uppercase tracking-[0.2em] active:scale-95">
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
