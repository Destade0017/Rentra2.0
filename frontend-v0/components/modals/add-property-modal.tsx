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
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 2MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/properties', {
        ...formData,
        images
      });
      toast.success('Property optimized with media', {
        className: 'rounded-xl font-bold uppercase tracking-tighter'
      });
      setFormData({ name: '', address: '' });
      setImages([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.response?.data?.message || 'Failed to sync property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-100 rounded-[40px] overflow-hidden p-0 gap-0 shadow-2xl shadow-slate-200 ring-1 ring-black/5">
        <DialogHeader className="p-10 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Digitize Asset</DialogTitle>
          <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">Infrastructure mapping for new portfolio recruitment.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 px-10 py-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Asset Designation</Label>
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
              <Label htmlFor="address" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Geolocation</Label>
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
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] ml-1">Visual Evidence</Label>
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
                    disabled={loading}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-indigo-100 transition-all group active:scale-95"
                  >
                    <ImagePlus className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Attach</span>
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
              Onboard Asset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-xs font-bold text-slate-300 hover:text-slate-900 px-6 h-14 rounded-2xl w-full md:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
