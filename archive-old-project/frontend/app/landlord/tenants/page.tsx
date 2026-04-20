'use client';

import { useState } from 'react';
import { LandlordSidebar } from '@/components/landlord-sidebar';
import { LandlordNavbar } from '@/components/landlord-navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { TenantsTable } from '@/components/tenants-table';
import { AddTenantModal } from '@/components/add-tenant-modal';

interface Tenant {
  id: string;
  name: string;
  email: string;
  property: string;
  rentStatus: 'paid' | 'due' | 'overdue';
  amount: string;
  dueDate: string;
}

export default function TenantsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [additionalTenants, setAdditionalTenants] = useState<Tenant[]>([]);

  const handleAddTenant = (data: {
    name: string;
    email: string;
    property: string;
    rentAmount: string;
  }) => {
    const newTenant: Tenant = {
      id: `new-${Date.now()}`,
      name: data.name,
      email: data.email,
      property: data.property,
      rentStatus: 'due',
      amount: `₦${data.rentAmount}`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };
    setAdditionalTenants((prev) => [newTenant, ...prev]);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'all';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <LandlordSidebar />
      <LandlordNavbar />

      <main className="lg:ml-72 mt-20 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Tenant Directory
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Portfolio Management • {additionalTenants.length + 6} Active Members
            </p>
          </div>
          
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8 py-8 shadow-2xl shadow-blue-600/30 flex items-center gap-3 group transition-all hover:-translate-y-1"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm uppercase tracking-widest">Onboard Tenant</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-premium mb-10">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <Input
                placeholder="Search by name, unit, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-7 pl-12 pr-4 text-sm font-bold focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-300 transition-all"
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 border-none min-w-[200px]">
                  <SlidersHorizontal size={18} className="text-slate-400" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0 font-bold text-slate-600 uppercase tracking-widest text-[11px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      <SelectItem value="all" className="font-bold text-xs uppercase tracking-widest text-slate-500">All Status</SelectItem>
                      <SelectItem value="paid" className="font-bold text-xs uppercase tracking-widest text-emerald-500">Paid</SelectItem>
                      <SelectItem value="due" className="font-bold text-xs uppercase tracking-widest text-blue-500">Due</SelectItem>
                      <SelectItem value="overdue" className="font-bold text-xs uppercase tracking-widest text-rose-500">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={handleClearFilters}
                    className="rounded-2xl px-4 py-7 font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    Reset
                  </Button>
               )}
            </div>
          </div>
        </div>

        {/* Intelligence Nudge */}
        {!hasActiveFilters && (
          <div className="mb-10 animate-subtle-slide">
              <div className="bg-[#1e1b4b] rounded-[32px] p-6 text-white flex items-center justify-between border border-white/10 shadow-xl shadow-indigo-950/20">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                          <Sparkles size={24} />
                      </div>
                      <div>
                          <p className="font-black text-sm tracking-tight uppercase italic text-blue-400">Portfolio Insight</p>
                          <p className="text-[10px] text-white/60 font-medium tracking-widest uppercase">3 Overdue tenants require immediate attention.</p>
                      </div>
                  </div>
                  <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-6 h-12">
                      Review Critical Cases
                  </Button>
              </div>
          </div>
        )}

        {/* Table Container */}
        <div className="premium-card overflow-hidden border-none shadow-premium bg-white">
           <TenantsTable
             searchQuery={searchQuery}
             filterStatus={filterStatus === 'all' ? '' : filterStatus}
             additionalTenants={additionalTenants}
           />
        </div>
      </main>

      {/* Add Tenant Modal */}
      <AddTenantModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddTenant={handleAddTenant}
      />
    </div>
  );
}
