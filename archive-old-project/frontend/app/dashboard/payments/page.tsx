'use client';

import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { PaymentsHistoryTable } from '@/components/payments-history-table';
import { PayNowModal } from '@/components/pay-now-modal';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  MapPin,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function TenantPaymentsPage() {
  const { fetchPayments, payments, loading } = useDashboardStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Derived tenant stats (mocking the "current bill" part for now based on first record or user profile)
  const currentBill = 250000; // Mock current rent
  const dueDate = 'May 1, 2024';

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <DashboardSidebar />

      <div className="flex-1 transition-all duration-300">
        <DashboardNavbar />

        <main className="p-6 md:p-10 lg:p-14 max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Billing Center
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Personal Account Management • Secure Transactions
            </p>
          </div>

          {/* Primary Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-2xl shadow-blue-900/10 rounded-[40px] overflow-hidden bg-[#1E1B4B] text-white p-10 flex flex-col justify-between relative group">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <CreditCard size={200} />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full mb-8">
                     <ShieldCheck size={16} className="text-blue-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Verified Secure Account</span>
                  </div>
                  
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">Outstanding Rent Balance</p>
                  <h2 className="text-6xl font-black tracking-tighter mb-4">₦{currentBill.toLocaleString()}</h2>
                  
                  <div className="flex items-center gap-6 mt-8">
                     <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-white/40" />
                        <span className="text-xs font-bold text-white/60">Due {dueDate}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-white/40" />
                        <span className="text-xs font-bold text-white/60">Unit 4B, Sunset Blvd</span>
                     </div>
                  </div>
               </div>

               <div className="relative z-10 mt-12">
                  <Button 
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-10 py-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                  >
                    Clear Balance Now
                    <ArrowRight size={20} />
                  </Button>
               </div>
            </Card>

            <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex flex-col justify-between border-l-4 border-l-emerald-500">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Paid to Date</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">₦4,500,000</h4>
                   </div>
                   <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">12 Transactions</span>
                      <Sparkles size={16} className="text-emerald-500" />
                   </div>
                </Card>

                <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100 space-y-4">
                   <div className="flex items-center gap-3 text-amber-600">
                      <AlertCircle size={24} />
                      <span className="font-black text-xs uppercase tracking-widest">Notice</span>
                   </div>
                   <p className="text-sm font-bold text-amber-900/70 leading-relaxed">
                      Please ensure your payment is made before the 5th of each month to avoid the ₦5,000 late penalty fee.
                   </p>
                </div>
            </div>
          </div>

          {/* History Sections */}
          <div className="space-y-8 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
              <Button variant="link" className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Download All Receipts</Button>
            </div>
            
            <PaymentsHistoryTable />
          </div>
        </main>
      </div>

      <PayNowModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        defaultAmount={currentBill}
      />
    </div>
  );
}
