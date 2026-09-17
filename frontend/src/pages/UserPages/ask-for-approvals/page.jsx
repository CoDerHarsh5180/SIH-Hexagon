import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, AIAdvisorPanel } from '../../../components/ui';
import { approvalsService } from '../../../services/approvalsService';

// ─────────────────────────────────────────────────────────────
// STATUTORY INSIGHT DATA (NSWS & MAITRI REPOSITORY)
// INSIGHTS[field][value]  → per-option insight
// INSIGHTS._field[field]  → per-field insight (for text inputs)
// ─────────────────────────────────────────────────────────────
const INSIGHTS = {
  projectNature: {
    greenfield: {
      title: 'Greenfield Project (New Industrial Setup)',
      body: 'Greenfield projects start from bare ground or an empty shed. All statutory permissions—CTE, Building Sanction, Fire NOC, and Environmental clearance—must be secured afresh before any physical erection begins.',
      points: [
        'Mandatory sequence: Land Title/NA → CTE → Building Plan → Fire NOC',
        'Requires clean site layout demarcating setbacks and green belt',
        'Eligible for Maharashtra Package Scheme of Incentives (PSI 2019)',
      ],
      tag: 'info',
    },
    brownfield: {
      title: 'Brownfield Project (Expansion / Diversification)',
      body: 'Brownfield projects utilize existing premises. You will require Amendment to CTE and DISH Factory License renewal reflecting increased capacity, new machinery, or modified effluent loads.',
      points: [
        'Requires existing CTE/CTO copies and baseline discharge records',
        'No new land NA order required if built within existing sanctioned perimeter',
        'Faster approval cycle if pollution load index does not increase',
      ],
      tag: 'tip',
    },
  },

  constitution: {
    'Private Limited Company': {
      title: 'Private Limited Company (MCA Registered)',
      body: 'Recognized corporate entity under Companies Act, 2013. Offers limited liability protection, simplified banking approvals, and higher institutional investor readiness.',
      points: [
        'Requires CIN (Corporate Identification Number) and Board Resolution',
        'Mandatory statutory audit and ROC annual filings',
        'Eligible for direct MIDC allotment in company name',
      ],
      tag: 'info',
    },
    'Partnership Firm': {
      title: 'Partnership Firm (Registrar of Firms - RoF)',
      body: 'Formed under Indian Partnership Act, 1932. Must possess a registered Partnership Deed with RoF Maharashtra for statutory property and licensing transfers.',
      points: [
        'Registered partnership deed required by DIC and MSEDCL',
        'Partners jointly and severally liable for enterprise obligations',
      ],
      tag: 'info',
    },
    'Sole Proprietorship': {
      title: 'Sole Proprietorship',
      body: 'Simplest business constitution. Ideal for micro-scale manufacturing units. Registered via Udyam MSME and Shop & Establishment Act.',
      points: [
        'Proprietor PAN card serves as the tax and license anchor',
        'No separate ROC corporate registration fees required',
        'Personal liability for all statutory dues and bank debts',
      ],
      tag: 'tip',
    },
    'Limited Liability Partnership (LLP)': {
      title: 'Limited Liability Partnership (LLP)',
      body: 'Combines corporate limited liability with the internal operational flexibility of a partnership under the LLP Act, 2008.',
      points: [
        'Requires LLPIN registered with Ministry of Corporate Affairs',
        'Low compliance burden compared to Pvt Ltd',
      ],
      tag: 'info',
    },
    'Public Limited': {
      title: 'Public Limited Company',
      body: 'High-scale entity subject to stringent MCA and SEBI disclosures. Mandatory for projects seeking public capital or large infrastructure scale.',
      points: [
        'Mandatory minimum 3 directors and 7 shareholders',
        'Extensive corporate governance and public filing obligations',
      ],
      tag: 'warning',
    },
  },

  isCompanyRegistered: {
    'Yes': {
      title: 'Registered Enterprise Status',
      body: 'Your business has legal standing via Udyam MSME certificate or MCA incorporation. All department applications can reference your verified CIN/Udyam number.',
      points: [
        'Instant validation across MAITRI single-window departments',
        'Qualifies for MSME delayed payment protection and concessional fees',
      ],
      tag: 'tip',
    },
    'No': {
      title: 'Statutory Registration Required',
      body: 'Unregistered units cannot secure industrial power tariffs, MPCB CTE, or factory building sanctions under Maharashtra industrial policy.',
      points: [
        'AI engine adds Udyam MSME / MCA Registration as Step 1 prerequisite',
        'Registration is 100% online, free of cost, and issued in 24–48 hours',
      ],
      tag: 'warning',
    },
  },

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
      title: 'Pune District Industrial Desk',
      body: 'MPCB Pune Regional Office supports full online portal filing — typically 20% faster than counter submission. Dedicated single-window desks at Chakan, Ranjangaon, and Talegaon.',
      points: ['Helpline: 020-2612-7881', 'MIDC Chakan, Ranjangaon, Talegaon have dedicated windows'],
      tag: 'tip',
    },
    'Thane': {
      title: 'Thane District Industrial Desk',
      body: 'MPCB Thane Sub-Regional Office has a dedicated fast-track window for Green and White category industries. Fast processing at Naupada zonal center.',
      points: ['Helpline: 022-2534-7777', 'Green/White fast-track — typically 15 days'],
      tag: 'tip',
    },
    'Mumbai Suburban': {
      title: 'Mumbai Suburban District',
      body: 'High environmental scrutiny due to coastal zone regulations. Allow 15 extra working days for CRZ compliance verification by MoEF & MCZMA.',
      points: ['Helpline: 022-2642-7731', 'CRZ clearance adds significant time if site is near coast'],
      tag: 'warning',
    },
    'Aurangabad (Chhatrapati Sambhajinagar)': {
      title: 'Aurangabad District Industrial Desk',
      body: 'Shendra and Waluj MIDC applicants benefit from priority single-window processing via the MAITRI portal — one of the fastest industrial clearance hubs.',
      points: ['Helpline: 0240-2481-556', 'Shendra MIDC has an in-estate inspection facility'],
      tag: 'tip',
    },
    'Nagpur': {
      title: 'Nagpur District Industrial Desk',
      body: 'Butibori MIDC has a dedicated on-site industrial desk for faster clearance. Sub-Regional MPCB office is located at Civil Lines.',
      points: ['Helpline: 0712-2560-881', 'Butibori MIDC desk handles permits in-estate'],
      tag: 'info',
    },
    'Nashik': {
      title: 'Nashik District Industrial Desk',
      body: 'Satpur, Ambad, and Sinnar MIDC zones have streamlined online application processes with Canada Corner MPCB office.',
      points: ['Helpline: 0253-2310-762', 'Online portal preferred for all submissions'],
      tag: 'info',
    },
    'Raigad': {
      title: 'Raigad District (Coastal & Industrial)',
      body: 'Coastal Regulation Zone (CRZ) rules apply if your site is near the coastline or creek. Environmental clearances require State SEIAA screening.',
      points: ['Helpline: 02141-222-561', 'Factor 30 extra days if CRZ proximity is triggered'],
      tag: 'warning',
    },
    'Kolhapur': {
      title: 'Kolhapur District',
      body: 'Standard processing timeline. MPCB District Office is at Tarabai Park handling Shiroli and Gokul Shirgaon industrial areas.',
      points: ['Helpline: 0231-2650-711'],
      tag: 'info',
    },
    'Solapur': {
      title: 'Solapur District',
      body: 'Textile and engineering hub. MIDC Chincholi applications are processed with state DIC incentives.',
      points: ['Helpline: 0217-2720-445'],
      tag: 'info',
    },
  },

  landType: {
    'MIDC Industrial Allotted Plot': {
      title: 'MIDC Plot — Deemed Industrial Zone',
      body: 'MIDC allotment letter itself serves as the legal land title. No separate Non-Agricultural (NA) conversion is needed under Section 44 MLRC — saves 60–90 days.',
      points: [
        'No NA conversion required — eliminates District Collector visit',
        'MIDC provides internal roads, HT power grid, and water infrastructure',
        'CTE application can begin immediately upon plot possession',
      ],
      tag: 'tip',
    },
    'Private Industrial Park': {
      title: 'Private Industrial Park / SEZ',
      body: 'Verify that the Industrial Park master layout has approval from Town Planning Authority. Individual plots get a derivative sanction from this master layout approval.',
      points: [
        'Request master layout approval from the developer',
        'Individual plot NA is derived from master — faster than standalone land',
        'Common ETP/CETP infrastructure can often be shared',
      ],
      tag: 'info',
    },
    'Agricultural Land': {
      title: 'Agricultural Land — Section 44 MLRC Conversion Mandatory',
      body: 'You must obtain Non-Agricultural (NA) conversion from the Sub-Divisional Officer (SDO) or District Collector before any civil construction or factory erection.',
      points: [
        'Requires 7/12 Extract, Village Demarcation Map, and Talathi no-dues cert',
        'SDO processing turnaround: 45–60 days',
        'Building sanction cannot be granted without final NA Order',
        'Conversion premium and non-agricultural assessment tax apply',
      ],
      tag: 'warning',
    },
    'Leased Commercial Premises': {
      title: 'Leased Industrial Premises / Shed',
      body: 'Factory License and CTE validity will be capped to match your lease term. All clearances must be renewed or amended when the lease deed is renewed.',
      points: [
        'Lease deed must be registered with the Sub-Registrar of Assurances',
        'Landlord NOC required for all statutory applications',
        'Check that the premise holds previous industrial occupancy certificate',
      ],
      tag: 'info',
    },
  },

  hasNaOrder: {
    'Yes': {
      title: 'NA Order Secured',
      body: 'Your agricultural land has already been legally converted for industrial usage under Sec 44 MLRC. You can directly proceed with Building Plan approval.',
      points: ['Attach Collector NA Order with building plan blueprint'],
      tag: 'tip',
    },
    'No': {
      title: 'NA Order Required (Step 1 Clearance)',
      body: 'Without an official NA order from the SDO/Collector, civil engineering blueprints and factory plans cannot be accepted by local planning authorities.',
      points: [
        'Added to your statutory clearances checklist automatically',
        'Estimated fee: ₹15,000 + land conversion premium',
      ],
      tag: 'warning',
    },
  },

  buildingHeight: {
    'Under 15 Meters (Standard)': {
      title: 'Standard Industrial Shed (<= 15m)',
      body: 'Single or double-height factory shed. Evaluated under standard fire hydrant and emergency exit norms without high-rise committee scrutiny.',
      points: ['Standard provisional fire NOC applies'],
      tag: 'info',
    },
    'Above 15 Meters (High-Rise)': {
      title: 'High-Rise Industrial Structure (> 15m)',
      body: 'Structures exceeding 15 meters in height require High-Rise Fire Safety Committee review under National Building Code (NBC) 2016 Part 4.',
      points: [
        'Mandatory dual fire escape staircases and external fire lifts',
        'Dedicated 6-meter peripheral access road for fire tenders',
        'Higher safety audit scrutiny before Occupancy Certificate',
      ],
      tag: 'warning',
    },
  },

  isForestOrRiverNearby: {
    'No': {
      title: 'No Sensitive Environmental Zone Proximity',
      body: 'Your site does not border river catchments or protected eco-zones. Standard MPCB pollution clearance timeline applies.',
      points: ['No MoEF or River Regulation clearance needed'],
      tag: 'tip',
    },
    'Yes (River Basin within 500m)': {
      title: 'River Regulation Zone (RRZ) Proximity',
      body: 'Site falls within 500m of a notified river basin. River Impact Assessment and stringent zero-discharge standards will be enforced by MPCB.',
      points: [
        'Effluent discharge into river catchment strictly forbidden',
        'Must install Zero Liquid Discharge (ZLD) or connect to municipal sewer',
        'Adds 45–60 days to environmental clearance turnaround',
      ],
      tag: 'warning',
    },
    'Yes (Protected Eco-Zone / Forest within 500m)': {
      title: 'Eco-Sensitive Zone (ESZ) / Forest Proximity',
      body: 'Site is within 500m of a notified sanctuary, national park, or reserved forest. Forest Clearance via MoEF & CC Parivesh portal is mandatory.',
      points: [
        'Central government MoEF clearance required',
        'Red category industries generally prohibited within 1km ESZ',
        'Requires certified GPS buffer map by Chief Conservator of Forests',
      ],
      tag: 'warning',
    },
    'Yes (Coastal Regulation Zone - CRZ)': {
      title: 'Coastal Regulation Zone (CRZ) Notification',
      body: 'Located near tidal water bodies, creeks, or sea coastline. Maharashtra Coastal Zone Management Authority (MCZMA) recommendation required.',
      points: [
        'MCZMA online portal application required',
        'Strict restrictions on permanent civil construction within CRZ buffer',
      ],
      tag: 'warning',
    },
  },

  businessType: {
    'food_processing': {
      title: 'Food & Beverage Sector',
      body: 'FSSAI (Food Safety and Standards Authority of India) is the core statutory regulator alongside MPCB. All food handlers must undergo medical fitness tests.',
      points: [
        'FSSAI State / Central Manufacturing License mandatory before trial batch',
        'Water test report according to IS 10500 potable norms required',
        'Organic trade effluent requires specialized biochemical ETP',
      ],
      tag: 'info',
    },
    'chemical_pharma': {
      title: 'Chemical, Dyes & Pharmaceuticals',
      body: 'Highest regulatory scrutiny in Maharashtra. Involves MPCB Red Category, PESO clearance for flammable solvents, and hazardous waste TSDF membership.',
      points: [
        'PESO license for solvents and pressurized vessels',
        'Hazardous Waste Management Authorization (Form 1)',
        'Mandatory online continuous effluent monitoring system (OCEMS)',
      ],
      tag: 'warning',
    },
    'textile_garments': {
      title: 'Textile, Spinning & Garmenting',
      body: 'Garment stitching has low pollution footprint (White/Green). Wet dyeing, bleaching, and washing require Zero Liquid Discharge (ZLD) or CETP connection.',
      points: [
        'Dyeing units: ZLD mandatory in water-stressed districts',
        'CETP membership letter required before MPCB CTE',
      ],
      tag: 'info',
    },
    'engineering_metal': {
      title: 'Automobile & Heavy Engineering',
      body: 'Includes sheet metal, fabrication, CNC machining, casting, and surface finishing. Electroplating and foundry activities trigger specialized clearances.',
      points: [
        'Electroplating: Acid bath hazardous waste authorization',
        'Foundry & Furnaces: Chimney emission scrubbers and stack height norms',
        'Electrical connected load typically requires HT substation',
      ],
      tag: 'info',
    },
    'cold_storage': {
      title: 'Cold Storage & Agro Warehouse',
      body: 'Units utilizing ammonia refrigerants are classed under hazardous chemical storage with mandatory disaster management protocols.',
      points: [
        'FSSAI Food Storage License for agro commodities',
        'Ammonia gas leak safety plan and breathing apparatus on-site',
        'Heavy continuous HT power requirement from MSEDCL',
      ],
      tag: 'info',
    },
  },

  isFoodProduct: {
    'Yes': {
      title: 'Food Safety Compliance (FSSAI)',
      body: 'Statutory prerequisite under Food Safety and Standards Act, 2006. FSSAI State Manufacturing License must be in hand before any commercial sale or dispatch.',
      points: [
        'Requires list of food categories and FoSCoS portal filing',
        'Potable water test report from NABL accredited laboratory',
      ],
      tag: 'info',
    },
    'No': {
      title: 'Non-Food Operations',
      body: 'Your products are non-edible. FSSAI food licensing regulations do not apply to this facility.',
      points: ['Eliminates FSSAI inspection and fee requirement'],
      tag: 'tip',
    },
  },

  storesFlammableSolvents: {
    'Yes': {
      title: 'PESO Flammable & Petroleum Storage Clearance',
      body: 'Under Petroleum Act 1934 and Petroleum Rules 2002, storage of Class A/B petroleum, industrial solvents, or compressed gas requires prior PESO license.',
      points: [
        'PESO approval required before constructing solvent storage tank farm',
        'Flameproof electrical fittings and flame arrestors mandatory',
        'Inspection by PESO controller prior to commissioning',
      ],
      tag: 'warning',
    },
    'No': {
      title: 'No Flammable Chemical Solvents',
      body: 'Facility does not store bulk volatile hydrocarbons or pressurized gases. PESO approval layer is bypassed.',
      points: ['Simpler site plan and lower fire insurance premium'],
      tag: 'tip',
    },
  },

  generatesHazardousWaste: {
    'Yes': {
      title: 'Hazardous Waste Management Authorization (Form 1)',
      body: 'Mandatory under Hazardous and Other Wastes Rules, 2016. Units generating spent acids, paint sludge, ETP filter cake, or chemical barrels must hold Form 1 authorization.',
      points: [
        'Dedicated hazardous waste storage shed with impervious concrete flooring',
        'Agreement with common TSDF facility (e.g. MEPL Ranjangaon/Taloja)',
        'Maintenance of Form 3 daily waste register on-site',
      ],
      tag: 'warning',
    },
    'No': {
      title: 'Non-Hazardous Industrial Waste',
      body: 'Facility produces standard municipal or recyclable scrap only. No specialized hazardous waste storage shed or TSDF agreement required.',
      points: ['Standard MPCB consent without hazardous authorization'],
      tag: 'tip',
    },
  },

  isExportOriented: {
    'Yes': {
      title: 'DGFT Importer-Exporter Code (IEC)',
      body: 'Exporting physical commodities abroad requires a 10-digit PAN-based IEC issued by the Directorate General of Foreign Trade (DGFT).',
      points: [
        'Fast online issuance within 24 hours',
        'Required for customs ICEGATE port clearance and GST zero-rating (LUT)',
      ],
      tag: 'info',
    },
    'No': {
      title: 'Domestic Market Distribution Only',
      body: 'Manufactured products will be sold within Indian state borders. DGFT IEC registration is not required at this stage.',
      points: ['Can be applied at any future expansion point'],
      tag: 'tip',
    },
  },

  connectedPowerKw: {
    title: 'Connected Electricity Load (HP / kW)',
    body: 'Load up to 70 HP (52 kW) is serviced on standard Low-Tension (LT) supply. Loads exceeding 70 HP mandate High-Tension (HT) 11kV/22kV dedicated substation transformer and Chief Electrical Inspectorate (CEI) safety sanction.',
    points: [
      '<= 70 HP: LT connection, rapid energization by MSEDCL',
      '> 70 HP: HT substation sanction and dedicated transformer needed',
      'CEI earthing test report and earth pits inspection mandatory',
    ],
    tag: 'info',
  },

  hasDieselGenerator: {
    'Yes': {
      title: 'Backup DG Set Installation (CEI Sanction)',
      body: 'Installing a captive diesel generator set requires Form C inspection and sanction from the Chief Electrical Inspectorate (CEI).',
      points: [
        'Acoustic enclosure compliant with CPCB noise norms (<= 75 dB at 1m)',
        'Dual independent earthing pits for alternator and neutral',
        "Submission of DG test certificate by certified 'A' class contractor",
      ],
      tag: 'info',
    },
    'No': {
      title: 'No Captive Generator',
      body: 'No DG Set planned. CEI generator clearance is not required for backup power.',
      points: ['Reduced electrical inspection turnaround'],
      tag: 'tip',
    },
  },

  waterSource: {
    'MIDC Piped Water Network': {
      title: 'MIDC Industrial Water Supply',
      body: 'Fastest and most reliable option. Water allotment is processed directly through MIDC engineering division without Central Ground Water Authority scrutiny.',
      points: [
        'Piped connection at plot boundary',
        'No groundwater depletion or CGWA NOC required',
      ],
      tag: 'tip',
    },
    'Municipal Corporation / Local Body': {
      title: 'Municipal / Nagar Palika Water Connection',
      body: 'Supply provided by local municipal authority. Subject to local municipal industrial tariff and pipeline extension permissions.',
      points: ['Local body water connection sanction required'],
      tag: 'info',
    },
    'Groundwater Extraction (Borewell)': {
      title: 'Groundwater Borewell (CGWA NOC Mandatory)',
      body: 'Extracting groundwater for commercial or industrial operations requires statutory NOC from Central Ground Water Authority (CGWA) under Jal Shakti guidelines.',
      points: [
        'CGWA NOC added to statutory clearances checklist',
        'Mandatory installation of digital water flow meter with telemetry',
        'Hydrogeological survey report must be attached with application',
      ],
      tag: 'warning',
    },
    'River / Surface Water': {
      title: 'Surface Water / River Intake',
      body: 'Pumping water directly from rivers, canals, or dams requires Water Resources Department (Irrigation Dept) extraction sanction.',
      points: ['Requires Irrigation Department agreement and water royalty deposit'],
      tag: 'warning',
    },
  },

  pollutionTier: {
    WHITE: {
      title: 'White Category (Practically Non-Polluting)',
      body: 'White category only requires an online intimation letter to MPCB. No formal consent fee, no site inspection, and no renewal hassle.',
      points: ['7–15 days processing', 'Fee: ₹3,500 intimation', 'No field inspector visit required'],
      tag: 'tip',
    },
    GREEN: {
      title: 'Green Category (Low Pollution Index)',
      body: 'Green category benefits from fast-track processing across all Maharashtra district offices. Issued after desk review of process flowchart.',
      points: ['15–25 days processing', 'Fee: ₹8,000 standard', 'Minimal site scrutiny'],
      tag: 'tip',
    },
    ORANGE: {
      title: 'Orange Category (Medium Pollution Index)',
      body: 'Standard manufacturing unit producing industrial effluent or stack emissions. Mandatory pre-commissioning field inspection by an MPCB sub-regional officer.',
      points: ['30–45 days processing', 'Fee: ₹15,000 – ₹50,000', 'ETP/STP must be commissioned before inspection'],
      tag: 'info',
    },
    RED: {
      title: 'Red Category (High Pollution Index)',
      body: 'Highest pollution potential. Requires public consultation, environmental impact assessment (EIA), and strict effluent standards.',
      points: ['45–60 days processing', 'Fee: ₹50,000 – ₹2,00,000', 'State appraisal committee review mandatory'],
      tag: 'warning',
    },
  },

  hasBoilerOrFurnace: {
    'Yes': {
      title: 'Boiler / Pressure Vessel Inspection (IBR 1923)',
      body: 'Operating steam boilers or high-pressure thermic heaters falls under the Indian Boilers Act, 1923, administered by the Directorate of Steam Boilers.',
      points: [
        'IBR certified manufacturer test certificates mandatory',
        'Hydrostatic pressure test conducted on-site by boiler inspector',
        'Certified boiler attendant must be physically present during operation',
      ],
      tag: 'warning',
    },
    'No': {
      title: 'No Steam Boilers or Pressure Furnaces',
      body: 'Directorate of Steam Boilers has no jurisdiction over this plant, eliminating this inspection layer.',
      points: ['No boiler inspector visit required'],
      tag: 'tip',
    },
  },

  proposedWorkers: {
    title: 'Workforce Headcount Compliance Thresholds',
    body: 'Industrial labor regulations scale directly with headcount: >= 10 workers using power triggers the Factories Act 1948 (DISH Form 1). >= 20 workers triggers mandatory EPFO (Provident Fund) and ESIC (Medical Insurance) registration.',
    points: [
      '>= 10 workers: DISH Factory License (Form 1) mandatory',
      '>= 20 workers: Statutory EPFO & ESIC social security enrollment',
      '>= 50 workers: Canteen facility & safety committee mandatory',
    ],
    tag: 'info',
  },

  _field: {
    plotAreaSqMtr: {
      title: 'Total Land Parcel Area',
      body: 'Enter the exact plot area in square meters as recorded on your MIDC Allotment Letter or 7/12 Land Extract. This drives Floor Space Index (FSI) calculations and MPCB green belt requirements.',
      points: ['Minimum 33% area must be reserved for green belt in Orange/Red units'],
      tag: 'info',
    },
    builtUpAreaSqMtr: {
      title: 'Total Covered Built-Up Area',
      body: 'The covered factory shed, admin block, and warehouse area. Built-up area exceeding 500 sq.m triggers mandatory Provisional Fire Safety NOC.',
      points: ['Fire hydrant loops and fire tender access road are verified based on built-up area'],
      tag: 'info',
    },
    plantMachineryCostCrores: {
      title: 'Plant & Machinery Capital Investment',
      body: 'Government classification for MSMEs under the MSMED Act 2006: Micro (up to ₹1 Cr), Small (₹1 to ₹10 Cr), Medium (₹10 to ₹50 Cr). Influences government subsidy eligibility and clearance fees.',
      points: ['Classifies enterprise scale on your Udyam Certificate'],
      tag: 'info',
    },
    totalInvestmentCrores: {
      title: 'Total Project Cost (Land + Building + Machinery)',
      body: 'Total project investment including civil works, land purchase, and utilities. Used by MPCB to determine the statutory Consent to Establish (CTE) fee slab.',
      points: ['Must match figures in your Detailed Project Report (DPR)'],
      tag: 'info',
    },
    waterRequirementKld: {
      title: 'Daily Water Consumption (KLD)',
      body: 'Enter the estimated kilolitres per day (KLD) needed for cooling, process, boiler feed, and domestic sanitary use. Higher consumption triggers dedicated Effluent Treatment Plant (ETP) capacity verification.',
      points: ['Usage above 10 KLD mandates continuous flow monitoring'],
      tag: 'info',
    },
    midcAreaName: {
      title: 'MIDC Industrial Estate / Zone Name',
      body: 'Specify the designated MIDC industrial cluster (e.g. Chakan Phase 2, Ranjangaon, Shendra, Butibori, Ambad). Routes your file directly to the zonal MIDC Special Planning Authority (SPA).',
      points: ['Assures prompt routing to the zonal MIDC executive engineer'],
      tag: 'info',
    },
  },
};

