'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Building2, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useProperties, Property } from '@/hooks/use-properties';
import { AddPropertyModal } from '@/components/modals/add-property-modal';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

export default function PropertiesPage() {
  const { 
    data: properties = [], 
    isLoading: loading, 
    error, 
    refetch: fetchProperties 
  } = useProperties();
  
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center mx-auto border border-indigo-100/30">
            <AlertCircle className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sync Fault</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Failed to retrieve property assets.</p>
          </div>
          <Button onClick={() => fetchProperties()} className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <span className="group-hover:mr-2 transition-all">Retry Connection</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40 rounded-xl" />
            <Skeleton className="h-4 w-60 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-[16/9] w-full rounded-[32px]" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-10 lg:space-y-12 pb-24 animate-in fade-in duration-700">
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onSuccess={fetchProperties} 
      />
      <AddTenantModal
        isOpen={isTenantModalOpen}
        onClose={() => {
          setIsTenantModalOpen(false);
          setSelectedPropertyId(undefined);
        }}
        onSuccess={fetchProperties}
        defaultPropertyId={selectedPropertyId}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Properties</h1>
          <p className="text-[10px] lg:text-sm text-slate-400 font-bold uppercase tracking-widest">Asset Management</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedPropertyId(undefined);
            setIsPropertyModalOpen(true);
          }}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 lg:h-12 px-8 shadow-xl shadow-indigo-100 font-bold transition-all w-full md:w-auto active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto border border-slate-100">
              <Building2 className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No Properties</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Start by adding your first property to manage units and tenants.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)}
              className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              Add Your First Property
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col p-0 hover:shadow-md transition-all group">
              <div className="aspect-[16/9] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-8 w-8 text-slate-200" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-white shadow-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">Active Asset</span>
                   </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight truncate">{property.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-tight">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-4 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Category</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-50 px-2.5 py-1 rounded-lg">Residential</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <Button 
                       variant="ghost" 
                       onClick={() => {
                         setSelectedPropertyId(property._id);
                         setIsTenantModalOpen(true);
                       }}
                       className="rounded-2xl h-12 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all border border-transparent font-black text-[10px] uppercase tracking-widest active:scale-95"
                     >
                       <Plus className="h-3.5 w-3.5 mr-2" />
                       Add Resident
                     </Button>
                     <Button variant="outline" className="rounded-2xl h-12 border-slate-100 hover:bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest active:scale-95">
                        Manage
                     </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
