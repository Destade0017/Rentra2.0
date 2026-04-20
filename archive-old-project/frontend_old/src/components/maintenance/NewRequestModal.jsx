import React, { useState, useEffect } from 'react';
import { X, Wrench, FileText, AlertCircle, Building, User, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { complaintService, propertyService, tenantService } from '../../api/services.js';
import api from '../../api/axios.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useToastStore } from '../../store/useToastStore.js';

export default function NewRequestModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [tenantData, setTenantData] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
    property: '',
    unit: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (user?.role === 'tenant') {
        fetchTenantInfo();
      } else {
        fetchProperties();
      }
    }
  }, [isOpen, user]);

  const fetchTenantInfo = async () => {
    try {
      // Find the tenant record for this user to get propertyId and unit
      const res = await api.get('/tenants/me/dashboard');
      const data = res.data.data;
      setTenantData(data);
      setFormData(prev => ({
        ...prev,
        property: data.property._id,
        unit: data.unit
      }));
    } catch (err) {
      console.error('Failed to fetch tenant info');
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await propertyService.getProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to fetch properties');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await complaintService.createComplaint(formData);
      showToast('Maintenance request submitted successfully!');
      onSuccess?.();
      onClose();
      // Reset
      setFormData({ title: '', category: 'Plumbing', priority: 'Medium', description: '', property: '', unit: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/20">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">New Maintenance Order</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Submit technical or repair request</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
              <X size={20} />
            </button>
          </div>

          <form className="flex-1 overflow-y-auto p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Case Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <FileText size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Broken AC in Bedroom" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Issue Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                      <Wrench size={18} />
                    </div>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none"
                    >
                       <option>Plumbing</option>
                       <option>Electrical</option>
                       <option>HVAC / Cooling</option>
                       <option>General Repair</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Priority Level</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold text-rose-500 appearance-none"
                  >
                     <option value="Urgent">🚨 Urgent</option>
                     <option value="High">🔴 High</option>
                     <option value="Medium">🟡 Medium</option>
                     <option value="Low">🔵 Low</option>
                  </select>
                </div>
              </div>

              {user?.role === 'landlord' && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Property</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Building size={18} />
                        </div>
                        <select 
                            required
                            value={formData.property}
                            onChange={(e) => setFormData({...formData, property: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none"
                        >
                        <option value="">Select property...</option>
                        {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    </div>
                    <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                        </div>
                        <input 
                            type="text" 
                            value={formData.unit}
                            onChange={(e) => setFormData({...formData, unit: e.target.value})}
                            placeholder="e.g. 4B" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium" 
                        />
                    </div>
                    </div>
                </div>
              )}

              {user?.role === 'tenant' && tenantData && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Asset</p>
                        <p className="text-sm font-bold text-slate-800">{tenantData.property.name} • {tenantData.unit}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                        <Building size={16} />
                    </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Problem Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4} 
                  placeholder="Describe the issue in detail..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium resize-none" 
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 py-4 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-100 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Launch Order'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
