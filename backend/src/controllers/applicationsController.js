import Application from '../models/Application.js';
import ApprovalCatalog from '../models/ApprovalCatalog.js';
import User from '../models/User.js';

// Helper to generate application ID and verification code
const generateAppMeta = () => {
  const currentYear = new Date().getFullYear();
  const random5 = Math.floor(10000 + Math.random() * 90000);
  const applicationId = `APP-MH-${currentYear}-${random5}`;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  return { applicationId, verificationCode };
};

// Helper to resolve fallback user if unauthenticated in preview
const resolveUserId = async (req) => {
  if (req.user && req.user._id) {
    return req.user._id;
  }
  // Lookup or create a default demo enterprise user
  let demoUser = await User.findOne({ email: 'applicant@saral.gov.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Sahyadri Agro Enterprises',
      fullName: 'Sahyadri Agro Enterprises',
      companyName: 'Sahyadri Agro Enterprises',
      email: 'applicant@saral.gov.in',
      phone: '+91 9822012345',
      password: 'password123',
      role: 'USER',
      industryType: 'Food Factory',
      district: 'Pune',
      isVerified: true,
    });
  }
  return demoUser._id;
};

/**
 * @desc    Submit a new statutory clearance application
 * @route   POST /api/applications
 * @access  Public / Private
 */
