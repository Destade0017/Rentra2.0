import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  MessageSquare, 
  Wrench, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Loader2,
  PlusCircle,
  History,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import api from '../api/axios.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Maintenance form state
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    category: 'Plumbing'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/tenants/me/dashboard');
      setDashboardData(data.data);
      
      // Fetch maintenance issues
      const maintRes = await api.get('/complaints');
      setMaintenance(maintRes.data.data || []);
      
      // Fetch real payments
      const payRes = await api.get('/payments/me');
      setHistory(payRes.data.data.map(p => ({
        id: p._id,
        date: new Date(p.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: p.amount,
        status: p.status,
        method: p.method
      })));
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
      setLoading(false);
    }
  };

  const handlePayRent = async () => {
    setIsProcessing(true);
    try {
      // For MVP, we record a manual payment. In production, this would open Paystack/Stripe
      await api.post('/payments', {
        tenantId: dashboardData._id,
        propertyId: dashboardData.property._id,
        amount: dashboardData.rent,
        method: 'Card Payment',
        notes: 'Rent payment via tenant portal'
      });
      
      setIsProcessing(false);
      setShowPayModal(false);
      setSuccessMessage('Rent payment of ₦' + dashboardData.rent.toLocaleString() + ' processed successfully!');
      fetchDashboardData(); // Refresh history
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await api.post('/complaints', {
        ...issueForm,
        property: dashboardData.property._id,
        unit: dashboardData.unit,
        priority: 'Medium' // Default priority
      });
      setIsProcessing(false);
      setShowIssueModal(false);
      setIssueForm({ title: '', description: '', category: 'Plumbing' });
      fetchDashboardData(); // Refresh
    } catch (error) {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-500" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Portal...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-[40px] border border-slate-100">
        <Building2 className="text-slate-200 mb-6" size={80} />
        <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Tenancy Found</h2>
        <p className="text-slate-500 font-medium max-w-sm">We couldn't find a tenant profile linked to {user?.email}. Please contact your property manager to link your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-subtle-slide max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-emerald-400"
          >
            <CheckCircle2 size={20} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Welcome Section */}
      <div className="bg-brand-500 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/30 blur-[100px] -mr-48 -mt-48 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-accent-300 mb-4">
              <ShieldCheck size={14} /> Resident Portal
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Welcome Home, {user.name.split(' ')[0]}.</h1>
            <p className="text-white/60 font-medium text-lg italic">{dashboardData.property.name} • {dashboardData.unit}</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setShowPayModal(true)}
              className="px-8 py-4 bg-accent-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-500/20 hover:bg-accent-600 transition-all flex items-center gap-2"
            >
              <Wallet size={16} /> Pay Rent
            </button>
            <button 
              onClick={() => setShowIssueModal(true)}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} /> Report Issue
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick View Stats */}
        <div className="lg:col-span-1 space-y-8">
          {/* Rent Summary Card */}
          <div className="bg-white p-8 rounded-[32px] shadow-premium border border-slate-100 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Status</span>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  dashboardData.rentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {dashboardData.rentStatus}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1 flex items-baseline gap-1">
                  ₦{dashboardData.rent.toLocaleString()}
                  <span className="text-sm text-slate-400 font-bold uppercase">Due</span>
                </h3>
                <p className="text-xs text-slate-400 font-bold">Cycle ends on {new Date(dashboardData.nextRentDate || dashboardData.leaseEnd).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-50">
               <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Balance Owed</span>
                <span className="text-sm font-black text-slate-900 leading-none">₦{dashboardData.balance.toLocaleString()}</span>
               </div>
               <button 
                onClick={() => setShowPayModal(true)}
                className="w-full py-4 bg-brand-500 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl shadow-brand-100/50 hover:bg-brand-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                Process Transaction <ArrowRight size={14} />
               </button>
            </div>
          </div>
        </div>

        {/* Support & History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Maintenance Summary */}
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-slate-100">
               <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <Wrench size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">{maintenance.length} Active</span>
               </div>
               <h4 className="text-xl font-black text-slate-900 mb-2">Maintenance Cases</h4>
               <p className="text-sm text-slate-500 font-medium mb-6">Track and report asset irregularities in your unit.</p>
               <div className="space-y-3">
                 {maintenance.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase italic">In Queue</span>
                    </div>
                 ))}
                 {maintenance.length === 0 && (
                   <p className="text-xs text-slate-300 font-bold italic py-2">No active tickets.</p>
                 )}
               </div>
            </div>

            {/* Messaging Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-slate-100 group cursor-pointer hover:border-accent-500 transition-colors">
               <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-accent-50 group-hover:text-accent-500 transition-colors">
                  <MessageSquare size={24} />
                </div>
                <ArrowUpRight size={20} className="text-slate-200 group-hover:text-accent-500" />
               </div>
               <h4 className="text-xl font-black text-slate-900 mb-2">Dialogue Hub</h4>
               <p className="text-sm text-slate-500 font-medium mb-6">Discuss lease terms or urgent matters with your landlord.</p>
               <button 
                onClick={() => navigate('/messages')}
                className="text-accent-500 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1"
               >
                Enter Chat <ArrowRight size={14} />
               </button>
            </div>
          </div>

          {/* Ledger History */}
          <div className="bg-white p-8 rounded-[32px] shadow-premium border border-slate-100">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History size={16} /> Transaction Ledger
                </h4>
                <button className="text-[10px] font-black text-accent-500 uppercase tracking-widest">Download Full Report</button>
             </div>
             <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase">Rent Payment Received</p>
                        <p className="text-[10px] text-slate-500 font-medium italic">{record.date} • {record.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">₦{record.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cleared</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)}
              className="absolute inset-0 bg-brand-500/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 pb-4">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Commit Rental Funds</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Initiating a secure transaction for <b>{dashboardData.unit}</b> at {dashboardData.property.name}.
                </p>
              </div>
              <div className="p-8 space-y-6">
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-slate-500 font-bold">Total Commitment</span>
                      <span className="text-2xl font-black text-slate-900 italic">₦{dashboardData.rent.toLocaleString()}</span>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-accent-500 cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="text-accent-500" />
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900 uppercase">Interactive Paystack</p>
                          <p className="text-[10px] text-slate-400 font-medium">Card, USSD, or Bank Transfer</p>
                        </div>
                        <CreditCard size={20} className="text-accent-500" />
                      </label>
                    </div>
                 </div>
                 <button 
                  onClick={handlePayRent}
                  disabled={isProcessing}
                  className="w-full py-4.5 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-brand-600 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate & Sync Funds'}
                 </button>
                 <button 
                  onClick={() => setShowPayModal(false)}
                  className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest"
                 >
                  Decline Transaction
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maintenance Issue Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIssueModal(false)}
              className="absolute inset-0 bg-brand-500/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
               <form onSubmit={handleSubmitIssue}>
                <div className="p-8 pb-4">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Report Irregularity</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Provide precise details for our technical response unit.
                  </p>
                </div>
                <div className="p-8 space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Category</label>
                      <select 
                        value={issueForm.category}
                        onChange={(e) => setIssueForm({...issueForm, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
                      >
                        <option>Plumbing</option>
                        <option>Electrical</option>
                        <option>General Repair</option>
                        <option>Appliance</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Title</label>
                      <input 
                        type="text" 
                        required
                        value={issueForm.title}
                        onChange={(e) => setIssueForm({...issueForm, title: e.target.value})}
                        placeholder="e.g. Master Bedroom Ceiling Leak"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-300"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Description</label>
                      <textarea 
                        rows={4}
                        required
                        value={issueForm.description}
                        onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
                        placeholder="Detail the irregularity for rapid synthesis..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-300 resize-none"
                      />
                   </div>
                   <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4.5 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-brand-600 disabled:opacity-50"
                   >
                     {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Sync with Support Unit'}
                   </button>
                </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
