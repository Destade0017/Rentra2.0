'use client';

import { useEffect, useState } from 'react';
import { LandlordSidebar } from '@/components/landlord-sidebar';
import { LandlordNavbar } from '@/components/landlord-navbar';
import { PaymentStats } from '@/components/payment-stats';
import { PaymentsHistoryTable } from '@/components/payments-history-table';
import { PayNowModal } from '@/components/pay-now-modal';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Plus, Building2, CreditCard, Wallet, Sparkles } from 'lucide-react';

export default function PaymentsPage() {
  const { fetchDashboard, fetchPayments, fetchTenants, loading } = useDashboardStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchPayments();
    fetchTenants();
  }, [fetchDashboard, fetchPayments, fetchTenants]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <LandlordSidebar />
      <LandlordNavbar />

      <main className="lg:ml-72 mt-20 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto transition-all duration-300">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Financial Vault
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Payments Monitoring • Live Transaction Logs
            </p>
          </div>
          
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8 py-8 shadow-2xl shadow-blue-600/30 flex items-center gap-3 group transition-all hover:-translate-y-1"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm uppercase tracking-widest">Post Transaction</span>
          </Button>
        </div>

        {/* Payment Metrics Section */}
        <PaymentStats />

        {/* Intelligence Banner */}
        <div className="mb-10 animate-subtle-slide">
            <div className="bg-[#1e1b4b] rounded-[32px] p-6 text-white flex flex-col md:flex-row md:items-center justify-between border border-white/10 shadow-xl shadow-indigo-950/20 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-tight uppercase italic text-blue-400 leading-none">Smart Collector</p>
                        <p className="text-[10px] text-white/50 font-medium tracking-widest uppercase mt-1">Rentra AI is ready to send reminders for 4 pending invoices.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="ghost" className="rounded-xl text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest px-4 h-12">Remind All</Button>
                   <Button className="bg-white text-indigo-950 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-12">Enable Auto-Pilot</Button>
                </div>
            </div>
        </div>

        {/* History Table Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Transaction Ledger
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync: Just now</p>
           </div>
           
           <PaymentsHistoryTable />
        </div>
      </main>

      {/* Record Payment Modal */}
      <PayNowModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
