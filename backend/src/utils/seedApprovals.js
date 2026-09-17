import ApprovalCatalog from '../models/ApprovalCatalog.js';
import BenefitScheme from '../models/BenefitScheme.js';
import VaultDocument from '../models/VaultDocument.js';
import LocalAuthority from '../models/LocalAuthority.js';
import Application from '../models/Application.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

export const initialMasterApprovals = [
  {
    id: 'appr-01',
    title: 'Consent to Establish (CTE) — Pollution Board',
    category: 'Environment & Pollution',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
    district: 'ALL',
    slaDays: 45,
    fee: 15000,
    description: 'Mandatory environmental clearance before breaking ground or erecting civil machinery under Water Act 1974 & Air Act 1981.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Site Plan / Layout', isMandatory: true, category: 'LAND' },
      { documentName: 'Identity Proof (Aadhaar/PAN)', isMandatory: true, category: 'IDENTITY' },
      { documentName: 'Process Flow Diagram', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Effluent Treatment Plant (ETP) Proposal', isMandatory: false, category: 'ENVIRONMENT' },
    ],
  },
  {
    id: 'appr-02',
    title: 'Provisional Fire Safety NOC',
    category: 'Fire Safety',
    department: 'Maharashtra Fire Services',
    authority: 'Maharashtra Fire Services / MIDC Fire Wing',
    authorityBody: 'Maharashtra Fire Services / MIDC Fire Wing',
    district: 'ALL',
    slaDays: 21,
    fee: 7500,
    description: 'Mandatory fire evacuation and hydrant layout approval before building plan sanction and construction.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Site Plan / Layout', isMandatory: true, category: 'LAND' },
      { documentName: 'Building Elevation Drawings', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Fire Hydrant Layout', isMandatory: true, category: 'TECHNICAL' },
    ],
  },
  {
    id: 'appr-03',
    title: 'Factory Building Plan Approval',
    category: 'Land & Town Planning',
    department: 'Town Planning & Municipal Corporation',
    authority: 'Town Planning & Municipal Corporation',
    authorityBody: 'Town Planning & Municipal Corporation',
    district: 'ALL',
    slaDays: 30,
    fee: 20000,
    description: 'Structural stability, setbacks, and FSI/FAR compliance sanction for industrial sheds and civil structures.',
    requiresInspection: false,
    inspectionTiming: 'Desk Review',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Site Plan / Layout', isMandatory: true, category: 'LAND' },
      { documentName: 'Structural Engineer Certificate', isMandatory: true, category: 'LEGAL' },
      { documentName: '7/12 Land Extract', isMandatory: true, category: 'LAND' },
    ],
  },
  {
    id: 'appr-04',
    title: 'FSSAI State Manufacturing License',
    category: 'Food Safety & Hygiene',
    department: 'Food Safety and Standards Authority of India (FSSAI)',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    authorityBody: 'Food Safety and Standards Authority of India (FSSAI)',
    district: 'ALL',
    slaDays: 30,
    fee: 5000,
    description: 'Statutory food manufacturing and packaging license under Food Safety and Standards Act, 2006.',
    requiresInspection: true,
    inspectionTiming: 'Post Commencement',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Identity Proof (Aadhaar/PAN)', isMandatory: true, category: 'IDENTITY' },
      { documentName: 'Water Quality Test Report', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'List of Machinery', isMandatory: true, category: 'TECHNICAL' },
    ],
  },
  {
    id: 'appr-05',
    title: 'Factory Registration & License (Form 1)',
    category: 'Labor & Factory Safety',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    authority: 'Directorate of Industrial Safety & Health (DISH)',
    authorityBody: 'Directorate of Industrial Safety & Health (DISH)',
    district: 'ALL',
    slaDays: 30,
    fee: 4500,
    description: 'Worker occupational safety, ventilation, and machinery guarding license under Factories Act, 1948.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Identity Proof (Aadhaar/PAN)', isMandatory: true, category: 'IDENTITY' },
      { documentName: 'List of Machinery', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'List of Directors/Partners', isMandatory: true, category: 'LEGAL' },
    ],
  },
  {
    id: 'appr-06',
    title: 'MSEDCL High-Tension (HT) Power Sanction',
    category: 'Power & Energy',
    department: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
    authority: 'MSEDCL & Chief Electrical Inspectorate (CEI)',
    authorityBody: 'MSEDCL',
    district: 'ALL',
    slaDays: 30,
    fee: 12000,
    description: 'Dedicated high-voltage HT substation transformer load sanction and CEI earth pit approval for loads > 70 HP.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Electrical Single Line Diagram (SLD)', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'CEI Earthing Test Report', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Connected Load List', isMandatory: true, category: 'TECHNICAL' },
    ],
  },
  {
    id: 'appr-07',
    title: 'Diesel Generator (DG Set) Installation Sanction',
    category: 'Power & Safety',
    department: 'Chief Electrical Inspectorate (CEI)',
    authority: 'Chief Electrical Inspectorate (CEI)',
    authorityBody: 'Chief Electrical Inspectorate (CEI)',
    district: 'ALL',
    slaDays: 15,
    fee: 3500,
    description: 'Form C approval, acoustic noise enclosure certification, and emergency backup generator sanction.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'DG Acoustic Enclosure Certificate', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Electrical Contractor Certificate', isMandatory: true, category: 'LEGAL' },
    ],
  },
  {
    id: 'appr-08',
    title: 'Boiler / Pressure Vessel Registration & Fitness',
    category: 'Boiler & Steam Safety',
    department: 'Directorate of Steam Boilers',
    authority: 'Directorate of Steam Boilers',
    authorityBody: 'Directorate of Steam Boilers',
    district: 'ALL',
    slaDays: 30,
    fee: 8000,
    description: 'Hydrostatic pressure testing and certified IBR operator validation under the Indian Boilers Act, 1923.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'IBR Manufacturer Certificate', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Boiler Operator Competency Card', isMandatory: true, category: 'LEGAL' },
    ],
  },
  {
    id: 'appr-09',
    title: 'Hazardous Waste Management Authorization (Form 1)',
    category: 'Environment & Pollution',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
    district: 'ALL',
    slaDays: 45,
    fee: 10000,
    description: 'Authorization for handling, storage, and disposal of hazardous/chemical waste under HWM Rules 2016.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Hazardous Waste Storage Layout', isMandatory: true, category: 'TECHNICAL' },
      { documentName: 'Common Hazardous Waste TSDF Membership', isMandatory: true, category: 'ENVIRONMENT' },
    ],
  },
  {
    id: 'DOC-MPCB-001',
    title: 'Consent to Establish (CTE) - Orange Category',
    category: 'Industrial Clearance',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    authority: 'Maharashtra Pollution Control Board (MPCB)',
    authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
    district: 'Aurangabad',
    slaDays: 30,
    fee: 15000,
    description: 'Consent to Establish for Orange Category food/dairy processing unit.',
    requiresInspection: true,
    inspectionTiming: 'Before Approval Issuance',
    status: 'ACTIVE',
    type: 'CLEARANCE',
    requiredDocs: [
      { documentName: 'Site Plan', isMandatory: true, category: 'LAND' },
      { documentName: 'Identity Proof', isMandatory: true, category: 'IDENTITY' },
      { documentName: 'Process Flow Diagram', isMandatory: true, category: 'TECHNICAL' },
    ],
  },
];

