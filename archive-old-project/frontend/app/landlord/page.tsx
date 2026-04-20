'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandlordSidebar } from '@/components/landlord-sidebar';
import { LandlordNavbar } from '@/components/landlord-navbar';
import { LandlordStatsCards } from '@/components/landlord-stats-cards';
import { TenantsTable } from '@/components/tenants-table';
import { LandlordRecentPayments } from '@/components/landlord-recent-payments';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Loader2, MessageSquare, ChevronRight, Sparkles, ArrowRight, X, AlertCircle, ShieldCheck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LandlordDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const { 
    fetchDashboard, 
    fetchTenants, 
    fetchPayments, 
    isDemoActive, 
    loadDemoData, 
    clearDemoData,
    tenants,
    loading: dashboardLoading
  } = useDashboardStore();

  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    } else if (!authLoading && user?.role !== 'landlord') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'landlord') {
      fetchDashboard();
      fetchTenants();
      fetchPayments();
    }
  }, [isAuthenticated, user, fetchDashboard, fetchTenants, fetchPayments]);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    const result = await loadDemoData();
    setIsSeeding(false);
    if (result.success) {
      toast.success('Demo environment initialized');
    } else {
      toast.error(result.message || 'Failed to seed demo data');
    }
  };

  const handleClearDemo = async () => {
    const result = await clearDemoData();
    if (result.success) {
      toast.success('Demo data cleared');
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl animate-bounce text-blue-600">
             <Sparkles size={32} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  // Derive immediate focus from overdue tenants
  const overdueTenants = tenants.filter(t => t.rentStatus === 'overdue').slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <LandlordSidebar />
      <LandlordNavbar />

      {/* Main Content */}
      <main className="lg:ml-72 mt-20 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto transition-all duration-300">
        
        {/* Demo Mode Alert */}
        {isDemoActive && (
          <div className="mb-8 bg-blue-600 rounded-[32px] p-6 text-white flex items-center justify-between shadow-2xl shadow-blue-600/20 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="font-black text-sm tracking-tight uppercase italic text-blue-100 leading-none">Perspective View</p>
                <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase mt-1">Viewing Demo Environment</p>
              </div>
            </div>
            <button 
              onClick={handleClearDemo}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg"
            >
              Clear Demo Data
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              E k&apos;aabo, {user?.name?.split(' ')[0] || 'Landlord'}!
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Rentra Empire Overview • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          {(!isDemoActive && tenants.length === 0) && (
            <Button 
              onClick={handleSeedDemo}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8 py-8 shadow-2xl shadow-blue-600/30 flex items-center gap-3 transition-all hover:-translate-y-1"
            >
              {isSeeding ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              <span className="text-sm uppercase tracking-widest">Load Demo Data</span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <LandlordStatsCards />

        {/* Immediate Focus */}
        {tenants.length > 0 ? (
          <div className="mb-10 space-y-4">
              <div className="flex items-center justify-between px-2">
                   <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                       Immediate Focus
                       {overdueTenants.length > 0 && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
                   </h3>
                   <button onClick={() => router.push('/landlord/tenants')} className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b-2 border-blue-600/20 pb-1 hover:border-blue-600 transition-all">
                       Full Directory
                   </button>
              </div>

              {overdueTenants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {overdueTenants.map(tenant => (
                       <div key={tenant._id} className="premium-card p-6 flex items-center justify-between group cursor-pointer border-l-[6px] border-l-rose-500 hover:scale-[1.01]">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-black">
                                  {tenant.unit || '??'}
                              </div>
                              <div>
                                  <p className="font-extrabold text-slate-900 tracking-tight">{tenant.name}</p>
                                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Rent Overdue</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <button className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                  <MessageSquare size={18} />
                              </button>
                              <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors" size={20} />
                          </div>
                       </div>
                    ))}
                </div>
              ) : (
                <div className="p-10 bg-white rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                       <ShieldCheck size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Portfolio Stabilized</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">No critical rent issues detected currently.</p>
                </div>
              )}
          </div>
        ) : (
          <div className="mb-10 p-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[32px] flex items-center justify-center mb-8 rotate-3">
                 <Building2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Your Empire Awaits.</h2>
              <p className="text-slate-400 font-bold max-w-sm mb-10 leading-relaxed uppercase text-[11px] tracking-widest">
                Start by adding your first property or loading our exploration dataset to see the power of Rentra.
              </p>
              <div className="flex items-center gap-4">
                 <Button onClick={() => router.push('/landlord/tenants')} className="bg-slate-900 text-white rounded-2xl px-12 py-8 font-black uppercase tracking-widest text-xs shadow-xl">
                    Add Property
                 </Button>
                 <Button onClick={handleSeedDemo} variant="outline" className="rounded-2xl px-8 py-8 font-black uppercase tracking-widest text-xs border-slate-200">
                    See Demo View
                 </Button>
              </div>
          </div>
        )}

        {/* Main Grid */}
        <div className={`${tenants.length === 0 && !dashboardLoading ? 'opacity-20 grayscale pointer-events-none' : ''} grid grid-cols-1 lg:grid-cols-3 gap-10 transition-all duration-700`}>
          {/* Tenants Table */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-6">
                Active Portfolio
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{tenants.length} Total</span>
              </h2>
              <TenantsTable />
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="lg:col-span-1 space-y-8">
             {/* Smart Assistant Nudge */}
             <div className="bg-[#1e1b4b] rounded-[32px] p-8 text-white flex flex-col gap-6 cursor-pointer hover:bg-[#2e2b5b] transition-all shadow-2xl shadow-indigo-950/20 group border border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm tracking-tight uppercase italic text-blue-400 leading-none">Smart Assistant</h4>
                        <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase mt-1">AI analysis in progress</p>
                    </div>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-between group-hover:bg-blue-600 transition-colors">
                    Analyze Portfolio <ArrowRight size={14} />
                </div>
            </div>

            <LandlordRecentPayments />
          </div>
        </div>
      </main>
    </div>
  );
}
