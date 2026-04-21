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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex-1 space-y-10 animate-in fade-in duration-700">
      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProperties} 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Properties</h1>
          <p className="text-zinc-500 font-medium">
            Manage your real estate data and rental units.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-11 px-6 shadow-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="p-16 border-dashed border-2 border-zinc-200 bg-zinc-50/30 text-center rounded-3xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto">
              <Building2 className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">No properties found</h2>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Your portfolio is currently empty. Add your first property to begin managing your tenants.
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl h-12 px-8 font-bold shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="p-8 bg-white border-zinc-100 rounded-3xl shadow-sm card-hover flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-950 border border-zinc-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-xl text-zinc-950 truncate tracking-tight">{property.name}</h3>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-500 font-medium leading-relaxed">
                  <MapPin className="h-4 w-4 mt-1 shrink-0 text-zinc-300" />
                  <p className="text-sm line-clamp-2">{property.address}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between mt-8 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl h-10 px-3 transition-all group/btn">
                <span className="text-xs font-bold uppercase tracking-widest">Details</span>
                <Plus className="h-4 w-4 transform group-hover/btn:rotate-90 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
