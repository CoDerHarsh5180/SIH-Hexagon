import ApprovalCatalog from '../models/ApprovalCatalog.js';
import EvaluationHistory from '../models/EvaluationHistory.js';

/**
 * @desc    Evaluate "Know Your Approval" Questionnaire
 * @route   POST /api/approvals/evaluate
 * @access  Public / Private
 */
export const evaluateQuestionnaire = async (req, res) => {
  try {
    const {
      sector = 'Food Factory',
      subSector = '',
      enterpriseScale = 'SMALL',
      district = 'Aurangabad',
      landType = 'MIDC Industrial Allotted Plot',
      plotAreaSqM = 0,
      builtUpAreaSqM = 0,
      connectedPowerLoadKW = 0,
      dailyWaterConsumptionKLD = 0,
      hasBoiler = false,
      hasDGSet = false,
      generatesHazardousWaste = false,
      pollutionTier = 'Orange',
      totalCapitalInvestmentInr = 0,
      workforceCount = 0,
      stage = 'pre-construction',
    } = req.body;

    const sectorLower = (sector || '').toLowerCase();
    const subSectorLower = (subSector || '').toLowerCase();
    const pollutionUpper = (pollutionTier || 'ORANGE').toUpperCase();
    const landTypeStr = landType || 'MIDC Industrial Allotted Plot';

    const mandatoryApprovals = [];

    // 1. MPCB Consent to Establish (CTE) - Mandatory for all manufacturing & industrial units
    let mpcbFee = 15000;
    let mpcbSla = 45;
    let mpcbReason = `Because your factory falls in ${pollutionUpper} Category with power load ${connectedPowerLoadKW || 100} HP/kW, MPCB Consent to Establish (CTE) is statutory prior to ground-breaking or civil erection.`;

    if (pollutionUpper === 'WHITE') {
      mpcbFee = 3500;
      mpcbSla = 15;
      mpcbReason = 'White category industry requires online intimation to MPCB. No formal inspection required.';
    } else if (pollutionUpper === 'GREEN') {
      mpcbFee = 8000;
      mpcbSla = 25;
      mpcbReason = 'Green category industry fast-track consent. Desk scrutiny with minimal statutory turnaround.';
    } else if (pollutionUpper === 'RED') {
      mpcbFee = 50000;
      mpcbSla = 60;
      mpcbReason = 'Red Category high environmental footprint requires EIA screening, public consultation, and strict effluent monitoring.';
    }

    mandatoryApprovals.push({
      approvalId: 'appr-01',
      id: 'appr-01',
      title: `Consent to Establish (CTE) — ${pollutionUpper} Category`,
      docName: `Consent to Establish (CTE) — ${pollutionUpper} Category`,
      department: 'Maharashtra Pollution Control Board (MPCB)',
      authority: 'Maharashtra Pollution Control Board (MPCB)',
      category: 'Environment & Pollution',
      statutoryAct: 'Water (Prevention & Control of Pollution) Act, 1974 & Air Act, 1981',
      estimatedFeeInr: mpcbFee,
      fee: mpcbFee,
      maxSlaDays: mpcbSla,
      slaDays: mpcbSla,
      urgency: 'Mandatory',
      tag: pollutionUpper === 'RED' || pollutionUpper === 'ORANGE' ? 'warning' : 'info',
      reason: mpcbReason,
      aiReason: mpcbReason,
      requiredDocs: ['Site Plan / Layout', 'Identity Proof (Aadhaar/PAN)', 'Process Flow Diagram'],
      requiresInspection: pollutionUpper !== 'WHITE',
    });

    // 2. Provisional Fire Safety NOC (Required if built-up area > 500 sqm or industrial operations)
    if (builtUpAreaSqM > 500 || builtUpAreaSqM === 0 || pollutionUpper !== 'WHITE') {
      const fireAuthority = landTypeStr.includes('MIDC')
        ? 'MIDC Fire Wing'
        : 'Maharashtra Fire Services & Municipal Fire Department';
      mandatoryApprovals.push({
        approvalId: 'appr-02',
        id: 'appr-02',
        title: 'Provisional Fire Safety NOC',
        docName: 'Provisional Fire Safety NOC',
        department: 'Maharashtra Fire Services',
        authority: fireAuthority,
        category: 'Fire Safety',
        statutoryAct: 'Maharashtra Fire Prevention and Life Safety Measures Act, 2006',
        estimatedFeeInr: 7500,
        fee: 7500,
        maxSlaDays: 21,
        slaDays: 21,
        urgency: 'Mandatory',
        tag: 'info',
        reason: `Proposed built-up area (${builtUpAreaSqM || 2640} sq.m) mandates certified fire hydrant coverage, emergency exit paths, and fire tender passage.`,
        aiReason: `Proposed built-up area (${builtUpAreaSqM || 2640} sq.m) mandates certified fire hydrant coverage, emergency exit paths, and fire tender passage.`,
        requiredDocs: ['Site Plan / Layout', 'Building Elevation Drawings', 'Fire Hydrant Layout'],
        requiresInspection: true,
      });
    }

    // 3. Factory Building Plan Sanction (From MIDC or Town Planning / Municipal Corp)
    const buildingSanctionAuthority = landTypeStr.includes('MIDC')
      ? 'MIDC Special Planning Authority (SPA)'
      : 'Town Planning & Municipal Corporation';
    mandatoryApprovals.push({
      approvalId: 'appr-03',
      id: 'appr-03',
      title: 'Factory Building Plan Approval & Sanction',
      docName: 'Factory Building Plan Approval & Sanction',
      department: buildingSanctionAuthority,
      authority: buildingSanctionAuthority,
      category: 'Land & Town Planning',
      statutoryAct: 'Maharashtra Regional and Town Planning (MRTP) Act, 1966',
      estimatedFeeInr: 20000,
      fee: 20000,
      maxSlaDays: 30,
      slaDays: 30,
      urgency: 'Mandatory',
      tag: 'info',
      reason: `Required to construct industrial shed and auxiliary facilities. Structural engineer stability and setbacks (${landTypeStr}) will be certified.`,
      aiReason: `Required to construct industrial shed and auxiliary facilities. Structural engineer stability and setbacks (${landTypeStr}) will be certified.`,
      requiredDocs: ['Site Plan / Layout', 'Structural Engineer Certificate', '7/12 Land Extract'],
      requiresInspection: false,
    });

    // 4. FSSAI State Manufacturing License (For Food, Dairy, Beverages, Cold Storage)
    if (
      sectorLower.includes('food') ||
      subSectorLower.includes('food') ||
      subSectorLower.includes('dairy') ||
      subSectorLower.includes('milk') ||
      subSectorLower.includes('pulp') ||
      sectorLower.includes('cold_storage')
    ) {
      mandatoryApprovals.push({
        approvalId: 'appr-04',
        id: 'appr-04',
        title: 'FSSAI State Manufacturing License',
        docName: 'FSSAI State Manufacturing License',
        department: 'Food Safety and Standards Authority of India (FSSAI)',
        authority: 'Food Safety and Standards Authority of India (FSSAI)',
        category: 'Food Safety & Hygiene',
        statutoryAct: 'Food Safety and Standards Act, 2006',
        estimatedFeeInr: 5000,
        fee: 5000,
        maxSlaDays: 30,
        slaDays: 30,
        urgency: 'Mandatory',
        tag: 'info',
        reason: 'Since your planned commercial activity involves Food Processing / Dairy Products, state food manufacturing license is mandatory before trial production.',
        aiReason: 'Since your planned commercial activity involves Food Processing / Dairy Products, state food manufacturing license is mandatory before trial production.',
        requiredDocs: ['Identity Proof (Aadhaar/PAN)', 'Water Quality Test Report', 'List of Machinery'],
        requiresInspection: true,
      });
    }

    // 5. DISH Factory Registration & License (Form 1) - If workforce > 10
    if (Number(workforceCount) >= 10 || Number(workforceCount) === 0) {
      mandatoryApprovals.push({
        approvalId: 'appr-05',
        id: 'appr-05',
        title: 'Factory Registration & License (Form 1)',
        docName: 'Factory Registration & License (Form 1)',
        department: 'Directorate of Industrial Safety & Health (DISH)',
        authority: 'Directorate of Industrial Safety & Health (DISH)',
        category: 'Labor & Factory Safety',
        statutoryAct: 'Factories Act, 1948',
        estimatedFeeInr: 4500,
        fee: 4500,
        maxSlaDays: 30,
        slaDays: 30,
        urgency: 'Mandatory',
        tag: 'info',
        reason: `With an estimated workforce of ${workforceCount || 45} persons using electrical machinery, DISH factory license safeguards occupational health & safety.`,
        aiReason: `With an estimated workforce of ${workforceCount || 45} persons using electrical machinery, DISH factory license safeguards occupational health & safety.`,
        requiredDocs: ['Identity Proof (Aadhaar/PAN)', 'List of Machinery', 'List of Directors/Partners'],
        requiresInspection: true,
      });
    }

    // 6. High-Tension (HT) Power Sanction (If connected load > 70 HP / 52 kW)
    if (Number(connectedPowerLoadKW) > 70) {
      mandatoryApprovals.push({
        approvalId: 'appr-06',
        id: 'appr-06',
        title: 'MSEDCL High-Tension (HT) Substation Sanction',
        docName: 'MSEDCL High-Tension (HT) Substation Sanction',
        department: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
        authority: 'MSEDCL & Chief Electrical Inspectorate (CEI)',
        category: 'Power & Energy',
        statutoryAct: 'Electricity Act, 2003',
        estimatedFeeInr: 12000,
        fee: 12000,
        maxSlaDays: 30,
        slaDays: 30,
        urgency: 'Mandatory',
        tag: 'info',
        reason: `Connected load (${connectedPowerLoadKW} kW) exceeds standard 70 HP LT limits. A dedicated transformer sub-station and CEI earth pit clearance are required.`,
        aiReason: `Connected load (${connectedPowerLoadKW} kW) exceeds standard 70 HP LT limits. A dedicated transformer sub-station and CEI earth pit clearance are required.`,
        requiredDocs: ['Electrical Single Line Diagram (SLD)', 'CEI Earthing Test Report', 'Connected Load List'],
        requiresInspection: true,
      });
    }

    // 7. Diesel Generator (DG Set) Sanction (If hasDGSet is true)
    if (hasDGSet) {
      mandatoryApprovals.push({
        approvalId: 'appr-07',
        id: 'appr-07',
        title: 'Diesel Generator (DG Set) Installation Sanction',
        docName: 'Diesel Generator (DG Set) Installation Sanction',
        department: 'Chief Electrical Inspectorate (CEI)',
        authority: 'Chief Electrical Inspectorate (CEI)',
        category: 'Power & Safety',
        statutoryAct: 'Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations',
        estimatedFeeInr: 3500,
        fee: 3500,
        maxSlaDays: 15,
        slaDays: 15,
        urgency: 'Conditional',
        tag: 'info',
        reason: 'Form C approval and acoustic enclosure noise testing are required for on-site diesel generating equipment.',
        aiReason: 'Form C approval and acoustic enclosure noise testing are required for on-site diesel generating equipment.',
        requiredDocs: ['DG Acoustic Enclosure Certificate', 'Electrical Contractor Certificate'],
        requiresInspection: true,
      });
    }

    // 8. Directorate of Steam Boilers Registration (If hasBoiler is true)
    if (hasBoiler) {
      mandatoryApprovals.push({
        approvalId: 'appr-08',
        id: 'appr-08',
        title: 'Boiler / Pressure Vessel Registration & Fitness',
        docName: 'Boiler / Pressure Vessel Registration & Fitness',
        department: 'Directorate of Steam Boilers',
        authority: 'Directorate of Steam Boilers',
        category: 'Boiler & Steam Safety',
        statutoryAct: 'Indian Boilers Act, 1923',
        estimatedFeeInr: 8000,
        fee: 8000,
        maxSlaDays: 30,
        slaDays: 30,
        urgency: 'Mandatory',
        tag: 'warning',
        reason: 'On-site steam boilers mandate hydrostatic pressure testing and certified IBR operator validation before commissioning.',
        aiReason: 'On-site steam boilers mandate hydrostatic pressure testing and certified IBR operator validation before commissioning.',
        requiredDocs: ['IBR Manufacturer Certificate', 'Boiler Operator Competency Card'],
        requiresInspection: true,
      });
    }

    // 9. Hazardous Waste Authorization (If generatesHazardousWaste is true)
    if (generatesHazardousWaste || pollutionUpper === 'RED' || sectorLower.includes('chemical')) {
      mandatoryApprovals.push({
        approvalId: 'appr-09',
        id: 'appr-09',
        title: 'Hazardous Waste Management Authorization (Form 1)',
        docName: 'Hazardous Waste Management Authorization (Form 1)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        authority: 'Maharashtra Pollution Control Board (MPCB)',
        category: 'Environment & Pollution',
        statutoryAct: 'Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016',
        estimatedFeeInr: 10000,
        fee: 10000,
        maxSlaDays: 45,
        slaDays: 45,
        urgency: 'Mandatory',
        tag: 'warning',
        reason: 'Generation of hazardous/chemical waste requires Form 1 authorization and common TSDF site membership.',
        aiReason: 'Generation of hazardous/chemical waste requires Form 1 authorization and common TSDF site membership.',
        requiredDocs: ['Hazardous Waste Storage Layout', 'Common Hazardous Waste TSDF Membership'],
        requiresInspection: true,
      });
    }

    const totalEstimatedFeeInr = mandatoryApprovals.reduce((acc, curr) => acc + curr.estimatedFeeInr, 0);
    const estimatedTimelineDays = Math.max(...mandatoryApprovals.map((m) => m.maxSlaDays), 30);

    // Persist evaluation in DB
    const evaluationDoc = await EvaluationHistory.create({
      userId: req.user?._id || undefined,
      sector,
      subSector,
      enterpriseScale,
      district,
      landType: landTypeStr,
      plotAreaSqM,
      builtUpAreaSqM,
      connectedPowerLoadKW,
      dailyWaterConsumptionKLD,
      hasBoiler,
      hasDGSet,
      generatesHazardousWaste,
      pollutionTier: pollutionTier || 'Orange',
      totalCapitalInvestmentInr,
      workforceCount,
      recommendedApprovals: mandatoryApprovals.map((m) => ({
        approvalId: m.approvalId,
        title: m.title,
        department: m.department,
        category: m.category,
        fee: m.estimatedFeeInr,
        slaDays: m.maxSlaDays,
        isMandatory: m.urgency === 'Mandatory',
        requiresInspection: m.requiresInspection,
      })),
      totalEstimatedFees: totalEstimatedFeeInr,
      maxSlaDays: estimatedTimelineDays,
      totalClearancesCount: mandatoryApprovals.length,
    });

    const responsePayload = {
      evaluationId: evaluationDoc._id,
      mandatoryApprovals,
      totalEstimatedFeeInr,
      estimatedFeeInr: totalEstimatedFeeInr,
      estimatedTimelineDays,
      totalApprovalsCount: mandatoryApprovals.length,
      enterpriseScale,
      pollutionTier,
      district,
      evaluatedAt: evaluationDoc.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Questionnaire evaluated successfully',
      data: responsePayload,
    });
  } catch (error) {
    console.error('[approvalsController:evaluateQuestionnaire] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate questionnaire parameters',
      error: error.message,
    });
  }
};

