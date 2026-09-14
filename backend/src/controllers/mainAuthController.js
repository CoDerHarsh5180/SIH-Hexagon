import ApprovalCatalog from '../models/ApprovalCatalog.js';
import BenefitScheme from '../models/BenefitScheme.js';
import LocalAuthority from '../models/LocalAuthority.js';
import Application from '../models/Application.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Create Master Document (Clearance Docket or Government Scheme)
 * @route   POST /api/main-auth/create-doc
 * @access  Public / Private
 */
export const createMasterDoc = async (req, res) => {
  try {
    const docData = req.body;

    // Check if creating a SCHEME document
    if (docData.type === 'SCHEME' || docData.schemeTitle) {
      const {
        id,
        schemeTitle,
        category = 'Capital Incentive',
        disbursingAuthority = 'Directorate of Industries',
        maxCeilingAmount = '₹2.50 Crores',
        subsidyPercentage = '35%',
        targetSectors = ['Food Processing'],
        eligibilityCriteria = ['MSME Registered'],
        status = 'PUBLISHED',
        fileName,
        datePublished,
      } = docData;

      const schemeId = id || `SCHEME-${Date.now().toString().slice(-4)}`;

      const scheme = await BenefitScheme.findOneAndUpdate(
        { id: schemeId },
        {
          id: schemeId,
          type: 'SCHEME',
          schemeTitle: schemeTitle || 'Government Subsidy Policy',
          category,
          disbursingAuthority,
          maxCeilingAmount,
          subsidyPercentage,
          targetSectors,
          eligibilityCriteria,
          status,
          fileName,
          datePublished: datePublished || new Date().toISOString().split('T')[0],
          createdBy: req.user?._id,
        },
        { upsert: true, returnDocument: 'after' }
      );

      return res.status(201).json({
        success: true,
        message: 'Government Scheme Master Policy published successfully',
        data: scheme,
      });
    }

    // Otherwise, create Master Clearance Document
    const {
      id,
      title,
      category = 'Industrial Clearance',
      slaDays = 30,
      fee = 5000,
      description = '',
      requiredDocs = ['Site Plan', 'Identity Proof'],
      requiresInspection = true,
      inspectionTiming = 'Before Approval Issuance',
      status = 'ACTIVE',
      department = 'Maharashtra Regulatory Body',
      authority = 'Maharashtra Regulatory Body',
      district = 'ALL',
      createdAt,
    } = docData;

    const clearanceId = id || `DOC-AUTH-${Date.now().toString().slice(-4)}`;

    const catalogDoc = await ApprovalCatalog.findOneAndUpdate(
      { id: clearanceId },
      {
        id: clearanceId,
        title: title || 'Statutory Clearance Docket',
        category,
        slaDays: Number(slaDays),
        fee: Number(fee),
        description,
        requiredDocs,
        requiresInspection: Boolean(requiresInspection),
        inspectionTiming,
        status,
        department,
        authority,
        district,
        type: 'CLEARANCE',
        createdBy: req.user?._id,
      },
      { upsert: true, returnDocument: 'after' }
    );

    return res.status(201).json({
      success: true,
      message: 'Master Clearance Document docket created successfully',
      data: catalogDoc,
    });
  } catch (error) {
    console.error('[mainAuthController:createMasterDoc] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create master document',
      error: error.message,
    });
  }
};

/**
 * @desc    Update Master Document
 * @route   PUT /api/main-auth/catalog/:id
 * @access  Public / Private
 */
