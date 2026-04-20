'use client';

import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ReportIssueModal } from '@/components/report-issue-modal';
import { 
  Wrench, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function TenantRepairsPage() {
  const { complaints, fetchComplaints, loading } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'in-progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle size={18} />;
      case 'in-progress': return <Clock size={18} />;
      case 'resolved': return <CheckCircle2 size={18} />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardSidebar />

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <DashboardNavbar />

        <main className="flex-1 p-6 md:p-10 lg:p-14 mt-20 max-w-7xl mx-auto w-full transition-all duration-300">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                Maintenance
              </h1>
              <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
                {filteredComplaints.filter(c => c.status !== 'resolved').length} Active Issues • Property Support
              </p>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1e1b4b] hover:bg-[#2e2a6b] text-white font-black rounded-2xl px-10 py-8 shadow-2xl shadow-indigo-950/20 flex items-center gap-4 transition-all hover:-translate-y-1 group"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-500">
                <Plus size={18} />
              </div>
              <span className="text-xs uppercase tracking-widest">Report New Issue</span>
            </Button>
          </div>

          {/* Intelligent Search */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-premium mb-10 flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <Input 
                placeholder="Search requests by title or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 pl-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Status Overview Banner */}
          {filteredComplaints.some(c => c.status === 'in-progress') && (
            <div className="mb-10 bg-amber-500 rounded-[32px] p-6 text-white flex items-center justify-between shadow-2xl shadow-amber-500/20">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight uppercase leading-none text-white">Technician Dispatched</h4>
                    <p className="text-[10px] text-white/70 font-bold tracking-widest uppercase mt-1 text-white">Your reported issues are being actively handled</p>
                  </div>
               </div>
            </div>
          )}

          {/* Complaints Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {loading && complaints.length === 0 ? (
               <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Records...</p>
               </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="col-span-full bg-white rounded-[40px] p-24 border-2 border-dashed border-slate-100 text-center">
                  <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                    <Wrench size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">No Maintenance History</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-sm mx-auto mb-10">Everything seems to be working perfectly. If you find any issues, report them immediately.</p>
                  <Button onClick={() => setIsModalOpen(true)} className="bg-[#1e1b4b] text-white rounded-2xl px-12 py-7 font-black text-xs uppercase tracking-widest">
                    Submit First Report
                  </Button>
              </div>
            ) : (
              filteredComplaints.map((repair) => (
                <div key={repair._id} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-premium group hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-500 flex flex-col justify-between">
                   <div>
                      <div className="flex items-center justify-between mb-8">
                         <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${getStatusStyle(repair.status)}`}>
                            {getStatusIcon(repair.status)}
                            <span className="text-[10px] font-black uppercase tracking-widest">{repair.status.replace('-', ' ')}</span>
                         </div>
                         <Badge variant="outline" className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest border-2 rounded-2xl ${
                            repair.priority === 'urgent' ? 'border-rose-100 text-rose-500' : 
                            repair.priority === 'high' ? 'border-amber-100 text-amber-500' : 'border-slate-100 text-slate-400'
                         }`}>
                            {repair.priority} priority
                         </Badge>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase italic tracking-tight">{repair.title}</h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mb-10 line-clamp-2 italic">
                        "{repair.description}"
                      </p>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{repair.category}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{new Date(repair.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                      
                      <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group-hover:scale-110">
                         <Search size={18} />
                      </button>
                   </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <ReportIssueModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
