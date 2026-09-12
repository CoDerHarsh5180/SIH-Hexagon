import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ScheduleInspectionModal = ({ req, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    inspectionDate: '2026-09-24',
    inspectionTime: '11:00 AM',
    inspectorName: 'Anand Patil',
    inspectorContact: '+91 22 2757 4410',
    instructions: 'Ensure site engineer, civil layout blueprint, and ETP specifications are available on site.',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.inspectionDate || !formData.inspectorName) {
      alert('Please fill in both the inspection date and inspector name.');
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(req.requestId, formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background border-t sm:border border-border w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">
              Field Site Review
            </span>
            <h3 className="text-base font-bold text-foreground mt-0.5">Schedule On-Site Inspection</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-foreground/60 hover:text-foreground cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="border border-border rounded-lg p-3 bg-border/5 space-y-1">
            <span className="text-[10px] text-foreground/50 uppercase block font-bold">Enterprise & Site</span>
            <p className="font-bold text-foreground">{req.enterprise.name}</p>
            <p className="text-foreground/70">{req.enterprise.plotLocation}, {req.enterprise.district}</p>
            <p className="text-india-blue font-semibold">{req.requestedDocName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Inspection Date <span className="text-india-blue">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Target Slot / Time <span className="text-india-blue">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 11:00 AM"
                value={formData.inspectionTime}
                onChange={(e) => setFormData({ ...formData, inspectionTime: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Assigned Inspector Name <span className="text-india-blue">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Inspector Contact Phone
              </label>
              <input
                type="tel"
                value={formData.inspectorContact}
                onChange={(e) => setFormData({ ...formData, inspectorContact: e.target.value })}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground font-mono focus:outline-none focus:border-india-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Instructions for Applicant
            </label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue"
            />
          </div>

          <p className="text-[11px] text-foreground/60 border-l-2 border-india-blue pl-2.5">
            Confirmed date and inspector contact details will be automatically dispatched to the applicant via SMS and app notification.
          </p>

          <div className="pt-3 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{submitting ? 'Confirming...' : 'Confirm & Schedule Inspection'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleInspectionModal;
