import BenefitScheme from '../models/BenefitScheme.js';
import SchemeApplication from '../models/SchemeApplication.js';
import User from '../models/User.js';
import { resolveUser as resolveUserShared } from '../utils/resolveUser.js';

// Helper to resolve user (returns full document)
const resolveUser = async (req) => resolveUserShared(req, true);

/**
 * @desc    Check subsidy eligibility against policy rules
 * @route   POST /api/benefits/schemes/:id/check-eligibility
 * @access  Public
 */
export const checkEligibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { machineryCostCrores = 0, powerLoadHp = 0, totalInvestment = 0, district = 'Pune', scale = 'SMALL' } = req.body;

    let scheme = await BenefitScheme.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!scheme) {
      // Create fallback scheme object if default
      scheme = {
        id: id || 'SCHEME-PSI-2019',
        schemeTitle: 'Package Scheme of Incentives (PSI 2019)',
        subsidyPercentageNumber: 35,
        maxCeilingAmountNumber: 25000000,
      };
    }

    const costNum = Number(machineryCostCrores) || (Number(totalInvestment) / 10000000) || 4.85;
    const subsidyPct = scheme.subsidyPercentageNumber || 35;
    const maxCeiling = scheme.maxCeilingAmountNumber || 25000000;

    // Calculate potential subsidy
    const calculatedSubsidyInr = Math.min((costNum * 10000000 * subsidyPct) / 100, maxCeiling);

    const isEligible = costNum > 0.25; // Eligible if minimum investment > 25 lakhs

    return res.status(200).json({
      success: true,
      data: {
        schemeId: scheme.id,
        schemeTitle: scheme.schemeTitle,
        isEligible,
        inputs: {
          machineryCostCrores: costNum,
          powerLoadHp: Number(powerLoadHp) || 350,
          district,
          scale,
        },
        calculatedSubsidyInr,
        calculatedSubsidyCrores: (calculatedSubsidyInr / 10000000).toFixed(2),
        subsidyPercentage: `${subsidyPct}%`,
        maxCeiling: `₹${(maxCeiling / 10000000).toFixed(2)} Crores`,
        remarks: isEligible
          ? `Eligible under ${scheme.schemeTitle} for up to ₹${(calculatedSubsidyInr / 10000000).toFixed(2)} Cr (${subsidyPct}% capital subsidy).`
          : 'Investment threshold below statutory eligibility limit.',
      },
    });
  } catch (error) {
    console.error('[benefitsController:checkEligibility] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate scheme eligibility',
      error: error.message,
    });
  }
};

/**
 * @desc    Apply / Claim Government Subsidy or Benefit Scheme
 * @route   POST /api/benefits/schemes/:id/apply
 * @access  Public / Private
 */