/**
 * @desc    Calculate statutory fees for selected approval dockets
 * @route   POST /api/approvals/calculator
 * @access  Public
 */
export const calculateFees = async (req, res) => {
  try {
    const { approvalIds = [] } = req.body;

    if (!Array.isArray(approvalIds) || approvalIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of approvalIds to calculate fees',
      });
    }

    // Lookup approvals in database catalog
    const catalogDocs = await ApprovalCatalog.find({ id: { $in: approvalIds } });

    // Fallback dictionary for known codes if catalog doesn't have custom item
    const fallbackFees = {
      'appr-01': { title: 'Consent to Establish (CTE) — Pollution Board', fee: 15000, authority: 'MPCB' },
      'appr-02': { title: 'Provisional Fire Safety NOC', fee: 7500, authority: 'Maharashtra Fire Services' },
      'appr-03': { title: 'Factory Building Plan Approval', fee: 20000, authority: 'Municipal Corporation / MIDC' },
      'appr-04': { title: 'FSSAI State Manufacturing License', fee: 5000, authority: 'FSSAI' },
      'appr-05': { title: 'Factory Registration & License (Form 1)', fee: 4500, authority: 'DISH' },
      'appr-06': { title: 'MSEDCL High-Tension (HT) Power Sanction', fee: 12000, authority: 'MSEDCL' },
      'appr-07': { title: 'Diesel Generator (DG Set) Installation Sanction', fee: 3500, authority: 'CEI' },
      'appr-08': { title: 'Boiler / Pressure Vessel Registration & Fitness', fee: 8000, authority: 'Steam Boilers' },
      'appr-09': { title: 'Hazardous Waste Management Authorization (Form 1)', fee: 10000, authority: 'MPCB' },
      'DOC-MPCB-001': { title: 'Consent to Establish (CTE) - Orange Category', fee: 15000, authority: 'MPCB' },
    };

    const breakdown = approvalIds.map((id) => {
      const doc = catalogDocs.find((d) => d.id === id);
      if (doc) {
        return {
          approvalId: doc.id,
          id: doc.id,
          title: doc.title,
          authority: doc.authority || doc.department,
          fee: doc.fee || 0,
        };
      }
      const fallback = fallbackFees[id] || { title: `Clearance Docket (${id})`, fee: 10000, authority: 'Regulatory Body' };
      return {
        approvalId: id,
        id,
        title: fallback.title,
        authority: fallback.authority,
        fee: fallback.fee,
      };
    });

    const totalFee = breakdown.reduce((acc, curr) => acc + curr.fee, 0);

    return res.status(200).json({
      success: true,
      message: 'Statutory fees calculated successfully',
      data: {
        approvalIds,
        breakdown,
        totalFee,
        gst: 0, // Government statutory clearance fees are GST exempt
        grandTotal: totalFee,
        itemsCount: breakdown.length,
      },
    });
  } catch (error) {
    console.error('[approvalsController:calculateFees] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate approval fees',
      error: error.message,
    });
  }
};

