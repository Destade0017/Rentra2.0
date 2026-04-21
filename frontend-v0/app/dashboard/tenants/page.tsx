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
    <div className="flex-1 space-y-20 pb-40 animate-in fade-in duration-1000">
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      {/* TIER 1: RESIDENT COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 px-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resident Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor your resident population.</p>
        </div>
        <Button 
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-8 shadow-xl shadow-indigo-100 font-bold tracking-tight transition-all w-full md:w-auto active:scale-95"
        >
          <Plus className="h-5 w-5 mr-3" />
          Onboard New Resident
        </Button>
      </div>

      {tenants.length === 0 ? (
        <Card className="p-24 border-dashed border-2 border-slate-200/60 bg-white text-center rounded-[40px] animate-in zoom-in-95 duration-700">
          <div className="max-w-[340px] mx-auto space-y-10">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] shadow-inner border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <Users className="h-10 w-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Directory Empty</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Once residents are onboarded, their financial ledgers will appear here.
              </p>
            </div>
            <Button 
              onClick={() => setIsTenantModalOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-10 font-bold shadow-xl shadow-indigo-100 w-full active:scale-95"
            >
              Add First Resident
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="bg-white border border-slate-200/50 rounded-[32px] shadow-sm flex flex-col justify-between p-10 hover-lift group">
              <div className="space-y-12">
                {/* Institutional Header */}
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-xl shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight leading-none truncate">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-3">
                       <Mail className="h-3 w-3 text-slate-300" />
                       <p className="text-xs text-slate-400 font-medium tracking-tight truncate">{tenant.email}</p>
                    </div>
                  </div>
                </div>

                {/* Structured Financials */}
                <div className="space-y-6 pt-10 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">Monthly Flow</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums tracking-tight">${tenant.rentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">Condition</span>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${tenant.status === 'paid' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-12">
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 rounded-2xl h-12 bg-slate-50/50 border border-transparent hover:border-indigo-100/50 transition-all uppercase tracking-widest">
                   Ledger
                 </Button>
                 <Button variant="ghost" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 rounded-2xl h-12 bg-slate-50/50 border border-transparent hover:border-slate-200 transition-all uppercase tracking-widest">
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