export const initialBenefitSchemes = [
  {
    id: 'SCHEME-1024',
    type: 'SCHEME',
    schemeTitle: 'PSI 2019 Capital Subsidy',
    category: 'Capital Incentive',
    disbursingAuthority: 'Directorate of Industries',
    maxCeilingAmount: '₹2.50 Crores',
    maxCeilingAmountNumber: 25000000,
    subsidyPercentage: '35%',
    subsidyPercentageNumber: 35,
    targetSectors: ['Food Processing', 'Textiles', 'Electronics', 'Manufacturing & Food Processing'],
    eligibilityCriteria: ['MSME Registration', 'Minimum 3 years operational intent', 'MIDC or NA Land'],
    status: 'PUBLISHED',
    datePublished: '2026-09-12',
  },
  {
    id: 'SCH-MH-01',
    type: 'SCHEME',
    schemeTitle: 'Package Scheme of Incentives (PSI) 2024 - Capital Subsidy',
    category: 'Capital Subsidy',
    disbursingAuthority: 'Directorate of Industries',
    maxCeilingAmount: '₹3.50 Crores',
    maxCeilingAmountNumber: 35000000,
    subsidyPercentage: '35%',
    subsidyPercentageNumber: 35,
    targetSectors: ['Manufacturing & Food Processing', 'Engineering', 'Agro'],
    eligibilityCriteria: ['New MSME and Large units investing > Rs 2.5 Crore in machinery.'],
    status: 'PUBLISHED',
    datePublished: '2026-01-15',
  },
  {
    id: 'SCH-MH-02',
    type: 'SCHEME',
    schemeTitle: 'Industrial Electricity Duty Exemption Scheme',
    category: 'Utility Exemption',
    disbursingAuthority: 'Energy & Industry Department',
    maxCeilingAmount: '100% Duty Waiver',
    maxCeilingAmountNumber: 5000000,
    subsidyPercentage: '100%',
    subsidyPercentageNumber: 100,
    targetSectors: ['All Industrial Sectors', 'Manufacturing', 'Chemical'],
    eligibilityCriteria: ['Units located in MIDC areas outside Mumbai/Pune urban corridor.'],
    status: 'PUBLISHED',
    datePublished: '2026-02-01',
  },
  {
    id: 'SCH-MH-03',
    type: 'SCHEME',
    schemeTitle: 'Interest Subvention on Working Capital & Term Loans',
    category: 'Financial Assistance',
    disbursingAuthority: 'Maharashtra State Finance Corporation',
    maxCeilingAmount: '₹1.00 Crore',
    maxCeilingAmountNumber: 10000000,
    subsidyPercentage: '5%',
    subsidyPercentageNumber: 5,
    targetSectors: ['Agro & Food Processing', 'Textiles'],
    eligibilityCriteria: ['Food processing facilities procuring raw produce from local farmer groups.'],
    status: 'PUBLISHED',
    datePublished: '2026-02-15',
  },
  {
    id: 'SCH-MH-04',
    type: 'SCHEME',
    schemeTitle: 'Green Industrial ETP Setup Incentive',
    category: 'Sustainability',
    disbursingAuthority: 'Environment Department & MPCB',
    maxCeilingAmount: '₹50 Lakhs',
    maxCeilingAmountNumber: 5000000,
    subsidyPercentage: '50%',
    subsidyPercentageNumber: 50,
    targetSectors: ['Chemical, Pharma & Food', 'Electroplating', 'Foundry'],
    eligibilityCriteria: ['Zero Liquid Discharge (ZLD) effluent treatment plants certified by MPCB.'],
    status: 'PUBLISHED',
    datePublished: '2026-03-01',
  },
];

