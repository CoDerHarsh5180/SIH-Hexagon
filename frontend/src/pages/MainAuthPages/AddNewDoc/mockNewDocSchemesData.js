export const approvalCategories = [
  'Industrial Clearance',
  'Environmental & Waste',
  'Safety & Fire NOC',
  'Building & Town Planning',
  'Labour & Workplace Safety',
  'Food Safety & Quality',
];

export const commonRequiredDocSuggestions = [
  'Site Plan & Building Blueprint',
  'Aadhaar / Identity Proof of Director',
  '7/12 Land Extract or Mutation Deed',
  'Electricity Sanction Letter',
  'Effluent Treatment Plant (ETP) Specs',
  'Machinery Layout Diagram',
  'Factory Safety Inspector Audit Form',
];

export const mockAiRefineDescription = (draftText) => {
  if (!draftText.trim()) {
    return 'Mandatory statutory clearance issued to assess civil, environmental, and operational compliance before industrial commissioning under applicable state laws.';
  }
  return `Official statutory clearance ensuring full regulatory compliance: ${draftText.trim()} This certificate authorizes lawful project initiation while guaranteeing worker safety, setback limits, and baseline pollution monitoring.`;
};

export const mockAiExtractSchemePdf = (fileName) => {
  return {
    schemeTitle: fileName.replace('.pdf', '').replace(/[-_]/g, ' '),
    targetSectors: ['Food Processing', 'Textiles', 'Renewable Energy'],
    maxSubsidyPercentage: '25% of Capital Expenditure',
    maxCeilingAmount: '₹50,00,000',
    eligibilityCriteria: [
      'Enterprises classified under MSME category with valid Udyam registration',
      'Minimum investment in plant and machinery exceeding ₹50 Lakhs',
      'Site located within recognized MIDC industrial parks or notified rural talukas',
    ],
    summary:
      'Extracted policy guidelines offering state interest subvention, clean-technology subsidy, and stamp duty exemption for eligible new manufacturing facilities.',
  };
};