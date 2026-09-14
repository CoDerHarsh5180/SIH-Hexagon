import BenefitScheme from '../models/BenefitScheme.js';
import SchemeApplication from '../models/SchemeApplication.js';
import User from '../models/User.js';

// Helper to resolve user
const resolveUser = async (req) => {
  if (req.user && req.user._id) return req.user;
  let demoUser = await User.findOne({ email: 'applicant@saral.gov.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Sahyadri Agro Enterprises',
      email: 'applicant@saral.gov.in',
      password: 'password123',
      role: 'USER',
      district: 'Pune',
    });
  }
  return demoUser;
};

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

    const application = await SchemeApplication.create({
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

    // Fallback if no schemes in DB yet
    if (!schemes || schemes.length === 0) {
      schemes = [
        {
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
      ];
    }

    return res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
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

    const scheme = await BenefitScheme.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
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