/**
 * @desc    Get consolidated required documents for selected approval dockets
 * @route   POST /api/approvals/required-documents
 * @access  Public
 */
export const getRequiredDocuments = async (req, res) => {
  try {
    const { approvalIds = [] } = req.body;

    if (!Array.isArray(approvalIds) || approvalIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of approvalIds to fetch required documents',
      });
    }

    const catalogDocs = await ApprovalCatalog.find({ id: { $in: approvalIds } });

    const fallbackDocMap = {
      'appr-01': ['Site Plan / Layout', 'Identity Proof (Aadhaar/PAN)', 'Process Flow Diagram'],
      'appr-02': ['Site Plan / Layout', 'Building Elevation Drawings', 'Fire Hydrant Layout'],
      'appr-03': ['Site Plan / Layout', 'Structural Engineer Certificate', '7/12 Land Extract'],
      'appr-04': ['Identity Proof (Aadhaar/PAN)', 'Water Quality Test Report', 'List of Machinery'],
      'appr-05': ['Identity Proof (Aadhaar/PAN)', 'List of Machinery', 'List of Directors/Partners'],
      'appr-06': ['Electrical Single Line Diagram (SLD)', 'CEI Earthing Test Report', 'Connected Load List'],
      'appr-07': ['DG Acoustic Enclosure Certificate', 'Electrical Contractor Certificate'],
      'appr-08': ['IBR Manufacturer Certificate', 'Boiler Operator Competency Card'],
      'appr-09': ['Hazardous Waste Storage Layout', 'Common Hazardous Waste TSDF Membership'],
      'DOC-MPCB-001': ['Site Plan', 'Identity Proof', 'Process Flow Diagram'],
    };

    const docNeededForMap = {};

    approvalIds.forEach((id) => {
      const doc = catalogDocs.find((d) => d.id === id);
      const title = doc?.title || id;
      let reqList = [];

      if (doc && Array.isArray(doc.requiredDocs)) {
        reqList = doc.requiredDocs.map((item) => (typeof item === 'string' ? item : item.documentName));
      } else {
        reqList = fallbackDocMap[id] || ['Identity Proof (Aadhaar/PAN)', 'Site Plan / Layout'];
      }

      reqList.forEach((docName) => {
        if (!docNeededForMap[docName]) {
          docNeededForMap[docName] = [];
        }
        docNeededForMap[docName].push(title);
      });
    });

    const categoryMap = {
      'Site Plan / Layout': 'LAND',
      'Site Plan': 'LAND',
      '7/12 Land Extract': 'LAND',
      '7/12 Land Record': 'LAND',
      'Identity Proof (Aadhaar/PAN)': 'IDENTITY',
      'Identity Proof': 'IDENTITY',
      'Process Flow Diagram': 'TECHNICAL',
      'Building Elevation Drawings': 'TECHNICAL',
      'Fire Hydrant Layout': 'TECHNICAL',
      'Structural Engineer Certificate': 'LEGAL',
      'Water Quality Test Report': 'TECHNICAL',
      'List of Machinery': 'TECHNICAL',
      'List of Directors/Partners': 'LEGAL',
      'Electrical Single Line Diagram (SLD)': 'TECHNICAL',
      'CEI Earthing Test Report': 'TECHNICAL',
      'Connected Load List': 'TECHNICAL',
      'DG Acoustic Enclosure Certificate': 'TECHNICAL',
      'Electrical Contractor Certificate': 'LEGAL',
      'IBR Manufacturer Certificate': 'TECHNICAL',
      'Boiler Operator Competency Card': 'LEGAL',
      'Hazardous Waste Storage Layout': 'TECHNICAL',
      'Common Hazardous Waste TSDF Membership': 'ENVIRONMENT',
    };

    const requiredDocuments = Object.keys(docNeededForMap).map((docName) => ({
      documentName: docName,
      isMandatory: true,
      category: categoryMap[docName] || 'OTHER',
      neededFor: docNeededForMap[docName],
    }));

    return res.status(200).json({
      success: true,
      message: 'Required documents fetched successfully',
      data: {
        approvalIds,
        requiredDocuments,
        uniqueDocumentNames: Object.keys(docNeededForMap),
        totalDocumentsCount: requiredDocuments.length,
      },
    });
  } catch (error) {
    console.error('[approvalsController:getRequiredDocuments] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch required documents',
      error: error.message,
    });
  }
};