export const applyScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { schemeTitle, category = 'Capital Incentive', claimDate, machineryCostCrores, powerLoadHp } = req.body;

    const user = await resolveUser(req);

    const scheme = await BenefitScheme.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    const resolvedTitle = schemeTitle || scheme?.schemeTitle || 'PSI 2019 Capital Subsidy';
    const costNum = Number(machineryCostCrores) || 4.85;
    const estimatedSubsidy = Math.min((costNum * 10000000 * 35) / 100, 25000000);
    const generatedClaimId = `CLM-SCH-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const application = await SchemeApplication.create({
      claimId: generatedClaimId,
      schemeId: id || scheme?.id || 'SCHEME-1024',
      schemeObjectId: scheme?._id,
      userId: user._id,
      schemeTitle: resolvedTitle,
      category: category || scheme?.category || 'Capital Incentive',
      claimDate: claimDate ? new Date(claimDate) : new Date(),
      claimAmount: estimatedSubsidy,
      eligibilityInputs: {
        machineryCostCrores: costNum,
        powerLoadHp: Number(powerLoadHp) || 350,
        district: user.district || 'Pune',
      },
      eligibilityResult: {
        isEligible: true,
        estimatedSubsidy,
        remarks: `Claim filed for ${resolvedTitle}. Estimated sanction: ₹${(estimatedSubsidy / 10000000).toFixed(2)} Cr`,
      },
      status: 'SUBMITTED',
    });

    return res.status(201).json({
      success: true,
      message: 'Government benefit claim application submitted successfully',
      data: application,
      claimId: application.claimId,
    });
  } catch (error) {
    console.error('[benefitsController:applyScheme] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply for scheme',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all Government Benefit Schemes
 * @route   GET /api/benefits/schemes
 * @access  Public
 */
export const getSchemes = async (req, res) => {
  try {
    const { category, sector, status = 'PUBLISHED' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = new RegExp(category, 'i');
    if (sector) query.targetSectors = { $in: [new RegExp(sector, 'i')] };

    let schemes = await BenefitScheme.find(query).sort({ createdAt: -1 });

    const defaultSchemes = [
      {
        id: 'SCH-MH-01',
        schemeTitle: 'Package Scheme of Incentives (PSI 2024) - Capital Subsidy',
        title: 'Package Scheme of Incentives (PSI 2024) - Capital Subsidy',
        category: 'Capital Subsidy',
        sector: 'Manufacturing & Food Processing',
        targetSectors: ['Manufacturing', 'Food Processing', 'Textiles', 'Engineering'],
        disbursingAuthority: 'Directorate of Industries, Maharashtra',
        maxCeilingAmount: '₹3.50 Crores',
        maxCeilingAmountNumber: 35000000,
        subsidyPercentage: '35%',
        subsidyPercentageNumber: 35,
        benefits: 'Up to 35% capital investment subsidy spread across 7 fiscal years.',
        eligibility: 'New MSME and Large units investing > Rs 25 Lakhs in machinery with Udyam Registration.',
        eligibilityCriteria: ['New MSME or Large unit investing > Rs 25 Lakhs in machinery', 'Valid Udyam MSME Registration', 'MIDC or Collector NA Land'],
        validTill: '31 March 2029',
        validUntil: new Date('2029-03-31'),
        status: 'PUBLISHED',
        datePublished: '2024-04-01',
      },
      {
        id: 'SCH-MH-02',
        schemeTitle: 'Industrial Electricity Duty Exemption Scheme',
        title: 'Industrial Electricity Duty Exemption Scheme',
        category: 'Utility Exemption',
        sector: 'All Industrial Sectors',
        targetSectors: ['All Industrial Sectors', 'Manufacturing', 'Utility Exemption'],
        disbursingAuthority: 'Energy Department & MSEDCL',
        maxCeilingAmount: '100% Exemption',
        maxCeilingAmountNumber: 5000000,
        subsidyPercentage: '100% Waiver',
        subsidyPercentageNumber: 100,
        benefits: '100% waiver of electricity duty for first 5 years of commercial production.',
        eligibility: 'Manufacturing units located in MIDC / industrial zones outside Mumbai urban corridor.',
        eligibilityCriteria: ['Units located in Maharashtra outside Mumbai urban corridor', 'Valid MSEDCL power connection'],
        validTill: 'Open-ended',
        status: 'PUBLISHED',
        datePublished: '2024-01-01',
      },
      {
        id: 'SCH-MH-03',
        schemeTitle: 'Interest Subvention on Working Capital & Term Loans',
        title: 'Interest Subvention on Working Capital & Term Loans',
        category: 'Financial Assistance',
        sector: 'Agro & Food Processing',
        targetSectors: ['Agro', 'Food Processing', 'MSME'],
        disbursingAuthority: 'Maharashtra State Financial Corporation (MSFC)',
        maxCeilingAmount: '₹1.00 Crore',
        maxCeilingAmountNumber: 10000000,
        subsidyPercentage: '5% Interest Subvention',
        subsidyPercentageNumber: 5,
        benefits: '5% interest subvention per annum on eligible term loans up to Rs 1 Crore.',
        eligibility: 'Food processing facilities and agri-enterprises procuring produce from local farmer groups.',
        eligibilityCriteria: ['Food processing & agro units', 'Active bank term loan for plant and machinery'],
        validTill: '31 December 2027',
        validUntil: new Date('2027-12-31'),
        status: 'PUBLISHED',
        datePublished: '2024-01-15',
      },
      {
        id: 'SCH-MH-04',
        schemeTitle: 'Green Industrial ETP Setup Incentive',
        title: 'Green Industrial ETP Setup Incentive',
        category: 'Sustainability',
        sector: 'Chemical, Pharma & Food',
        targetSectors: ['Sustainability', 'Chemical', 'Pharma', 'Food Processing'],
        disbursingAuthority: 'Maharashtra Pollution Control Board (MPCB)',
        maxCeilingAmount: '₹50 Lakhs',
        maxCeilingAmountNumber: 5000000,
        subsidyPercentage: '50% Subsidy',
        subsidyPercentageNumber: 50,
        benefits: '50% one-time subsidy on capital cost of ETP / ZLD equipment up to Rs 50 Lakhs.',
        eligibility: 'Zero Liquid Discharge (ZLD) effluent treatment plants certified by MPCB.',
        eligibilityCriteria: ['Zero Liquid Discharge (ZLD) effluent treatment plants', 'Certified by MPCB'],
        validTill: '31 March 2028',
        validUntil: new Date('2028-03-31'),
        status: 'PUBLISHED',
        datePublished: '2024-02-01',
      },
      {
        id: 'SCH-MH-05',
        schemeTitle: 'Stamp Duty & Registration Fee 100% Exemption',
        title: 'Stamp Duty & Registration Fee 100% Exemption',
        category: 'Land & Infrastructure',
        sector: 'All Industrial Sectors',
        targetSectors: ['Manufacturing', 'All Industrial Sectors', 'Engineering'],
        disbursingAuthority: 'Revenue and Forest Department, Maharashtra',
        maxCeilingAmount: '100% Exemption',
        maxCeilingAmountNumber: 2500000,
        subsidyPercentage: '100% Waiver',
        subsidyPercentageNumber: 100,
        benefits: '100% stamp duty waiver on land lease or purchase for establishing new industrial units.',
        eligibility: 'Industrial plot purchased in MIDC or authorized cooperative industrial estates.',
        eligibilityCriteria: ['Plot located in MIDC or designated industrial area', 'Valid registered agreement'],
        validTill: 'Open-ended',
        status: 'PUBLISHED',
        datePublished: '2024-01-01',
      },
    ];

    // Auto-seed into MongoDB if empty, otherwise normalize retrieved records
    if (!schemes || schemes.length === 0) {
      try {
        await BenefitScheme.insertMany(defaultSchemes);
        schemes = await BenefitScheme.find(query).sort({ createdAt: -1 });
      } catch {
        schemes = defaultSchemes;
      }
    }

    // Normalize each scheme to ensure title, sector, benefits, and eligibility exist
    const normalized = schemes.map((s) => {
      const obj = s.toObject ? s.toObject() : { ...s };
      return {
        ...obj,
        id: obj.id || obj._id,
        title: obj.title || obj.schemeTitle || 'Government Incentive Scheme',
        schemeTitle: obj.schemeTitle || obj.title || 'Government Incentive Scheme',
        category: obj.category || 'Capital Subsidy',
        sector: obj.sector || (Array.isArray(obj.targetSectors) ? obj.targetSectors.join(', ') : obj.targetSectors) || 'All Industrial Sectors',
        targetSectors: obj.targetSectors || (obj.sector ? [obj.sector] : ['All Industrial Sectors']),
        benefits: obj.benefits || (obj.subsidyPercentage ? `${obj.subsidyPercentage} capital subsidy up to ${obj.maxCeilingAmount || '₹2.5 Cr'}` : obj.description) || 'Capital subsidy and tariff exemptions',
        eligibility: obj.eligibility || (Array.isArray(obj.eligibilityCriteria) ? obj.eligibilityCriteria.join('; ') : obj.eligibilityCriteria) || 'Valid Udyam MSME and factory setup in Maharashtra',
        validTill: obj.validTill || (obj.validUntil ? new Date(obj.validUntil).toLocaleDateString('en-IN') : (obj.datePublished ? `Valid from ${obj.datePublished}` : 'Open-ended')),
        status: obj.status || 'PUBLISHED',
      };
    });

    return res.status(200).json({
      success: true,
      count: normalized.length,
      data: normalized,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch benefit schemes',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Scheme by ID
 * @route   GET /api/benefits/schemes/:id
 * @access  Public
 */
export const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;

    let scheme = await BenefitScheme.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!scheme) {
      // Check known schemes fallback
      const knownSchemes = {
        'SCHEME-1024': {
          id: 'SCHEME-1024',
          schemeTitle: 'PSI 2019 Capital Subsidy',
          category: 'Capital Incentive',
          disbursingAuthority: 'Directorate of Industries',
          maxCeilingAmount: '₹2.50 Crores',
          subsidyPercentage: '35%',
          targetSectors: ['Food Processing', 'Textiles', 'Electronics'],
          eligibilityCriteria: ['MSME Registration', 'Minimum 3 years operational intent', 'MIDC or NA Land'],
          status: 'PUBLISHED',
          datePublished: '2026-09-12',
        },
        'SCH-MH-01': {
          id: 'SCH-MH-01',
          schemeTitle: 'Package Scheme of Incentives (PSI) 2024 - Capital Subsidy',
          category: 'Capital Subsidy',
          disbursingAuthority: 'Directorate of Industries',
          maxCeilingAmount: '₹3.50 Crores',
          subsidyPercentage: '35%',
          targetSectors: ['Manufacturing & Food Processing'],
          eligibilityCriteria: ['New MSME and Large units investing > Rs 2.5 Crore in machinery.'],
          status: 'PUBLISHED',
          datePublished: '2026-01-15',
        },
      };

      if (knownSchemes[id]) {
        scheme = knownSchemes[id];
      } else {
        return res.status(404).json({
          success: false,
          message: 'Scheme not found',
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scheme',
      error: error.message,
    });
  }
};

export default {
  checkEligibility,
  applyScheme,
  getSchemes,
  getSchemeById,
};