export const submitApplication = async (req, res) => {
  try {
    const {
      approvalId,
      approvalTitle,
      title,
      authority,
      department,
      district,
      feePaid = 0,
      feeAmount,
      submissionDate,
      uploadedDocuments = [],
    } = req.body;

    if (!approvalId && !title && !approvalTitle) {
      return res.status(400).json({
        success: false,
        message: 'approvalId and approvalTitle/title are required',
      });
    }

    const userId = await resolveUserId(req);
    const { applicationId, verificationCode } = generateAppMeta();

    // Lookup catalog for default authority/fee/SLA if not provided
    let catalogDoc = null;
    if (approvalId) {
      catalogDoc = await ApprovalCatalog.findOne({ id: approvalId });
    }

    const resolvedTitle = approvalTitle || title || catalogDoc?.title || 'Industrial Clearance';
    const resolvedAuthority = authority || catalogDoc?.authority || catalogDoc?.department || 'Maharashtra Regulatory Body';
    const resolvedDistrict = district || req.user?.district || 'Pune';
    const resolvedFee = feeAmount !== undefined ? feeAmount : (catalogDoc?.fee || feePaid || 15000);
    const slaDays = catalogDoc?.slaDays || 30;

    const deadline = new Date(submissionDate || Date.now());
    deadline.setDate(deadline.getDate() + slaDays);

    const isPaid = Number(feePaid) > 0;

    const newApp = await Application.create({
      applicationId,
      verificationCode,
      userId,
      approvalId: approvalId || `appr-${Date.now().toString().slice(-4)}`,
      approvalTitle: resolvedTitle,
      title: resolvedTitle,
      authority: resolvedAuthority,
      department: department || resolvedAuthority,
      district: resolvedDistrict,
      isCustomApplication: false,
      status: isPaid ? 'FEE_PAID' : 'SUBMITTED',
      currentStage: isPaid ? 'DOCUMENT_SCRUTINY' : 'APPLICATION_SUBMITTED',
      submissionDate: submissionDate || new Date(),
      feeAmount: resolvedFee,
      feePaid: feePaid || 0,
      paymentDetails: {
        isPaid,
        amount: feePaid || 0,
        paymentMethod: 'UPI',
        paidAt: isPaid ? new Date() : undefined,
        paymentStatus: isPaid ? 'VERIFIED' : 'PENDING',
      },
      uploadedDocuments: uploadedDocuments.map((doc) => ({
        documentId: doc.documentId || `DOC-${Date.now()}`,
        documentName: doc.documentName || 'Required Certificate',
        documentType: doc.documentType || 'PDF',
        fileUrl: doc.fileUrl || 'https://storage.saral.gov.in/sample.pdf',
        fileName: doc.fileName || 'document.pdf',
        fileSize: doc.fileSize || 102400,
        verificationStatus: 'PENDING',
      })),
      sla: {
        slaDays,
        slaDeadline: deadline,
        isBreached: false,
        isEscalated: false,
        escalations: [],
      },
      auditTrail: [
        {
          stage: 'APPLICATION_SUBMITTED',
          action: 'APPLICATION_FILED',
          actor: req.user?.name || 'Applicant',
          actorRole: req.user?.role || 'USER',
          actorId: userId,
          timestamp: new Date(),
          remarks: `Application filed for ${resolvedTitle}. Total fee: ₹${resolvedFee}`,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Clearance application submitted successfully',
      data: newApp,
      applicationId: newApp.applicationId,
      verificationCode: newApp.verificationCode,
    });
  } catch (error) {
    console.error('[applicationsController:submitApplication] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit clearance application',
      error: error.message,
    });
  }
};

/**
 * @desc    Submit a Custom Application
 * @route   POST /api/applications/custom-apply
 * @access  Public / Private
 */
export const submitCustomApplication = async (req, res) => {
  try {
    const {
      approvalId = 'DOC-CUSTOM-001',
      title = 'Custom Industrial Clearance',
      authority = 'Maharashtra Pollution Control Board (MPCB)',
      district = 'Aurangabad',
      feeAmount = 15000,
      description = '',
    } = req.body;

    const userId = await resolveUserId(req);
    const { applicationId, verificationCode } = generateAppMeta();

    const slaDays = 30;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + slaDays);

    const newApp = await Application.create({
      applicationId,
      verificationCode,
      userId,
      approvalId,
      approvalTitle: title,
      title,
      authority,
      department: authority,
      district,
      isCustomApplication: true,
      status: 'SUBMITTED',
      currentStage: 'APPLICATION_SUBMITTED',
      submissionDate: new Date(),
      feeAmount,
      feePaid: 0,
      paymentDetails: {
        isPaid: false,
        amount: feeAmount,
        paymentStatus: 'PENDING',
      },
      sla: {
        slaDays,
        slaDeadline: deadline,
        isBreached: false,
        isEscalated: false,
        escalations: [],
      },
      auditTrail: [
        {
          stage: 'APPLICATION_SUBMITTED',
          action: 'CUSTOM_APPLICATION_FILED',
          actor: req.user?.name || 'Applicant',
          actorRole: req.user?.role || 'USER',
          actorId: userId,
          timestamp: new Date(),
          remarks: `Custom clearance application filed for ${title} to ${authority} (${district}).`,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Custom clearance application initiated successfully',
      data: newApp,
      applicationId: newApp.applicationId,
      verificationCode: newApp.verificationCode,
    });
  } catch (error) {
    console.error('[applicationsController:submitCustomApplication] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create custom clearance application',
      error: error.message,
    });
  }
};

/**
 * @desc    Respond to Discrepancy Notice with remarks and revised files
 * @route   POST /api/applications/:id/discrepancy-response
 * @access  Public / Private
 */
export const respondDiscrepancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, uploadedFiles = [] } = req.body;

    let app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    const responsePayload = {
      remarks: remarks || 'Discrepancy clarification submitted with revised documents.',
      respondedAt: new Date(),
      uploadedFiles: uploadedFiles.map((file) => ({
        documentType: file.documentType || 'Revised Document',
        fileUrl: file.fileUrl || 'https://storage.saral.gov.in/revised.pdf',
        fileName: file.fileName || 'revised_file.pdf',
      })),
    };

    // If there is an existing open discrepancy, resolve it
    if (app.discrepancies && app.discrepancies.length > 0) {
      const openDiscrepancy = app.discrepancies.find((d) => d.status === 'OPEN') || app.discrepancies[app.discrepancies.length - 1];
      openDiscrepancy.status = 'RESOLVED';
      openDiscrepancy.response = responsePayload;
    } else {
      // Create new discrepancy response entry
      app.discrepancies.push({
        remarks: 'Clarification Requested by Authority',
        status: 'RESOLVED',
        response: responsePayload,
      });
    }

    // Add uploaded files to main uploadedDocuments list
    uploadedFiles.forEach((file) => {
      app.uploadedDocuments.push({
        documentName: file.documentType || 'Revised Attachment',
        documentType: file.documentType || 'PDF',
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        verificationStatus: 'PENDING',
      });
    });

    app.status = 'DISCREPANCY_RESOLVED';
    app.currentStage = 'DOCUMENT_SCRUTINY';

    app.auditTrail.push({
      stage: 'DOCUMENT_SCRUTINY',
      action: 'DISCREPANCY_RESPONSE_SUBMITTED',
      actor: req.user?.name || 'Applicant',
      actorRole: req.user?.role || 'USER',
      timestamp: new Date(),
      remarks: remarks || 'Clarification response and revised documents uploaded.',
    });

    await app.save();

    return res.status(200).json({
      success: true,
      message: 'Discrepancy clarification response recorded successfully',
      data: app,
    });
  } catch (error) {
    console.error('[applicationsController:respondDiscrepancy] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record discrepancy response',
      error: error.message,
    });
  }
};

