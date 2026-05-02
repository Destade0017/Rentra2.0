'use client';

import { useState, useCallback, useMemo } from 'react';
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

  // Modal states
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const handleRefresh = useCallback(() => {
    refetchProperties();
    refetchTenants();
  }, [refetchProperties, refetchTenants]);

  // Premium Calculations
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
      recentTenants: tenants.slice(0, 3), // Mocking recent for now as backend doesn't have sort
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
    <div className="flex-1 max-w-[1200px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-700">
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

      {/* 1. SMART INSIGHTS BAR */}
      {!loading && !isEmpty && (
        <div className="bg-indigo-600/5 border border-indigo-100/50 rounded-[24px] p-4 lg:px-8 flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-bold text-indigo-900 tracking-tight">
              {stats.overdueCount > 0 
                ? `${stats.overdueCount} tenants are currently overdue on payments.` 
                : "All systems clear. Your portfolio is performing at 100% efficiency."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Expected this month:</span>
            <span className="text-sm font-black text-indigo-900">₦{stats.collectedRent.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Control Center</h1>
          <p className="text-sm text-slate-500 font-medium italic">Performance overview and critical actions.</p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={handleRefresh}
               className="h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600"
             >
               <History className="h-3.5 w-3.5 mr-2" />
               Refresh Data
             </Button>
          </div>
        )}
      </div>

      {/* 2. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-[32px] bg-slate-50" />
          ))
        ) : (
          <>
            <MetricCard 
              label="Total Properties" 
              value={stats.totalProperties} 
              icon={<Building2 className="h-5 w-5" />} 
              color="indigo" 
            />
            <MetricCard 
              label="Total Tenants" 
              value={stats.totalTenants} 
              icon={<Users className="h-5 w-5" />} 
              color="slate" 
            />
            <MetricCard 
              label="Rent Collected" 
              value={`₦${stats.collectedRent.toLocaleString()}`} 
              icon={<CheckCircle2 className="h-5 w-5" />} 
              color="green" 
            />
            <MetricCard 
              label="Overdue Rent" 
              value={`₦${stats.overdueAmount.toLocaleString()}`} 
              icon={<AlertCircle className="h-5 w-5" />} 
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: ATTENTION & ACTIVITY */}
          <div className="lg:col-span-2 space-y-12">
            {/* 3. WHAT NEEDS ATTENTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">What Needs Attention</h2>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  {stats.overdueCount} Critical
                </span>
              </div>
              <div className="grid gap-4">
                {loading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)
                ) : stats.overdueList.length > 0 ? (
                  stats.overdueList.map((tenant) => (
                    <Card key={tenant._id} className="p-5 border-slate-100/60 flex items-center justify-between group hover:bg-slate-50/50 transition-colors rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Overdue • ₦{tenant.rentAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                        Action
                      </Button>
                    </Card>
                  ))
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px] space-y-4">
                     <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Everything is up to date</p>
                  </div>
                )}
              </div>
            </section>

            {/* 4. RECENT ACTIVITY */}
            <section className="space-y-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Recent Activity</h2>
              <div className="space-y-0.5">
                {loading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)
                ) : (
                  tenants.slice(0, 5).map((tenant, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700">Payment Processed</p>
                        <p className="text-[10px] text-slate-400 font-medium">From {tenant.name} • ₦{tenant.rentAmount.toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 tabular-nums">2h ago</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: QUICK ACTIONS */}
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Quick Actions</h2>
              <div className="grid gap-4">
                <ActionCard 
                  label="Add Property" 
                  description="Register a new building" 
                  icon={<Building2 className="h-5 w-5" />} 
                  onClick={() => setIsPropertyModalOpen(true)}
                />
                <ActionCard 
                  label="Add Tenant" 
                  description="Onboard new residents" 
                  icon={<Users className="h-5 w-5" />} 
                  onClick={() => setIsTenantModalOpen(true)}
                />
                <ActionCard 
                  label="Record Payment" 
                  description="Manual rent entry" 
                  icon={<DollarSign className="h-5 w-5" />} 
                  onClick={() => {}}
                />
              </div>
            </section>

            {/* UPGRADE TEASER */}
            <Card className="p-8 bg-slate-900 border-0 rounded-[32px] overflow-hidden relative group">
              <div className="relative z-10 space-y-4">
                <h3 className="text-white font-bold text-lg leading-tight">Professional Insights coming soon.</h3>
                <p className="text-slate-400 text-xs font-medium">Unlock predictive analytics and tax reporting for your portfolio.</p>
                <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest border-0">
                  Join Waitlist
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl group-hover:bg-indigo-600/40 transition-all duration-1000" />
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
    <Card className="p-6 border-slate-100/60 bg-white rounded-[32px] shadow-sm hover-lift group">
      <div className="flex flex-col gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]} transition-all group-hover:scale-110`}>
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ActionCard({ label, description, icon, onClick }: { label: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-5 bg-white border border-slate-100/60 rounded-[24px] flex items-center justify-between group hover:border-indigo-100 hover:bg-indigo-50/20 transition-all text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
