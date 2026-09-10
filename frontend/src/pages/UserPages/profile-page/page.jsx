import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Pencil } from 'lucide-react';

// Mock Data
const initialFactoryData = {
  businessId: 'ENT-MH-440912',
  factoryName: 'Sahyadri Agro Foods Private Limited',
  businessType: 'Food Factory',
  category: 'Orange Category (Non-Hazardous Food Processing)',
  currentStage: 'Pre-operational',
  udyamNumber: 'UAM-MH-19-0034182',
  gstNumber: '27AABCS1429B1Z8',
  startDate: '12 March 2024',
  location: { plotNumber: 'Plot D-42/B, Five Star Industrial Area', area: 'MIDC Shendra Phase 2', district: 'Aurangabad', taluka: 'Aurangabad', state: 'Maharashtra', pincode: '431154' },
  factoryDetails: { plotArea: '45,000 sq ft', builtArea: '28,500 sq ft', electricityLoad: '350 HP / kVA', dailyWaterUse: '12,500 Litres per day', wasteWaterSetup: 'ETP Plant Installed (20,000 Litres capacity)', machineCost: 'Rs 4.85 Crore', totalProjectCost: 'Rs 12.5 Crore' },
  ownerDetails: { fullName: 'Rajesh V. Deshmukh', post: 'Owner / Managing Director', email: 'contact@sahyadriagrofoods.com', mobileNumber: '+91 98230 45892', idNumber: 'DIN-08923419' },
  licenses: { fssaiNumber: '11524032000219 (State Food License)', mpcbNumber: 'MPCB/RO-AUR/CTE-2025/119', fireNocNumber: 'CFO/MIDC/F-NOC/2026/89', factoryLicenseStatus: 'Form-1 Application Sent' },
};

const EditableField = ({ label, value, editValue, isEditing, onChange }) => (
  <div>
    <label className="block text-[11px] font-semibold text-foreground/50 mb-1">{label}</label>
    {isEditing ? (
      <input
        type="text"
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors"
      />
    ) : (
      <p className="font-semibold text-foreground text-xs py-1">{value}</p>
    )}
  </div>
);

const FactCard = ({ label, value, mono = false }) => (
  <div className="p-3 rounded-lg border border-border">
    <span className="text-[10px] text-foreground/40 block font-sans">{label}</span>
    <span className={`font-bold text-foreground text-xs block mt-0.5 ${mono ? 'font-mono truncate' : ''}`}>{value}</span>
  </div>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="border-b border-border pb-3">
    <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>
    {subtitle && <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>}
  </div>
);

