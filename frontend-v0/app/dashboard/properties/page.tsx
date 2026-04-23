'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in duration-700">
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
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="text-sm text-slate-500">Manage your properties and units.</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedPropertyId(undefined);
            setIsPropertyModalOpen(true);
          }}
          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-6 shadow-md shadow-indigo-100 font-semibold transition-all w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="p-16 border-dashed border-2 bg-white text-center rounded-2xl">
          <div className="max-w-[300px] mx-auto space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 text-slate-300">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">No Properties</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add your first property to start tracking rent.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-8 font-semibold shadow-md shadow-indigo-100 w-full"
            >
              Add Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden bg-white border border-slate-200/50 rounded-2xl shadow-sm flex flex-col p-0 hover-lift group">
              <div className="aspect-[16/9] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100/50">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-8 w-8 text-slate-200" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Active</span>
                   </div>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">{property.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Type</span>
                    <span className="text-xs font-semibold text-slate-600">Residential</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button 
                       variant="ghost" 
                       size="sm"
                       onClick={() => {
                         setSelectedPropertyId(property._id);
                         setIsTenantModalOpen(true);
                       }}
                       className="rounded-xl h-9 px-4 bg-slate-50/50 hover:bg-slate-100/80 text-slate-500 hover:text-indigo-600 transition-all border border-transparent flex items-center gap-2"
                     >
                       <Plus className="h-3.5 w-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Add Tenant</span>
                     </Button>
                     <Button variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-xl h-9 px-4 bg-white hover:bg-slate-50 border-slate-200/60">
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
