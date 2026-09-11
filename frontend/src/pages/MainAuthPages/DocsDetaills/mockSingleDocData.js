export const initialDocData = {
  id: 'DOC-MPCB-001',
  name: 'Consent to Establish (CTE) - Orange Category',
  category: 'Industrial Clearance',
  slaDays: 30,
  baseFee: 15000,
  status: 'ACTIVE', // 'ACTIVE' | 'PAUSED' | 'DRAFT'
  totalApplications: 1245,
  description: 'Initial permission required before setting up an industry that falls under the orange pollution category. This verifies that your factory plan meets environmental safety rules.',
  
  // What the user must upload
  requiredDocs: [
    'Site Plan / Layout', 
    'Identity Proof (Aadhaar/PAN)', 
    'Process Flow Diagram', 
    '7/12 Land Extract or Lease Deed'
  ],
  
  // The helpful explanation shown to the user on the "Ask for Approval" page
  aiReason: 'Because your factory falls in the Orange Category with connected power above 100 HP, MPCB permission is mandatory before any civil work or machinery fitting starts.',
  aiPoints: [
    'Submit Form CTE-1 on the MPCB online portal',
    'Attach factory layout, process flow, and effluent details',
    'Field inspection will be scheduled after document review',
    'Must be issued before any civil construction begins'
  ]
};