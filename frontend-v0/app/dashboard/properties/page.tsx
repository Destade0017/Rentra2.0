'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Building2, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { AddPropertyModal } from '@/components/modals/add-property-modal';

import { AddTenantModal } from '@/components/modals/add-tenant-modal';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loading) {
    return (
      <div className="flex-1 space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-[32px] border border-slate-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-20 pb-40 animate-in fade-in duration-1000">
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

      {/* TIER 1: ASSET COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 px-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Assets</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and monitor your physical portfolio.</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedPropertyId(undefined);
            setIsPropertyModalOpen(true);
          }}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-8 shadow-xl shadow-indigo-100 font-bold tracking-tight transition-all w-full md:w-auto active:scale-95"
        >
          <Plus className="h-5 w-5 mr-3" />
          Onboard New Asset
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="p-24 border-dashed border-2 border-slate-200/60 bg-white text-center rounded-[40px] animate-in zoom-in-95 duration-700">
          <div className="max-w-[340px] mx-auto space-y-10">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] shadow-inner border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <Building2 className="h-10 w-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Empty Portfolio</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Your management controls will activate once your first property is onboarded.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-10 font-bold shadow-xl shadow-indigo-100 w-full active:scale-95"
            >
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden bg-white border border-slate-200/50 rounded-[32px] shadow-sm flex flex-col p-0 hover-lift group">
              {/* Institutional Media Header */}
              <div className="aspect-[16/10] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100/50">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Building2 className="h-10 w-10 text-slate-200" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">No Media</span>
                  </div>
                )}
                {/* Contextual Status Tag */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                     <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900">Active</span>
                   </div>
                </div>
              </div>

              {/* Expensive Content Architecture */}
              <div className="p-10 space-y-12 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight leading-tight">{property.name}</h3>
                    <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
                      <span className="truncate">{property.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex flex-col gap-8 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Asset Class</span>
                      <span className="text-xs font-bold text-slate-900">Residential</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => {
                           setSelectedPropertyId(property._id);
                           setIsTenantModalOpen(true);
                         }}
                         className="rounded-2xl h-11 px-5 bg-slate-50/50 hover:bg-slate-100/80 text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 group/action flex items-center gap-2"
                       >
                         <Plus className="h-4 w-4 transition-transform group-active/action:scale-75" />
                         <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Sign Resident</span>
                       </Button>
                       <Button variant="outline" className="text-xs font-bold text-slate-600 rounded-2xl h-11 px-6 bg-white hover:bg-slate-50 border-slate-200/60">
                          Configure
                       </Button>
                    </div>
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
