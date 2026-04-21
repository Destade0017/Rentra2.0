'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Building2, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { AddPropertyModal } from '@/components/modals/add-property-modal';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

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
      <div className="flex-1 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl border border-zinc-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onSuccess={fetchProperties} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950">Properties</h1>
          <p className="text-sm lg:text-base text-zinc-500 font-medium">
            Manage your real estate data and rental units.
          </p>
        </div>
        <Button 
          onClick={() => setIsPropertyModalOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-12 lg:h-11 px-6 shadow-sm font-semibold transition-all w-full md:w-auto"
        >
          <Plus className="h-5 w-5 lg:h-4 lg:w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="p-10 lg:p-16 border-dashed border-2 border-zinc-200 bg-white text-center rounded-[24px] lg:rounded-3xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-zinc-50 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 lg:h-10 lg:w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl lg:text-2xl font-bold text-zinc-950 tracking-tight">No properties found</h2>
              <p className="text-sm lg:text-base text-zinc-500 leading-relaxed font-medium px-4">
                Your portfolio is currently empty. Add your first property to begin.
              </p>
            </div>
            <Button 
              onClick={() => setIsPropertyModalOpen(true)}
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-14 lg:h-12 px-8 font-bold shadow-md w-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden bg-white border border-slate-200/50 rounded-[32px] shadow-sm flex flex-col p-0 hover-lift group">
              {/* Institutional Media Header */}
              <div className="aspect-[16/10] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100/50">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Building2 className="h-8 w-8 text-slate-200" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">No Media</span>
                  </div>
                )}
              </div>

              {/* Expensive Content Architecture */}
              <div className="p-10 space-y-10 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight leading-tight">{property.name}</h3>
                    <div className="flex items-center gap-2.5 text-slate-400 font-medium text-xs">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                      <span className="truncate">{property.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-slate-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Asset Class</span>
                    <span className="text-xs font-bold text-slate-900">Residential</span>
                  </div>
                  <Button variant="ghost" className="text-xs font-bold text-slate-400 hover:text-indigo-600 rounded-2xl h-10 px-5 bg-slate-50/50 border border-transparent hover:border-indigo-100/50">
                    View Asset
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
