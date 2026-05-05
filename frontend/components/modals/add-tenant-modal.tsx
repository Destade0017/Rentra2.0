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
import { useAddTenant } from '@/hooks/use-tenants';
import { useProperties } from '@/hooks/use-properties';
import { toast } from 'sonner';
import { useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultPropertyId?: string;
}

export function AddTenantModal({ isOpen, onClose, onSuccess, defaultPropertyId }: AddTenantModalProps) {
  const [uploading, setUploading] = useState(false);
  const { data: properties = [] } = useProperties();
  const addTenant = useAddTenant();
  const [profileImage, setProfileImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    rentAmount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultPropertyId) {
        setFormData(prev => ({ ...prev, property: defaultPropertyId }));
      }
    }
  }, [isOpen, defaultPropertyId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large (max 2MB)');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file, 'rentra-files', 'tenants');
      setProfileImage(url);
      toast.success('Profile image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
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

    try {
      await addTenant.mutateAsync({
        ...formData,
        rentAmount: Number(formData.rentAmount),
        profileImage
      });
      toast.success('Resident Successfully Contracted', {
        className: 'rounded-2xl font-bold uppercase tracking-tighter text-[10px]'
      });
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error adding tenant:', error);
      toast.error(error.response?.data?.message || 'Operational Fault');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', property: '', rentAmount: '', dueDate: '' });
    setProfileImage('');
    onClose();
  };

  const loading = addTenant.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-100 rounded-[40px] p-0 overflow-hidden gap-0 shadow-2xl shadow-slate-200">
        <DialogHeader className="p-10 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add New Tenant</DialogTitle>
          <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">Assign a tenant to one of your properties.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-10 py-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</Label>
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
            <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</Label>
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
            <Label htmlFor="phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
              WhatsApp Number <span className="text-slate-300 normal-case font-medium tracking-normal">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 select-none">+234</span>
              <Input
                id="phone"
                type="tel"
                placeholder="8012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
                className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium pl-[3.75rem]"
              />
            </div>
            <p className="text-[9px] text-slate-300 ml-1">Used to send WhatsApp rent reminders</p>
          </div>
          <div className="space-y-3">
            <Label htmlFor="property" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Select Property</Label>
            <Select 
              onValueChange={(val) => setFormData({ ...formData, property: val })}
              value={formData.property}
              disabled={loading || !!defaultPropertyId}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white text-sm font-medium">
                <SelectValue placeholder="Select a property" />
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
              <Label htmlFor="rentAmount" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Monthly Rent ($)</Label>
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
              <Label htmlFor="dueDate" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Rent Due Date</Label>
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

          {/* Profile Image Upload */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Profile Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              {profileImage ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setProfileImage('')}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || uploading}
                  className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center hover:bg-slate-50 hover:border-indigo-100 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-slate-300" />
                  )}
                </button>
              )}
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-tighter">
                  {profileImage ? 'Profile image attached' : 'Click to upload a profile photo'}
                </p>
                <p className="text-[9px] text-slate-300 mt-0.5">JPG, PNG or GIF up to 2MB</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
          <DialogFooter className="p-10 pt-6 bg-slate-50/30 -mx-10 mt-6 md:flex-row-reverse border-t border-slate-50">
            <Button
              type="submit"
              loading={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-10 font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all w-full md:w-auto"
            >
              Add Tenant
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
              className="text-xs font-bold text-slate-400 hover:text-slate-900 px-6 h-14 rounded-2xl w-full md:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
