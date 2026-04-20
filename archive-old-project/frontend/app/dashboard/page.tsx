'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardNavbar } from '@/components/dashboard-navbar'
import { PaymentsTable } from '@/components/payments-table'
import { RepairsSection } from '@/components/repairs-section'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { 
  Loader2, 
  Zap, 
  CreditCard, 
  Wrench, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight, 
  Sparkles,
  Building2 
} from 'lucide-react'

// Sample data
const recentPayments = [
  {
    id: '1',
    date: 'Mar 1, 2024',
    amount: 2500,
    status: 'completed' as const,
    method: 'Bank Transfer',
  },
  {
    id: '2',
    date: 'Feb 1, 2024',
    amount: 2500,
    status: 'completed' as const,
    method: 'Bank Transfer',
  },
  {
    id: '3',
    date: 'Jan 15, 2024',
    amount: 2500,
    status: 'pending' as const,
    method: 'Credit Card',
  },
]

const repairRequests = [
  {
    id: '1',
    title: 'Kitchen faucet leaking',
    status: 'open' as const,
    priority: 'high' as const,
    submittedDate: 'Mar 10, 2024',
  },
  {
    id: '2',
    title: 'Bedroom window blind repair',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    submittedDate: 'Mar 5, 2024',
  },
]

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    } else if (!loading && user?.role !== 'tenant') {
      router.push('/landlord');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl animate-bounce text-blue-600">
             <Sparkles size={32} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Entering Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardSidebar />

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <DashboardNavbar />

        <main className="flex-1 p-6 md:p-10 lg:p-14 mt-20 max-w-7xl mx-auto w-full transition-all duration-300">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Personalized Tenant Hub • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Massive KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 group/stats">
             {/* Rent Status Card */}
             <div className="bg-[#0f172a] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-950/20 group hover:-translate-y-1 transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <CreditCard size={120} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Current Balance</p>
                <div className="flex flex-col relative z-10">
                  <span className="text-4xl font-black tracking-tight leading-tight">₦150,000</span>
                  <div className="flex items-center gap-3 mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                        Pay Rent Now
                      </Button>
                      <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-400/10 px-3 py-2 rounded-full">
                        Due in 5 days
                      </span>
                  </div>
                </div>
             </div>

             {/* Lease Health Card */}
             <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-premium relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                <div className="absolute -right-6 -bottom-6 p-8 opacity-5 text-indigo-950 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck size={160} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Lease Status</p>
                <div className="flex flex-col relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-black tracking-tight leading-tight text-slate-900">Active</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest ml-2">Good Standing</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full mt-6 overflow-hidden">
                    <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-1000 w-[65%]" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Lease ends in 4 months (Aug 2024)</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
               {/* Quick Actions */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                     Quick Center
                     <Zap className="text-blue-500 fill-blue-500" size={18} />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button className="premium-card p-6 flex items-center justify-between group hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                              <CreditCard size={20} />
                           </div>
                           <div className="text-left">
                              <p className="font-extrabold text-slate-900 tracking-tight">Setup Auto-Pay</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Never miss a payment</p>
                           </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-blue-500" />
                     </button>
                     <button className="premium-card p-6 flex items-center justify-between group hover:border-amber-500 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black">
                              <Wrench size={20} />
                           </div>
                           <div className="text-left">
                              <p className="font-extrabold text-slate-900 tracking-tight">Request Repair</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quick maintenance fix</p>
                           </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-amber-500" />
                     </button>
                  </div>
               </div>

               {/* Payments Table */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent History</h2>
                     <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Download Statements</button>
                  </div>
                  <div className="premium-card overflow-hidden border-none shadow-premium">
                     <PaymentsTable payments={recentPayments} />
                  </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-8">
               {/* Unit Profile */}
               <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col gap-6 relative overflow-hidden border border-white/5 shadow-2xl shadow-indigo-950/20 group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500 group-hover:scale-110 transition-transform duration-700">
                    <Building2 size={120} />
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                     <h4 className="font-black text-xs tracking-widest uppercase italic text-blue-400">Your Unit Profile</h4>
                     <p className="text-3xl font-black tracking-tight">Apartment 4B</p>
                     <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Prime Residences • Block A</p>
                  </div>
                  <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rent Amount</span>
                        <span className="text-sm font-black tracking-tight">₦150,000 / mo</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Electricity IP</span>
                        <span className="text-sm font-black tracking-tight">192.168.10.4</span>
                     </div>
                  </div>
                  <button className="bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group relative z-10">
                     View Full Lease <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>

               <RepairsSection repairs={repairRequests} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
