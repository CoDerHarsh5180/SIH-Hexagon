import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Public verification lookup by Application ID & 6-digit PIN
 * @route   POST /api/tracking/public-lookup
 * @access  Public
 */
export const publicLookup = async (req, res) => {
  try {
    const { applicationId, verificationCode } = req.body;

    if (!applicationId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and Verification Code are required',
      });
    }

    const app = await Application.findOne({
      applicationId: applicationId.trim(),
      verificationCode: verificationCode.trim(),
    }).populate('userId', 'name companyName district');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'No matching application found. Please verify the Application ID and 6-digit Security PIN.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application verified and retrieved successfully',
      data: {
        applicationId: app.applicationId,
        approvalTitle: app.approvalTitle,
        authority: app.authority,
        district: app.district,
        status: app.status,
        currentStage: app.currentStage,
        submissionDate: app.submissionDate,
        feePaid: app.feePaid,
        sla: app.sla,
        scrutiny: app.scrutiny,
        inspection: app.inspection,
        centralApproval: app.centralApproval,
        issuedCertificate: app.issuedCertificate,
        auditTrail: app.auditTrail,
        applicantName: app.userId?.name || app.userId?.companyName || 'Enterprise Applicant',
      },
    });
  } catch (error) {
    console.error('[trackingController:publicLookup] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to lookup application',
      error: error.message,
    });
  }
};

/**
 * @desc    Escalate application due to SLA timeline breach or review stalls
 * @route   POST /api/tracking/:id/escalate
 * @access  Public / Private
 */
export const escalateSla = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Escalation remarks are required',
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

    const escalationEntry = {
      escalatedAt: new Date(),
      remarks: remarks.trim(),
      escalatedBy: req.user?._id,
      status: 'OPEN',
    };

    app.sla.isEscalated = true;
    app.sla.escalations.push(escalationEntry);

    app.auditTrail.push({
      stage: app.currentStage || 'DOCUMENT_SCRUTINY',
      action: 'SLA_ESCALATION_FILED',
      actor: req.user?.name || 'Applicant',
      actorRole: req.user?.role || 'USER',
      timestamp: new Date(),
      remarks: `Citizen filed SLA escalation notice: "${remarks}"`,
    });

    await app.save();

    // Create system notification for Local & Main Authorities
    await Notification.create({
      role: 'LOCAL_AUTH',
      title: `⚡ SLA Escalation: ${app.applicationId}`,
      message: `Applicant escalated clearance delay for ${app.approvalTitle} (${app.district}). Reason: ${remarks}`,
      type: 'SLA_BREACH',
      referenceId: app.applicationId,
      link: `/local-auth/all-requests/${app.applicationId}`,
    });

    return res.status(200).json({
      success: true,
      message: 'SLA escalation ticket dispatched to Grievance Redressal Officer and Main Authority.',
      data: app,
    });
  } catch (error) {
    console.error('[trackingController:escalateSla] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to escalate SLA',
      error: error.message,
    });
  }
};

/**
 * @desc    Get tracking pipeline with stage progress
 * @route   GET /api/tracking/:id
 * @access  Public / Private
 */
export const getTrackingPipeline = async (req, res) => {
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

    const stages = [
      {
        id: 'STAGE_1',
        name: 'Application Submission',
        status: 'COMPLETED',
        completedAt: app.submissionDate,
      },
      {
        id: 'STAGE_2',
        name: 'Fee Payment & Receipt Verification',
        status: app.feePaid > 0 || app.paymentDetails?.isPaid ? 'COMPLETED' : 'PENDING',
        completedAt: app.paymentDetails?.paidAt,
      },
      {
        id: 'STAGE_3',
        name: 'Desk Document Scrutiny',
        status: app.scrutiny?.decision ? 'COMPLETED' : app.status === 'UNDER_SCRUTINY' || app.status === 'DISCREPANCY_RAISED' ? 'IN_PROGRESS' : 'PENDING',
        decision: app.scrutiny?.decision,
      },
      {
        id: 'STAGE_4',
        name: 'Field Inspection',
        status: app.inspection?.status === 'PASSED' || app.inspection?.status === 'COMPLETED' ? 'COMPLETED' : app.inspection?.status === 'SCHEDULED' ? 'IN_PROGRESS' : 'PENDING',
        inspectorName: app.inspection?.inspectorName,
        scheduledDate: app.inspection?.scheduledDate,
      },
      {
        id: 'STAGE_5',
        name: 'Final Clearance Sanction & Issuance',
        status: app.status === 'APPROVED' ? 'COMPLETED' : app.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
        signedDocId: app.centralApproval?.signedDocId || app.issuedCertificate?.signedDocId,
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        application: app,
        pipelineStages: stages,
      },
    });
  } catch (error) {
    console.error('[trackingController:getTrackingPipeline] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking pipeline',
      error: error.message,
    });
  }
};

/**
 * @desc    Get detailed audit history trail
 * @route   GET /api/tracking/:id/history
 * @access  Public / Private
 */
export const getAuditHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findOne({
      $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        applicationId: app.applicationId,
        approvalTitle: app.approvalTitle,
        auditTrail: app.auditTrail || [],
      },
    });
  } catch (error) {
    console.error('[trackingController:getAuditHistory] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit history',
      error: error.message,
    });
  }
};

export default {
  publicLookup,
  escalateSla,
  getTrackingPipeline,
  getAuditHistory,
};