export const updateMasterDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let doc = await ApprovalCatalog.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!doc) {
      doc = await BenefitScheme.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    }

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: `Document not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update document',
      error: error.message,
    });
  }
};

/**
 * @desc    Register Local Authority Officer in Directory
 * @route   POST /api/main-auth/local-authorities
 * @access  Public / Private
 */
export const registerLocalAuthority = async (req, res) => {
  try {
    const { name, designation, body, department, district, phone, email, employeeId } = req.body;

    if (!name || !designation || !body || !email || !district) {
      return res.status(400).json({
        success: false,
        message: 'Name, designation, body, district, and email are required',
      });
    }

    const authority = await LocalAuthority.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      {
        name,
        designation,
        body,
        authorityBody: body,
        department: department || body,
        district,
        phone: phone || '+91 9800000000',
        email: email.trim().toLowerCase(),
        employeeId: employeeId || `MH-GOV-${Date.now().toString().slice(-4)}`,
        status: 'ACTIVE',
      },
      { upsert: true, returnDocument: 'after' }
    );

    return res.status(201).json({
      success: true,
      message: 'Local Authority Officer registered in State Single-Window Directory',
      data: authority,
    });
  } catch (error) {
    console.error('[mainAuthController:registerLocalAuthority] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register local authority',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all Local Authorities in State
 * @route   GET /api/main-auth/local-authorities
 * @access  Public / Private
 */
export const getLocalAuthorities = async (req, res) => {
  try {
    const { district, body } = req.query;

    const query = {};
    if (district && district !== 'ALL') query.district = new RegExp(district, 'i');
    if (body && body !== 'ALL') query.body = new RegExp(body, 'i');

    const authorities = await LocalAuthority.find(query).sort({ district: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: authorities.length,
      data: authorities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch local authorities',
      error: error.message,
    });
  }
};

/**
 * @desc    Intervene on Stalled Citizen Complaint (Apex Escalation Notice)
 * @route   POST /api/main-auth/complaints/:id/intervene
 * @access  Public / Private
 */
export const interveneComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'EXPEDITE_NOTICE_SENT', noticeTimestamp, remarks } = req.body;

    let complaint = await Complaint.findOne({
      $or: [{ complaintId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${id}`,
      });
    }

    complaint.status = 'INTERVENED';
    complaint.intervention = {
      action,
      noticeTimestamp: noticeTimestamp ? new Date(noticeTimestamp) : new Date(),
      intervenedBy: req.user?._id,
      officerName: req.user?.name || 'Principal Secretary / Directorate Desk',
      remarks: remarks || 'Apex expedite notice dispatched to local zonal commissioner.',
    };

    await complaint.save();

    // Broadcast escalation alert
    await Notification.create({
      role: 'LOCAL_AUTH',
      title: `⚡ Apex Intervention: Complaint ${complaint.complaintId}`,
      message: `Directorate of Industries issued an expedite directive for ${complaint.authority} (${complaint.district}).`,
      type: 'SLA_BREACH',
      referenceId: complaint.complaintId,
    });

    return res.status(200).json({
      success: true,
      message: `Intervention notice '${action}' served to regulatory authority.`,
      data: complaint,
    });
  } catch (error) {
    console.error('[mainAuthController:interveneComplaint] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process complaint intervention',
      error: error.message,
    });
  }
};

/**
 * @desc    Get State-Wide Complaints
 * @route   GET /api/main-auth/complaints
 * @access  Public / Private
 */
export const getStateComplaints = async (req, res) => {
  try {
    const { status, authority, district } = req.query;

    const query = {};
    if (status && status !== 'ALL') query.status = status;
    if (authority && authority !== 'ALL') query.authority = new RegExp(authority, 'i');
    if (district && district !== 'ALL') query.district = new RegExp(district, 'i');

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch state complaints',
      error: error.message,
    });
  }
};

/**
 * @desc    Approve Central Request (Sanction Clearances from Apex Desk)
 * @route   POST /api/main-auth/requests/:id/approve
 * @access  Public / Private
 */
export const approveCentralRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { signedDocId = 'IAS-SANCTION-MH-2026-901', remarks } = req.body;

    let app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    app.status = 'APPROVED';
    app.currentStage = 'FINAL_APPROVAL';
    app.centralApproval = {
      sanctionId: `SANCTION-MH-${Date.now().toString().slice(-6)}`,
      signedDocId,
      action: 'APPROVED',
      remarks: remarks || 'Approved subject to quarterly compliance report.',
      approvedBy: req.user?._id,
      officerName: req.user?.name || 'Apex Regulatory Sanctioning Officer',
      processedAt: new Date(),
    };

    app.issuedCertificate = {
      certificateNumber: `MH-APEX-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
      certificateUrl: `https://storage.saral.gov.in/certificates/${app.applicationId}.pdf`,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
      validityYears: 5,
      digitalSignature: signedDocId,
      signedDocId,
    };

    app.auditTrail.push({
      stage: 'FINAL_APPROVAL',
      action: 'CENTRAL_SANCTION_APPROVED',
      actor: req.user?.name || 'Apex Directorate',
      actorRole: 'MAIN_AUTH',
      timestamp: new Date(),
      remarks: `Central sanction granted with DSC token ${signedDocId}. ${remarks || ''}`,
    });

    await app.save();

    return res.status(200).json({
      success: true,
      message: `Central sanction approved successfully. Signed Doc ID: ${signedDocId}`,
      data: app,
    });
  } catch (error) {
    console.error('[mainAuthController:approveCentralRequest] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve central request',
      error: error.message,
    });
  }
};

