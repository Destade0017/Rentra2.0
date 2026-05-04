'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAddProperty } from '@/hooks/use-properties';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/supabase';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 2MB)`);
        continue;
      }

      try {
        setUploading(true);
        const url = await uploadImage(file, 'rentra-files', 'properties');
        setImages(prev => [...prev, url]);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addProperty = useAddProperty();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addProperty.mutateAsync({
        ...formData,
        images
      });
      toast.success('Property added successfully', {
        className: 'rounded-2xl font-bold uppercase tracking-tighter text-[10px]'
      });
      setFormData({ name: '', address: '' });
      setImages([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.response?.data?.message || 'Failed to sync property');
    }
  };

  const loading = addProperty.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-100 rounded-[40px] overflow-hidden p-0 gap-0 shadow-2xl shadow-slate-200 ring-1 ring-black/5">
        <DialogHeader className="p-10 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add Property</DialogTitle>
          <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">Register a new property to your portfolio.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 px-10 py-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Property Name</Label>
              <Input
                id="name"
                placeholder="e.g. Sunset Towers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="address" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Property Address</Label>
              <Input
                id="address"
                placeholder="123 Financial District"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
                className="rounded-2xl h-12 bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Property Photos</Label>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-inner">
                    <img src={img} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-80" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-75"
                    >
                      <X className="h-3 w-3 text-slate-900" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading || uploading}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-indigo-100 transition-all group active:scale-95 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    )}
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {uploading ? 'Uploading...' : 'Attach'}
                    </span>
                  </button>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple 
                className="hidden" 
              />
            </div>
          </div>

          <DialogFooter className="p-10 pt-6 bg-slate-50/30 -mx-10 mt-6 border-t border-slate-50 md:flex-row-reverse">
            <Button
              type="submit"
              loading={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 px-10 font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all w-full md:w-auto"
            >
              Add Property
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
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