const getInsight = (field, value) => {
  const data = field === '_field' ? INSIGHTS._field?.[value] : INSIGHTS[field]?.[value];
  if (!data) return null;
  return { ...data, field, value, timestamp: new Date() };
};

// ─────────────────────────────────────────────────────────────
// KYA Master Schema
// ─────────────────────────────────────────────────────────────
const KYA_SCHEMA = {
  projectNatures: [
    { id: 'greenfield', label: 'New Factory (Greenfield)', desc: 'Starting a brand new factory on a new plot or shed' },
    { id: 'brownfield', label: 'Expanding Old Factory (Brownfield)', desc: 'Adding new machines, extra sheds, or increasing capacity in existing unit' },
  ],
  constitutions: [
    'Private Limited Company (Pvt Ltd)',
    'Partnership Firm',
    'Proprietorship (Single Owner)',
    'Limited Liability Partnership (LLP)',
    'Public Limited Company',
  ],
  stages: [
    { id: 'pre-construction', label: 'Before Construction (Planning)', tagline: 'Need land permissions, factory building map pass & Pollution Board CTE' },
    { id: 'pre-operational', label: 'Construction Done (Fitting Machines)', tagline: 'Building is ready, setting up machinery, power & water connections' },
    { id: 'established', label: 'Running Factory (Expansion)', tagline: 'Factory is working; adding more machines, power load or new sheds' },
  ],
  districts: [
    'Pune',
    'Thane',
    'Mumbai Suburban',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Nagpur',
    'Nashik',
    'Kolhapur',
    'Solapur',
    'Raigad',
  ],
  landOwnershipTypes: [
    'MIDC Industrial Allotted Plot',
    'Private Industrial Park',
    'Agricultural Land (Farm Land)',
    'Rented / Leased Commercial Premises',
  ],
  buildingHeights: [
    'Under 15 Meters (Standard Factory Shed)',
    'Above 15 Meters (Multi-floor / High-Rise)',
  ],
  ecoZones: [
    'No (Normal Industrial Zone)',
    'Yes (Near River / Water Canal within 500m)',
    'Yes (Near Forest or Sanctuary within 500m)',
    'Yes (Near Sea Coast / CRZ Area)',
  ],
  businessTypes: [
    { id: 'food_processing', label: 'Food, Dairy & Beverages' },
    { id: 'chemical_pharma', label: 'Chemicals, Dyes & Medicines' },
    { id: 'textile_garments', label: 'Cloth, Garments & Spinning' },
    { id: 'engineering_metal', label: 'Automobile, Metal & Machinery' },
    { id: 'cold_storage', label: 'Cold Storage & Agro Warehouse' },
  ],
  subClassifications: {
    food_processing: ['Dairy & Milk Products', 'Bakery & Snacks', 'Fruit Pulp & Canning', 'Atta / Dal / Spices Milling'],
    chemical_pharma: ['Bulk Drug Medicines (APIs)', 'Industrial Chemicals & Acids', 'Paints & Varnishes', 'Tablets / Liquid Packaging'],
    textile_garments: ['Cloth Dyeing & Washing', 'Fabric Weaving Only', 'Readymade Garment Stitching'],
    engineering_metal: ['Electroplating & Metal Coating', 'Foundry & Iron Casting', 'Sheet Metal Fabrication & Auto Parts'],
    cold_storage: ['Cold Storage for Fruits & Vegetables', 'Dry Godown & Warehouse'],
  },
  waterSources: [
    'MIDC Pipeline Supply',
    'Nagar Palika / Municipal Water',
    'Borewell (Groundwater Pump)',
    'River / Canal Water',
  ],
  pollutionCategories: [
    { code: 'WHITE', label: 'White Category (Very Low Pollution)', desc: 'Zero smoke/effluent. Only online notice to MPCB needed.' },
    { code: 'GREEN', label: 'Green Category (Low Pollution)', desc: 'Small pollution footprint. Quick consent in 15 to 25 days.' },
    { code: 'ORANGE', label: 'Orange Category (Medium Pollution)', desc: 'General factory with smoke or dirty water. Needs ETP plant.' },
    { code: 'RED', label: 'Red Category (Heavy / Chemical Pollution)', desc: 'High pollution risk. Detailed government checks required.' },
  ],
};

