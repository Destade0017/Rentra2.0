'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, AlertCircle, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  property: string;
  rentStatus: 'paid' | 'due' | 'overdue';
  amount: string;
  dueDate: string;
}

interface TenantsTableProps {
  searchQuery?: string;
  filterStatus?: string;
  additionalTenants?: Tenant[];
}

export function TenantsTable({
  searchQuery = '',
  filterStatus = '',
  additionalTenants = [],
}: TenantsTableProps) {
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      property: 'Block A, Unit 4A',
      rentStatus: 'paid',
      amount: '₦200,000',
      dueDate: '2024-04-01',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      property: 'Block B, Unit 2B',
      rentStatus: 'paid',
      amount: '₦180,000',
      dueDate: '2024-04-05',
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      property: 'Block C, Unit 1C',
      rentStatus: 'due',
      amount: '₦210,000',
      dueDate: '2024-04-10',
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      property: 'Block D, Unit 3D',
      rentStatus: 'overdue',
      amount: '₦195,000',
      dueDate: '2024-03-15',
    },
    ...additionalTenants,
  ]);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        searchQuery === '' ||
        (tenant.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tenant.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tenant.property || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === '' || tenant.rentStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, filterStatus]);

  const getStatusBadge = (status: Tenant['rentStatus']) => {
    const configs = {
      paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Paid' },
      due: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Due' },
      overdue: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Overdue' },
    };

    const config = configs[status];

    return (
      <span className={`${config.bg} ${config.text} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-white`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-none">
      {filteredTenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mb-2">No results found</p>
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase text-center max-w-[240px]">
            {searchQuery || filterStatus
              ? 'Try widening your search parameters'
              : 'Add your first tenant to populate this directory'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Member Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 hidden md:table-cell">Unit Information</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Financials</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Portfolio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTenants.map((tenant) => {
                const propertyParts = tenant.property ? tenant.property.split(',') : ['Unknown'];
                const mainProperty = propertyParts[0];
                const subProperty = propertyParts.length > 1 ? propertyParts[1].trim() : '';

                return (
                  <tr
                    key={tenant.id || `tenant-${Math.random()}`} // Fallback for DB-provided _id or static id
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-600/5 rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm group-hover:scale-110 transition-transform">
                            {tenant.name ? tenant.name[0] : '?'}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{tenant.name}</p>
                            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                               <Mail size={12} />
                               <span className="text-[10px] font-bold lowercase tracking-normal">{tenant.email}</span>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                         <MapPin size={14} className="text-slate-200" />
                         <div>
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{mainProperty}</p>
                            {subProperty && (
                               <p className="text-[10px] font-bold text-slate-400">{subProperty}</p>
                            )}
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                         <p className="text-sm font-black text-slate-900 tracking-tight">{tenant.amount}</p>
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {tenant.dueDate ? new Date(tenant.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                            </span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {tenant.rentStatus ? getStatusBadge(tenant.rentStatus) : null}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                            <CreditCard size={18} />
                         </button>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                            <ChevronRight size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
