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
      <DialogContent className="sm:max-w-[480px] bg-white border-zinc-100 rounded-[32px] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">New Property</DialogTitle>
          <p className="text-sm text-slate-400 font-medium mt-1">Add a new rental to your workspace.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-4">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-500 ml-1">Property Name</Label>
              <Input
                id="name"
                placeholder="e.g. Sunset Apartments"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-bold text-slate-500 ml-1">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, Miami"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
                className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 ml-1">Images (Optional)</Label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-100 shadow-none">
                    <img src={img} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-80" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2 w-2 text-slate-950" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 hover:border-slate-200 transition-all group"
                  >
                    <ImagePlus className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-400">Add</span>
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

          <DialogFooter className="p-8 pt-4 bg-slate-50/30">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-xs font-bold text-slate-400 hover:text-slate-900 px-6 h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-11 px-8 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
