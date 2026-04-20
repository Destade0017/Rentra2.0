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

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProperties} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your rental properties
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : properties.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <Empty
            icon={<Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
            title="No properties yet"
            description="Create your first property to start managing tenants and track rent payments."
          />
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2 mt-6 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add First Property
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Card key={property._id} className="p-6 bg-card border-border hover:shadow-md transition-shadow flex flex-col justify-between h-48">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg truncate">{property.name}</h3>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="line-clamp-2">{property.address}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between mt-4 text-accent hover:bg-accent/10 group">
                View Details
                <Plus className="h-4 w-4 transform group-hover:rotate-90 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
