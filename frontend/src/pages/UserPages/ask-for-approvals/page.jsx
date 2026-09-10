import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../../components/ui';
import { Building2, Check } from 'lucide-react';

// Mock Data
const approvalFormSchema = {
  stages: [
    { id: 'pre-construction', label: 'Pre-Construction', tagline: 'Planning stage, land purchase, building layouts & preliminary clearances', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'pre-operational', label: 'Pre-Operational', tagline: 'Building finished, machinery installation, power/water connection & trial runs', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'established', label: 'Established / Expansion', tagline: 'Currently running plant adding new sheds, extra power load or product lines', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ],
  districts: ['Pune', 'Thane', 'Mumbai Suburban', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Nagpur', 'Nashik', 'Kolhapur', 'Solapur', 'Raigad'],
  landOwnershipTypes: ['MIDC Industrial Allotted Plot', 'Private Industrial Park', 'Private Agricultural Land (Requires NA conversion)', 'Leased Commercial Premises'],
  businessTypes: [
    { id: 'food_processing', label: 'Food & Beverage Processing' },
    { id: 'chemical_pharma', label: 'Chemical, Dyes & Pharmaceuticals' },
    { id: 'textile_garments', label: 'Textile, Spinning & Garmenting' },
    { id: 'engineering_metal', label: 'Automobile & Heavy Engineering' },
    { id: 'cold_storage', label: 'Cold Storage & Agro Warehouse' },
  ],
  subClassifications: {
    food_processing: ['Dairy Products & Milk Chilling', 'Bakery & Confectionery', 'Fruit Pulp & Canning', 'Grain Milling & Spices'],
    chemical_pharma: ['Bulk Drug Actives (APIs)', 'Specialty Industrial Chemicals', 'Paint & Varnish Synthesis', 'Formulations & Packaging'],
    textile_garments: ['Yarn Dyeing & Washing', 'Fabric Weaving Only', 'Readymade Garment Stitching'],
    engineering_metal: ['Electroplating & Heat Treatment', 'Foundry & Casting', 'Sheet Metal Fabrication & Assembly'],
    cold_storage: ['Controlled Atmosphere Cold Storage', 'Dry Agricultural Logistics Shed'],
  },
  pollutionCategories: [
    { code: 'WHITE', label: 'White (Practically Non-Polluting)', desc: 'Needs simple intimation, no formal NOC' },
    { code: 'GREEN', label: 'Green (Low Pollution Index)', desc: 'Rapid consent within 15 to 30 days' },
    { code: 'ORANGE', label: 'Orange (Medium Pollution Index)', desc: 'Standard CTE with strict effluent/air norms' },
    { code: 'RED', label: 'Red (High Pollution Index)', desc: 'Detailed environmental screening & public scrutiny' },
  ],
};

const FormSelect = ({ value, onChange, options, labelKey = null, valueKey = null }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground text-xs focus:outline-none focus:border-india-blue transition-colors"
  >
    {options.map((opt) => {
      const val = valueKey ? opt[valueKey] : opt;
      const label = labelKey ? opt[labelKey] : opt;
      return <option key={val} value={val}>{label}</option>;
    })}
  </select>
);

const FormInput = ({ type = 'text', value, onChange, placeholder, step }) => (
  <input
    type={type}
    step={step}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground text-xs focus:outline-none focus:border-india-blue transition-colors"
  />
);

const STEP_LABELS = ['Stage & Land', 'Enterprise & Activity', 'Utilities & Environment'];

const StepTab = ({ step, label, active, done, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-1 rounded-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs ${
      active
        ? 'bg-india-blue text-white'
        : done
        ? 'text-india-blue bg-india-blue/10'
        : 'text-foreground/50 hover:text-foreground'
    }`}
  >
    <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center shrink-0 ${
      active ? 'border-white/60' : done ? 'border-india-blue' : 'border-current'
    }`}>
      {done && !active ? '✓' : step}
    </span>
    <span className="truncate">{label}</span>
  </button>
);

const YesNoToggle = ({ value, onChange }) => (
  <div className="flex gap-2">
    {['Yes', 'No'].map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
          value === opt
            ? 'border-india-blue bg-india-blue/10 text-india-blue'
            : 'border-border text-foreground/60 hover:border-foreground/30'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-foreground/60 mb-1.5">{children}</label>
);

export const AskForApprovalPage = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    stage: 'pre-construction',
    district: 'Pune',
    landType: 'MIDC Industrial Allotted Plot',
    midcAreaName: 'MIDC Chakan Phase 2',
    plotAreaSqMtr: '2500',
    builtUpAreaSqMtr: '1400',
    isForestOrRiverNearby: 'No',
    businessType: 'food_processing',
    subType: 'Fruit Pulp & Canning',
    totalInvestmentCrores: '8.5',
    plantMachineryCostCrores: '4.2',
    proposedWorkers: '35',
    connectedPowerKw: '180',
    waterRequirementKld: '15',
    generatesHazardousWaste: 'No',
    hasBoilerOrFurnace: 'No',
    hasDieselGenerator: 'Yes',
    pollutionTier: 'ORANGE',
  });

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFinishAndSubmit = (e) => {
    e.preventDefault();
    alert('Information saved! Forwarding data to system rules engine to generate required clearances list.');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
            MAITRI & NSWS Dynamic Questionnaire
          </span>
          <span className="text-[11px] font-semibold text-foreground/40 uppercase">Single Window Clearance</span>
        </div>
        <PageHeader
          title="Ask For Approvals"
          subtitle="Answer questions about your enterprise. The system determines every mandatory approval, fee, and timeline."
          className="pb-0 border-b-0"
        />
      </div>

      {/* Step Wizard */}
      <div className="flex gap-1 p-1 rounded-lg border border-border bg-background">
        {STEP_LABELS.map((label, i) => (
          <StepTab
            key={i}
            step={i + 1}
            label={label}
            active={currentSection === i + 1}
            done={currentSection > i + 1}
            onClick={() => setCurrentSection(i + 1)}
          />
        ))}
      </div>

      {/* Form */}
      <div className="border border-border rounded-xl bg-background p-4 sm:p-6">
        {/* ── SECTION 1 ── */}
        {currentSection === 1 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Section 1: Enterprise Stage & Land Location</h2>
              <p className="text-xs text-foreground/50 mt-0.5">Clearances differ widely depending on your stage.</p>
            </div>

            <div>
              <FieldLabel>Current Operational Stage <span className="text-india-blue">*</span></FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {approvalFormSchema.stages.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => update('stage', st.id)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.stage === st.id
                        ? 'border-india-blue bg-india-blue/5'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 ${
                        formData.stage === st.id ? 'border-india-blue text-india-blue' : 'border-border text-foreground/40'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={st.icon} />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-foreground">{st.label}</span>
                    </div>
                    <p className="text-[11px] text-foreground/50 mt-2 leading-tight">{st.tagline}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Target District <span className="text-india-blue">*</span></FieldLabel>
                <FormSelect value={formData.district} onChange={(v) => update('district', v)} options={approvalFormSchema.districts} />
              </div>
              <div>
                <FieldLabel>Land Ownership Type <span className="text-india-blue">*</span></FieldLabel>
                <FormSelect value={formData.landType} onChange={(v) => update('landType', v)} options={approvalFormSchema.landOwnershipTypes} />
              </div>
            </div>

            {formData.landType.includes('MIDC') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-india-blue/20 rounded-lg p-3 bg-india-blue/5">
                <FieldLabel>MIDC Estate / Zone Name</FieldLabel>
                <FormInput value={formData.midcAreaName} onChange={(v) => update('midcAreaName', v)} placeholder="e.g. Chakan Phase 2, Shendra" />
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Plot Area (Sq. Meters)</FieldLabel>
                <FormInput type="number" value={formData.plotAreaSqMtr} onChange={(v) => update('plotAreaSqMtr', v)} />
              </div>
              <div>
                <FieldLabel>Built-Up Area (Sq. Meters)</FieldLabel>
                <FormInput type="number" value={formData.builtUpAreaSqMtr} onChange={(v) => update('builtUpAreaSqMtr', v)} />
              </div>
            </div>

            <div className="border border-border rounded-lg p-3">
              <FieldLabel>Is site within 500m of a River or Forest?</FieldLabel>
              <div className="flex flex-wrap gap-4 mt-1">
                {['No', 'Yes (River Basin)', 'Yes (Protected Eco-Zone)'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="forestRiver" checked={formData.isForestOrRiverNearby === opt} onChange={() => update('isForestOrRiverNearby', opt)} className="text-india-blue" />
                    <span className="text-xs text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button type="button" onClick={() => setCurrentSection(2)} className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer">
                Save & Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SECTION 2 ── */}
        {currentSection === 2 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Section 2: Enterprise Sector & Activity</h2>
              <p className="text-xs text-foreground/50 mt-0.5">Identifies department jurisdiction — FSSAI, Labour, Chemicals wing etc.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Primary Sector <span className="text-india-blue">*</span></FieldLabel>
                <FormSelect value={formData.businessType} onChange={(v) => { update('businessType', v); update('subType', approvalFormSchema.subClassifications[v][0]); }} options={approvalFormSchema.businessTypes} valueKey="id" labelKey="label" />
              </div>
              <div>
                <FieldLabel>Sub-Activity <span className="text-india-blue">*</span></FieldLabel>
                <FormSelect value={formData.subType} onChange={(v) => update('subType', v)} options={approvalFormSchema.subClassifications[formData.businessType] || []} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Machinery Cost (Rs Crore)</FieldLabel>
                <FormInput type="number" step="0.1" value={formData.plantMachineryCostCrores} onChange={(v) => update('plantMachineryCostCrores', v)} />
              </div>
              <div>
                <FieldLabel>Total Project Cost (Rs Crore)</FieldLabel>
                <FormInput type="number" step="0.1" value={formData.totalInvestmentCrores} onChange={(v) => update('totalInvestmentCrores', v)} />
              </div>
              <div>
                <FieldLabel>Workforce Headcount</FieldLabel>
                <FormInput type="number" value={formData.proposedWorkers} onChange={(v) => update('proposedWorkers', v)} />
              </div>
            </div>

            <div className="border border-india-blue/20 bg-india-blue/5 rounded-lg p-3 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-india-blue shrink-0" />
              <span className="text-foreground/80">
                Based on Rs {formData.plantMachineryCostCrores} Cr outlay, this qualifies under <strong className="text-india-blue">Small Enterprise MSME</strong> norms.
              </span>
            </div>

            <div className="pt-4 border-t border-border flex justify-between gap-2">
              <button type="button" onClick={() => setCurrentSection(1)} className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer">← Back</button>
              <button type="button" onClick={() => setCurrentSection(3)} className="px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer">Continue →</button>
            </div>
          </motion.div>
        )}

        {/* ── SECTION 3 ── */}
        {currentSection === 3 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Section 3: Utilities & Environmental Parameters</h2>
              <p className="text-xs text-foreground/50 mt-0.5">Required by MSEDCL, Water Board, and MPCB.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Connected Electricity Load (HP / kVA)</FieldLabel>
                <FormInput type="number" value={formData.connectedPowerKw} onChange={(v) => update('connectedPowerKw', v)} />
                <span className="text-[10px] text-foreground/40 mt-1 block">Loads &gt; 70 HP require HT substation sanction.</span>
              </div>
              <div>
                <FieldLabel>Water Usage (KLD)</FieldLabel>
                <FormInput type="number" value={formData.waterRequirementKld} onChange={(v) => update('waterRequirementKld', v)} />
              </div>
            </div>

            <div>
              <FieldLabel>Pollution Category <span className="text-india-blue">*</span></FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {approvalFormSchema.pollutionCategories.map((cat) => (
                  <div
                    key={cat.code}
                    onClick={() => update('pollutionTier', cat.code)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.pollutionTier === cat.code
                        ? 'border-india-blue bg-india-blue/5'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{cat.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-xs font-bold ${
                        formData.pollutionTier === cat.code ? 'bg-india-blue text-white' : 'bg-border text-foreground/60'
                      }`}>
                        {cat.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/50 mt-1.5 leading-tight">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              {[
                { field: 'hasDieselGenerator', label: 'Installing a DG set?', hint: 'Requires Chief Electrical Inspector sanction.' },
                { field: 'hasBoilerOrFurnace', label: 'Steam boilers or furnace chimneys?', hint: 'Triggers Directorate of Steam Boilers inspection.' },
              ].map(({ field, label, hint }, i) => (
                <div key={field} className={`flex items-center justify-between gap-4 p-3.5 text-xs ${i > 0 ? 'border-t border-border' : ''}`}>
                  <div>
                    <span className="font-semibold text-foreground block">{label}</span>
                    <span className="text-[11px] text-foreground/50">{hint}</span>
                  </div>
                  <YesNoToggle value={formData[field]} onChange={(v) => update(field, v)} />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex justify-between gap-2">
              <button type="button" onClick={() => setCurrentSection(2)} className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-border cursor-pointer">← Back</button>
              <button type="button" onClick={handleFinishAndSubmit} className="px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer">
                Generate Approvals Checklist →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AskForApprovalPage;