export const EnterpriseProfilePage = () => {
  const [factory, setFactory] = useState(initialFactoryData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFactoryData);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleChange = (section, key, value) => {
    setFormData((prev) =>
      section
        ? { ...prev, [section]: { ...prev[section], [key]: value } }
        : { ...prev, [key]: value }
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFactory(formData);
    setIsEditing(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5">
      {/* Save toast */}
      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border border-india-blue/30 bg-india-blue/10 text-india-blue p-3 rounded-lg flex items-center justify-between text-xs"
          >
            <span className="font-semibold">Details saved successfully.</span>
            <button onClick={() => setShowSavedMsg(false)} className="text-india-blue/70 hover:text-india-blue cursor-pointer text-sm font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl border border-border bg-india-blue/5 flex items-center justify-center shrink-0 text-india-blue mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                  {factory.businessId}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-border text-foreground/70">
                  {factory.businessType}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-india-blue/20 bg-india-blue/10 text-india-blue">
                  {factory.currentStage}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground break-words">{factory.factoryName}</h1>
              <p className="text-xs text-foreground/50 mt-0.5">{factory.location.area}, {factory.location.district} (Maharashtra)</p>
            </div>
          </div>

          <div className="shrink-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Details
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => { setFormData(factory); setIsEditing(false); }} className="px-3.5 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <FactCard label="Udyam Registration" value={factory.udyamNumber} mono />
          <FactCard label="GST Number" value={factory.gstNumber} mono />
          <FactCard label="Pollution Category" value="Orange" />
          <FactCard label="Started On" value={factory.startDate} />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Address */}
          <div className="border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <SectionHeading title="Factory Location & Address" subtitle="Government offices use this to assign local officers and inspect your site." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <EditableField label="Plot / Survey Number" value={factory.location.plotNumber} editValue={formData.location.plotNumber} isEditing={isEditing} onChange={(v) => handleChange('location', 'plotNumber', v)} />
              <EditableField label="Industrial Area / MIDC" value={factory.location.area} editValue={formData.location.area} isEditing={isEditing} onChange={(v) => handleChange('location', 'area', v)} />
              <div>
                <label className="block text-[11px] font-semibold text-foreground/50 mb-1">District (Maharashtra)</label>
                {isEditing ? (
                  <input type="text" value={formData.location.district} onChange={(e) => handleChange('location', 'district', e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors" />
                ) : (
                  <p className="font-bold text-india-blue text-xs py-1">{factory.location.district}</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-foreground/50 mb-1">Taluka & PIN Code</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input type="text" value={formData.location.taluka} onChange={(e) => handleChange('location', 'taluka', e.target.value)} placeholder="Taluka" className="w-1/2 bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors" />
                    <input type="text" value={formData.location.pincode} onChange={(e) => handleChange('location', 'pincode', e.target.value)} placeholder="Pincode" className="w-1/2 bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors" />
                  </div>
                ) : (
                  <p className="font-semibold text-foreground text-xs py-1">{factory.location.taluka} — {factory.location.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Factory Setup */}
          <div className="border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <SectionHeading title="Factory Size & Capacity" subtitle="These numbers determine electricity quota, water connections, and pollution board fees." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Plot & Shed Area', value: `${factory.factoryDetails.plotArea} / ${factory.factoryDetails.builtArea}` },
                { label: 'Electricity Sanctioned', value: factory.factoryDetails.electricityLoad },
                { label: 'Daily Water Required', value: factory.factoryDetails.dailyWaterUse },
                { label: 'Machinery Cost', value: factory.factoryDetails.machineCost },
              ].map(({ label, value }) => (
                <div key={label} className="border border-border rounded-lg p-3">
                  <span className="text-foreground/40 block text-[11px]">{label}</span>
                  <p className="text-foreground font-bold text-xs mt-1 font-mono">{value}</p>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-lg p-3 text-xs">
              <span className="text-[11px] font-bold text-foreground/50 block">Waste Water System</span>
              <p className="text-foreground font-semibold mt-1">{factory.factoryDetails.wasteWaterSetup}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Owner */}
          <div className="border border-border rounded-xl p-4 sm:p-6 space-y-4">
            <SectionHeading title="Factory Owner / Manager" subtitle="Person responsible for official letters and inspections." />
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-foreground/40 block text-[11px]">Full Name</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{factory.ownerDetails.fullName}</p>
                <p className="text-foreground/50 text-xs">{factory.ownerDetails.post}</p>
              </div>
              {[
                { label: 'Email', value: factory.ownerDetails.email },
                { label: 'Mobile', value: factory.ownerDetails.mobileNumber },
                { label: 'Director ID / PAN', value: factory.ownerDetails.idNumber },
              ].map(({ label, value }) => (
                <div key={label} className="border-t border-border pt-2.5">
                  <span className="text-foreground/40 block text-[11px]">{label}</span>
                  <p className="text-foreground mt-0.5 break-all font-mono font-bold text-xs">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Licenses */}
          <div className="border border-border rounded-xl p-4 sm:p-6 space-y-3">
            <SectionHeading title="Government License Numbers" />
            <div className="space-y-2 text-xs font-mono">
              {[
                { label: 'FSSAI Food License', value: factory.licenses.fssaiNumber },
                { label: 'MPCB CTE Number', value: factory.licenses.mpcbNumber },
                { label: 'Fire NOC Reference', value: factory.licenses.fireNocNumber },
                { label: 'Factory License (DISH)', value: factory.licenses.factoryLicenseStatus, sans: true },
              ].map(({ label, value, sans }) => (
                <div key={label} className="p-2.5 rounded-lg border border-border">
                  <span className="text-[11px] text-foreground/50 block font-sans">{label}</span>
                  <span className={`text-foreground font-bold block mt-0.5 ${sans ? 'font-sans text-[11px]' : 'text-xs'}`}>{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert('Opening All Documents page')}
              className="w-full py-2 rounded-lg border border-border hover:border-india-blue text-xs font-bold text-foreground/60 hover:text-india-blue transition-colors cursor-pointer text-center block"
            >
              View Uploaded Papers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseProfilePage;