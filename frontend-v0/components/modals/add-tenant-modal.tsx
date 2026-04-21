'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultPropertyId?: string;
}

export function AddTenantModal({ isOpen, onClose, onSuccess, defaultPropertyId }: AddTenantModalProps) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    property: '',
    rentAmount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultPropertyId) {
        setFormData(prev => ({ ...prev, property: defaultPropertyId }));
      }
      fetchProperties();
    }
  }, [isOpen, defaultPropertyId]);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.property || !formData.rentAmount || !formData.dueDate) {
      toast.error('Required criteria missing', {
        className: 'rounded-2xl font-bold uppercase tracking-tighter text-[10px]'
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/tenants', {
        ...formData,
        rentAmount: Number(formData.rentAmount),
      });
      toast.success('Resident Successfully Contracted', {
        className: 'rounded-2xl font-bold uppercase tracking-tighter text-[10px]'
      });
      setFormData({ name: '', email: '', property: '', rentAmount: '', dueDate: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding tenant:', error);
      toast.error(error.response?.data?.message || 'Operational Fault');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-100 rounded-[40px] p-0 overflow-hidden gap-0 shadow-2xl shadow-slate-200">
        <DialogHeader className="p-10 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Finalize Resident Assignment</DialogTitle>
          <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">Map a new resident record to your portfolio infrastructure.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-10 py-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Identity</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">System Mailbox</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="property" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Asset Mapping</Label>
            <Select 
              onValueChange={(val) => setFormData({ ...formData, property: val })}
              value={formData.property}
              disabled={loading || !!defaultPropertyId}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white text-sm font-medium">
                <SelectValue placeholder="Select target asset" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-100 rounded-2xl shadow-xl">
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id} className="text-sm font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-700 py-3 rounded-xl cursor-pointer">
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="rentAmount" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Fiscal Cycle ($)</Label>
              <Input
                id="rentAmount"
                type="number"
                placeholder="2500"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                disabled={loading}
                className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium tabular-nums"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="dueDate" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Protocol Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={loading}
                className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>
          <DialogFooter className="p-10 pt-6 bg-slate-50/30 -mx-10 mt-6 md:flex-row-reverse border-t border-slate-50">
            <Button
              type="submit"
              loading={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-10 font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all w-full md:w-auto"
            >
              Settle Assignment
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-xs font-bold text-slate-300 hover:text-slate-900 px-6 h-14 rounded-2xl w-full md:w-auto"
            >
              Abort Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
