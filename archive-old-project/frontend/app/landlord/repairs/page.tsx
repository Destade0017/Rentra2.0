'use client';

import { useEffect, useState } from 'react';
import { LandlordSidebar } from '@/components/landlord-sidebar';
import { LandlordNavbar } from '@/components/landlord-navbar';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ReportIssueModal } from '@/components/report-issue-modal';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  MapPin,
  User,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function LandlordRepairsPage() {
  const { complaints, fetchComplaints, updateComplaint, loading } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const res = await updateComplaint(id, { status: newStatus });
    if (res.success) {
      toast.success(`Request marked as ${newStatus}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.tenant?.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'in-progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-rose-600 text-white shadow-lg shadow-rose-600/20';
      case 'high': return 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';
      default: return 'bg-blue-600 text-white shadow-lg shadow-blue-600/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <LandlordSidebar />
      <LandlordNavbar />

      <main className="lg:ml-72 mt-20 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto transition-all duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Maintenance Center
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              {filteredComplaints.length} Active Requests • Logistics Hub
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8 py-8 shadow-2xl shadow-blue-600/30 flex items-center gap-3 transition-all hover:-translate-y-1"
          >
            <Plus size={20} />
            <span className="text-sm uppercase tracking-widest">Post Repair</span>
          </Button>
        </div>

        {/* Global Toolbar */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-premium mb-10 flex flex-col lg:flex-row gap-6">
           <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <Input 
                placeholder="Search by title or tenant name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 pl-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-300 transition-all"
              />
           </div>
           
           <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl">
              {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f.replace('-', ' ')}
                </button>
              ))}
           </div>
        </div>

        {/* Intelligence Alert */}
        {complaints.some(c => c.priority === 'urgent' && c.status !== 'resolved') && (
           <div className="mb-10 bg-rose-500 rounded-[32px] p-6 text-white flex items-center justify-between shadow-2xl shadow-rose-500/20 animate-pulse">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight uppercase leading-none">Immediate Action Required</h4>
                    <p className="text-[10px] text-white/70 font-bold tracking-widest uppercase mt-1">High priority issues detected in your portfolio</p>
                  </div>
              </div>
           </div>
        )}

        {/* Request Grid */}
        <div className="space-y-6">
          {loading && complaints.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Ledger...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-[40px] p-24 border-2 border-dashed border-slate-100 text-center">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                   <Clock size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">No Requests Found</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto mb-10">Your maintenance ledger is currently empty. Any tenant reports will appear here.</p>
                <Button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white rounded-2xl px-12 py-7 font-black text-xs uppercase tracking-widest">
                   Log Manual Request
                </Button>
            </div>
          ) : (
            filteredComplaints.map((repair) => (
              <div 
                key={repair._id}
                className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-premium group hover:-translate-x-1 hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex flex-col xl:flex-row gap-10">
                   {/* Left: Status & Identity */}
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(repair.status)}`}>
                             {repair.status.replace('-', ' ')}
                          </span>
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getPriorityStyle(repair.priority)}`}>
                             {repair.priority}
                          </span>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors mb-2 uppercase italic">{repair.title}</h3>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-2xl">{repair.description}</p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                          <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Property</p>
                              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                                 <MapPin size={14} className="text-blue-500" /> {repair.property?.name || 'Main Portfolio'}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Reporter</p>
                              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                                 <User size={14} className="text-blue-500" /> {repair.tenant?.name || 'Manual Log'}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Logged Date</p>
                              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                                 <Calendar size={14} className="text-blue-500" /> {new Date(repair.createdAt).toLocaleDateString()}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Category</p>
                              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                                 <Wrench size={14} className="text-blue-500" /> {repair.category}
                              </div>
                          </div>
                      </div>
                   </div>

                   {/* Right: Actions */}
                   <div className="flex flex-row xl:flex-col justify-end xl:justify-center items-center gap-4 xl:pl-10 xl:border-l border-slate-50">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button className="h-16 px-10 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800">
                                Management <MoreVertical size={16} className="ml-2" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-2xl border-slate-100 p-2 w-56 shadow-2xl">
                             <DropdownMenuItem onClick={() => handleStatusUpdate(repair._id, 'pending')} className="rounded-xl font-bold py-3">Mark Pending</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusUpdate(repair._id, 'in-progress')} className="rounded-xl font-bold py-3">Mark In-Progress</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusUpdate(repair._id, 'resolved')} className="rounded-xl font-bold py-3 text-emerald-600">Mark Resolved</DropdownMenuItem>
                             <DropdownMenuItem className="rounded-xl font-bold py-3 text-rose-600">Close Case</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                       <Button variant="ghost" className="h-16 w-16 p-0 rounded-3xl bg-slate-50 text-slate-400 hover:text-blue-600 shadow-sm border border-slate-100">
                          <ChevronRight size={24} />
                       </Button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <ReportIssueModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
