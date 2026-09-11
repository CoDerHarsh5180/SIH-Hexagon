import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, AIAdvisorPanel } from '../../../components/ui';
import { Bot, Check, Sparkles, Clock } from 'lucide-react';
// ─────────────────────────────────────────────────────────────
// INSIGHT DATA
// INSIGHTS[field][value]  → per-option insight
// INSIGHTS._field[field]  → per-field insight (for text inputs)
// ─────────────────────────────────────────────────────────────
const INSIGHTS = {
  stage: {
    'pre-construction': {
      title: 'Pre-Construction Stage',
      body: 'You are at the earliest phase. No civil or earth-moving work can legally begin until you hold a valid CTE (Consent to Establish) from the Pollution Control Board and a Building Plan sanction.',
      points: [
        'Priority: Building Plan Sanction & CTE before breaking ground',
        'Land must have NA (Non-Agricultural) conversion if outside MIDC',
        'Provisional Fire NOC is required even for layout approval',
        'Estimated 6–8 clearances, 45–90 days total',
      ],
      tag: 'info',
    },
    'pre-operational': {
      title: 'Pre-Operational Stage',
      body: 'Civil construction is complete. You now need machinery installation permits, power and water connection sanctions, and a Factory License before commercial trial runs begin.',
      points: [
        'DISH Factory License must come before any machinery is energized',
        'MSEDCL load sanction required even if meter is already installed',
        'Water connection from MIDC Water Works needs a fresh application',
        'Estimated 4–6 clearances, 30–60 days total',
      ],
      tag: 'info',
    },
    'established': {
      title: 'Established / Expansion Stage',
      body: 'Your plant is running. Any addition — new shed, extra power load, or a new product line — needs amendment applications. Operating without amendments is a statutory violation.',
      points: [
        'CTE amendment mandatory for every new machinery addition or product line',
        'Additional power load sanction from MSEDCL for capacity increase',
        'Factory License headcount amendment needed if workforce increases >10%',
        'Estimated 3–5 amendments, 30–45 days total',
      ],
      tag: 'warning',
    },
  },

  district: {
    'Pune': {
      title: 'Pune District',
      body: 'MPCB Pune Regional Office supports full online portal filing — typically 20% faster than counter submission. SDO clearances are at the Collector Complex, Shivajinagar.',
      points: ['Helpline: 020-2612-7881', 'MIDC Chakan, Ranjangaon, Talegaon have dedicated windows'],
      tag: 'tip',
    },
    'Thane': {
      title: 'Thane District',
      body: 'MPCB Thane Sub-Regional Office has a dedicated fast-track window for Green and White category industries. Applications processed at Naupada office.',
      points: ['Helpline: 022-2534-7777', 'Green/White fast-track — typically 15 days'],
      tag: 'tip',
    },
    'Mumbai Suburban': {
      title: 'Mumbai Suburban',
      body: 'High scrutiny due to coastal zone regulations. Allow 15 extra working days for CRZ compliance verification by MoEF.',
      points: ['Helpline: 022-2642-7731', 'CRZ clearance adds significant time if site is near coast'],
      tag: 'warning',
    },
    'Aurangabad (Chhatrapati Sambhajinagar)': {
      title: 'Aurangabad District',
      body: 'Shendra MIDC applicants benefit from priority single-window processing via the MAITRI portal — one of the most industry-friendly districts.',
      points: ['Helpline: 0240-2481-556', 'Shendra MIDC has an in-estate inspection facility'],
      tag: 'tip',
    },
    'Nagpur': {
      title: 'Nagpur District',
      body: 'Butibori MIDC has a dedicated on-site industrial desk for faster clearance. Sub-Regional MPCB office is at Civil Lines.',
      points: ['Helpline: 0712-2560-881', 'Butibori MIDC desk handles permits in-estate'],
      tag: 'info',
    },
    'Nashik': {
      title: 'Nashik District',
      body: 'Satpur and Ambad MIDC zones have streamlined online application processes. MPCB sub-regional office is at Canada Corner.',
      points: ['Helpline: 0253-2310-762', 'Online portal preferred for all submissions'],
      tag: 'info',
    },
    'Raigad': {
      title: 'Raigad District',
      body: 'Coastal Regulation Zone rules apply if your site is near the coastline or any creek. EIA may be required by MoEF.',
      points: ['Helpline: 02141-222-561', 'Factor 30 extra days if CRZ proximity is triggered'],
      tag: 'warning',
    },
    'Kolhapur': {
      title: 'Kolhapur District',
      body: 'Standard processing timeline. MPCB District Office is at Tarabai Park.',
      points: ['Helpline: 0231-2650-711'],
      tag: 'info',
    },
    'Solapur': {
      title: 'Solapur District',
      body: 'Standard processing timeline. MIDC Chincholi applications are routed through Pune Regional Office.',
      points: ['Helpline: 0217-2720-445'],
      tag: 'info',
    },
  },

  landType: {
    'MIDC Industrial Allotted Plot': {
      title: 'MIDC Plot — Fastest Path',
      body: 'MIDC allotment letter itself serves as the legal land title. No separate Non-Agricultural (NA) conversion is needed — eliminates the SDO office visit entirely.',
      points: [
        'No NA conversion required — saves 60–90 days',
        'MIDC provides internal roads, power, and water infrastructure',
        'CTE application can begin on the same day as plot possession',
      ],
      tag: 'tip',
    },
    'Private Industrial Park': {
      title: 'Private Industrial Park',
      body: 'Verify that the Industrial Park master layout has approval from the Town Planning Authority. Individual plots get a derivative sanction from this master approval.',
      points: [
        'Ask park developer for Master Layout Approval certificate',
        'Individual plot NA is derived from master — faster than standalone',
        "Building plan submitted to park's designated authority, not BMC",
      ],
      tag: 'info',
    },
    'Private Agricultural Land (Requires NA conversion)': {
      title: 'Agricultural Land — NA Required',
      body: 'You must obtain Non-Agricultural (NA) conversion from the Sub-Divisional Officer (SDO) before any construction begins. This is a significant prerequisite step.',
      points: [
        'File 7/12 Extract + Village Map + No-dues cert from talathi',
        'SDO processing time: 60–90 days',
        'No CTE or building plan will be accepted without NA order',
        'Budget ₹20,000–₹50,000 in conversion premium charges',
      ],
      tag: 'warning',
    },
    'Leased Commercial Premises': {
      title: 'Leased Premises',
      body: 'The Factory License validity will be capped to match your lease period. All clearances must be renewed or transferred when the lease is renewed or transferred.',
      points: [
        'Lease deed must be registered and notarized',
        'MPCB CTE will be issued only for the lease duration',
        'Get NOC from landlord for each clearance application',
      ],
      tag: 'info',
    },
  },

  businessType: {
    'food_processing': {
      title: 'Food & Beverage Processing',
      body: 'FSSAI is the primary additional regulator beyond standard MPCB clearances. Your facility will undergo annual hygiene inspections and must maintain manufacturing logs.',
      points: [
        'FSSAI State Manufacturing License mandatory before first sale',
        'HACCP / ISO 22000 food safety plan strongly recommended',
        'ETP required for dairy or fruit pulp effluent',
      ],
      tag: 'info',
    },
    'chemical_pharma': {
      title: 'Chemical & Pharmaceuticals',
      body: 'The most complex regulatory stack in Maharashtra. Expect enhanced MPCB scrutiny, PESO oversight for solvents, and mandatory online effluent monitoring.',
      points: [
        'Drug License from Maharashtra FDA if manufacturing APIs',
        'PESO license mandatory if flammable solvents are stored',
        'Online CETP connection required for effluent discharge',
        'Hazardous Waste Authorization (Form 1) from MPCB',
      ],
      tag: 'warning',
    },
    'textile_garments': {
      title: 'Textile & Garmenting',
      body: 'Category depends heavily on your process. Stitching-only units are typically White/Green. Dyeing and washing units fall in Orange/Red and need ZLD compliance.',
      points: [
        'Dyeing units: Zero Liquid Discharge (ZLD) may be mandatory',
        'Labour Welfare Board registration if workers > 25',
        'CETP membership required for dyeing effluent units',
      ],
      tag: 'info',
    },
    'engineering_metal': {
      title: 'Engineering & Metal Works',
      body: 'Sheet metal and assembly units are relatively straightforward. Electroplating and foundry units are hazardous and face significantly higher regulatory scrutiny.',
      points: [
        'Electroplating: Hazardous Waste Authorization mandatory',
        'Foundry: chimney height clearance from MPCB',
        'Pressure vessels: Boiler Inspector certification',
        'High-voltage equipment: Chief Electrical Inspectorate clearance',
      ],
      tag: 'warning',
    },
    'cold_storage': {
      title: 'Cold Storage & Agro Warehouse',
      body: 'FSSAI storage license is needed for food-grade cold storage. Units using ammonia refrigerants are treated as hazardous plants with additional compliance.',
      points: [
        'FSSAI Storage License for food-grade products',
        'Ammonia refrigerant → treated as hazardous plant',
        'HT power connection mandatory for loads above 300 HP',
        'Emergency response plan for ammonia leak required',
      ],
      tag: 'info',
    },
  },

  pollutionTier: {
    WHITE: {
      title: 'White Category — Simplest Track',
      body: 'White category only needs an online intimation to MPCB. No formal NOC issued, no field inspection. The fastest regulatory path available.',
      points: ['7–15 days processing', 'Fee: ₹2,000 – ₹5,000', 'No field inspector visit required'],
      tag: 'tip',
    },
    GREEN: {
      title: 'Green Category',
      body: 'Green category gets a dedicated fast-track lane at most MPCB offices. Consent is issued after desk review only — no site visit.',
      points: ['15–30 days processing', 'Fee: ₹5,000 – ₹15,000', 'Desk review only — no field inspection'],
      tag: 'tip',
    },
    ORANGE: {
      title: 'Orange Category',
      body: 'Desk review followed by a mandatory field inspection by an MPCB officer. Your ETP/STP must be installed and operational before the site visit.',
      points: ['30–45 days processing', 'Fee: ₹15,000 – ₹50,000', 'ETP must be commissioned before site inspection'],
      tag: 'info',
    },
    RED: {
      title: 'Red Category — High Scrutiny',
      body: 'Requires a public notice period, environmental hearing, and lab-tested inspection. Engaging a certified Environmental Consultant is strongly recommended.',
      points: ['45–90 days processing', 'Fee: ₹50,000 – ₹2,00,000', 'Environmental hearing is mandatory before consent'],
      tag: 'warning',
    },
  },

  isForestOrRiverNearby: {
    'No': {
      title: 'No Environmental Proximity',
      body: 'Your site has no river basin or eco-zone proximity. Standard MPCB clearance applies without any additional environmental steps.',
      points: ['No MoEF clearance required', 'Standard MPCB timeline applies'],
      tag: 'tip',
    },
    'Yes (River Basin)': {
      title: 'River Basin Proximity Detected',
      body: 'Your site may fall under River Regulation Zone (RRZ) rules. A River Impact Assessment and MoEF clearance could be required before MPCB issues CTE.',
      points: ['MoEF online application required', 'Add 60–90 extra days to your timeline'],
      tag: 'warning',
    },
    'Yes (Protected Eco-Zone)': {
      title: 'Protected Eco-Zone Proximity',
      body: 'Forest Clearance under the Forest Conservation Act, 1980 may be mandatory. This is a central government clearance via the MoEF & CC portal.',
      points: ['Forest Clearance via MoEF & CC portal', 'Adds 60–120 days to timeline', 'Qualified ecologist survey required'],
      tag: 'warning',
    },
  },

  hasDieselGenerator: {
    'Yes': {
      title: 'DG Set Installation',
      body: 'A Diesel Generating set requires sanction from the Chief Electrical Inspectorate (CEI). An acoustic enclosure test and earthing report must be submitted.',
      points: ['CEI application → Form C approval', 'Acoustic enclosure must meet CPCB noise norms', 'Annual fitness test by CEI thereafter'],
      tag: 'info',
    },
    'No': {
      title: 'No DG Set',
      body: 'No DG Set means no CEI sanction needed for backup power. Your electrical compliance only covers the MSEDCL sanctioned load.',
      points: ['Simpler electrical compliance', 'MSEDCL load sanction is sufficient'],
      tag: 'tip',
    },
  },

  hasBoilerOrFurnace: {
    'Yes': {
      title: 'Boiler / Furnace Present',
      body: 'Boilers fall under the Indian Boilers Act. Inspection by the Directorate of Steam Boilers is mandatory before commissioning.',
      points: ['Boiler registration with Directorate of Steam Boilers', 'Annual fitness certificate required', 'Certified IBR boiler operator must be on-site'],
      tag: 'info',
    },
    'No': {
      title: 'No Boiler or Furnace',
      body: 'The Directorate of Steam Boilers has no jurisdiction over your plant. This removes one compliance layer from your setup.',
      points: ['No Boiler Inspectorate visit needed', 'Simplifies annual compliance calendar'],
      tag: 'tip',
    },
  },

  // Per-field insights for text input labels
  _field: {
    midcAreaName: {
      title: 'MIDC Zone Name',
      body: 'This routes your application file to the correct MIDC Division Office. Different zones have separate Single Window desks — Chakan, Shendra, and Butibori each have their own processing units with different turnaround times.',
      points: ['Ensures your file reaches the right zonal officer', 'Incorrect zone name is a common cause of file returns'],
      tag: 'info',
    },
    plotAreaSqMtr: {
      title: 'Total Plot Area',
      body: 'Used to calculate FSI/FAR (Floor Space Index) by the Municipal Corporation, and to determine your environmental footprint fee slab by the MPCB. Enter the full land parcel area as per your title document.',
      points: ['Drives FSI/FAR computation for building plan', 'MPCB uses this to set your pollution fee bracket'],
      tag: 'info',
    },
    builtUpAreaSqMtr: {
      title: 'Proposed Built-Up Area',
      body: 'The fire department uses this to verify hydrant coverage, emergency exit widths, and evacuation capacity. Municipal Corporation uses it to calculate Building Plan sanction fees.',
      points: ['Fire NOC compliance is area-dependent', 'Building plan fee = (rate per sq.m) × builtUpArea'],
      tag: 'info',
    },
    plantMachineryCostCrores: {
      title: 'Plant & Machinery Cost',
      body: 'This value directly determines your MSME classification — Micro (up to ₹1 Cr), Small (₹1–10 Cr), Medium (₹10–50 Cr). Classification affects MPCB fee slabs, subsidy eligibility, and single-window priority processing.',
      points: ['Up to ₹1 Cr → Micro Enterprise', '₹1–10 Cr → Small Enterprise', '₹10–50 Cr → Medium Enterprise'],
      tag: 'info',
    },
    totalInvestmentCrores: {
      title: 'Total Project Cost',
      body: 'Used by MPCB for overall environmental fee calculation and by DIC (District Industries Centre) for subsidy registration. Keep this figure consistent across all government applications — discrepancies can trigger re-verification.',
      points: ['Must match figures in your DPR (Detailed Project Report)', 'Inconsistent values across forms cause file returns'],
      tag: 'info',
    },
    proposedWorkers: {
      title: 'Workforce / Employee Count',
      body: 'If you employ more than 10 workers with electrical power, the Factories Act, 1948 applies fully. Above 250 workers, additional welfare compliance is mandatory — canteen, crèche, and a designated Welfare Officer.',
      points: ['>10 workers + electrical power → Factories Act applies', '>250 workers → canteen, crèche, Welfare Officer mandatory', 'Headcount affects your Factory License fee slab'],
      tag: 'info',
    },
    connectedPowerKw: {
      title: 'Connected Electricity Load',
      body: 'Loads above 70 HP require a High Tension (HT) service connection from MSEDCL, which requires a separately sanctioned substation. Loads at or below 70 HP use a standard LT (Low Tension) connection — simpler and approved faster.',
      points: ['≤ 70 HP → LT connection, standard process', '> 70 HP → HT substation sanction from MSEDCL', 'HT connection requires separate CEI approval'],
      tag: 'info',
    },
    waterRequirementKld: {
      title: 'Daily Water Usage (KLD)',
      body: 'MPCB uses daily water consumption to determine your ETP (Effluent Treatment Plant) capacity requirement. Usage above 10 KLD typically mandates a full ETP installation on-site verified by an inspector.',
      points: ['> 10 KLD → full ETP on-site is mandatory', 'MPCB inspector checks actual vs. declared usage', 'Declared KLD sets your effluent discharge standards'],
      tag: 'info',
    },
    subType: {
      title: 'Factory Sub-Activity',
      body: 'Narrows down which regulatory sub-department handles your file. For example, dairy units have a dedicated FSSAI dairy cell, while API manufacturers are handled by a specialized pharma inspection unit within MPCB.',
      points: ['Determines the sub-department officer assigned', 'Affects which inspection checklist is used on-site'],
      tag: 'info',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// getInsight — replace body with an API call to integrate backend
// getInsight(field, value) stays the same signature
// ─────────────────────────────────────────────────────────────
const getInsight = (field, value) => {
  const data =
    field === '_field'
      ? INSIGHTS._field?.[value]
      : INSIGHTS[field]?.[value];
  if (!data) return null;
  return { ...data, field, value, timestamp: new Date() };
};

// ─────────────────────────────────────────────────────────────
// Form Schema
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FieldLabel — clickable label that triggers AI insight
// ─────────────────────────────────────────────────────────────
const FieldLabel = ({ children, onClick }) => {
  if (!onClick) {
    return (
      <label className="block text-xs font-semibold text-foreground/60 mb-1.5">{children}</label>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-1 mb-1.5 cursor-pointer text-left"
    >
      <span className="text-xs font-semibold text-foreground/60 group-hover:text-india-blue transition-colors border-b border-dashed border-transparent group-hover:border-india-blue/50">
        {children}
      </span>
      <span className="text-[9px] font-bold text-india-blue/0 group-hover:text-india-blue/70 transition-all uppercase tracking-wider translate-x-0 group-hover:translate-x-0.5 duration-150">
        AI ↗
      </span>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// Tag badge
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// AI Advisor Panel
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Local form sub-components
// ─────────────────────────────────────────────────────────────
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
      active ? 'bg-india-blue text-white' : done ? 'text-india-blue bg-india-blue/10' : 'text-foreground/50 hover:text-foreground'
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
          value === opt ? 'border-india-blue bg-india-blue/10 text-india-blue' : 'border-border text-foreground/60 hover:border-foreground/30'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
const MAX_HISTORY = 3;

export const AskForApprovalPage = () => {
  const navigate = useNavigate();
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

  const [activeInsight, setActiveInsight] = useState(null);
  const [insightHistory, setInsightHistory] = useState([]);

  // Fire insight without changing formData (for label clicks)
  const showInsight = (field, value) => {
    // TO INTEGRATE BACKEND: replace getInsight() call with your async fetch here
    const insight = getInsight(field, value);
    if (!insight) return;
    setInsightHistory((prev) =>
      activeInsight ? [activeInsight, ...prev].slice(0, MAX_HISTORY) : prev
    );
    setActiveInsight(insight);
  };

  // Update form field + trigger insight for option clicks
  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    showInsight(field, value);
  };

  const handleFinishAndSubmit = () => {
    navigate('/user/approvals/list');
  };

  // Shorthand for field-level insight (text input labels)
  const fi = (fieldKey) => () => showInsight('_field', fieldKey);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[15px] font-semibold text-foreground/60 uppercase">Single Window Clearance</span>
        </div>
        <PageHeader
          title="Ask For Approvals"
          subtitle="Answer questions about your enterprise. Click any field label to get AI guidance on what it means."
          className="pb-0 border-b-0"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── FORM ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step Tabs */}
          <div className="flex gap-1 p-1 rounded-lg border border-border bg-background">
            {STEP_LABELS.map((label, i) => (
              <StepTab key={i} step={i + 1} label={label} active={currentSection === i + 1} done={currentSection > i + 1} onClick={() => setCurrentSection(i + 1)} />
            ))}
          </div>

          {/* Form Card */}
          <div className="border border-border rounded-xl bg-background p-4 sm:p-6">

            {/* SECTION 1 */}
            {currentSection === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Section 1: Enterprise Stage & Land Location</h2>
                  <p className="text-xs text-foreground/50 mt-0.5">Clearances differ widely depending on your stage.</p>
                </div>

                {/* Stage */}
                <div>
                  <FieldLabel onClick={() => showInsight('stage', formData.stage)}>
                    Current Operational Stage <span className="text-india-blue">*</span>
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {approvalFormSchema.stages.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => update('stage', st.id)}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.stage === st.id ? 'border-india-blue bg-india-blue/5' : 'border-border hover:border-foreground/30'
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
                    <FieldLabel onClick={() => showInsight('district', formData.district)}>
                      Target District <span className="text-india-blue">*</span>
                    </FieldLabel>
                    <FormSelect value={formData.district} onChange={(v) => update('district', v)} options={approvalFormSchema.districts} />
                  </div>
                  <div>
                    <FieldLabel onClick={() => showInsight('landType', formData.landType)}>
                      Land Ownership Type <span className="text-india-blue">*</span>
                    </FieldLabel>
                    <FormSelect value={formData.landType} onChange={(v) => update('landType', v)} options={approvalFormSchema.landOwnershipTypes} />
                  </div>
                </div>

                {formData.landType.includes('MIDC') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-india-blue/20 rounded-lg p-3 bg-india-blue/5">
                    <FieldLabel onClick={fi('midcAreaName')}>MIDC Estate / Zone Name</FieldLabel>
                    <FormInput value={formData.midcAreaName} onChange={(v) => update('midcAreaName', v)} placeholder="e.g. Chakan Phase 2, Shendra" />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={fi('plotAreaSqMtr')}>Plot Area (Sq. Meters)</FieldLabel>
                    <FormInput type="number" value={formData.plotAreaSqMtr} onChange={(v) => update('plotAreaSqMtr', v)} />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('builtUpAreaSqMtr')}>Built-Up Area (Sq. Meters)</FieldLabel>
                    <FormInput type="number" value={formData.builtUpAreaSqMtr} onChange={(v) => update('builtUpAreaSqMtr', v)} />
                  </div>
                </div>

                <div className="border border-border rounded-lg p-3">
                  <FieldLabel onClick={() => showInsight('isForestOrRiverNearby', formData.isForestOrRiverNearby)}>
                    Is site within 500m of a River or Forest?
                  </FieldLabel>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {['No', 'Yes (River Basin)', 'Yes (Protected Eco-Zone)'].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer" onClick={() => update('isForestOrRiverNearby', opt)}>
                        <input type="radio" name="forestRiver" checked={formData.isForestOrRiverNearby === opt} onChange={() => {}} className="text-india-blue" />
                        <span className="text-xs text-foreground">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button type="button" onClick={() => setCurrentSection(2)} className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer">
                    Save & Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 2 */}
            {currentSection === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Section 2: Enterprise Sector & Activity</h2>
                  <p className="text-xs text-foreground/50 mt-0.5">Identifies department jurisdiction — FSSAI, Labour, Chemicals wing etc.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={() => showInsight('businessType', formData.businessType)}>
                      Primary Sector <span className="text-india-blue">*</span>
                    </FieldLabel>
                    <FormSelect
                      value={formData.businessType}
                      onChange={(v) => {
                        update('businessType', v);
                        setFormData((p) => ({ ...p, subType: approvalFormSchema.subClassifications[v][0] }));
                      }}
                      options={approvalFormSchema.businessTypes}
                      valueKey="id"
                      labelKey="label"
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('subType')}>
                      Sub-Activity <span className="text-india-blue">*</span>
                    </FieldLabel>
                    <FormSelect value={formData.subType} onChange={(v) => update('subType', v)} options={approvalFormSchema.subClassifications[formData.businessType] || []} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel onClick={fi('plantMachineryCostCrores')}>Machinery Cost (Rs Crore)</FieldLabel>
                    <FormInput type="number" step="0.1" value={formData.plantMachineryCostCrores} onChange={(v) => update('plantMachineryCostCrores', v)} />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('totalInvestmentCrores')}>Total Project Cost (Rs Crore)</FieldLabel>
                    <FormInput type="number" step="0.1" value={formData.totalInvestmentCrores} onChange={(v) => update('totalInvestmentCrores', v)} />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('proposedWorkers')}>Workforce Headcount</FieldLabel>
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
                  <button type="button" onClick={() => setCurrentSection(1)} className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border cursor-pointer">← Back</button>
                  <button type="button" onClick={() => setCurrentSection(3)} className="px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer">Continue →</button>
                </div>
              </motion.div>
            )}

            {/* SECTION 3 */}
            {currentSection === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Section 3: Utilities & Environmental Parameters</h2>
                  <p className="text-xs text-foreground/50 mt-0.5">Required by MSEDCL, Water Board, and MPCB.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={fi('connectedPowerKw')}>Connected Electricity Load (HP / kVA)</FieldLabel>
                    <FormInput type="number" value={formData.connectedPowerKw} onChange={(v) => update('connectedPowerKw', v)} />
                    <span className="text-[10px] text-foreground/40 mt-1 block">Loads &gt; 70 HP require HT substation sanction.</span>
                  </div>
                  <div>
                    <FieldLabel onClick={fi('waterRequirementKld')}>Water Usage (KLD)</FieldLabel>
                    <FormInput type="number" value={formData.waterRequirementKld} onChange={(v) => update('waterRequirementKld', v)} />
                  </div>
                </div>

                <div>
                  <FieldLabel onClick={() => showInsight('pollutionTier', formData.pollutionTier)}>
                    Pollution Category <span className="text-india-blue">*</span>
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {approvalFormSchema.pollutionCategories.map((cat) => (
                      <div
                        key={cat.code}
                        onClick={() => update('pollutionTier', cat.code)}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.pollutionTier === cat.code ? 'border-india-blue bg-india-blue/5' : 'border-border hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{cat.label}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-xs font-bold ${
                            formData.pollutionTier === cat.code ? 'bg-india-blue text-white' : 'bg-border text-foreground/60'
                          }`}>{cat.code}</span>
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
                        <FieldLabel onClick={() => showInsight(field, formData[field])}>
                          {label}
                        </FieldLabel>
                        <span className="text-[11px] text-foreground/50">{hint}</span>
                      </div>
                      <YesNoToggle value={formData[field]} onChange={(v) => update(field, v)} />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex justify-between gap-2">
                  <button type="button" onClick={() => setCurrentSection(2)} className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-border cursor-pointer">← Back</button>
                  <button type="button" onClick={handleFinishAndSubmit} className="px-6 py-2.5 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer">
                    Generate Approvals Checklist →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── AI ADVISOR ── */}
        <div className="lg:col-span-1">
          <AIAdvisorPanel insight={activeInsight} history={insightHistory} />
        </div>

      </div>
    </div>
  );
};

export default AskForApprovalPage;