/**
 * @desc    Reject Central Request with Statutory Remittance Grounds
 * @route   POST /api/main-auth/requests/:id/reject
 * @access  Public / Private
 */
export const rejectCentralRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, grounds = 'Environment Protection Act Section 5' } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'rejectionReason is required for central rejection',
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

    app.status = 'REJECTED';
    app.currentStage = 'REJECTED';
    app.centralApproval = {
      action: 'REJECTED',
      rejectionReason,
      grounds,
      approvedBy: req.user?._id,
      officerName: req.user?.name || 'Apex Directorate',
      processedAt: new Date(),
    };

    app.auditTrail.push({
      stage: 'FINAL_APPROVAL',
      action: 'CENTRAL_SANCTION_REJECTED',
      actor: req.user?.name || 'Apex Directorate',
      actorRole: 'MAIN_AUTH',
      timestamp: new Date(),
      remarks: `Application rejected. Grounds: ${grounds}. Reason: ${rejectionReason}`,
    });

    await app.save();

    return res.status(200).json({
      success: true,
      message: `Application rejected under statutory grounds '${grounds}'.`,
      data: app,
    });
  } catch (error) {
    console.error('[mainAuthController:rejectCentralRequest] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject central request',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Central Requests for Apex Directorate
 * @route   GET /api/main-auth/requests
 * @access  Public / Private
 */
export const getCentralRequests = async (req, res) => {
  try {
    const { status, district } = req.query;

    const query = {};
    if (status && status !== 'ALL') query.status = status;
    if (district && district !== 'ALL') query.district = new RegExp(district, 'i');

    const requests = await Application.find(query)
      .populate('userId', 'name companyName email district')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch central requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Central Request by ID
 * @route   GET /api/main-auth/requests/:id
 * @access  Public / Private
 */
export const getCentralRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).populate('userId', 'name companyName email phone district');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: app,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Master Catalog
 * @route   GET /api/main-auth/catalog
 * @access  Public
 */
export const getMasterCatalog = async (req, res) => {
  try {
    const clearances = await ApprovalCatalog.find().sort({ createdAt: -1 });
    const schemes = await BenefitScheme.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        clearances,
        schemes,
        totalClearances: clearances.length,
        totalSchemes: schemes.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch master catalog',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Master Document by ID
 * @route   GET /api/main-auth/catalog/:id
 * @access  Public
 */
export const getMasterDocById = async (req, res) => {
  try {
    const { id } = req.params;

    let doc = await ApprovalCatalog.findOne({ id });
    if (!doc) {
      doc = await BenefitScheme.findOne({ id });
    }

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in catalog',
      });
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch master doc',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Main Authority Analytics Overview
 * @route   GET /api/main-auth/analytics
 * @access  Public / Private
 */
export const getAnalytics = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const approvedCount = await Application.countDocuments({ status: 'APPROVED' });
    const rejectedCount = await Application.countDocuments({ status: 'REJECTED' });
    const pendingCount = await Application.countDocuments({ status: { $in: ['SUBMITTED', 'UNDER_SCRUTINY', 'FEE_PAID', 'INSPECTION_SCHEDULED'] } });
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: { $in: ['RESOLVED', 'RESOLVED_WITH_INSPECTION'] } });
    const totalAuthorities = await LocalAuthority.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalApplications,
        approvedCount,
        rejectedCount,
        pendingCount,
        approvalRate: totalApplications > 0 ? ((approvedCount / totalApplications) * 100).toFixed(1) : '100',
        totalComplaints,
        resolvedComplaints,
        totalAuthorities,
        activeSlaCompliance: '94.8%',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate analytics',
      error: error.message,
    });
  }
};

export default {
  createMasterDoc,
  updateMasterDoc,
  registerLocalAuthority,
  getLocalAuthorities,
  interveneComplaint,
  getStateComplaints,
  approveCentralRequest,
  rejectCentralRequest,
  getCentralRequests,
  getCentralRequestById,
  getMasterCatalog,
  getMasterDocById,
  getAnalytics,
};