const STEP_LABELS = [
  '1. Entity & Land',
  '2. Sector & Operations',
  '3. Utilities & Water',
  '4. Safety & Labour',
];

const StepTab = ({ step, label, active, done, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
      active
        ? 'bg-india-blue text-white shadow-sm'
        : done
        ? 'text-india-blue bg-india-blue/10 hover:bg-india-blue/20'
        : 'text-foreground/60 hover:text-foreground hover:bg-muted/40'
    }`}
  >
    <span
      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
        active
          ? 'bg-white text-india-blue'
          : done
          ? 'bg-india-blue text-white'
          : 'border border-foreground/30 text-foreground/60'
      }`}
    >
      {done && !active ? '✓' : step}
    </span>
    <span className="truncate hidden sm:inline">{label}</span>
    <span className="sm:hidden">{step}</span>
  </button>
);

const FieldLabel = ({ children, onClick, required = false }) => {
  if (!onClick) {
    return (
      <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
        {children} {required && <span className="text-india-orange font-bold">*</span>}
      </label>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-1.5 mb-1.5 cursor-pointer text-left w-full"
    >
      <span className="text-xs font-semibold text-foreground/80 group-hover:text-india-blue transition-colors border-b border-dashed border-transparent group-hover:border-india-blue/50">
        {children} {required && <span className="text-india-orange font-bold">*</span>}
      </span>
      <span className="text-[9px] font-bold text-india-blue/60 group-hover:text-india-blue transition-all uppercase tracking-wider bg-india-blue/5 px-1.5 py-0.5 rounded border border-india-blue/20 shrink-0">
        AI Clause ↗
      </span>
    </button>
  );
};

const YesNoToggle = ({ value, onChange }) => (
  <div className="flex gap-1.5 shrink-0">
    {['Yes', 'No'].map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
          value === opt
            ? 'border-india-blue bg-india-blue text-white shadow-sm'
            : 'border-border text-foreground/60 hover:border-foreground/30 hover:bg-muted/40'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const FormSelect = ({ value, onChange, options, labelKey = null, valueKey = null }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground text-xs focus:outline-none focus:border-india-blue focus:ring-1 focus:ring-india-blue transition-colors"
  >
    {options.map((opt) => {
      const val = valueKey ? opt[valueKey] : opt;
      const label = labelKey ? opt[labelKey] : opt;
      return (
        <option key={val} value={val}>
          {label}
        </option>
      );
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
    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground text-xs focus:outline-none focus:border-india-blue focus:ring-1 focus:ring-india-blue transition-colors"
  />
);

const MAX_HISTORY = 3;

export const AskForApprovalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(1);
  const [evaluating, setEvaluating] = useState(false);
  const [advisoryBanner, setAdvisoryBanner] = useState(Boolean(location.state?.needQuestionnaire));

  const resolvedInitialDistrict = () => {
    const raw = location.state?.initialDistrict;
    if (!raw) return 'Pune';
    return raw;
  };

  // ─────────────────────────────────────────────────────────────
  // NSWS / MAITRI STRUCTURED FORM STATE (NO OPEN ESSAY PROMPTS)
  // ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    // Module 1: Enterprise Nature & Land Location
    projectNature: 'greenfield',
    constitution: 'Private Limited Company',
    isCompanyRegistered: 'Yes',
    stage: 'pre-construction',
    district: resolvedInitialDistrict(),
    landType: 'MIDC Industrial Allotted Plot',
    midcAreaName: 'MIDC Chakan Phase 2',
    hasNaOrder: 'Yes',
    plotAreaSqMtr: '2500',
    builtUpAreaSqMtr: '1400',
    buildingHeight: 'Under 15 Meters (Standard)',
    isForestOrRiverNearby: 'No',

    // Module 2: Sector & Operational Triggers
    businessType: 'food_processing',
    subType: 'Fruit Pulp & Canning',
    isFoodProduct: 'Yes',
    storesFlammableSolvents: 'No',
    generatesHazardousWaste: 'No',
    isExportOriented: 'No',
    plantMachineryCostCrores: '4.2',
    totalInvestmentCrores: '8.5',

    // Module 3: Utilities & Infrastructure
    connectedPowerKw: '180',
    hasDieselGenerator: 'Yes',
    waterSource: 'MIDC Piped Water Network',
    waterRequirementKld: '15',
    dischargesEffluent: 'Yes',

    // Module 4: Safety, Labour & Environmental Classification
    pollutionTier: 'ORANGE',
    hasBoilerOrFurnace: 'No',
    proposedWorkers: '35',
  });

  const [activeInsight, setActiveInsight] = useState(null);
  const [insightHistory, setInsightHistory] = useState([]);

  const showInsight = (field, value) => {
    const insight = getInsight(field, value);
    if (!insight) return;
    setInsightHistory((prev) =>
      activeInsight ? [activeInsight, ...prev].slice(0, MAX_HISTORY) : prev
    );
    setActiveInsight(insight);
  };

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    showInsight(field, value);
  };

  const fi = (fieldKey) => () => showInsight('_field', fieldKey);

  const calculatedMsmeScale = () => {
    const mach = Number(formData.plantMachineryCostCrores) || 0;
    if (mach <= 1) return 'Micro Enterprise';
    if (mach <= 10) return 'Small Enterprise';
    if (mach <= 50) return 'Medium Enterprise';
    return 'Large Industrial Undertaking';
  };

  // ─────────────────────────────────────────────────────────────
  // SUBMIT EVALUATION TO BACKEND ENGINE
  // ─────────────────────────────────────────────────────────────
  const handleFinishAndSubmit = async () => {
    setEvaluating(true);
    const evaluationPayload = {
      projectNature: formData.projectNature,
      constitution: formData.constitution,
      isCompanyRegistered: formData.isCompanyRegistered === 'Yes',
      hasUdyam: formData.isCompanyRegistered === 'Yes',
      stage: formData.stage,
      district: formData.district,
      landType: formData.landType,
      midcAreaName: formData.midcAreaName,
      hasNaOrder: formData.hasNaOrder === 'Yes',
      plotAreaSqM: Number(formData.plotAreaSqMtr) || 0,
      builtUpAreaSqM: Number(formData.builtUpAreaSqMtr) || 0,
      buildingHeight: formData.buildingHeight,
      isForestOrRiverNearby: formData.isForestOrRiverNearby,

      sector: formData.businessType,
      subSector: formData.subType,
      isFoodProduct: formData.isFoodProduct === 'Yes',
      storesFlammableSolvents: formData.storesFlammableSolvents === 'Yes',
      generatesHazardousWaste: formData.generatesHazardousWaste === 'Yes',
      isExportOriented: formData.isExportOriented === 'Yes',
      totalCapitalInvestmentInr: (Number(formData.totalInvestmentCrores) || 0) * 10000000,
      plantMachineryCostCrores: Number(formData.plantMachineryCostCrores) || 0,
      enterpriseScale:
        Number(formData.plantMachineryCostCrores) <= 1
          ? 'MICRO'
          : Number(formData.plantMachineryCostCrores) <= 10
          ? 'SMALL'
          : Number(formData.plantMachineryCostCrores) <= 50
          ? 'MEDIUM'
          : 'LARGE',

      connectedPowerLoadKW: Number(formData.connectedPowerKw) || 0,
      hasDGSet: formData.hasDieselGenerator === 'Yes',
      waterSource: formData.waterSource,
      dailyWaterConsumptionKLD: Number(formData.waterRequirementKld) || 0,
      dischargesEffluent: formData.dischargesEffluent === 'Yes',

      pollutionTier: formData.pollutionTier,
      hasBoiler: formData.hasBoilerOrFurnace === 'Yes',
      workforceCount: Number(formData.proposedWorkers) || 0,
    };

    const targetListRoute = location.pathname.startsWith('/user')
      ? '/user/approvals/list'
      : '/approvals/list';

    try {
      const res = await approvalsService.evaluateQuestionnaire(evaluationPayload);
      navigate(targetListRoute, { state: { evaluationResult: res.data } });
    } catch (err) {
      console.warn('[AskForApproval] Evaluation fallback to client heuristics:', err.message);
      navigate(targetListRoute);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-india-blue uppercase tracking-wider bg-india-blue/10 px-2 py-0.5 rounded">
            Government Single Window System
          </span>
          <span className="text-xs text-foreground/50">• Check Required Government Permissions</span>
        </div>
        <PageHeader
          title="Find Approvals for Your Factory"
          subtitle="Answer a few simple questions about your factory. We will find every government clearance, license, and NOC you need in Maharashtra."
          className="pb-0 border-b-0"
        />
      </div>

      {/* Advisory Banner if accessed directly */}
      {advisoryBanner && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">📋</span>
            <p>
              <strong>Please fill these details:</strong> To give you the exact list of government permissions and fees, please answer these basic factory details first.
            </p>
          </div>
          <button
            onClick={() => setAdvisoryBanner(false)}
            className="text-amber-900 dark:text-amber-100 font-bold hover:underline cursor-pointer ml-3 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two-column layout: Form & AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── QUESTIONNAIRE FORM CONTAINER ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step Tabs */}
          <div className="flex gap-1.5 p-1.5 rounded-xl border border-border bg-card/40 backdrop-blur">
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

          {/* Form Card */}
          <div className="border border-border rounded-2xl bg-card p-4 sm:p-6 shadow-sm">
            {/* ════════════════════════════════════════════════════════════
                MODULE 1: ENTERPRISE CONSTITUTION & LAND PARCEL
               ════════════════════════════════════════════════════════════ */}
            {currentSection === 1 && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Step 1: Business Type & Land Details
                    </h2>
                    <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">
                      Step 1 of 4
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Tell us about your company setup, registration, and factory land.
                  </p>
                </div>

                {/* Project Nature: Greenfield vs Brownfield */}
                <div>
                  <FieldLabel onClick={() => showInsight('projectNature', formData.projectNature)} required>
                    Is this a New Factory or Expanding an Old One?
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {KYA_SCHEMA.projectNatures.map((pn) => (
                      <div
                        key={pn.id}
                        onClick={() => update('projectNature', pn.id)}
                        className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
                          formData.projectNature === pn.id
                            ? 'border-india-blue bg-india-blue/5 ring-1 ring-india-blue'
                            : 'border-border hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{pn.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                              formData.projectNature === pn.id
                                ? 'border-india-blue bg-india-blue text-white'
                                : 'border-border'
                            }`}
                          >
                            {formData.projectNature === pn.id && '✓'}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60 mt-1">{pn.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Constitution & Registered Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={() => showInsight('constitution', formData.constitution)} required>
                      Company Ownership Type
                    </FieldLabel>
                    <FormSelect
                      value={formData.constitution}
                      onChange={(v) => update('constitution', v)}
                      options={KYA_SCHEMA.constitutions}
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={() => showInsight('stage', formData.stage)} required>
                      Current Factory Stage
                    </FieldLabel>
                    <FormSelect
                      value={formData.stage}
                      onChange={(v) => update('stage', v)}
                      options={KYA_SCHEMA.stages}
                      valueKey="id"
                      labelKey="label"
                    />
                  </div>
                </div>

                {/* Registration Check */}
                <div className="p-3.5 rounded-xl border border-border bg-card/30 flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel onClick={() => showInsight('isCompanyRegistered', formData.isCompanyRegistered)}>
                      Is your company already registered with Government (Udyam MSME or MCA / ROC)?
                    </FieldLabel>
                    <span className="text-[11px] text-foreground/50 block">
                      If No, we will first help you get your free Udyam MSME registration online.
                    </span>
                  </div>
                  <YesNoToggle
                    value={formData.isCompanyRegistered}
                    onChange={(v) => update('isCompanyRegistered', v)}
                  />
                </div>

                {/* District and Land Tenure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={() => showInsight('district', formData.district)} required>
                      Factory Location (District)
                    </FieldLabel>
                    <FormSelect
                      value={formData.district}
                      onChange={(v) => update('district', v)}
                      options={KYA_SCHEMA.districts}
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={() => showInsight('landType', formData.landType)} required>
                      Factory Land Type
                    </FieldLabel>
                    <FormSelect
                      value={formData.landType}
                      onChange={(v) => update('landType', v)}
                      options={KYA_SCHEMA.landOwnershipTypes}
                    />
                  </div>
                </div>

                {/* Conditional MIDC Estate Name */}
                {formData.landType === 'MIDC Industrial Allotted Plot' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-xl border border-india-blue/30 bg-india-blue/5">
                    <FieldLabel onClick={fi('midcAreaName')}>
                      MIDC Area / Estate Name
                    </FieldLabel>
                    <FormInput
                      value={formData.midcAreaName}
                      onChange={(v) => update('midcAreaName', v)}
                      placeholder="e.g. Chakan Phase 2, Ranjangaon, Butibori"
                    />
                    <span className="text-[10px] text-foreground/50 mt-1 block">
                      Government MIDC industrial land. You do not need a Collector NA order.
                    </span>
                  </motion.div>
                )}

                {/* Conditional Agricultural Land NA Check */}
                {formData.landType.includes('Agricultural') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('hasNaOrder', formData.hasNaOrder)}>
                        Do you have Non-Agricultural (NA) Order from District Collector / SDO?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If No, farm land must first be converted to Non-Agricultural (NA) for factory use.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.hasNaOrder}
                      onChange={(v) => update('hasNaOrder', v)}
                    />
                  </motion.div>
                )}

                {/* Area and Heights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel onClick={fi('plotAreaSqMtr')} required>
                      Total Plot Area (in Sq. Meters)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      value={formData.plotAreaSqMtr}
                      onChange={(v) => update('plotAreaSqMtr', v)}
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('builtUpAreaSqMtr')} required>
                      Covered / Shed Area (in Sq. Meters)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      value={formData.builtUpAreaSqMtr}
                      onChange={(v) => update('builtUpAreaSqMtr', v)}
                      placeholder="1400"
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={() => showInsight('buildingHeight', formData.buildingHeight)}>
                      Building Height
                    </FieldLabel>
                    <FormSelect
                      value={formData.buildingHeight}
                      onChange={(v) => update('buildingHeight', v)}
                      options={KYA_SCHEMA.buildingHeights}
                    />
                  </div>
                </div>

                {/* Eco-Zone / River / Forest Proximity */}
                <div className="p-3.5 rounded-xl border border-border">
                  <FieldLabel onClick={() => showInsight('isForestOrRiverNearby', formData.isForestOrRiverNearby)}>
                    Is your factory near any River, Forest, or Sea Coast?
                  </FieldLabel>
                  <FormSelect
                    value={formData.isForestOrRiverNearby}
                    onChange={(v) => update('isForestOrRiverNearby', v)}
                    options={KYA_SCHEMA.ecoZones}
                  />
                  <span className="text-[10px] text-foreground/50 mt-1 block">
                    Factories within 500 meters of rivers or forests need an extra environmental check.
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:bg-india-blue/90 transition-all cursor-pointer shadow-sm"
                  >
                    Next: What Will You Make? →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                MODULE 2: SECTOR & OPERATIONAL STATUTORY TRIGGERS
               ════════════════════════════════════════════════════════════ */}
            {currentSection === 2 && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Step 2: Factory Product & Machinery
                    </h2>
                    <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">
                      Step 2 of 4
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    What items will your factory make, and what chemicals or machines will you use?
                  </p>
                </div>

                {/* Sector and Sub-sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={() => showInsight('businessType', formData.businessType)} required>
                      Main Industry Category
                    </FieldLabel>
                    <FormSelect
                      value={formData.businessType}
                      onChange={(v) => {
                        update('businessType', v);
                        const firstSub = KYA_SCHEMA.subClassifications[v]?.[0] || '';
                        setFormData((p) => ({
                          ...p,
                          businessType: v,
                          subType: firstSub,
                          isFoodProduct: v === 'food_processing' ? 'Yes' : 'No',
                        }));
                      }}
                      options={KYA_SCHEMA.businessTypes}
                      valueKey="id"
                      labelKey="label"
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('subType')} required>
                      What exactly will you manufacture?
                    </FieldLabel>
                    <FormSelect
                      value={formData.subType}
                      onChange={(v) => update('subType', v)}
                      options={KYA_SCHEMA.subClassifications[formData.businessType] || []}
                    />
                  </div>
                </div>

                {/* Repeated Specific Statutory Questions */}
                <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                  {/* Trigger 1: Food / FSSAI */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('isFoodProduct', formData.isFoodProduct)}>
                        Will you make, pack, or store any Food, Milk, or Drinks?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If Yes, FSSAI Food Safety License will be required.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.isFoodProduct}
                      onChange={(v) => update('isFoodProduct', v)}
                    />
                  </div>

                  {/* Trigger 2: Solvents / PESO */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('storesFlammableSolvents', formData.storesFlammableSolvents)}>
                        Will you store dangerous chemicals, Petrol, Diesel tanks, or Gas cylinders?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If Yes, PESO Petroleum & Explosive Safety permit will be added.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.storesFlammableSolvents}
                      onChange={(v) => update('storesFlammableSolvents', v)}
                    />
                  </div>

                  {/* Trigger 3: Hazardous Waste / Sludge */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('generatesHazardousWaste', formData.generatesHazardousWaste)}>
                        Does work involve chemical electroplating, acid washing, or toxic chemical waste?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If Yes, MPCB Hazardous Waste permission and waste disposal center tie-up is required.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.generatesHazardousWaste}
                      onChange={(v) => update('generatesHazardousWaste', v)}
                    />
                  </div>

                  {/* Trigger 4: Export Unit / DGFT */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('isExportOriented', formData.isExportOriented)}>
                        Do you plan to export your goods to other countries?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If Yes, we will add the 1-day DGFT Import-Export Code (IEC).
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.isExportOriented}
                      onChange={(v) => update('isExportOriented', v)}
                    />
                  </div>
                </div>

                {/* Capital Investments & MSME Scale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={fi('plantMachineryCostCrores')} required>
                      Machinery & Equipment Cost (in ₹ Crores)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      value={formData.plantMachineryCostCrores}
                      onChange={(v) => update('plantMachineryCostCrores', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel onClick={fi('totalInvestmentCrores')} required>
                      Total Project Cost (Land + Building + Machinery) (in ₹ Crores)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      step="0.1"
                      value={formData.totalInvestmentCrores}
                      onChange={(v) => update('totalInvestmentCrores', v)}
                    />
                  </div>
                </div>

                {/* Dynamic MSME Classification Callout */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-foreground/60">Your Government Enterprise Size:</span>
                    <strong className="text-foreground ml-2 font-bold">{calculatedMsmeScale()}</strong>
                  </div>
                  <span className="text-[10px] text-india-blue font-bold uppercase tracking-wide bg-india-blue/10 px-2 py-0.5 rounded">
                    MSME Act
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="px-6 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:bg-india-blue/90 transition-all cursor-pointer shadow-sm"
                  >
                    Next: Power & Water Details →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                MODULE 3: UTILITIES, POWER & WATER INFRASTRUCTURE
               ════════════════════════════════════════════════════════════ */}
            {currentSection === 3 && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Step 3: Electricity, Water & Generators
                    </h2>
                    <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">
                      Step 3 of 4
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    MSEDCL electricity connection, water supply, and generator permits.
                  </p>
                </div>

                {/* Electricity Load & HT Substation check */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel onClick={() => showInsight('connectedPowerKw', formData.connectedPowerKw)} required>
                      Required Electricity Power Load (HP / kW)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      value={formData.connectedPowerKw}
                      onChange={(v) => update('connectedPowerKw', v)}
                      placeholder="180"
                    />
                    <span className="text-[10px] text-foreground/50 mt-1 block">
                      Power above 70 HP needs an MSEDCL high-voltage (HT) transformer substation.
                    </span>
                  </div>
                  <div>
                    <FieldLabel onClick={fi('waterRequirementKld')} required>
                      Daily Water Needed (in KLD - 1000 Litres/Day)
                    </FieldLabel>
                    <FormInput
                      type="number"
                      value={formData.waterRequirementKld}
                      onChange={(v) => update('waterRequirementKld', v)}
                      placeholder="15"
                    />
                    <span className="text-[10px] text-foreground/50 mt-1 block">
                      Total water for factory processing, machine cooling, and workers.
                    </span>
                  </div>
                </div>

                {/* Interrelated Alert for High-Tension Load */}
                {Number(formData.connectedPowerKw) > 70 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-xl border border-india-blue/30 bg-india-blue/5 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-india-blue uppercase tracking-wider block">
                      ⚡ High Voltage Electricity Substation Required
                    </span>
                    <p className="text-foreground/70 text-[11px] leading-relaxed">
                      Your power load ({formData.connectedPowerKw} HP) is more than 70 HP. MSEDCL requires a dedicated 11kV/22kV transformer with Electrical Inspector (CEI) earth pit testing.
                    </p>
                  </motion.div>
                )}

                {/* Primary Water Source */}
                <div>
                  <FieldLabel onClick={() => showInsight('waterSource', formData.waterSource)} required>
                    Where will you get water from?
                  </FieldLabel>
                  <FormSelect
                    value={formData.waterSource}
                    onChange={(v) => update('waterSource', v)}
                    options={KYA_SCHEMA.waterSources}
                  />
                </div>

                {/* CGWA Groundwater Trigger Alert */}
                {formData.waterSource.includes('Borewell') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      💧 Central Ground Water Authority (CGWA) Permission Required
                    </span>
                    <p className="text-foreground/70 text-[11px] leading-relaxed">
                      Using borewell water for factory work requires permission from the Ground Water Authority (CGWA) and a digital water meter.
                    </p>
                  </motion.div>
                )}

                {/* DG Set & Effluent Toggles */}
                <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel onClick={() => showInsight('hasDieselGenerator', formData.hasDieselGenerator)}>
                        Will you install a Diesel Generator (DG Set) for power backup?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        Requires Electrical Inspector (CEI) soundproof canopy and earthing test.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.hasDieselGenerator}
                      onChange={(v) => update('hasDieselGenerator', v)}
                    />
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel>
                        Will your factory release any dirty / chemical water?
                      </FieldLabel>
                      <span className="text-[11px] text-foreground/50 block">
                        If Yes, an on-site water cleaning plant (ETP) or MIDC drainage connection is needed.
                      </span>
                    </div>
                    <YesNoToggle
                      value={formData.dischargesEffluent}
                      onChange={(v) => update('dischargesEffluent', v)}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(4)}
                    className="px-6 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:bg-india-blue/90 transition-all cursor-pointer shadow-sm"
                  >
                    Next: Workers & Pollution Category →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                MODULE 4: SAFETY, LABOUR & POLLUTION CLASSIFICATION
               ════════════════════════════════════════════════════════════ */}
            {currentSection === 4 && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Step 4: Workers, Boilers & Pollution Level
                    </h2>
                    <span className="text-[11px] font-mono font-bold text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">
                      Step 4 of 4
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Pollution board consent (CTE), Factory license (DISH), and PF/ESIC for workers.
                  </p>
                </div>

                {/* MPCB Pollution Classification Cards */}
                <div>
                  <FieldLabel onClick={() => showInsight('pollutionTier', formData.pollutionTier)} required>
                    Pollution Level of Your Industry (MPCB Category)
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {KYA_SCHEMA.pollutionCategories.map((cat) => (
                      <div
                        key={cat.code}
                        onClick={() => update('pollutionTier', cat.code)}
                        className={`border rounded-xl p-3 cursor-pointer transition-all ${
                          formData.pollutionTier === cat.code
                            ? 'border-india-blue bg-india-blue/5 ring-1 ring-india-blue'
                            : 'border-border hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{cat.label}</span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              formData.pollutionTier === cat.code
                                ? 'bg-india-blue text-white'
                                : 'bg-muted text-foreground/60'
                            }`}
                          >
                            {cat.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/50 mt-1">{cat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steam Boilers / High Pressure Vessels */}
                <div className="p-3.5 rounded-xl border border-border flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel onClick={() => showInsight('hasBoilerOrFurnace', formData.hasBoilerOrFurnace)}>
                      Will you use Steam Boilers, Steam Heaters, or High Pressure Tanks?
                    </FieldLabel>
                    <span className="text-[11px] text-foreground/50 block">
                      Requires inspection from Directorate of Steam Boilers.
                    </span>
                  </div>
                  <YesNoToggle
                    value={formData.hasBoilerOrFurnace}
                    onChange={(v) => update('hasBoilerOrFurnace', v)}
                  />
                </div>

                {formData.hasBoilerOrFurnace === 'Yes' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      🔥 Steam Boiler Inspection Required
                    </span>
                    <p className="text-foreground/70 text-[11px] leading-relaxed">
                      Water pressure test and certified boiler operator are needed before starting the boiler.
                    </p>
                  </motion.div>
                )}

                {/* Workforce Headcount */}
                <div>
                  <FieldLabel onClick={() => showInsight('proposedWorkers', formData.proposedWorkers)} required>
                    How many total workers and staff will work in factory?
                  </FieldLabel>
                  <FormInput
                    type="number"
                    value={formData.proposedWorkers}
                    onChange={(v) => update('proposedWorkers', v)}
                    placeholder="35"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        Number(formData.proposedWorkers) >= 10
                          ? 'bg-india-blue/15 text-india-blue border border-india-blue/30'
                          : 'bg-muted text-foreground/40'
                      }`}
                    >
                      {Number(formData.proposedWorkers) >= 10 ? '✓ Factory License Needed (10 or more workers)' : 'No Factory License (< 10 workers)'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        Number(formData.proposedWorkers) >= 20
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-foreground/40'
                      }`}
                    >
                      {Number(formData.proposedWorkers) >= 20 ? '✓ PF & ESIC Required (20 or more workers)' : 'PF / ESIC (< 20 workers)'}
                    </span>
                  </div>
                </div>

                {/* Pre-Submission Comprehensive Synthesis Box */}
                <div className="p-4 rounded-xl border border-india-blue/30 bg-gradient-to-br from-india-blue/5 via-card to-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-india-blue uppercase tracking-wider flex items-center gap-1.5">
                      <span>🏛️</span> Quick Factory Summary
                    </span>
                    <span className="text-[10px] font-mono text-foreground/50">Maharashtra Single Window</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-background/80 border border-border">
                      <span className="text-foreground/50 block text-[9px] uppercase">Pollution Board</span>
                      <strong className="text-foreground">MPCB CTE ({formData.pollutionTier})</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-background/80 border border-border">
                      <span className="text-foreground/50 block text-[9px] uppercase">Factory License</span>
                      <strong className="text-foreground">
                        {Number(formData.proposedWorkers) >= 10 ? 'DISH Form 1 License' : 'Exempt (< 10)'}
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-background/80 border border-border">
                      <span className="text-foreground/50 block text-[9px] uppercase">Power Connection</span>
                      <strong className="text-foreground">
                        {Number(formData.connectedPowerKw) > 70 ? 'MSEDCL HT Substation' : 'MSEDCL LT Connection'}
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-background/80 border border-border">
                      <span className="text-foreground/50 block text-[9px] uppercase">Food Safety</span>
                      <strong className="text-foreground">
                        {formData.isFoodProduct === 'Yes' ? 'FSSAI License' : 'Not Required'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-border flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={evaluating}
                    onClick={handleFinishAndSubmit}
                    className="px-6 py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:bg-india-blue/90 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {evaluating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Finding All Your Approvals...
                      </>
                    ) : (
                      'Show My Required Approvals & Fees →'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── AI ADVISOR COMPLIANCE PANEL (RIGHT COLUMN) ── */}
        <div className="lg:col-span-1">
          <AIAdvisorPanel insight={activeInsight} history={insightHistory} />
        </div>
      </div>
    </div>
  );
};

export default AskForApprovalPage;