/**
 * @desc    Submit Statutory Fee Payment (UTR / Payment Confirmation)
 * @route   POST /api/applications/:id/fee-payment
 * @access  Public / Private
 */
export const submitFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber, amount, paymentMethod = 'UPI', receiptUrl } = req.body;

    if (!utrNumber || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'utrNumber and amount are required for fee payment',
      });
    }

    let app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    app.feePaid = Number(amount);
    app.paymentDetails = {
      isPaid: true,
      utrNumber: utrNumber.trim(),
      amount: Number(amount),
      paymentMethod,
      paidAt: new Date(),
      receiptUrl: receiptUrl || '',
      paymentStatus: 'VERIFIED',
    };

    app.status = 'FEE_PAID';
    app.currentStage = 'DOCUMENT_SCRUTINY';

    app.auditTrail.push({
      stage: 'FEE_PAYMENT',
      action: 'FEE_PAYMENT_VERIFIED',
      actor: req.user?.name || 'Applicant',
      actorRole: req.user?.role || 'USER',
      timestamp: new Date(),
      remarks: `Statutory fee payment of ₹${amount} recorded via ${paymentMethod} (UTR: ${utrNumber}).`,
    });

    await app.save();

    return res.status(200).json({
      success: true,
      message: `Fee payment of ₹${amount} recorded successfully. UTR: ${utrNumber}`,
      data: app,
    });
  } catch (error) {
    console.error('[applicationsController:submitFeePayment] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process fee payment',
      error: error.message,
    });
  }
};

/**
 * @desc    Withdraw clearance application
 * @route   POST /api/applications/:id/withdraw
 * @access  Public / Private
 */
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Applicant requested withdrawal' } = req.body;

    let app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    if (app.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an already APPROVED clearance certificate.',
      });
    }

    app.status = 'WITHDRAWN';
    app.currentStage = 'WITHDRAWN';
    app.withdrawal = {
      isWithdrawn: true,
      reason: reason.trim(),
      withdrawnAt: new Date(),
    };

    app.auditTrail.push({
      stage: 'WITHDRAWN',
      action: 'APPLICATION_WITHDRAWN',
      actor: req.user?.name || 'Applicant',
      actorRole: req.user?.role || 'USER',
      timestamp: new Date(),
      remarks: `Application withdrawn by applicant. Reason: ${reason}`,
    });

    await app.save();

    return res.status(200).json({
      success: true,
      message: 'Clearance application withdrawn successfully',
      data: app,
    });
  } catch (error) {
    console.error('[applicationsController:withdrawApplication] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to withdraw application',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user applications list with filtering
 * @route   GET /api/applications
 * @access  Public / Private
 */
export const getUserApplications = async (req, res) => {
  try {
    const { status, district, authority, search } = req.query;

    const query = {};

    // If user is authenticated as enterprise applicant, filter to their applications
    if (req.user && req.user.role === 'USER') {
      query.userId = req.user._id;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (district && district !== 'ALL') {
      query.district = new RegExp(district, 'i');
    }
    if (authority && authority !== 'ALL') {
      query.authority = new RegExp(authority, 'i');
    }
    if (search) {
      query.$or = [
        { applicationId: new RegExp(search, 'i') },
        { approvalTitle: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { authority: new RegExp(search, 'i') },
      ];
    }

    const applications = await Application.find(query)
      .populate('userId', 'name email companyName phone district')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('[applicationsController:getUserApplications] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single application by ID or Application Number
 * @route   GET /api/applications/:id
 * @access  Public / Private
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).populate('userId', 'name email companyName phone district');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error('[applicationsController:getApplicationById] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch application details',
      error: error.message,
    });
  }
};

export default {
  submitApplication,
  submitCustomApplication,
  respondDiscrepancy,
  submitFeePayment,
  withdrawApplication,
  getUserApplications,
  getApplicationById,
};