export const initialLocalAuthorities = [
  {
    name: 'S. K. Kulkarni',
    designation: 'Scrutiny Officer (MPCB)',
    body: 'Maharashtra Pollution Control Board',
    authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    district: 'Chhatrapati Sambhajinagar',
    phone: '+91 240 233 4455',
    email: 'sk.kulkarni@mpcb.gov.in',
    employeeId: 'MH-GOV-8821',
    status: 'ACTIVE',
  },
  {
    name: 'Anand Patil',
    designation: 'Divisional Fire Officer',
    body: 'Maharashtra Fire Services / MIDC Wing',
    authorityBody: 'Maharashtra Fire Services',
    department: 'Maharashtra Fire Services',
    district: 'Pune',
    phone: '+91 20 2612 7881',
    email: 'anand.patil@midcfire.gov.in',
    employeeId: 'MH-GOV-8822',
    status: 'ACTIVE',
  },
  {
    name: 'Dr. Neha Shinde',
    designation: 'Town Planning Assistant Director',
    body: 'Brihanmumbai Municipal Corporation (BMC)',
    authorityBody: 'Town Planning Department',
    department: 'Urban Development & Municipal Corporation',
    district: 'Mumbai Suburban',
    phone: '+91 22 2262 0251',
    email: 'neha.shinde@mcgm.gov.in',
    employeeId: 'MH-GOV-8823',
    status: 'ACTIVE',
  },
  {
    name: 'V. R. Deshmukh',
    designation: 'Executive Engineer (Water Works)',
    body: 'MIDC Water Works Division',
    authorityBody: 'Maharashtra Industrial Development Corporation (MIDC)',
    department: 'MIDC Water Works',
    district: 'Thane',
    phone: '+91 22 2534 7777',
    email: 'vr.deshmukh@midcindia.org',
    employeeId: 'MH-GOV-8824',
    status: 'ACTIVE',
  },
  {
    name: 'Rajendra Joshi',
    designation: 'Joint Director of DISH',
    body: 'Directorate of Industrial Safety & Health',
    authorityBody: 'Directorate of Industrial Safety & Health (DISH)',
    department: 'Directorate of Industrial Safety and Health',
    district: 'Nagpur',
    phone: '+91 712 256 0881',
    email: 'r.joshi@dish.maharashtra.gov.in',
    employeeId: 'MH-GOV-8825',
    status: 'ACTIVE',
  },
];

