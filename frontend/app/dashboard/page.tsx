'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  History,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useProperties } from '@/hooks/use-properties';
import { useTenants, Tenant } from '@/hooks/use-tenants';
import { AddPropertyModal } from '@/components/modals/add-property-modal';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { formatCurrency } from '@/lib/utils';

interface Property {
  _id: string;
  name: string;
  address: string;
  images: string[];
}

export default function DashboardPage() {
  const { 
    data: properties = [] as Property[], 
    isLoading: loadingProperties, 
    error: errorProperties, 
    refetch: refetchProperties 
  } = useProperties();
  
  const { 
    data: tenants = [] as Tenant[], 
    isLoading: loadingTenants, 
    error: errorTenants, 
    refetch: refetchTenants 
  } = useTenants();
  
  const loading = loadingProperties || loadingTenants;
  const error = errorProperties || errorTenants ? 'Sync fault detected. Reconnecting...' : '';

  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const handleRefresh = useCallback(() => {
    refetchProperties();
    refetchTenants();
  }, [refetchProperties, refetchTenants]);

  const stats = useMemo(() => {
    const overdueTenants = tenants.filter(t => t.status !== 'paid');
    const totalRent = tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);
    const collectedRent = tenants.filter(t => t.status === 'paid').reduce((acc, t) => acc + (t.rentAmount || 0), 0);
    const overdueAmount = totalRent - collectedRent;

    return {
      totalProperties: properties.length,
      totalTenants: tenants.length,
      collectedRent,
      overdueAmount,
      overdueCount: overdueTenants.length,
      recentTenants: tenants.slice(0, 3),
      overdueList: overdueTenants.slice(0, 4)
    };
  }, [properties, tenants]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center mx-auto border border-indigo-100/30">
            <AlertCircle className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sync Fault</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{error}</p>
          </div>
          <Button onClick={handleRefresh} className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <span className="group-hover:mr-2 transition-all">Reconnect Terminal</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !loading && properties.length === 0;

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full space-y-8 lg:space-y-12 pb-24 animate-in fade-in duration-700">
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onSuccess={handleRefresh}
      />
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={handleRefresh}
      />

      {/* 1. SMART INSIGHTS BAR (MOBILE OPTIMIZED) */}
      {!loading && !isEmpty && (
        <div className="bg-indigo-600 border border-indigo-500 rounded-[24px] lg:rounded-[32px] p-5 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-1000 shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm shrink-0">
              <Sparkles className="h-5 w-5 text-indigo-100" />
            </div>
            <div>
               <p className="text-sm lg:text-base font-bold text-white tracking-tight leading-tight">
                 {stats.overdueCount > 0 
                   ? `${stats.overdueCount} Critical Overdue Payments` 
                   : "Portfolio Health Optimal"}
               </p>
               <p className="text-[10px] lg:text-[11px] font-bold text-indigo-200 uppercase tracking-widest mt-0.5">
                 {stats.overdueCount > 0 
                   ? "Action Required Immediately" 
                   : "All systems clear and performing"}
               </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t border-white/10 sm:border-0">
            <div className="space-y-0.5">
              <span className="block text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em]">Monthly Goal</span>
              <span className="text-lg font-black text-white leading-none">₦{formatCurrency(stats.collectedRent)}</span>
            </div>
            <ArrowRight className="h-5 w-5 text-white/40 hidden sm:block" />
          </div>
        </div>
      )}

      {/* HEADER (MOBILE REFINED) */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-[10px] lg:text-sm text-slate-400 font-bold uppercase tracking-widest">Real-time status</p>
        </div>
        {!isEmpty && (
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={handleRefresh}
             className="h-11 w-11 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-indigo-600 active:rotate-180 transition-all duration-500 lg:hidden"
           >
             <History className="h-5 w-5" />
           </Button>
        )}
      </div>

      {/* 2. METRIC CARDS (MOBILE-FIRST GRID) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 lg:h-32 rounded-[24px] lg:rounded-[32px] bg-white border border-slate-100" />
          ))
        ) : (
          <>
            <MetricCard 
              label="Assets" 
              value={stats.totalProperties} 
              icon={<Building2 className="h-4 w-4 lg:h-5 lg:w-5" />} 
              color="indigo" 
            />
            <MetricCard 
              label="Tenants" 
              value={stats.totalTenants} 
              icon={<Users className="h-4 w-4 lg:h-5 lg:w-5" />} 
              color="slate" 
            />
            <MetricCard 
              label="Revenue" 
              value={`₦${formatCurrency(stats.collectedRent)}`} 
              icon={<CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5" />} 
              color="green" 
            />
            <MetricCard 
              label="Overdue" 
              value={`₦${formatCurrency(stats.overdueAmount)}`} 
              icon={<AlertCircle className="h-4 w-4 lg:h-5 lg:w-5" />} 
              color="amber" 
            />
          </>
        )}
      </div>

      {isEmpty && !loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto border border-slate-100">
              <Zap className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Ready</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Connect your first property asset to initialize the control center.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)} 
              className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              Initialize Portfolio
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* LEFT: ATTENTION & ACTIVITY */}
          <div className="lg:col-span-2 space-y-10 lg:space-y-12">
            {/* 3. WHAT NEEDS ATTENTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Critical Items</h2>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                  {stats.overdueCount} Alert
                </span>
              </div>
              <div className="grid gap-3">
                {loading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-20 rounded-[24px]" />)
                ) : stats.overdueList.length > 0 ? (
                  stats.overdueList.map((tenant) => (
                    <Card key={tenant._id} className="p-4 lg:p-5 border-slate-100 bg-white flex items-center justify-between group hover:bg-slate-50/50 transition-colors rounded-[24px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shadow-sm shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{tenant.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Rent Pending • ₦{formatCurrency(tenant.rentAmount)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white transition-all shrink-0">
                        Remind
                      </Button>
                    </Card>
                  ))
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-white/50 space-y-4">
                     <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto" />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Everything is up to date</p>
                  </div>
                )}
              </div>
            </section>

            {/* 4. RECENT ACTIVITY */}
            <section className="space-y-6">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] px-1">Global Feed</h2>
              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                {loading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-16 border-b border-slate-50" />)
                ) : (
                  tenants.slice(0, 5).map((tenant, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0 active:bg-slate-100">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                         <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">Rent Entry Recorded</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{tenant.name} • ₦{formatCurrency(tenant.rentAmount)}</p>
                      </div>
                      <span className="text-[9px] font-black text-slate-300 tabular-nums uppercase">Recently</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: QUICK ACTIONS (TOP PRIORITY ON MOBILE) */}
          <div className="space-y-10 lg:space-y-12">
            <section className="space-y-6">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] px-1">Quick Tasks</h2>
              <div className="grid grid-cols-1 gap-3 lg:gap-4">
                <ActionCard 
                  label="Add Asset" 
                  description="Register building" 
                  icon={<Building2 className="h-5 w-5" />} 
                  onClick={() => setIsPropertyModalOpen(true)}
                />
                <ActionCard 
                  label="Add Tenant" 
                  description="Onboard residents" 
                  icon={<Users className="h-5 w-5" />} 
                  onClick={() => setIsTenantModalOpen(true)}
                />
                <ActionCard 
                  label="Log Payment" 
                  description="Manual entry" 
                  icon={<DollarSign className="h-5 w-5" />} 
                  onClick={() => {}}
                />
              </div>
            </section>

            {/* UPGRADE TEASER */}
            <Card className="p-8 bg-slate-900 border-0 rounded-[32px] overflow-hidden relative group shadow-2xl shadow-slate-200">
              <div className="relative z-10 space-y-4">
                <h3 className="text-white font-black text-lg leading-tight tracking-tight">Pro Analytics</h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">Predictive revenue and tax reporting.</p>
                <Button className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                  Coming Soon
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 blur-3xl group-hover:bg-indigo-600/50 transition-all duration-1000" />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: 'indigo' | 'slate' | 'green' | 'amber' }) {
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100/50',
    slate: 'text-slate-600 bg-slate-50 border-slate-100/50',
    green: 'text-green-600 bg-green-50 border-green-100/50',
    amber: 'text-amber-600 bg-amber-50 border-amber-100/50',
  };

  return (
    <Card className="p-4 lg:p-6 border-slate-100 bg-white rounded-[24px] lg:rounded-[32px] shadow-sm hover:shadow-md transition-all active:scale-95 group">
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className={`w-9 h-9 lg:w-12 lg:h-12 rounded-[14px] lg:rounded-2xl flex items-center justify-center border ${colors[color]} transition-all group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <div className="space-y-0.5 lg:space-y-1">
          <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{label}</p>
          <p className="text-sm lg:text-2xl font-black text-slate-900 tracking-tight tabular-nums truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ActionCard({ label, description, icon, onClick }: { label: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 lg:p-5 bg-white border border-slate-100 rounded-[24px] flex items-center justify-between group hover:border-indigo-100 hover:bg-indigo-50/20 transition-all text-left shadow-sm active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