/**
 * @desc    Get master approvals catalog
 * @route   GET /api/approvals
 * @access  Public
 */
export const getApprovalsCatalog = async (req, res) => {
  try {
    const { category, district, search, status = 'ACTIVE' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = new RegExp(category, 'i');
    if (district && district !== 'ALL') {
      query.$or = [{ district: 'ALL' }, { district: new RegExp(district, 'i') }];
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') },
        { id: new RegExp(search, 'i') },
      ];
    }

    const approvals = await ApprovalCatalog.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: approvals.length,
      data: approvals,
    });
  } catch (error) {
    console.error('[approvalsController:getApprovalsCatalog] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch approvals catalog',
      error: error.message,
    });
  }
};

/**
 * @desc    Get approval by ID
 * @route   GET /api/approvals/:id
 * @access  Public
 */
export const getApprovalById = async (req, res) => {
  try {
    const { id } = req.params;

    let approval = await ApprovalCatalog.findOne({ id });
    if (!approval && id.match(/^[0-9a-fA-F]{24}$/)) {
      approval = await ApprovalCatalog.findById(id);
    }

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: `Approval docket not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: approval,
    });
  } catch (error) {
    console.error('[approvalsController:getApprovalById] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch approval details',
      error: error.message,
    });
  }
};

export default {
  evaluateQuestionnaire,
  calculateFees,
  getRequiredDocuments,
  getApprovalsCatalog,
  getApprovalById,
};
