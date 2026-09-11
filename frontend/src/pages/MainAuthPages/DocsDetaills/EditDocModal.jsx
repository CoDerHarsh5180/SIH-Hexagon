import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, Plus, Trash2, Save } from 'lucide-react';

export const EditDocModal = ({ isOpen, docData, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...docData });

  // Handle basic text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle arrays (Required Docs & AI Points)
  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background border-t sm:border border-border w-full sm:max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
              Update Scheme / Clearance
            </span>
            <h3 className="text-base font-bold text-foreground mt-0.5">Edit Document Details</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer bg-border/20">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-5 text-xs">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-foreground/70 mb-1">Document Name <span className="text-india-blue">*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue" />
            </div>
            <div>
              <label className="block font-semibold text-foreground/70 mb-1">Category</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue" />
            </div>
            <div>
              <label className="block font-semibold text-foreground/70 mb-1">Government Fee (₹)</label>
              <input type="number" name="baseFee" required value={formData.baseFee} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground font-mono focus:outline-none focus:border-india-blue" />
            </div>
            <div>
              <label className="block font-semibold text-foreground/70 mb-1">Time to Complete (Days)</label>
              <input type="number" name="slaDays" required value={formData.slaDays} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground font-mono focus:outline-none focus:border-india-blue" />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-foreground/70 mb-1">Current Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue">
                <option value="ACTIVE">Active (Available to Public)</option>
                <option value="PAUSED">Paused (Temporarily Stopped)</option>
                <option value="DRAFT">Draft (Working on it)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-foreground/70 mb-1">Description</label>
              <textarea name="description" rows="2" required value={formData.description} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue" />
            </div>
          </div>

          {/* Required Documents List */}
          <div className="border border-border p-3 rounded-lg bg-border/5">
            <label className="block font-bold text-foreground mb-2">Required Papers from Public</label>
            <div className="space-y-2">
              {formData.requiredDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={doc} onChange={(e) => handleArrayChange('requiredDocs', idx, e.target.value)} required className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue" placeholder="e.g. Aadhaar Card" />
                  <button type="button" onClick={() => removeArrayItem('requiredDocs', idx)} className="p-2 text-foreground/40 hover:text-india-orange cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addArrayItem('requiredDocs')} className="mt-2 text-india-blue font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              <Plus className="w-3 h-3" /> Add Paper
            </button>
          </div>

          {/* AI Explanation Details */}
          <div className="border border-border p-3 rounded-lg bg-border/5 space-y-3">
            <label className="block font-bold text-foreground">Explanation for Public</label>
            <div>
              <label className="block font-semibold text-foreground/70 mb-1 text-[10px] uppercase">Main Reason it is needed</label>
              <textarea name="aiReason" rows="2" required value={formData.aiReason} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue" />
            </div>
            
            <div>
              <label className="block font-semibold text-foreground/70 mb-1 text-[10px] uppercase">Important Points (Bullet List)</label>
              <div className="space-y-2">
                {formData.aiPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="text" value={point} onChange={(e) => handleArrayChange('aiPoints', idx, e.target.value)} required className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue" />
                    <button type="button" onClick={() => removeArrayItem('aiPoints', idx)} className="p-2 text-foreground/40 hover:text-india-orange cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addArrayItem('aiPoints')} className="mt-2 text-india-blue font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                <Plus className="w-3 h-3" /> Add Point
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex justify-end gap-2 sticky bottom-0 bg-background pb-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};