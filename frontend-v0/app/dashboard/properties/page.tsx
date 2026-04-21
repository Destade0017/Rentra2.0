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
            <Card key={property._id} className="group overflow-hidden bg-white border-zinc-100 rounded-[32px] shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all duration-500 flex flex-col p-0">
              {/* Image Header */}
              <div className="aspect-[16/10] w-full bg-zinc-100 relative overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-300">
                    <Building2 className="h-10 w-10 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Media Sync</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Active Asset</p>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-zinc-950 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{property.name}</h3>
                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-[0.1em] text-[10px]">
                       <MapPin className="h-3 w-3" />
                       <span className="truncate">{property.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-zinc-50 mt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-7 w-7 rounded-full bg-zinc-50 border-2 border-white ring-1 ring-zinc-100" />
                    ))}
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl px-4 group/btn">
                    Details <Plus className="h-3 w-3 ml-2 transform group-hover/btn:rotate-90 transition-transform" />
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