export const seedApprovalsCatalog = async () => {
  try {
    // 1. Seed Approvals Catalog
    for (const item of initialMasterApprovals) {
      await ApprovalCatalog.findOneAndUpdate(
        { id: item.id },
        { $set: item },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seed] Approval catalog verified (${initialMasterApprovals.length} master clearances active).`);

    // 2. Seed Benefit Schemes
    for (const scheme of initialBenefitSchemes) {
      await BenefitScheme.findOneAndUpdate(
        { id: scheme.id },
        { $set: scheme },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seed] Benefit schemes catalog verified (${initialBenefitSchemes.length} schemes active).`);

    // 3. Ensure Demo User
    let demoUser = await User.findOne({ email: 'applicant@saral.gov.in' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Sahyadri Agro Enterprises',
        fullName: 'Rajesh V. Deshmukh',
        companyName: 'Sahyadri Agro Foods Private Limited',
        email: 'applicant@saral.gov.in',
        phone: '+91 98230 45892',
        password: 'password123',
        role: 'USER',
        district: 'Pune',
        industryType: 'Food Factory',
      });
    }

    // 4. Seed Local Authorities Directory
    for (const auth of initialLocalAuthorities) {
      await LocalAuthority.findOneAndUpdate(
        { email: auth.email },
        { $set: auth },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seed] Local authorities directory verified (${initialLocalAuthorities.length} officers active).`);

    // 5. Seed Baseline Applications (For Tracking, Local Auth Inward Queue & Main Auth)
    const baselineApps = [
      {
        applicationId: 'APP-MH-2026-89412',
        verificationCode: '123456',
        approvalId: 'appr-01',
        approvalTitle: 'Consent to Establish (CTE) — Pollution Board',
        authority: 'Maharashtra Pollution Control Board (MPCB)',
        district: 'Pune',
        status: 'SUBMITTED',
        currentStage: 'FIELD_INSPECTION',
        feePaid: 15000,
        submissionDate: new Date('2026-08-12T10:30:00.000Z'),
        userId: demoUser._id,
        applicantName: 'Sahyadri Agro Foods Private Limited',
        sla: {
          slaDays: 45,
          slaDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          isEscalated: false,
          escalations: [],
        },
        paymentDetails: {
          utrNumber: '423871928312',
          amount: 15000,
          paymentMethod: 'UPI',
          paidAt: new Date('2026-08-12T11:00:00.000Z'),
          isPaid: true,
        },
        inspection: {
          inspectionId: 'INSP-MH-89412',
          scheduledDate: '2026-09-24',
          inspectionTime: '11:00 AM',
          inspectorName: 'Anand Patil',
          inspectorContact: '+91 22 2757 4410',
          instructions: 'Ensure site engineer and blueprint are available on site.',
          status: 'SCHEDULED',
        },
        submittedFiles: [
          { documentName: 'Industrial Site Plan Drawing.pdf', fileName: 'Industrial Site Plan Drawing.pdf', fileSize: 3400000, fileUrl: 'https://storage.saral.gov.in/vault/site-plan.pdf', verificationStatus: 'VERIFIED' },
          { documentName: 'Environmental Impact Assessment.pdf', fileName: 'Environmental Impact Assessment.pdf', fileSize: 6100000, fileUrl: 'https://storage.saral.gov.in/vault/eia.pdf', verificationStatus: 'VERIFIED' },
          { documentName: '7_12 Land Extract Document.pdf', fileName: '7_12 Land Extract Document.pdf', fileSize: 1200000, fileUrl: 'https://storage.saral.gov.in/vault/7_12.pdf', verificationStatus: 'VERIFIED' },
        ],
        auditTrail: [
          { stage: 'DOCUMENT_SCRUTINY', action: 'SUBMISSION_FILED', actor: 'Sahyadri Agro Enterprises', actorRole: 'USER', timestamp: new Date('2026-08-12T10:30:00.000Z'), remarks: 'Application docket submitted via SARAL online portal.' },
          { stage: 'DOCUMENT_SCRUTINY', action: 'DESK_SCREENING_PASSED', actor: 'S. K. Kulkarni', actorRole: 'LOCAL_AUTH', timestamp: new Date('2026-08-18T14:20:00.000Z'), remarks: 'Desk verification complete. Site layout verified.' },
          { stage: 'FIELD_INSPECTION', action: 'INSPECTION_SCHEDULED', actor: 'Anand Patil', actorRole: 'LOCAL_AUTH', timestamp: new Date('2026-08-25T09:15:00.000Z'), remarks: 'Field verification scheduled for 2026-09-24 at 11:00 AM.' },
        ],
      },
      {
        applicationId: 'APP-MH-2026-89411',
        verificationCode: '123456',
        approvalId: 'appr-02',
        approvalTitle: 'Provisional Fire Safety NOC',
        authority: 'Maharashtra Fire Services / MIDC Fire Wing',
        district: 'Pune',
        status: 'UNDER_SCRUTINY',
        currentStage: 'DOCUMENT_SCRUTINY',
        feePaid: 7500,
        submissionDate: new Date('2026-08-25T12:00:00.000Z'),
        userId: demoUser._id,
        applicantName: 'Sahyadri Agro Foods Private Limited',
        sla: {
          slaDays: 21,
          slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isEscalated: false,
          escalations: [],
        },
        paymentDetails: {
          utrNumber: '998811223344',
          amount: 7500,
          paymentMethod: 'NetBanking',
          paidAt: new Date('2026-08-25T12:15:00.000Z'),
          isPaid: true,
        },
        submittedFiles: [
          { documentName: 'Building Blueprint with Fire Hydrants.pdf', fileName: 'Building Blueprint with Fire Hydrants.pdf', fileSize: 4200000, fileUrl: 'https://storage.saral.gov.in/vault/fire-plan.pdf', verificationStatus: 'PENDING' },
        ],
      },
      {
        applicationId: 'APP-MH-2026-89413',
        verificationCode: '123456',
        approvalId: 'appr-03',
        approvalTitle: 'Factory Building Plan Approval & Sanction',
        authority: 'MIDC Special Planning Authority (SPA)',
        district: 'Aurangabad',
        status: 'SUBMITTED',
        currentStage: 'DOCUMENT_SCRUTINY',
        feePaid: 20000,
        submissionDate: new Date('2026-08-15T09:00:00.000Z'),
        userId: demoUser._id,
        applicantName: 'Sahyadri Agro Foods Private Limited',
        sla: {
          slaDays: 30,
          slaDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          isEscalated: false,
          escalations: [],
        },
        paymentDetails: {
          utrNumber: '112233445566',
          amount: 20000,
          paymentMethod: 'UPI',
          paidAt: new Date('2026-08-15T09:30:00.000Z'),
          isPaid: true,
        },
        submittedFiles: [
          { documentName: 'Structural Stability Certificate.pdf', fileName: 'Structural Stability Certificate.pdf', fileSize: 2100000, fileUrl: 'https://storage.saral.gov.in/vault/structural.pdf', verificationStatus: 'VERIFIED' },
        ],
      },
    ];

    for (const app of baselineApps) {
      await Application.findOneAndUpdate(
        { applicationId: app.applicationId },
        { $set: app },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seed] Baseline applications verified (${baselineApps.length} applications active).`);

    // 6. Seed Initial Vault Documents
    const initialVault = [
      {
        certificateNumber: 'MH-MPCB-2025-0018',
        documentName: 'Consent to Establish (CTE) - Pollution Control',
        category: 'ENVIRONMENT',
        issuedBy: 'State Pollution Control Board',
        fileUrl: 'https://storage.saral.gov.in/vault/cte-certificate.pdf',
        fileName: 'cte-certificate.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        issueDate: new Date('2025-03-15'),
        expiryDate: new Date('2026-10-15'),
        status: 'ACTIVE',
        userId: demoUser._id,
      },
      {
        certificateNumber: 'MH-TP-2025-0941',
        documentName: 'Factory Building Plan Approval',
        category: 'LAND',
        issuedBy: 'Town Planning & Municipal Corp',
        fileUrl: 'https://storage.saral.gov.in/vault/building-plan.pdf',
        fileName: 'building-plan.pdf',
        fileSize: 4200000,
        fileType: 'application/pdf',
        issueDate: new Date('2025-06-20'),
        expiryDate: new Date('2028-06-19'),
        status: 'ACTIVE',
        userId: demoUser._id,
      },
      {
        certificateNumber: 'MH-FIRE-2026-0112',
        documentName: 'Fire Safety NOC (Provisional)',
        category: 'CLEARANCE',
        issuedBy: 'Department of Fire & Rescue Services',
        fileUrl: 'https://storage.saral.gov.in/vault/fire-noc.pdf',
        fileName: 'fire-noc.pdf',
        fileSize: 950000,
        fileType: 'application/pdf',
        issueDate: new Date('2026-01-10'),
        expiryDate: new Date('2026-11-05'),
        status: 'EXPIRING_SOON',
        userId: demoUser._id,
      },
      {
        certificateNumber: 'MH-MIDC-2024-8841',
        documentName: 'Land Possession & Lease Deed',
        category: 'LAND',
        issuedBy: 'Industrial Development Authority (IDA)',
        fileUrl: 'https://storage.saral.gov.in/vault/lease-deed.pdf',
        fileName: 'lease-deed.pdf',
        fileSize: 3100000,
        fileType: 'application/pdf',
        issueDate: new Date('2024-11-01'),
        expiryDate: new Date('2054-10-31'),
        status: 'ACTIVE',
        userId: demoUser._id,
      },
      {
        certificateNumber: 'MH-DISH-2026-4412',
        documentName: 'Hazardous Waste Authorization (Form 1)',
        category: 'CLEARANCE',
        issuedBy: 'Maharashtra Pollution Control Board (MPCB)',
        fileUrl: 'https://storage.saral.gov.in/vault/waste-auth.pdf',
        fileName: 'waste-auth.pdf',
        fileSize: 1500000,
        fileType: 'application/pdf',
        issueDate: new Date('2026-02-01'),
        expiryDate: new Date('2026-09-22'),
        status: 'RENEWAL_PENDING',
        userId: demoUser._id,
      },
    ];

    for (const doc of initialVault) {
      await VaultDocument.findOneAndUpdate(
        { certificateNumber: doc.certificateNumber },
        { $set: doc },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seed] Enterprise Document Vault verified (${initialVault.length} statutory records active).`);

    // 7. Seed Initial Complaint
    await Complaint.findOneAndUpdate(
      { complaintId: 'CMP-MH-2026-89412' },
      {
        complaintId: 'CMP-MH-2026-89412',
        userId: demoUser._id,
        userName: demoUser.name,
        applicationId: 'APP-MH-2026-89412',
        authority: 'Maharashtra Pollution Control Board (MPCB)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        district: 'Pune',
        complaintType: 'SLA Exceeded / Stalled Review',
        subject: 'Delay in CTE issuance past statutory SLA',
        description: 'Submitted all documents 45 days ago, review is stalled awaiting field inspection signoff.',
        status: 'OPEN',
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('[Seed] Database initialization and catalog verification complete.');
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
  }
};

export default seedApprovalsCatalog;
